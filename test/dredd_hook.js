const hooks = require('hooks');

var storage = {};

hooks.beforeEach(function (transaction) {
    transaction.request.uri = transaction.request.uri.replace(/\?.*/g, ""); 
    transaction.fullPath = transaction.fullPath.replace(/\?.*/g, ""); 
    hooks.log("Testing Request: " + JSON.stringify(transaction.request));
  });

hooks.after('General > Prague City Districts > GET All Districts', (transaction) => {
    storage["districtSlug"] = JSON.parse(transaction.real.body).features[0].properties.slug;
});

hooks.before('General > Prague City District > GET District', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('praha-1', storage["districtSlug"]);
    transaction.fullPath = transaction.fullPath.replace('praha-1', storage["districtSlug"]);
});

hooks.after('Traffic > Shared Cars > GET All Shared Cars', (transaction) => {
    storage["carId"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Traffic > Shared Car > GET Shared Car', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('1BF8210', storage["carId"]);
    transaction.fullPath = transaction.fullPath.replace('1BF8210', storage["carId"]);
});

hooks.after('Traffic > Traffic Cameras > GET All Traffic Cameras', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Traffic > Traffic Camera > GET Traffic Camera', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('404032', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('404032', storage["id"]);
});

hooks.after('Public Space > Gardens > GET All Gardens', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Garden > GET Garden', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('frantiskanska-zahrada', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('frantiskanska-zahrada', storage["id"]);
});

hooks.after('Public Space > Medical Institutions > GET All Medical Institutions', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Medical Institution > GET Medical Institution', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('2526713200064203-fakultni-nemocnice-v-motole', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('2526713200064203-fakultni-nemocnice-v-motole', storage["id"]);
});

hooks.after('Public Space > Playgrounds > GET All Playgrounds', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Playground > GET Playground', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('72', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('72', storage["id"]);
});

hooks.after('Public Space > Public Toilets > GET All Public Toilets', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Public Toilet > GET Public Toilet', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('72', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('72', storage["id"]);
});

hooks.after('Public Space > Sorted Waste Stations > GET All Sorted Waste Stations', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Sorted Waste Station > GET Sorted Waste Station', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('1521', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('1521', storage["id"]);
});

hooks.after('Public Space > Waste Collection Yards > GET All Waste Collection Yards', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Public Space > Waste Collection Yard > GET Waste Collection Yard', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('1', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('1', storage["id"]);
});

hooks.after('Vehicle Positions > Vehicle Positions > GET All Vehicle Positions', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.trip.gtfs_trip_id;
});

hooks.before('Vehicle Positions > Vehicle Position > GET Vehicle Position', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('100381', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('100381', storage["id"]);
});

hooks.after('Municipal Authorities > Municipal Authorities > GET All Municipal Authorities', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Municipal Authorities > Municipal Authority > GET Municipal Authority', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('urad-mestske-casti-praha-10', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('urad-mestske-casti-praha-10', storage["id"]);
});

hooks.after('Municipal Authorities > Municipal Police Stations > GET All Municipal Police Stations', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.id;
});

hooks.before('Municipal Authorities > Municipal Police Station > GET Municipal Police Station', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('72', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('72', storage["id"]);
});

hooks.after('GTFS > GTFS Stops > GET All GTFS Stops', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body).features[0].properties.stop_id;
});

hooks.before('GTFS > GTFS Stop > GET GTFS Stop', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('U118Z101P', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('U118Z101P', storage["id"]);
});

hooks.after('GTFS > GTFS Trips > GET All GTFS Trips', (transaction) => {
    storage["id"] = JSON.parse(transaction.real.body)[0].trip_id;
    storage["shape_id"] = JSON.parse(transaction.real.body)[0].shape_id;
});

hooks.before('GTFS > GTFS Trip > GET GTFS Trip', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('991_30_190107', storage["id"]);
    transaction.fullPath = transaction.fullPath.replace('991_30_190107', storage["id"]);
});

hooks.before('GTFS > GTFS Shape > GET GTFS Shape', (transaction) => {
    transaction.request.uri = transaction.request.uri.replace('L991V2', storage["shape_id"]);
    transaction.fullPath = transaction.fullPath.replace('L991V2', storage["shape_id"]);
});
