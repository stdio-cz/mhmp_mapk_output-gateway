// load telemetry before all deps
import { initTraceProvider } from "@golemio/core/dist/telemetry";
import { config } from "@golemio/core/dist/output-gateway/config";
initTraceProvider("output-gateway", config.node_env, config.telemetry);

// start app
import * as Sentry from "@sentry/node";
import App from "./App";
try {
    Sentry.captureMessage("Datova platforma startup");
    new App().start();
} catch (error) {
    Sentry.captureException(error);
}
