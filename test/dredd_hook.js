const hooks = require("hooks");

var storage = {};

hooks.beforeEach(function (transaction) {
    transaction.request.uri = transaction.request.uri.replace(/\?.*/g, "");
    transaction.fullPath = transaction.fullPath.replace(/\?.*/g, "");
    // hooks.log("Testing Request: " + JSON.stringify(transaction.request));
});

hooks.after("Public Space 🏡 > Prague City Districts > GET All Districts", (transaction) => {
    storage["districtSlug"] = JSON.parse(transaction.real.body).features[0].properties.slug;
});

hooks.before("Public Space 🏡 > Prague City Districts > GET District", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("praha-1", storage["districtSlug"]);
    transaction.fullPath = transaction.fullPath.replace("praha-1", storage["districtSlug"]);
});

hooks.after("Traffic 🚘 > Shared Cars > GET All Shared Cars", (transaction) => {
    storage["carId"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Traffic 🚘 > Shared Cars > GET Shared Car", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("1BF8210", storage["carId"]);
    transaction.fullPath = transaction.fullPath.replace("1BF8210", storage["carId"]);
});

hooks.after("Traffic 🚘 > Bicycle Parkings > GET All Bicycle Parkings", (transaction) => {
    storage["bicycleParkingId"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Traffic 🚘 > Bicycle Parkings > GET Bicycle Parking", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("282743091", storage["bicycleParkingId"]);
    transaction.fullPath = transaction.fullPath.replace("282743091", storage["bicycleParkingId"]);
});

hooks.after("Traffic 🚘 > Traffic Cameras > GET All Traffic Cameras", (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Traffic 🚘 > Traffic Cameras > GET Traffic Camera", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("404032", storage["id"]);
    transaction.fullPath = transaction.fullPath.replace("404032", storage["id"]);
});

hooks.before("Public Space 🏡 > Gardens > GET All Gardens", (transaction) => (transaction.skip = true));

hooks.before("Public Space 🏡 > Gardens > GET Garden", (transaction) => (transaction.skip = true));

hooks.before("Public Space 🏡 > Gardens > GET All Gardens Properties", (transaction) => (transaction.skip = true));

hooks.after("Public Space 🏡 > Medical Institutions > GET All Medical Institutions", (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Public Space 🏡 > Medical Institutions > GET Medical Institution", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("2526713200064203-fakultni-nemocnice-v-motole", storage["id"]);
    transaction.fullPath = transaction.fullPath.replace("2526713200064203-fakultni-nemocnice-v-motole", storage["id"]);
});

hooks.after("Public Space 🏡 > Playgrounds > GET All Playgrounds", (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Public Space 🏡 > Playgrounds > GET Playground", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("72", storage["id"]);
    transaction.fullPath = transaction.fullPath.replace("72", storage["id"]);
});

hooks.after("Public Space 🏡 > Public Toilets > GET All Public Toilets", (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before("Public Space 🏡 > Public Toilets > GET Public Toilet", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("72", storage["id"]);
    transaction.fullPath = transaction.fullPath.replace("72", storage["id"]);
});

hooks.before("Waste ♻️ > Sorted Waste Stations > GET All Sorted Waste Stations", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("sortedwastestations", "sortedwastestationspg");
    transaction.fullPath = transaction.fullPath.replace("sortedwastestations", "sortedwastestationspg");
});

hooks.before("Waste ♻️ > Sorted Waste Stations > GET Sorted Waste Station", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("sortedwastestations", "sortedwastestationspg");
    transaction.fullPath = transaction.fullPath.replace("sortedwastestations", "sortedwastestationspg");
});

hooks.before(
    "Waste ♻️ > Sorted Waste Fullness Sensors Data > GET All Sorted Waste Measurements",
    (transaction) => (transaction.skip = true)
);

hooks.before(
    "Waste ♻️ > Sorted Waste Fullness Sensors Data > GET All Sorted Waste Picks",
    (transaction) => (transaction.skip = true)
);

hooks.before(
    "Waste ♻️ > Sorted Waste Fullness Sensors Data > GET All Sorted Waste Pick Days",
    (transaction) => (transaction.skip = true)
);

hooks.before("Waste ♻️ > Waste Collection Yards > GET Waste Collection Yard", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace(
        "sberny-dvur-hlavniho-mesta-prahy-probostska",
        "stabilni-sberna-nebezpecnych-odpadu-areal-spol-mikapa-plus"
    );
    transaction.fullPath = transaction.fullPath.replace(
        "sberny-dvur-hlavniho-mesta-prahy-probostska",
        "stabilni-sberna-nebezpecnych-odpadu-areal-spol-mikapa-plus"
    );
});

hooks.after("Public Transport 🚋 > Vehicle Positions > GET All Vehicle Positions", (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.trip.gtfs_trip_id;
});

hooks.before("Public Transport 🚋 > Vehicle Positions > GET Vehicle Position", (transaction) => {
    transaction.request.uri = transaction.request.uri.replace("100381", storage["id"]);
    transaction.fullPath = transaction.fullPath.replace("100381", storage["id"]);
});

hooks.after(
    "Public Space 🏡 > Municipal Authorities > GET All Municipal Authorities",
    (transaction) => (transaction.skip = true)
);

hooks.before("Public Space 🏡 > Municipal Authorities > GET Municipal Authority", (transaction) => (transaction.skip = true));

hooks.before(
    "Public Space 🏡 > Municipal Police Stations > GET All Municipal Police Stations",
    (transaction) => (transaction.skip = true)
);

hooks.before(
    "Public Space 🏡 > Municipal Police Stations > GET Municipal Police Station",
    (transaction) => (transaction.skip = true)
);

hooks.before(
    "Pedestrians 🚶 > Locations and Measurements of movement > GET locations and directions",
    (transaction) => (transaction.skip = true)
);

hooks.before(
    "Pedestrians 🚶 > Locations and Measurements of movement > GET measurements of pedestrian traffic",
    (transaction) => (transaction.skip = true)
);

// Skip all public transport transactions
hooks.before("Public Transport 🚋 > GTFS Services > GET GTFS Services", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Routes > GET All GTFS Routes", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Routes > GET GTFS Route", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Trips > GET All GTFS Trips", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Trips > GET GTFS Trip", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Shapes > GET GTFS Shape", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Stops > GET All GTFS Stops", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Stops > GET GTFS Stop", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > GTFS Stop times > GET GTFS Stop times", (transaction) => (transaction.skip = true));
hooks.before(
    "Public Transport 🚋 > RealTime Vehicle Positions > GET All Vehicle Positions",
    (transaction) => (transaction.skip = true)
);
hooks.before(
    "Public Transport 🚋 > RealTime Vehicle Positions > GET Vehicle Position",
    (transaction) => (transaction.skip = true)
);
hooks.before(
    "Public Transport 🚋 > GTFS RealTime Vehicle Positions > GET GTFS RealTime Trip Updates Protocol Buffer",
    (transaction) => (transaction.skip = true)
);
hooks.before(
    "Public Transport 🚋 > GTFS RealTime Vehicle Positions > GET GTFS RealTime Vehicle Positions Protocol Buffer",
    (transaction) => (transaction.skip = true)
);
hooks.before("Public Transport 🚋 > Departure Boards > GET Departure Board", (transaction) => (transaction.skip = true));
hooks.before("Public Transport 🚋 > PID Departure Boards > GET Departure Board", (transaction) => (transaction.skip = true));
