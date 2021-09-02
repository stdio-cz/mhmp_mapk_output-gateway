// load telemetry before all deps
import { initTraceProvider } from "@golemio/core/dist/monitoring";
import { config } from "@golemio/core/dist/output-gateway/config";
initTraceProvider(config.app_name, config.node_env, config.telemetry);

// start app
import App from "./App";
new App().start();
