[![pipeline status](http://gitlab.oict.cz/data-platform/output-gateway/badges/master/pipeline.svg)](http://gitlab.oict.cz/data-platform/output-gateway/commits/master)
[![coverage report](http://gitlab.oict.cz/data-platform/output-gateway/badges/master/coverage.svg)](http://gitlab.oict.cz/data-platform/output-gateway/commits/master)


# Data Platform Output Gateway

Output Gateway for the Data Platform System. Provides REST API for the data stored in Golemio data platform. 

More in Apiary documentation at https://outputgateway.docs.apiary.io

Developed by http://operatorict.cz


## Docker instalation
### Prerequisites
- Docker Engine
- Mongo
- Postgres

### Instalation
1. Build docker image by `docker build -t output-gateway .`
2. Setup ENV variables by `.env` file or add `-e VAR=VALUE` to docker run
3. Run container by

```
docker run --rm \
    -p 3004:3004 \ # expose port 3004
    -e PORT=3004 \
    -e MONGO_CONN: mongodb://user:pass@mongo.dp_database:27017/dataplatform?authSource=admin \
    -e POSTGRES_CONN: postgres://user:pass@postgres.dp_database/dataplatform \
    output-gateway # docker image label (defined by step 1)
```


## Prerequisites

- node.js
- mongoDB
- Postgres
- npm
- typescript

## Installation


Install Node

Install all npm modules using command:
```
npm install
```

from the application's root directory.

## Compilation of typescript code

To compile typescript code into js one-time

```
npm run build
```
or run this, to watch all changes
```
npm run build-watch
```
from the application's root directory.

## Run

```
npm start
```
This will load all config variables from environment variables or the .env file. To run, set all environment variables from the `.env.template` file, or copy the `.env.template` file into new `.env` file in root directory and set variables there.

Project uses `dotenv` package: https://www.npmjs.com/package/dotenv

Application is now running locally on port 3000 or on port specified in the environment variable.

## Tests

To run all test defined in /test directory simply run this command:
```
npm test
```
from the application's root directory. All tests should pass with the correct data. Test data are in the `test/data` directory. You can import them using the `mongorestore -d $MONGO_DB_NAME ./test/data/dataplatform` command. More: https://docs.mongodb.com/manual/reference/program/mongorestore/

You can also test the API against the Apiary documentation using `dredd` (https://dredd.org). To run the tests, make sure the app will be run on port 3000 (setting ENV variable or leaving the default) and run
```
dredd
```
from the application's root directory.

## Logging

Logging uses `Winston` for standard logging with levels, `morgan` for http access logs and `debug` for debugging.

All logs with `silly` and `debug` level are printed as standard log (if appropriate log level is set) using Winston as well as using `debug` module with `"data-platform:output-gateway"` settings.

You can set both `LOG_LEVEL` and `DEBUG` settings in ENV variables.

## Documentation

For generating documentation run `npm run generate-docs`. Typedoc source code documentation is located in `docs/typedoc`.

## Problems?

Contact benak@operatorict.cz or vycpalek@operatorict.cz
