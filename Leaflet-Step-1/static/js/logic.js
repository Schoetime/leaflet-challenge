function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earth Quakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
function createMarkers(data) {

  // Pull the "stations" property off of response.data
  var quakes = data.features;

  // Initialize an array to hold bike markers
  var quakemarkers = [];

  // Loop through the stations array
  quakes.forEach(quake => {
    // var magrad = Math.pow(quake.properties.mag,3.3)*666;
    var magrad = Math.pow(quake.properties.mag,3.75) * 420;
    // For each station, create a marker and bind a popup with the station's name
    var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{radius:magrad,color:getColor(quake.geometry.coordinates[2])})
      .bindPopup("<h3> Magnitude: " + quake.properties.mag + "</h3>" +
      "<h3> Depth: " + quake.geometry.coordinates[2] + "</h3>" +
      "<h3> Location: " + quake.properties.place + "</h3>")
    // Add the marker to the bikeMarkers array
    quakemarkers.push(quakeMarker);
  })

  createMap(L.layerGroup(quakemarkers));
}

function getColor(d){
  return d>91 ? "red":
    d>71 ? "orange":
    d>51 ? "lightorange":
    d>31 ? "yellow":
    d>11 ? "lightgreen":
    "green";
}