const HCMlong = 106.660172;
const HCMlat = 10.762622;
const clusterBreakpointZoomLevel = 14; // Adjust this value as needed

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";

function main() {
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [HCMlong, HCMlat],
    zoom: 15,
  });
  // After the map has been loaded, you add your data source and layers.
  map.on("load", async function () {
    // Load your data
    const geojsonData = await loadData();

    // Add the source with your GeoJSON data and enable clustering
    map.addSource("ads", {
      type: "geojson",
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Add a layer for the clusters
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "ads",
      filter: ["has", "point_count"],
      paint: {
        // Paint properties here
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6", // Color for clusters with count < 100
          100,
          "#f1f075", // Color for clusters with count < 750
          750,
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
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    // Add a layer for individual points (non-clustered)
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "ads",
      filter: ["!", ["has", "point_count"]],
      paint: {
        // Use a 'case' expression to assign a color based on the 'status' property
        "circle-color": [
          "match",
          ["get", "status"],
          "ĐÃ QUY HOẠCH",
          "#51bbd6", // Blue
          "CHƯA QUY HOẠCH",
          "#ffff00", // Yellow
          "ĐÃ CẤP PHÉP",
          "#00ff00", // Green
          "BỊ BÁO CÁO",
          "#ff0000", // Red
          "#ffffff", // Default color (white)
        ],
        "circle-radius": 15, // Radius for individual points
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });
  });

  map.on("zoom", function () {
    if (map.getZoom() > clusterBreakpointZoomLevel) {
      map.setLayoutProperty("unclustered-point", "visibility", "visible");
      map.setLayoutProperty("clusters", "visibility", "none");
      map.setLayoutProperty("cluster-count", "visibility", "none");
    } else {
      map.setLayoutProperty("unclustered-point", "visibility", "none");
      map.setLayoutProperty("clusters", "visibility", "visible");
      map.setLayoutProperty("cluster-count", "visibility", "visible");
    }
  });
  // Assuming your 'unclustered-point' layer is for individual points
  map.on("mouseenter", "unclustered-point", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Create a popup and set its content based on the feature properties
    var coordinates = e.features[0].geometry.coordinates.slice();
    var properties = e.features[0].properties;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(
        `
      <h6>${properties.adFormat}</h6>
      <p>${properties.address}</p>
      <p>${properties.area}</p>
      <p>${properties.landType}</p>
      <p style="font-weight: 900; font-style: italic">${properties.status}</p>
      `
      )
      .addTo(map);
  });

  map.on("mouseleave", "unclustered-point", function () {
    map.getCanvas().style.cursor = "";
    // Remove the popup
    map.getCanvas().style.cursor = "";
    if (map.getPopup()) {
      map.getPopup().remove();
    }
  });

  map.on("click", "unclustered-point", function (e) {
    // Prevent the 'click' event from propagating to the map
    event.stopPropagation();

    // Fly to the point
    map.flyTo({ center: e.features[0].geometry.coordinates, zoom: 15 });

    // Pass the properties of this specific feature to the sidebar
    showSidebar(e.features[0].properties);
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
          var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h6>Location Information: </h6>
          <p>Address: ${data.features[0].place_name}</p>`
          );
          currentMarker.setPopup(popup).togglePopup(); // Set popup to marker and show it
        } else {
          throw new Error("Unable to find the address of the location");
        }
      })
      .catch((error) => {
        console.error("Error fetching address: ", error);
        currentMarker.remove(); // Remove the marker if geocoding fails.
      });
  });

  addControls(map);
  grabAdData()
    .catch((error) => {
      console.log(`Error found: ${error.message}`);
    })
    .then((data) => {
      for (const ad of data.features) {
        // Create a DOM element for each marker.
        const el = document.createElement("div");
        //adjust color of icon
        switch (ad.properties.status) {
          case "ĐÃ QUY HOẠCH": {
            el.className = "marker";
            break;
          }

          case "CHƯA QUY HOẠCH": {
            el.className = "yellow";
            break;
          }

          case "ĐÃ CẤP PHÉP": {
            el.className = "green";
            break;
          }

          case "BỊ BÁO CÁO": {
            el.className = "red";
            break;
          }

          default: {
            el.className = "marker";
          }
        }

        // // Add markers to the map.
        // const marker = new mapboxgl.Marker(el)
        //   .setLngLat(ad.geometry.coordinates)
        //   .setPopup(
        //     new mapboxgl.Popup({ offset: 25 }).setHTML(
        //       `
        //   <h6>${ad.properties.adFormat}</h6>
        //   <p>${ad.properties.address}</p>
        //   <p>${ad.properties.area}</p>
        //   <p>${ad.properties.landType}</p>
        //   <p style="font-weight: 900; font-style: italic">${ad.properties.status}</p>
        //   `
        //     )
        //   )
        //   .addTo(map);
        // Add 'mouseenter' event listener to show the popup.
        el.addEventListener("mouseenter", () => {
          marker.getPopup().addTo(map);
        });

        // Add 'mouseleave' event listener to remove the popup.
        el.addEventListener("mouseleave", () => {
          marker.getPopup().remove();
        });
        marker.getElement().addEventListener("click", function (event) {
          // Prevents the map click event (and thus the reverse geocoding) from firing
          event.stopPropagation();
          map.flyTo({ center: ad.geometry.coordinates, zoom: 15 });

          // Pass the properties of this specific feature to the sidebar
          showSidebar(ad.properties);
        });
      }
    });

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

  // Event listener for closing the modal
  document
    .getElementById("reportModal")
    .addEventListener("hide.bs.modal", closeOverlay);

  // Event listener for the form submission
  document
    .getElementById("reportForm")
    .addEventListener("submit", function (event) {
      closeOverlay(); // Hide the overlay
      // Perform the submission logic or AJAX request here
      // For example:
      // $.post('/submit-report', $(this).serialize(), function(response) {
      //   // Handle response
      //   $('#reportModal').modal('hide'); // Hide the modal if the submission is successful
      // });
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

main();

function addControls(map) {
  // Assuming the rest of your code before this...

  // 1. Add Fullscreen control
  map.addControl(new mapboxgl.FullscreenControl());

  // 2. Add Zoom controls (Zoom in / Zoom out)
  map.addControl(new mapboxgl.NavigationControl());

  // 3. Add User Location control (this will show the user's location and allow for tracking)
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true, // Set to true to keep tracking user's location
      showUserLocation: true, // Set to true to show user's location
    })
  );
}

