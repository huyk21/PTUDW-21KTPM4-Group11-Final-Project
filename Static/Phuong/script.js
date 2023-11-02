const long = 106.660172;
const lat = 10.762622;
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHV5azIxIiwiYSI6ImNsbnpzcWhycTEwbnYybWxsOTAydnc2YmYifQ.55__cADsvmLEm7G1pib5nA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [long, lat],
  zoom: 14,
});

var marker = new mapboxgl.Marker()
  .setLngLat([106.6942, 10.77368])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<h3>Trường đại học kinh tế TPHCasduM</h3><p>University of Economics Ho Chi Minh City</p>"
    )
  )
  .addTo(map);
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
const advertisementPoints = [
  {
    lng: 106.67,
    lat: 10.762,
    title: "Điểm quảng cáo 1",
    description: "Thông tin về điểm quảng cáo 1",
  },
  // ... thêm các điểm khác
];
const markers = [];

advertisementPoints.forEach((point) => {
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h3>${point.title}</h3><p>${point.description}</p>`
  );

  const marker = new mapboxgl.Marker()
    .setLngLat([point.lng, point.lat])
    .setPopup(popup)
    .addTo(map);

  markers.push(marker);
});

let areAdsVisible = true;

document.getElementById("toggleAds").addEventListener("click", function () {
  if (areAdsVisible) {
    markers.forEach((marker) => marker.remove());
  } else {
    markers.forEach((marker) => marker.addTo(map));
  }

  areAdsVisible = !areAdsVisible;
});
