const HCMlong = 106.702003;
const HCMlat = 10.772417;
const clusterBreakpointZoomLevel = 13; // Adjust this value as needed

let showReportedMarkers = true; // Flag to toggle visibility
let markers = []; // Array to store markers
//access Token
// Event listener for the button
var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
});
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [HCMlong, HCMlat],
  zoom: 13,
});
map.addControl(geolocate);
//main function
function main() {
  // After the map has been loaded, you add your data source and layers.
  map.on("load", async function () {
    geolocate.trigger();
    // Load your data
    const geojsonData = await loadData();
    console.log(geojsonData);
    //move user to current location of user

    // Add the source with your GeoJSON data and enable clustering
    map.addSource("ads", {
      type: "geojson",
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 18,
      clusterRadius: 50,
    });

    // Add a layer for the clusters
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "ads",
      visibility: "visible",
      filter: ["has", "point_count"],
      paint: {
        // Paint properties here
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6", // Color for clusters with count < 100
          3,
          "#f1f075", // Color for clusters with count < 750
          10,
          "#f28cb1", // Color for clusters with count >= 750
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20, // Radius for clusters with count < 100
          100,
          30, // Radius for clusters with count < 750
          750,
          40, // Radius for clusters with count >= 750
        ],
      },
    });

    // Add a layer for the cluster counts
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "ads",
      filter: ["has", "point_count"],
      visibility: "visible",
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#000000", // Specify the text color if needed
      },
    });

    // Add a layer for individual points (non-clustered)
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "ads",
      filter: ["!", ["has", "point_count"]],
      visibility: "visible", // Explicitly set the initial visibility

      paint: {
        // Use a 'case' expression to assign a color based on the 'status' property
        "circle-color": [
          "match",
          ["get", "status", ["get", "location"]],
          "ĐÃ QUY HOẠCH",
          "#51bbd6", // Blue
          "CHƯA QUY HOẠCH",
          "#ffff00", // Yellow
          "ĐÃ CẤP PHÉP",
          "#00ff00", // Green
          "BỊ BÁO CÁO",
          "#ff0000", // Red
          "blue", // Default color (white)
        ],
        "circle-radius": 12, // Radius for individual points
        "circle-opacity": 1,
      },
    });
  });
  let currentPopup = null; // This will hold the currently open popup

  map.on("mouseenter", "unclustered-point", function (e) {
    map.getCanvas().style.cursor = "pointer"; // Change the cursor style as a UI indicator
    // Ensure you extract 'location' as an object
    const location = JSON.parse(e.features[0].properties.location);
    const ward = JSON.parse(e.features[0].properties.ward);
    const wardName = ward.name;

    // Extract other properties from 'location'
    const adFormat = location.adFormat;
    const address = location.address;
    const locationType = location.locationType;
    const status = location.status;

    // Close the previous popup if it exists
    if (currentPopup) {
      currentPopup.remove();
    }

    // Construct the HTML content for the popup using the properties
    const popupContent = `
        <h6>${adFormat}</h6>
        <p>${address}</p>
        <p>${wardName}</p>
        <p>${locationType}</p>
        <p style="font-weight: 900; font-style: italic">${status}</p>
    `;

    // Create and add the new popup to the map
    currentPopup = new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  map.on("mouseleave", "unclustered-point", function () {
    map.getCanvas().style.cursor = ""; // Reset the cursor style
    if (currentPopup) {
      currentPopup.remove(); // Remove the current popup
      currentPopup = null; // Reset the current popup reference
    }
  });
  map.on("click", "unclustered-point", function (e) {
    e.originalEvent.stopPropagation();
    const status = e.features[0].properties.location.status;

    if (status === "BỊ BÁO CÁO" && !showReportedMarkers) {
      hideSidebar();
      return;
    } else {
      // Prevent the 'click' event from propagating to the map

      // Fly to the point
      map.flyTo({ center: e.features[0].geometry.coordinates, zoom: 15 });

      // Pass the properties of this specific feature to the sidebar

      showSidebar(e.features[0].properties);
    }
  });
  // Assuming you've already added your 'clusters' layer and your 'ads' source.

  // When a click event occurs on a feature in the clusters layer, zoom in
  map.on("click", "clusters", function (e) {
    // Get the cluster id from the features properties
    var clusterId = e.features[0].properties.cluster_id;

    // Get the point coordinates from the feature
    var point = e.features[0].geometry.coordinates;

    // Get the cluster expansion zoom
    map
      .getSource("ads")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        // Ease to the point with the new zoom level
        map.easeTo({
          center: point,
          zoom: 15,
        });
      });
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );

  let currentMarker; // This will keep track of the current marker on the map

  // Add a click event to the map to perform reverse geocoding
  map.on("click", function (e) {
    // Remove the previous marker if it exists
    if (currentMarker) {
      currentMarker.remove();
    }
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["unclustered-point"],
    });
    if (features.length > 0) {
      // No features under the click, so this is a map click
      // Perform reverse geocoding and create a marker as you have it in your snippet
      currentMarker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
    } else {
      // Construct the URL for reverse geocoding using the clicked coordinates
      var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

      // Create a marker at the clicked location
      currentMarker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);

      // Fetch the result
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.features && data.features.length > 0) {
            var popupContent = `
                <h6>Thông tin vị trí: </h6>
                <p>Địa chỉ: ${data.features[0].place_name}</p>
                <p class="fw-bold">Chưa có thông tin quảng cáo</p>
              `;
            var popup = new mapboxgl.Popup({ offset: 25 })
              .setLngLat(e.lngLat)
              .setHTML(popupContent)
              .addTo(map);

            // Set up the event listener for the report button
            // It must be done after the popup is added to the map so the button exists in the DOM
            setTimeout(() => {
              document
                .getElementById("reportLocationBtn")
                .addEventListener("click", () => {
                  openReportModal();
                });
            }, 10); // Delaying just a bit to ensure the DOM is updated

            currentMarker.setPopup(popup); // Set popup to marker and show it
          } else {
            throw new Error("Unable to find the address of the location");
          }
        })
        .catch((error) => {
          console.error("Error fetching address: ", error);
          if (currentMarker) {
            currentMarker.remove(); // Remove the marker if geocoding fails.
          }
        });
    }
  });

  addControls(map);

  // Prevent clicks inside the sidebar from propagating to the map, which would hide the sidebar
  $("#sidebar").click(function (event) {
    event.stopPropagation();
  });

  // Clicking on the map canvas (outside the sidebar) hides the sidebar
  $(map.getCanvas()).click(function (e) {
    if (!$(e.target).closest("#sidebar").length) {
      hideSidebar(map);
    }
  }); // Event handler for the close button
  $("#closeSidebar").click(function () {
    hideSidebar(map);
  });
  $(document).ready(function () {
    // On map click, center the map on the clicked location and show sidebar with information
    map.on("click", function (e) {
      var lngLat = e.lngLat;

      // Center the map on the clicked location
      map.flyTo({ center: lngLat, zoom: 15 });
    });
  });

  // Event listener for the 'Report Issue' button

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.getElementById("pageOverlay");
    var toggleButton = document.getElementById("toggleSidebarButton");
    var sidebar = document.getElementById("nav-sidebar");

    toggleButton.addEventListener("click", function () {
      // Hide the toggle button
      // Show the sidebar
    });

    // If you want to be able to close the sidebar, you'd add an event listener
    // to a close button inside the sidebar. For example:
    var closeButton = document.getElementById("closeSideBar");
    closeButton.addEventListener("click", function () {});
  });
  document
    .getElementById("toggleSidebarButton")
    .addEventListener("click", function () {
      var sidebar = document.getElementById("nav-sidebar");
    });

  document.addEventListener("DOMContentLoaded", function () {
    var sidebar = document.getElementById("nav-sidebar");
    var toggleSidebarButton = document.getElementById("toggleSidebarButton");
    var closeSideBarButton = document.getElementById("closeSideBar");
    var pageOverlay = document.getElementById("pageOverlay");
    var navSidebar = document.getElementById("nav-sidebar");

    // Function to open the sidebar
    function openSidebar() {
      navSidebar.style.transform = "translateX(0%)";
      navSidebar.style.transition = "transform 0.5s";
      pageOverlay.style.display = "block";
    }

    // Function to close the sidebar
    function closeSidebar() {
      navSidebar.style.transform = "translateX(-100%)";
      navSidebar.style.transition = "transform 0.5s";
      pageOverlay.style.display = "none";
    }

    // Event listener to toggle the sidebar
    toggleSidebarButton.addEventListener("click", openSidebar);

    // Event listener for closing sidebar using the close button
    closeSideBarButton.addEventListener("click", closeSidebar);

    // Event listener to close the sidebar when clicking on the overlay
    pageOverlay.addEventListener("click", function () {
      closeSidebar();
    });
  });

  document.addEventListener("fullscreenchange", () => {
    var overlay = document.getElementById("pageOverlay");
    var fsElement = document.fullscreenElement;

    if (fsElement) {
      // Append the overlay to the fullscreen element, which is the Mapbox container
      fsElement.appendChild(overlay);
      overlay.style.zIndex = "500"; // Ensure it's on top
      overlay.classList.add("active"); // Use 'active' class to control visibility with opacity
    } else {
      // If exiting fullscreen, hide the overlay and move it back to its original place
      document.body.appendChild(overlay); // Or to wherever it originally is
      overlay.classList.remove("active");
    }
  });
}
function addControls(map) {
  // add Fullscreen control
  map.addControl(new mapboxgl.FullscreenControl());

  // add Zoom controls (Zoom in / Zoom out)
  map.addControl(new mapboxgl.NavigationControl());

  // add User Location control (this will show the user's location and allow for tracking)
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );
}

