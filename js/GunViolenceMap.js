// ============================================================
// Davidson County Gun Death Tracker
// Mapbox GL JS
// ============================================================
//
// MAPBOX PROVIDES:
//
// - Basemap
// - Roads
// - Highway shields
// - Road names
// - City names
// - Water
// - Geographic context
//
// CENSUS TIGERWEB PROVIDES:
//
// - Tennessee boundary
// - Davidson County boundary
//
// DOES NOT CREATE:
//
// - Custom city labels
// - City polygons
//
// ============================================================


// ============================================================
// MAPBOX ACCESS TOKEN
// ============================================================

mapboxgl.accessToken =
    "pk.eyJ1IjoiZmF0aW1hLWFsZWpvIiwiYSI6ImNtOGN4MWEwbTI0eTkyaXBzc2VpZXZqdXcifQ.OOX9uS34z6I0ztBKBPSbtA";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

var map;

var tennesseeData = null;

var davidsonData = null;


// ============================================================
// CREATE MAP
// ============================================================

function createMap() {

    console.log(
        "Creating Mapbox map..."
    );


    map = new mapboxgl.Map({

        container:
            "map",

        style:
            "mapbox://styles/mapbox/streets-v12",

        // Davidson County / Nashville area
        center: [
            -86.78,
            36.17
        ],

        zoom:
            10,

        minZoom:
            9,

        maxZoom:
            15,

        attributionControl:
            true

    });


    // ========================================================
    // NAVIGATION CONTROL
    // ========================================================

    map.addControl(

        new mapboxgl.NavigationControl(),

        "top-right"

    );


    // ========================================================
    // MAP LOAD
    // ========================================================

    map.on(

        "load",

        function() {

            console.log(
                "MAPBOX IS WORKING"
            );


            // Load Census boundaries.

            addTennessee();

            addDavidsonCounty();


            // Create map controls.

            createLegend();

            createRecenterButton();

        }

    );

}


// ============================================================
// TENNESSEE
// ============================================================

function addTennessee() {

    console.log(
        "Loading Tennessee..."
    );


    var url =

        "https://tigerweb.geo.census.gov/arcgis/rest/services/" +

        "TIGERweb/State_County/MapServer/0/query" +

        "?where=STUSAB%3D%27TN%27" +

        "&outFields=*" +

        "&returnGeometry=true" +

        "&outSR=4326" +

        "&f=geojson";


    fetch(url)

        .then(

            function(response) {

                console.log(
                    "Tennessee response:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        "Could not load Tennessee."
                    );

                }


                return response.json();

            }

        )

        .then(

            function(data) {

                console.log(
                    "Tennessee data loaded:",
                    data
                );


                if (data.error) {

                    throw new Error(

                        data.error.message ||

                        "Tennessee Census error."

                    );

                }


                // Save the data.

                tennesseeData =
                    data;


                // ==================================================
                // CHECK IF SOURCE ALREADY EXISTS
                // ==================================================

                if (
                    map.getSource(
                        "tennessee"
                    )
                ) {

                    return;

                }


                // ==================================================
                // ADD TENNESSEE SOURCE
                // ==================================================

                map.addSource(

                    "tennessee",

                    {

                        type:
                            "geojson",

                        data:
                            data

                    }

                );


                // ==================================================
                // TENNESSEE FILL
                // ==================================================

                map.addLayer({

                    id:
                        "tennessee-fill",

                    type:
                        "fill",

                    source:
                        "tennessee",

                    paint: {

                        "fill-color":
                            "#3498db",

                        "fill-opacity":
                            0.08

                    }

                });


                // ==================================================
                // TENNESSEE OUTLINE
                // ==================================================

                map.addLayer({

                    id:
                        "tennessee-outline",

                    type:
                        "line",

                    source:
                        "tennessee",

                    paint: {

                        "line-color":
                            "#222222",

                        "line-width":
                            2,

                        "line-opacity":
                            1

                    }

                });


                console.log(
                    "Tennessee added."
                );

            }

        )

        .catch(

            function(error) {

                console.error(
                    "Tennessee error:",
                    error
                );

            }

        );

}


