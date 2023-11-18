//map center
const HCMlong = 106.6993006;
const HCMlat = 10.7890103;

//access Token
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";

//main function
function main() {
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [HCMlong, HCMlat],
    zoom: 15,
  });

  clusteringMarkers(map)

  //add custom map controls
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
            `<h6>Thông tin vị trí: </h6>
          <p>Địa chỉ: ${data.features[0].place_name}</p>
          <p class="fw-bold">Chưa có thông tin quảng cáo</p>`
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

        // Add markers to the map.
        const marker = new mapboxgl.Marker(el)
          .setLngLat(ad.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `
          <h6>${ad.properties.adFormat}</h6>
          <p>${ad.properties.address}</p>
          <p>${ad.properties.area}</p>
          <p>${ad.properties.landType}</p>
          <p style="font-weight: 900; font-style: italic">${ad.properties.status}</p>
          `
            )
          )
          .addTo(map);
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
      map.flyTo({ center: lngLat });
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.getElementById("pageOverlay");
    var toggleButton = document.getElementById("toggleSidebarButton");
    var sidebar = document.getElementById("nav-sidebar");

    toggleButton.addEventListener("click", function () {
      // Hide the toggle button
      // Show the sidebar
    });

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
      trackUserLocation: true, // Set to true to keep tracking user's location
      showUserLocation: true, // Set to true to show user's location
    })
  );
}

//asynchronous function to grab data from json config file
async function grabAdData() {
  try {
    const data = await fetch("/AdData.json");
    const jsonData = await data.json();
    return jsonData;
  } catch (error) {
    throw new Error(`Error found: ${error.message}`);
  }
}

// Function to show sidebar with property information
function showSidebar(properties) {
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