// Function to show sidebar with property information
function showSidebar(properties) {
  let location = JSON.parse(properties.location);
  let ward = JSON.parse(properties.ward);
  let adboard = JSON.parse(properties.adboard);
  let imageUrl = adboard.imageUrl;

  hideSidebar();
  // Start with the image of the ad
  $("#billboard-img").html(
    `<img src="${imageUrl}" alt="billboard image" class="img-fluid">
      
    `
  );
  setTimeout(() => {
    // Update the content of the sidebar
    $("#infoContent").html(`
            <h5 class="fw-bold">Địa chỉ: ${location.address}</h5>
            <p class="fw-bold fs-6">Số lượng: ${adboard.quantity}</p>
            <p class="fw-bold fs-6">Khu vực: ${ward.name}</p>
            <p class="fw-bold fs-6">Loại vị trí: ${location.locationType}</p>
            <p class="fw-bold fs-6">Hình thức quảng cáo: ${location.adFormat}</p>
            <p class="fw-bold fs-6">Trạng thái: ${location.status}</p>
            <p class="fw-bold fs-6">Loại bảng quảng cáo: ${adboard.boardType}</p>
            <p class="fw-bold fs-6">Kích thước: ${adboard.size}</p>
            <button id="viewReportsBtn" class="btn btn-primary">Xem Báo Cáo</button>
        `);

    // Add event listener to the new button
    $("#viewReportsBtn").click(function () {
      showReports(properties); // Assuming 'address' can be used to fetch reports
    });

    // Show the sidebar by adding the 'visible' class
    $("#sidebar").addClass("visible");
  }, 150);
}
function showReports(properties) {
  // Mock-up report data
  var reportsData = [
    {
      date: "2023-11-15",
      user: "User1",
      content: "This is the first report content.",
    },
    {
      date: "2023-11-14",
      user: "User2",
      content: "This is the second report content.",
    },
    // Add more reports as needed
  ];

  // Start with an empty HTML string
  var reportsHtml = "";

  // Loop over each report and append HTML string
  reportsData.forEach(function (report) {
    reportsHtml += `
          <div class="card mt-2">
              <div class="card-body">
                  <h6 class="card-title">Report by ${report.user}</h6>
                  <p class="card-text">${report.content}</p>
                  <footer class="blockquote-footer">${report.date}</footer>
                  
              </div>
          </div>
          
      `;
  });
  reportsHtml += `<button id="viewReportsBtn" class="btn btn-primary">Xem Báo Cáo</button>`;
  // Set the reports HTML to the sidebar
  $("#infoContent").html(reportsHtml);

  // Change the text of the button to toggle back to ad details
  $("#viewReportsBtn")
    .text("Ẩn Báo Cáo")
    .off("click")
    .click(function () {
      // Assuming showSidebar is your function that shows the ad details
      showSidebar(properties); // currentProperties should be the current ad details
    });
}
// Function to hide the sidebar
function hideSidebar(map) {
  $("#sidebar").removeClass("visible");
}