async function grabAdData() {
  try {
    const data = await fetch("/AdData.json");
    const jsonData = await data.json();
    return jsonData;
  } catch (error) {
    throw new Error(`Error found: ${error.message}`);
  }
}
document
  .getElementById("reportButton")
  .addEventListener("click", openReportModal);
// Function to show sidebar with property information
function showSidebar(properties) {
  hideSidebar();
  // Start with the image of the ad
  var sidebarContent = `
    <div class="sidebar-section">
      <img src="${properties.imageUrl}" alt="Ad Image" style="width:100%; height:auto;">
    </div>
  `;
  setTimeout(() => {
    // Update the content of the sidebar
    $("#infoContent").html(`
    
    <h5 class="fw-bold">Địa chỉ: ${properties.address}</h5>
    <p class="fw-bold fs-6">Số lượng: ${properties.quantity}</p>
    <p class="fw-bold fs-6">Khu vực: ${properties.area}</p>
    <p class="fw-bold fs-6">Loại vị trí: ${properties.landType}</p>
    <p class="fw-bold fs-6">Hình thức quảng cáo: ${properties.adFormat}</p>
    <p class="fw-bold fs-6">Trạng thái: ${properties.status}</p>
    <p class="fw-bold fs-6">Loại bảng quảng cáo: ${properties.boardType}</p>
    <p class="fw-bold fs-6">Kích thước: ${properties.size}</p>
  `);

    // Show the sidebar by adding the 'visible' class
    $("#sidebar").addClass("visible");
  }, 150);
}

// Function to hide the sidebar
function hideSidebar(map) {
  $("#sidebar").removeClass("visible");
}
// On map click, show sidebar with the location information
map.on("click", function (e) {
  // Perform a reverse geocode on the clicked location
  var lngLat = e.lngLat;
  var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

  $.get(url, function (data) {
    if (data.features.length > 0) {
      var placeName = data.features[0].place_name;
      showSidebar(`<strong>Location:</strong> ${placeName}`);
    } else {
      showSidebar("No location information found.");
    }
  });
});

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
    const response = await fetch("/AdData.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error(`Error loading data: ${error}`);
    return null;
  }
}