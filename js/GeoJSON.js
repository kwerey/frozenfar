// Define interesting points as GeoJSON, then create individually toggleable layers to plot them on a map.

// geoJSON is lon/lat rather than lat/lon so these coords are inverted vs the rest of leaflet.
var tenTowns = [
    {
        "type": "Feature",
        "properties": {
            "name": "Bryn Shander",
            "sacrifices": false,
            "fact": "biggest tentown.",
            "color": "green",
            "population": 1200,
            "speaker": "Duvessa Shane"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.095719, 52.646502 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Goodmead",
            "sacrifices": true,
            "fact": "it's good mead, brent!",
            "population": 100,
            "speaker": "[pending byelection, maybe Olivessa?]"      
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.067326, 52.587174 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Targos",
            "sacrifices": true,
            "fact": "Speaker is a Zhentarim?",
            "population": 1000,
            "speaker": "Naerth"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.178579, 52.678121 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Easthaven",
            "sacrifices": false,
            "fact": "pubs are either freezing or haunted.",
            "population": 750,
            "speaker": "UNKNOWN"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.261173, 52.618193 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Dougan\'s Hole",
            "sacrifices": true,
            "fact": "hole not included in cost of purchase.",
            "population": 50,
            "speaker": "Edgra Durmoot"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.027086, 52.554846 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Caer-Konig",
            "sacrifices": false,
            "fact": "watch out for Speakers in snowdrifts.",
            "population": 150,
            "speaker": "Trovus the Very Sober Dragonborn."
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.335297, 52.755406 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Caer-Dineval",
            "sacrifices": false,
            "fact": "where the Speaker is definitely alive.",
            "population": 100,
            "speaker": "Sir Crannoc the Definitely Still Alive"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.266663, 52.701312 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Lonelywood",
            "sacrifices": false,
            "fact": "[as yet unexplored].",
            "population": 100,
            "speaker": "UNKNOWN"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.03828, 52.779484 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Bremen",
            "sacrifices": false,
            "fact": "highest tavern per head count in Icewind Dale.",
            "population": 150,
            "speaker": "Dorbulgruf Shaelscar"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.210035, 52.703097 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Termalaine",
            "sacrifices": false,
            "fact": "mine your own business, the kobolds are staff!",
            "population": 600,
            "speaker": "Oarus Masthew"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.010645, 52.758745 ]
        }
    }
];

// L.geoJSON is already an extension of L.layergroup, doesnt need to be defined as one! https://leafletjs.com/examples/geojson/
var tenTownsData = L.geoJSON(tenTowns, {
    style: function (feature) {
        return {color: feature.properties.color};
    }
}).bindPopup(function (layer) {
    headline = '<b>' + layer.feature.properties.name + '</b>: ' + layer.feature.properties.fact;
    populationCount = '<br/><b>Population:</b> ' + layer.feature.properties.population;
    speakerName = '<br/><b>Speaker:</b> ' + layer.feature.properties.speaker;
    msg = headline + populationCount + speakerName;
    return msg;
})


// Roads - not sure if we'll do anything with this, but let's see
var roads = [{
        "type": "LineString",
        "coordinates": [[ 0.2637, 52.6180 ], [ 0.2248, 52.6128 ], [ 0.2059, 52.6176 ], [0.1294, 52.6266], [ -0.0934, 52.6472] ]
    }, {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];



// these are already apparently a layergroup, dont need to be defined as one! https://leafletjs.com/examples/geojson/
var roadsData = L.geoJSON(roads)

// Now we do the same for landmarks.

var landmarks = [
    {
        "type": "Feature",
        "properties": {
            "name": "Kelvin\'s Cairn",
            "fact": "home to the Dread Goat Whittaker.",
            "affiliation": "blacksheen beasts?"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.244356, 52.809421 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Keel Hollow",
            "fact": "Old Frost Giant hospice, still full of whispers.",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.3769, 52.693847 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Nafri\'s Rest",
            "fact": "Followers of the Bloody-Handed Lady, who drove away their Sanguine.",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.355677, 52.552373 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Black Cabin",
            "fact": "???",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.085081, 52.873548 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Frost Giant\'s Lodge",
            "fact": "Left in the care of a thinking Mammoth",
            "affiliation": "Aurilites"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.251304, 52.560898 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Snappy\'s Nest",
            "fact": "Our fish friend has been driven away by Aurilites",
            "affiliation": "Aurilites"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.150343, 52.789661 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Lost Spire of Netheril",
            "fact": "Maybe here... we can finally see the stars?",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.640013, 52.77122 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Former site of Mossclaw Village",
            "fact": "Who knows what lives here now, at the foot of the Spine of the World?",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -0.514498, 52.421398 ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name": "Revel\'s End",
            "fact": "A prison at the end of the world.",
            "affiliation": "[UNKNOWN]"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ 0.038455, 53.085782 ]
        }
    }
]

// these are already apparently a layergroup, dont need to be defined as one! https://leafletjs.com/examples/geojson/
var landmarkData = L.geoJSON(landmarks, {
    style: function (feature) {
        return {color: feature.properties.color};
    }
}).bindPopup(function (layer) {
    headline = '<b>' + layer.feature.properties.name + '</b>: ' + layer.feature.properties.fact;
    affiliation = '<br/><b>Affiliation:</b> ' + layer.feature.properties.affiliation;
    msg = headline + affiliation;
    return msg;
})

//Coordinate Finder
var marker = L.marker([52.75, 0.8 ], {
    draggable: true,
});

marker.bindPopup('Drag this marker!').openPopup();
marker.on('dragend', function(e) {
    marker.getPopup().setContent(marker.getLatLng().toString()).openOn(map);
});

var utility = L.layerGroup([ marker]);

// Define the base layer and map, then configure display.

var baseLayer = L.tileLayer('./raw-icewind-dale-map/{z}/{x}/{y}.png', {
    tms: true,
    opacity: 0.7,
    attribution: 'Map image &copy; <a href="https://company.wizards.com/en">Wizards of the Coast</a>',
    minZoom: 9,
    maxZoom: 13,
});

//Creating the Map
var map = L.map('map', {
    center: [52.75, 0.3 ],
    zoom: 10,
    minZoom: 9,
    maxZoom: 13,
    layers: [baseLayer, tenTownsData]
});

// Fit to overlay bounds (SW and NE points with (lat, lon))     
map.fitBounds([[ 52.205, 1.575447 ], [53.23102, -0.89751] ]);

var baseMaps = {
    "The Frozenfar": baseLayer
};

var overlayMaps = {
    "Ten Towns": tenTownsData,
    "Landmarks": landmarkData,
    "Coordinate Finder": utility
//    "Roads": roadsData // these ones are not ready for prime time yet
};

// Add layers to map
L.control.layers(baseMaps, overlayMaps).addTo(map);

L.control.scale().addTo(map);
