BASE_URL="http://charilab.sakura.ne.jp";

/* convenience stores */
var convenience = L.geoJsonDynamic({
        jsonUrl: BASE_URL+"/geoapi/getToBeFixed.php?kind=convenience",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* toilets */
var toilets = L.geoJsonDynamic({
        jsonUrl: BASE_URL+"/geoapi/getToBeFixed.php?kind=toilets",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* traffic signals */
var signals = L.geoJsonDynamic({
        jsonUrl: BASE_URL+"/geoapi/getToBeFixed.php?kind=signals",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/*
 Set base layers:
    You must include 'baselayers.js' before.
*/
var baseLayers = {
    "OpenStreetMap": osm,
    "OpenCycleMap": ocm,
    "Mapbox": mapbox_mine
};

var overlays = {
    "コンビニエンスストア": convenience,
    "トイレ": toilets,
    "交差点": signals
};

// functions for local storage
function lsSet(key, val) {
    return window.localStorage.setItem(key, val);
}

function lsGet(key) {
    return window.localStorage.getItem(key);
}

function lsClear() {
    return window.localStorage.clear();
}

/*
 * Main routine
 */
// Get previous status
var baselayer = lsGet('layer') ? baseLayers[lsGet('layer')] : baseLayers['OpenCycleMap'];
var lat = lsGet('latitude') ? lsGet('latitude') : 35.67487;
var lng = lsGet('longitude') ? lsGet('longitude') : 139.76807;
var center = L.latLng(lat, lng);
var zoom = lsGet('zoom') ? lsGet('zoom') : 10;

var map = L.map('map', {
    fullscreenControl: true,
    layers: baselayer,
    minZoom: 5,
    mazZoom: 19
}).setView(center, zoom);

L.control.layers(baseLayers, overlays, {
    position: 'topleft'
}).addTo(map);

// add scalebar
L.control.scale({
    position: 'topright',
    metric: true,
    imperial: false
}).addTo(map);

function setUrl() {
    var ymax=map.getBounds().getNorthWest().lat;
    var xmin=map.getBounds().getNorthWest().lng;
    var ymin=map.getBounds().getSouthEast().lat;
    var xmax=map.getBounds().getSouthEast().lng;
    var locStr = "_"+ymax+"_"+xmin+"_"+ymin+"_"+xmax;
    
    var anchor = document.getElementById("tdf_conv");
    anchor.href = BASE_URL+"/tobefixed/tbf0"+locStr+".gpx";
    anchor.text = BASE_URL+"/tobefixed/tbf0"+locStr+".gpx";

    anchor = document.getElementById("tdf_toilets");
    anchor.href = BASE_URL+"/tobefixed/tbf1"+locStr+".gpx";
    anchor.text = BASE_URL+"/tobefixed/tbf1"+locStr+".gpx";

    anchor = document.getElementById("tdf_sig");
    anchor.href = BASE_URL+"/tobefixed/tbf2"+locStr+".gpx";
    anchor.text = BASE_URL+"/tobefixed/tbf2"+locStr+".gpx";
}

setUrl();

// Handling events
// Save current status
map.on('baselayerchange', function(e) {
  lsSet('layer', e.name);
});

map.on('moveend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
  setUrl();
});

map.on('zoomend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
  lsSet('zoom', map.getZoom());
  setUrl();
});
