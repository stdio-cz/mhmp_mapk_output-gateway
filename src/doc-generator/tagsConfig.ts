// exclude the tags from Open Data API:
const protectedTags = [
    "📤 Exporting Module",
    "🚢 Floating Car Data",
    "🚶 Pedestrians",
    "🚧 Traffic Restrictions",
    "🚲 Shared Bikes",
    "GBFS",
];

export { protectedTags };

//  ALL Actual tags at 2023-05.26:
/*
    "tags": [
      {
        "name": "🌦 Air Quality",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Air Quality Stations in Prague"
      },
      {
        "name": "🧮 Bicycle Counters",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Measurements of Bicycle Counters in Prague"
      },
      {
        "name": "📤 Exporting Module",
        "description": "💡 Download data in .csv format"
      },
      {
        "name": "🚢 Floating Car Data",
        "description": "💡 FCD"
      },
      {
        "name": "🚶 Pedestrians",
        "description": "💡 Locations and Measurements of movement"
      },
      {
        "name": "🌳 Gardens",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Gardens"
      },
      {
        "name": "🏥 Medical Institutions",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Medical Institutions"
      },
      {
        "name": "🌡️ Microclimate",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Microclimate Sensors Info"
      },
      {
        "name": "🏛 Municipal Authorities",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Municipal Authorities"
      },
      {
        "name": "🏢️ Municipal Libraries",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Municipal Libraries"
      },
      {
        "name": "👮 Municipal Police Stations",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Municipal Police Stations"
      },
      {
        "name": "🚧 Traffic Restrictions",
        "description": "💡 NDIC Traffic Restrictions API for Intermodal Route Planner"
      },
      {
        "name": "🅿️ Parking",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Parkings, parking zones, tarifs, measurements."
      },
      {
        "name": "🏸 Playgrounds",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Playgrounds"
      },
      {
        "name": "🚲 Shared Bikes",
        "description": "💡 Locations and Description of Prague Shared Bikes"
      },
      {
        "name": "GBFS",
        "description": "💡 General Bikeshare Feed Specification"
      },
      {
        "name": "🚘 Shared Cars",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Prague Shared Cars"
      },
      {
        "name": "♻️ Waste Collection",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Some containers are equipped with IoT sensors that measure their fullness. Use `?onlyMonitored=true` to retrieve only these monitored containers. More about this project at [Chytrý svoz odpadu](https://www.smartprague.eu/projekty/chytry-svoz-odpadu)."
      },
      {
        "name": "♻️ Waste Collection Yards",
        "description": "<img src=\"https://img.shields.io/badge/opendata-available-green\" alt=\"golemioapi-opendata-badge\" /> 💡 Locations and Description of Waste Collection Yards"
      }
    ]
  */
