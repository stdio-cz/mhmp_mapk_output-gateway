[![pipeline status](https://gitlab.com/operator-ict/golemio/code/output-gateway/badges/master/pipeline.svg)](https://gitlab.com/operator-ict/golemio/code/output-gateway/commits/master)
[![coverage report](https://gitlab.com/operator-ict/golemio/code/output-gateway/badges/master/coverage.svg)](https://gitlab.com/operator-ict/golemio/code/output-gateway/commits/master)

# Golemio Data Platform Output Gateway

Output Gateway for the Golemio data platform system. Provides unified REST API for the data stored in Golemio data platform.

Uses express server, caching using Redis.

Documentation at https://operator-ict.gitlab.io/golemio/code/output-gateway/

API specification at https://golemioapi.docs.apiary.io

Developed by http://operatorict.cz

## Docker instalation

### Prerequisites

-   Docker Engine (https://docs.docker.com/)
-   Postgres (https://www.postgresql.org/)
-   PostGIS (https://postgis.net/)
-   Golemio Schema Definitions

### Instalation & run

1. Build docker image by `docker build -t output-gateway .`
2. Setup ENV variables by `.env` file or add `-e VAR=VALUE` to docker run. Env variables are described in `.env.template`.
3. Run container by

```
docker run --rm \
    -p 3004:3004 \ # expose port 3004
    -e PORT=3004 \
    -e POSTGRES_CONN: postgres://user:pass@postgres.dp_database/dataplatform \
    output-gateway # docker image label (defined by step 1)
```

## Local Installation

### Prerequisites

-   node.js (https://nodejs.org)
-   Postgres (https://www.postgresql.org/)
-   PostGIS (https://postgis.net/)
-   TypeScript (https://www.typescriptlang.org/)
-   Golemio Schema Definitions

### Installation

Install all prerequisites

Install all dependencies using command:

```
npm install
```

from the application's root directory.

### Build & Run

#### Production

To compile typescript code into js one-time (production build):

```
npm run build
```

To run the app:

```
npm run start
```

#### Dev/debug

Run via TypeScript (in this case it is not needed to build separately, application will watch for changes and restart on save):

```
npm run dev-start
```

or run with a debugger:

```
npm run dev-start-debug
```

Runing the application in any way will load all config variables from environment variables or the .env file. To run, set all environment variables from the `.env.template` file, or copy the `.env.template` file into new `.env` file in root directory and set variables there.

Project uses `dotenv` package: https://www.npmjs.com/package/dotenv

Application is now running locally on port 3004 or on port specified in the environment variable.

### Importing example data

Example data are stored in `db/example/`.

For importing example data run `psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f db/example/sql_dump.sql`.

## Tests

To run all test defined in /test directory simply run this command:

```
npm run test
```

from the application's root directory. All tests should pass with the correct data. Test data are in the `db/example` directory.

You can also test the API against the Apiary documentation using `dredd` (https://dredd.org). To run the tests, make sure the app will be run on port 3004 (setting ENV variable or leaving the default) and run

```
dredd
```

from the application's root directory.

## Logging

Logging uses `pino` for standard logging with levels, `pino-http` for http access logs and `debug` (https://www.npmjs.com/package/debug) for debugging.

All logs with `silly` and `debug` level are printed as standard log (if appropriate log level is set) using `pino` as well as using `debug` module with `"data-platform:output-gateway"` settings.

You can set both `LOG_LEVEL` and `DEBUG` settings in ENV variables.

## Documentation

For generating documentation run `npm run generate-docs`. Typedoc source code documentation is located in `docs/typedoc`.

More documentation in `docs/`. If you want to add a new dataset or create new API routes, check out our existing [modules](https://gitlab.com/operator-ict/golemio/code/modules).

### API documentation

Rest API documentation is placed in `docs/apiary_docs.apib` which is also up-to-date on [golemioapi.docs.apiary.io](https://golemioapi.docs.apiary.io/#) (master), [outputgatewaydev.docs.apiary.io](https://outputgatewaydev.docs.apiary.io/#) (development).

## Contribution guidelines

Please read `CONTRIBUTING.md`.

## Troubleshooting

Contact benak@operatorict.cz or vycpalek@operatorict.cz
