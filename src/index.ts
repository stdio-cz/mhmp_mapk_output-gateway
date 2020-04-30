import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import App from "./App";
import config from "./config/config";
import {log} from "./core/Logger";
// index.js

try {
    Sentry.captureMessage("Datova platforma startup");
    new App().start();
} catch (error) {
    Sentry.captureException(error);
}
