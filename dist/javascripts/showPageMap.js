"use strict";

mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: noticia.geometry.coordinates,
  zoom: 12
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker().setLngLat(noticia.geometry.coordinates).setPopup(new mapboxgl.Popup({
  offset: 25
}).setHTML("<h3>".concat(noticia.title, "</h3><p>").concat(noticia.location, "</p>"))).addTo(map);