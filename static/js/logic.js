// Visualizing USGS Data with Leaflet

// Data = Signficant Earthquakes in the Past 7 Days JSON ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson")

// Use the URL of the JSON to pull in the data for the visulization
var sig_earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const colors= ['#4034eb', '#349ceb', '#34ebe5', '#b1eb34', '#37eb34', '#ebe534', '#eb9634', '#7a1809']
// var myMap = L.map("map", {
//   center: [45.52, -122.67],
//   zoom: 13
// }); 

// Pull the GeoJSON data
d3.json(sig_earthquake_url, function(data) {
  // Now use createFeature function to create
  createFeatures(data.features);
});

function createFeatures(featureData) {

  function onEachFeature(feature, layer) {
      layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>Magnitude: ' + feature.properties.mag + '</h4><h4>USGS Event Page: <a href=' + feature.properties.url + " target='_blank'>Click here</a></h4>", {maxWidth: 400})
  }

  const layerToMap = L.geoJSON(featureData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
          

          if (feature.properties.mag >= 7) {
            fillcolor = colors[7];
          }
          else if (feature.properties.mag >= 6) {
              fillcolor = colors[6];
          }
          else if (feature.properties.mag >= 5) {
              fillcolor = colors[5];
          }
          else if (feature.properties.mag >= 4) {
              fillcolor = colors[4];
          }
          else if (feature.properties.mag >= 3) {
              fillcolor = colors[3];
          }
          else if (feature.properties.mag >= 2) {
              fillcolor = colors[2];
          }
          else if (feature.properties.mag >= 1) {
              fillcolor = colors[1];
          }
          else  fillcolor = colors[0];

          let radius = feature.properties.mag * 3;

          return L.circleMarker(latlng, {
              radius: radius,
              color: 'black',
              fillColor: fillcolor,
              fillOpacity: 1,
              weight: 1
          });
      }
  });
  createMap(layerToMap);
}

function createMap(earthquakes) {
  // Create the streetmap and earthquakes layers
  const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  const baseMaps = {
      "Street Map": streetmap
    };

  // Create overlay object to hold overlay layer
  const overlayMaps = {
      Earthquakes: earthquakes
    };
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  const myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap,earthquakes]
    });
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap); 
  // Creating the legend
  var legend = L.control({ position: "topleft" });

  // function to assign colors for legend and markers

  function getColor(d) {
    return ( d >= 7 ? colors[7] :
        d >= 6 ? colors[6] :
        d >= 5 ? colors[5] :
        d >= 4 ? colors[4] :
        d >= 3 ? colors[3] :
        d >= 2 ? colors[2] :
        d >= 1 ? colors[1] :
        colors[0]);
  }

  legend.onAdd = function(myMap) {
    const div = L.DomUtil.create('div', 'info legend')
    const magnitudes = [0, 1, 2, 3, 4, 5, 6, 7]
    div.innerHTML += "<b>LEGEND</b><br>"
    for (let i = 0; i < magnitudes.length; i++) {
         div.innerHTML +=
         '<i  style="background-color:' + getColor(magnitudes[i]) + '">' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '</i>  <rect width="60" height="10" style="fill:' + getColor(magnitudes[i]) + '"/><br>' : '+');
    }
    return div
  };
  // Adding legend to the map
  legend.addTo(myMap);
};
