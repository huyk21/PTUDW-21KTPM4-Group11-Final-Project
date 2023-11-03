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
    const data = await fetch('/AdData.json')
    const jsonData = await data.json()
    return jsonData
  }
  catch(error){
    throw new Error(`Error found: ${error.message}`)
  }
}

grabAdData().catch(error => 
  {
    console.log(`Error found: ${error.message}`)
  }).then(data => {
  for (const marker of data.features) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.className = "marker";
  
    // Add markers to the map.
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
})
