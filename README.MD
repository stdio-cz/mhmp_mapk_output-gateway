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

Copy the `config.template.js` file into new `config.js` file in /app directory

## Compilation of typescript code

To compile typescript code into js you first need to install typescript globally

```
npm install -g typescript
```
and then a run this, to watch all changes
```
tsc -w
```
Or run this, to compile all scripts one-time
```
tsc
```
from the application's root directory.

## Run

```
npm run start-local
```
This will load all environment variables from the .env file.
Or
```
npm run start-prod
```
This will load all environment variables directly from environment.

Application is now running locally on port 3000 or on port specified in the config file.

## Tests

To run all test defined in /test directory simply run this command:
```
npm test
```
from the application's root directory. All tests should pass.

## Problems?

Contact benak@operatorict.cz or vycpalek@operatorict.cz
