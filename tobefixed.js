/* convenience stores */
var convenience = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getToBeFixed.php?kind=convenience",
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
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getToBeFixed.php?kind=toilets",
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
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getToBeFixed.php?kind=signals",
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

// Handling events
// Save current status
map.on('baselayerchange', function(e) {
  lsSet('layer', e.name);
});

map.on('moveend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
});

map.on('zoomend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
  lsSet('zoom', map.getZoom());
});