// ============================================================
// DAVIDSON COUNTY
// ============================================================

function addDavidsonCounty() {

    console.log(
        "Loading Davidson County..."
    );


    var url =

        "https://tigerweb.geo.census.gov/arcgis/rest/services/" +

        "TIGERweb/State_County/MapServer/13/query" +

        "?where=GEOID%3D%2747037%27" +

        "&outFields=*" +

        "&returnGeometry=true" +

        "&outSR=4326" +

        "&f=geojson";


    fetch(url)

        .then(

            function(response) {

                console.log(
                    "Davidson County response:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        "Could not load Davidson County."
                    );

                }


                return response.json();

            }

        )

        .then(

            function(data) {

                console.log(
                    "Davidson County data loaded:",
                    data
                );


                if (data.error) {

                    throw new Error(

                        data.error.message ||

                        "Davidson County Census error."

                    );

                }


                // Save Davidson County data.

                davidsonData =
                    data;


                // ==================================================
                // CHECK IF SOURCE ALREADY EXISTS
                // ==================================================

                if (
                    map.getSource(
                        "davidson-county"
                    )
                ) {

                    return;

                }


                // ==================================================
                // DAVIDSON COUNTY SOURCE
                // ==================================================

                map.addSource(

                    "davidson-county",

                    {

                        type:
                            "geojson",

                        data:
                            data

                    }

                );


                // ==================================================
                // DAVIDSON COUNTY FILL
                // ==================================================

                map.addLayer({

                    id:
                        "davidson-fill",

                    type:
                        "fill",

                    source:
                        "davidson-county",

                    paint: {

                        "fill-color":
                            "#e74c3c",

                        "fill-opacity":
                            0.30

                    }

                });


                // ==================================================
                // DAVIDSON COUNTY OUTLINE
                // ==================================================

                map.addLayer({

                    id:
                        "davidson-outline",

                    type:
                        "line",

                    source:
                        "davidson-county",

                    paint: {

                        "line-color":
                            "#e74c3c",

                        "line-width":
                            4,

                        "line-opacity":
                            1

                    }

                });


                console.log(
                    "Davidson County added."
                );


                // ==================================================
                // FIT MAP TO DAVIDSON COUNTY
                // ==================================================

                fitGeoJSON(
                    davidsonData
                );

            }

        )

        .catch(

            function(error) {

                console.error(
                    "Davidson County error:",
                    error
                );

            }

        );

}


// ============================================================
// FIT GEOJSON
// ============================================================

function fitGeoJSON(data) {

    if (

        !data ||

        !data.features ||

        data.features.length === 0

    ) {

        console.error(
            "Cannot fit map: invalid GeoJSON."
        );

        return;

    }


    var coordinates = [];


    data.features.forEach(

        function(feature) {

            if (
                !feature.geometry
            ) {

                return;

            }


            collectCoordinates(

                feature.geometry.coordinates,

                coordinates

            );

        }

    );


    if (
        coordinates.length === 0
    ) {

        console.error(
            "Cannot fit map: no coordinates."
        );

        return;

    }


    var bounds =
        new mapboxgl.LngLatBounds();


    coordinates.forEach(

        function(point) {

            bounds.extend(
                point
            );

        }

    );


    if (
        !bounds.isEmpty()
    ) {

        map.fitBounds(

            bounds,

            {

                padding: {

                    top:
                        60,

                    bottom:
                        60,

                    left:
                        60,

                    right:
                        60

                },

                duration:
                    1000

            }

        );

    }

}


// ============================================================
// COLLECT COORDINATES
// ============================================================

