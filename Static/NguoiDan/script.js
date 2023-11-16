const HCMlong = 106.660172;
const HCMlat = 10.762622;

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";

function main() {
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [HCMlong, HCMlat],
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
        //add if statement here to adjust color of icon
        el.className = "marker";

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
    // Next, add the name of the ad and the rating
    sidebarContent += `
    <div class="sidebar-section">
      <h3>${properties.name}</h3>
      <p>Rating: ${properties.rating} (${properties.reviewCount} reviews)</p>
    </div>
  `;

    // Add tabs for Overview and Reports
    sidebarContent += `
    <div class="sidebar-section">
      <ul class="nav nav-tabs" id="adInfoTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">Overview</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="reports-tab" data-bs-toggle="tab" data-bs-target="#reports" type="button" role="tab" aria-controls="reports" aria-selected="false">Reports</button>
        </li>
      </ul>
      <div class="tab-content" id="adInfoTabsContent">
        <div class="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
          <p>Address: ${properties.address}</p>
          <p>Quantity: ${properties.quantity}</p>
          <p>Area: ${properties.area}</p>
          <p>Land Type: ${properties.landType}</p>
          <p>Ad Format: ${properties.adFormat}</p>
          <p>Status: ${properties.status}</p>
          <p>Board Type: ${properties.boardType}</p>
          <p>Size: ${properties.size}</p>
          <!-- Report Button in Overview -->
          
        </div>
        <div class="tab-pane fade" id="reports" role="tabpanel" aria-labelledby="reports-tab">
          <!-- User reports will be inserted here -->
        </div>
      </div>
    </div>
  `;

    // Update the content of the sidebar
    $("#infoContent").html(sidebarContent);

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
