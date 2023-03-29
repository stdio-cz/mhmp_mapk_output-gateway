// Load reflection lib
import "@golemio/core/dist/shared/_global";
// load telemetry before all deps
import { initTraceProvider } from "@golemio/core/dist/monitoring";
import { InspectorUtils } from "@golemio/core/dist/helpers/inspector";
import { config } from "@golemio/core/dist/output-gateway/config";

initTraceProvider(config.app_name, config.node_env, config.telemetry);

// start app
import App from "./App";
new App().start();

const inspectorUtils = new InspectorUtils();

// handle user-defined process signals
process.on("SIGUSR1", () => inspectorUtils.activateInspector(config.inspector.host));
process.on("SIGUSR2", () => inspectorUtils.deactivateInspector());
