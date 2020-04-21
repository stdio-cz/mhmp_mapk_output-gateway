import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import App from "./App";
import config from "./config/config";
import {log} from "./core/Logger";
// index.js

// This allows TypeScript to detect our global value
declare global {
    namespace NodeJS {
        // tslint:disable-next-line:interface-name
        interface Global {
            __rootdir__: string;
        }
    }
}

global.__rootdir__ = __dirname || process.cwd();

log.info(`Config for sentry: ${config.sentry_enable}`);
if (config.sentry_enable) {
    log.info(`Sentry logging enabled with dsn: ${config.sentry_dsn}`);
    Sentry.init({ dsn: config.sentry_dsn});
    // throw new Error("This is test error on startup");
}
try {
    Sentry.captureMessage("Datova platforma startup");
    new App().start();
} catch (error) {
    Sentry.captureException(error);
}
