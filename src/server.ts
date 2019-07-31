import { PORT } from "./config";

import App from "./App";

import AssetController from "./controllers/assets/assets.controller";
import HealthController from "./controllers/health/health.controller";
import LegacyPhotosController from "./controllers/legacy/legacyPhotos.controller";

const app = new App(
  [new AssetController(), new HealthController(), new LegacyPhotosController()],
  PORT,
  "0.0.0.0"
);

app.listen();