// Function to open the report modal
function openReportModal() {
  var overlay = document.getElementById("pageOverlay");
  var reportModalElement = document.getElementById("reportModal");
  var reportModal = new bootstrap.Modal(reportModalElement, {
    backdrop: "static", // Keep static backdrop to prevent closing when clicking outside
  });
  reportModal.show();
  overlay.style.display = "block"; // Show the overlay
}

//function to close the overlay
function closeOverlay() {
  var overlay = document.getElementById("pageOverlay");
  overlay.style.display = "none"; // Hide the overlay
}

//function to adjust buttons on sidebar when hovering
function buttonHover(id) {
  let button = document.getElementById(id);
  button.classList.add("bg-black");
  button.style.color = "white";
}

//function to return button state after stop hovering
function buttonLeave(id) {
  let button = document.getElementById(id);
  button.classList.remove("bg-black");
  button.style.color = "";
}
async function loadData() {
  try {
    const response = await fetch("/api/loaddata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    let featureCollection = {
      type: "FeatureCollection",
      features: data.map((feature) => {
        const { type, geometry, ...properties } = feature;
        return {
          type: "Feature",
          geometry: geometry,
          properties: properties,
        };
      }),
    };
    return featureCollection;
  } catch (error) {
    console.error(error);
    // Depending on how you want to handle errors, you might want to rethrow the error
    // or return a default value like `null` or `{}`.
    return null;
  }
}
let isLayerVisible = true; // A flag to track the visibility state

