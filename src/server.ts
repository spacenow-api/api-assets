import { PORT } from "./config";

import App from "./App";

import AssetsController from "./controllers/assets/asset.controller";
import HealthController from "./controllers/health/health.controller";

const app = new App(
  [new AssetsController(), new HealthController()],
  PORT,
  "0.0.0.0"
);

app.listen();
