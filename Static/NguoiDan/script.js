const long = 106.660172;
const lat = 10.762622;

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [long, lat],
  zoom: 15,
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
        var popup = new mapboxgl.Popup({ offset: 25 }).setText(
          "Address: " + data.features[0].place_name
        );
        currentMarker.setPopup(popup).togglePopup(); // Set popup to marker and show it
      } else {
        throw new Error("No address found for this location");
      }
    })
    .catch((error) => {
      console.error("Error fetching address: ", error);
      currentMarker.remove(); // Remove the marker if geocoding fails.
    });
});
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

async function grabAdData() {
  try {
    const response = await fetch("/AdData.json");
    const data = await response.json();

    for (const feature of data.features) {
      // Continue if the feature is not properly defined
      if (!feature.properties) continue;

      const el = document.createElement("div");
      el.className = "marker";

      // Create the HTML content for the popup using the properties from the feature
      const popupContent = `
        <div>
          <h3>Address: ${feature.properties.address}</h3>
          <p>Section: ${feature.properties.section}</p>
          <p>Land Type: ${feature.properties.landtype}</p>
          <p>Format: ${feature.properties.format}</p>
          <p>Status: ${feature.properties.status}</p>
          <p>Type: ${feature.properties.type}</p>
          <p>Size: ${feature.properties.size}</p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      // Tạo marker mới.
      const marker = new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);

      // Add 'mouseenter' event listener to show the popup.
      el.addEventListener("mouseenter", () => {
        marker.getPopup().addTo(map);
      });

      // Add 'mouseleave' event listener to remove the popup.
      el.addEventListener("mouseleave", () => {
        marker.getPopup().remove();
      });
      // Add a click event listener for each marker
      // When a marker is clicked, update and show the sidebar
      $(marker.getElement()).click(() => showSidebar(feature.properties));
    }
  } catch (error) {
    console.error(`Error fetching advertisement data: ${error.message}`);
  }
}

grabAdData();

// Function to show sidebar with property information
function showSidebar(properties) {
  // Update the content of the sidebar
  $("#infoContent").html(`
    <h4>${properties.address}</h4>
    <p>Section: ${properties.section}</p>
    <p>Land Type: ${properties.landtype}</p>
    <!-- Add other details as needed -->
  `);

  // Show the sidebar
  $("#sidebar").removeClass("d-none");
}
// Function to hide the sidebar
function hideSidebar() {
  $("#sidebar").addClass("d-none");
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

// Prevent clicks inside the sidebar from propagating to the map, which would hide the sidebar
$("#sidebar").click(function (event) {
  event.stopPropagation();
});

// Clicking on the map canvas (outside the sidebar) hides the sidebar
$(map.getCanvas()).click(function (e) {
  if (!$(e.target).closest("#sidebar").length) {
    hideSidebar();
  }
}); // Event handler for the close button
$("#closeSidebar").click(function () {
  hideSidebar();
});
$(document).ready(function () {
  // On map click, center the map on the clicked location and show sidebar with information
  map.on("click", function (e) {
    var lngLat = e.lngLat;

    // Center the map on the clicked location
    map.flyTo({ center: lngLat });

    // Perform a reverse geocode on the clicked location
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
});
// Your existing map setup code

// ...

// Function to open the report modal
function openReportModal() {
  var reportModalElement = document.getElementById("reportModal");
  var reportModal = new bootstrap.Modal(reportModalElement, {
    backdrop: false, // Disable the backdrop
  });
  reportModal.show();
}

// Event listener for the 'Report Issue' button
document
  .getElementById("reportButton")
  .addEventListener("click", openReportModal);

document.addEventListener("DOMContentLoaded", function () {
  var toggleButton = document.getElementById("toggleSidebarButton");
  var sidebar = document.getElementById("nav-sidebar");

  toggleButton.addEventListener("click", function () {
    // Hide the toggle button
    toggleButton.classList.add("d-none");

    // Show the sidebar
    sidebar.classList.remove("d-none");
  });

  // If you want to be able to close the sidebar, you'd add an event listener
  // to a close button inside the sidebar. For example:
  var closeButton = document.getElementById("closeSideBar");
  closeButton.addEventListener("click", function () {
    sidebar.classList.add("d-none");
    toggleButton.classList.remove("d-none");
  });
});
document
  .getElementById("toggleSidebarButton")
  .addEventListener("click", function () {
    var sidebar = document.getElementById("nav-sidebar");
    sidebar.classList.toggle("open");
  });
// Opening the sidebar
document
  .getElementById("toggleSidebarButton")
  .addEventListener("click", function () {
    var sidebar = document.getElementById("nav-sidebar");
    sidebar.style.transform = "translateX(0%)"; // Adjust as necessary for your layout
  });

// Closing the sidebar
document.getElementById("closeSideBar").addEventListener("click", function () {
  var sidebar = document.getElementById("nav-sidebar");
  sidebar.style.transform = "translateX(-100%)"; // Adjust as necessary for your layout
});
