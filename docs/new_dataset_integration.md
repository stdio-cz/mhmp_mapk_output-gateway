## Adding a new dataset

- import dataset from schema-definitions (in `App.ts`)
- add new data to loaded data in RouterBuilder; add new data definition to the array of loaded data in method call `LoadData()` (this will automatically create all necessary default routes `/` and `/{id}`, optionally `/history`)
- create Apiary documentation (in `docs/apiary_docs.apib`), including MSON data structure specifications
- create new test data (mongo dump, using `mongodump` tool) and add them to `db/example/mongo_data/dataplatform`
- create Dredd hooks for testing (typically adding existing ID from returned data collection to the test for detail /{id} route)