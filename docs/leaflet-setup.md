# Leaflet

This "make an interactive fantasy map" blog was where I started - thanks, fellow blogger! 
https://www.techtrail.net/creating-an-interactive-map-with-leaflet-js/

Leaflet itself has great documentation and examples at https://leafletjs.com/examples/quick-start/ onwards. 

This project uses in particular:

* Layer groups and layer controls: https://leafletjs.com/examples/layers-control/
* GeoJSON: https://leafletjs.com/examples/geojson/

Further notes will assume you've read those.

## GeoJSON

Note that:

- GeoJSON uses lon, lat rather than lat, lon
- GeoJSON objects are themselves layergroups, so we can simply create an L.geoJSON() object containing our data and then enable it as a map layer on the layer control:

```

var tenTownsData = {
    // a list of GeoJSON Features
}

var tenTownsData = L.geoJSON(tenTowns, {
    style: function (feature) {
        return {color: feature.properties.color};
    }
}).bindPopup(function (layer) {
    msg = layer.feature.properties.popupContent + '\n \n Population: ' + layer.feature.properties.population
    return msg;
})
```
