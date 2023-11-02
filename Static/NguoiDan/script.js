mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [106.660172, 10.77368],
  zoom: 13,
});

// Add the control to the map.
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
