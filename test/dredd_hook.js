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
