import { PORT } from "./config";

import App from "./App";

import AssetsController from "./controllers/assets/asset.controller";
import HealthController from "./controllers/health/health.controller";
import LegacyPhotosController from "./controllers/legacy/legacyPhotos.controller";

const app = new App(
  [
    new AssetsController(),
    new HealthController(),
    new LegacyPhotosController()
  ],
  PORT,
  "0.0.0.0"
);

app.listen();