// Function to toggle layer opacity
function toggleMarkers() {
  const layers = ["clusters", "cluster-count", "unclustered-point"]; // Add all layer IDs you want to toggle here

  layers.forEach((layerId) => {
    // Check if the layer exists on the map
    if (map.getLayer(layerId)) {
      // Get the current visibility of the layer
      var visibility = map.getLayoutProperty(layerId, "visibility");

      // If the layer's visibility is undefined or visible, hide it
      if (visibility !== "none") {
        map.setLayoutProperty(layerId, "visibility", "none");
      } else {
        // Otherwise, show the layer
        map.setLayoutProperty(layerId, "visibility", "visible");
      }
    }
  });
}

function toggleReportedMarkers() {
  const unclusteredLayerId = "unclustered-point"; // The ID of your unclustered points layer

  // Change the opacity for markers with status "BỊ BÁO CÁO"
  const opacityExpression = [
    "case",
    ["==", ["get", "status"], "BỊ BÁO CÁO"],
    showReportedMarkers ? 0 : 1, // toggle opacity for these markers
    1,
  ]; // keep other markers unaffected

  map.setPaintProperty(unclusteredLayerId, "circle-opacity", opacityExpression);

  // Toggle the flag
  showReportedMarkers = !showReportedMarkers;
}

// Example of modifying the click event handler
map.on("click", "unclustered-point", (e) => {
  // Rest of your click handling logic...
});

// Event listener for the button

$(document).ready(function () {
  $(".summernote").summernote();
});
main();
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    console.log("Entered fullscreen mode");
    // If your sidebar needs to be moved inside the fullscreen element:
    document.fullscreenElement.appendChild(document.getElementById("sidebar"));
  } else {
    console.log("Exited fullscreen mode");
    // Move the sidebar back to its original container if needed
  }
});
// Get a reference to the toggle button element
// Get a reference to the button element
const toggleReportedMarkersButton = document.getElementById(
  "toggleReportedMarkers"
);

// Select the <i> element with the class "bi-toggle-off" within the button
const toggleButton =
  toggleReportedMarkersButton.querySelector(".bi.bi-toggle-off");

// Now, you can work with the "toggleOffIcon" element as needed

// Add a click event listener to toggle the state and color
toggleButton.addEventListener("click", function () {
  toggleReportedMarkers();
  // Check if the toggle button is currently in the off state
  if (toggleButton.classList.contains("bi-toggle-off")) {
    toggleButton.classList.remove("bi-toggle-off");
    toggleButton.classList.add("bi-toggle-on");
  } else {
    toggleButton.classList.remove("bi-toggle-on");
    toggleButton.classList.add("bi-toggle-off");
  }
});
const toggleMarkersButton = document.getElementById("toggleMarkers");
const toggleButton2 = toggleMarkersButton.querySelector(".bi-toggle-off");

// Now, you can work with the "toggleOffIcon" element as needed
toggleButton2.addEventListener("click", toggleMarkers);
// Add a click event listener to toggle the state and color
toggleButton2.addEventListener("click", function () {
  // Check if the toggle button is currently in the off state
  if (toggleButton2.classList.contains("bi-toggle-off")) {
    toggleButton2.classList.remove("bi-toggle-off");
    toggleButton2.classList.add("bi-toggle-on");
  } else {
    toggleButton2.classList.remove("bi-toggle-on");
    toggleButton2.classList.add("bi-toggle-off");
  }
});
