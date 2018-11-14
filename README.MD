[![pipeline status](http://gitlab.oict.cz/data-platform/output-gateway/badges/master/pipeline.svg)](http://gitlab.oict.cz/data-platform/output-gateway/commits/master)
[![coverage report](http://gitlab.oict.cz/data-platform/output-gateway/badges/master/coverage.svg)](http://gitlab.oict.cz/data-platform/output-gateway/commits/master)


# Data Platform Output Gateway

Output Gateway for the Data Platform System.

Developed by http://operatorict.cz

## Prerequisites

- node.js
- mongoDB
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
from the application's root directory. All tests should pass.

## Problems?

Contact benak@operatorict.cz or vycpalek@operatorict.cz
