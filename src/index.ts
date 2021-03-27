import * as Sentry from "@sentry/node";
import App from "./App";
try {
    Sentry.captureMessage("Datova platforma startup");
    new App().start();
} catch (error) {
    Sentry.captureException(error);
}