function collectCoordinates(
    coordinates,
    points
) {

    if (
        !Array.isArray(
            coordinates
        )
    ) {

        return;

    }


    // Coordinate pair.

    if (

        coordinates.length >= 2 &&

        typeof coordinates[0] ===
            "number"

    ) {

        points.push(
            coordinates
        );

        return;

    }


    coordinates.forEach(

        function(child) {

            collectCoordinates(

                child,

                points

            );

        }

    );

}


// ============================================================
// RECENTER BUTTON
// ============================================================

function createRecenterButton() {

    var container =
        document.createElement(
            "div"
        );


    container.className =
        "recenter-control";


    var button =
        document.createElement(
            "button"
        );


    button.id =
        "recenter";


    button.textContent =
        "Recenter";


    container.appendChild(
        button
    );


    var RecenterControl = {

        onAdd:
            function(mapInstance) {

                this._map =
                    mapInstance;

                return container;

            },


        onRemove:
            function() {

                if (
                    container.parentNode
                ) {

                    container.parentNode.removeChild(
                        container
                    );

                }

                this._map =
                    undefined;

            }

    };


    map.addControl(

        RecenterControl,

        "bottom-left"

    );


    button.addEventListener(

        "click",

        function() {

            // ==================================================
            // DAVIDSON COUNTY FIRST
            // ==================================================

            if (davidsonData) {

                fitGeoJSON(
                    davidsonData
                );

                return;

            }


            // ==================================================
            // TENNESSEE SECOND
            // ==================================================

            if (tennesseeData) {

                fitGeoJSON(
                    tennesseeData
                );

                return;

            }


            // ==================================================
            // FINAL FALLBACK
            // ==================================================

            map.flyTo({

                center: [

                    -86.78,

                    36.17

                ],

                zoom:
                    10

            });

        }

    );

}


// ============================================================
// LEGEND
// ============================================================

function createLegend() {

    var container =
        document.createElement(
            "div"
        );


    container.className =
        "legend-control-container";


    container.innerHTML = `

        <h4>
            Gun Violence Map
        </h4>


        <div style="
            margin-bottom:8px;
        ">

            <span style="
                display:inline-block;
                width:14px;
                height:14px;
                background:#3498db;
                opacity:0.15;
                border:2px solid #222;
                margin-right:5px;
                vertical-align:middle;
            "></span>

            Tennessee

        </div>


        <div>

            <span style="
                display:inline-block;
                width:14px;
                height:14px;
                background:#e74c3c;
                opacity:0.5;
                border:2px solid #e74c3c;
                margin-right:5px;
                vertical-align:middle;
            "></span>

            Davidson County

        </div>

    `;


    var LegendControl = {

        onAdd:
            function(mapInstance) {

                this._map =
                    mapInstance;

                return container;

            },


        onRemove:
            function() {

                if (
                    container.parentNode
                ) {

                    container.parentNode.removeChild(
                        container
                    );

                }

                this._map =
                    undefined;

            }

    };


    map.addControl(

        LegendControl,

        "bottom-right"

    );

}


// ============================================================
// WELCOME POPUP
// ============================================================

function setupWelcomePopup() {

    var popup =
        document.getElementById(
            "welcomePopup"
        );


    var closeBtn =
        document.getElementById(
            "closePopup"
        );


    if (

        popup &&

        closeBtn

    ) {

        closeBtn.addEventListener(

            "click",

            function() {

                popup.style.display =
                    "none";

            }

        );

    }

}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(

    "DOMContentLoaded",

    function() {

        console.log(
            "Page loaded."
        );


        // ==================================================
        // CHECK MAPBOX
        // ==================================================

        if (
            typeof mapboxgl ===
            "undefined"
        ) {

            console.error(
                "Mapbox GL JS is not loaded."
            );

            return;

        }


        console.log(
            "Mapbox GL JS loaded."
        );


        // ==================================================
        // WELCOME POPUP
        // ==================================================

        setupWelcomePopup();


        // ==================================================
        // CREATE MAP
        // ==================================================

        createMap();

    }

);