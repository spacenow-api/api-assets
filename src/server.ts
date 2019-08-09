import { PORT } from "./config";

import App from "./App";

import AssetController from "./controllers/assets/assets.controller";
import HealthController from "./controllers/health/health.controller";
import LegacyPhotosController from "./controllers/legacy/legacyPhotos.controller";
import MailController from './controllers/mail/mail.controller';

const app = new App(
  [
    new AssetController(),
    new HealthController(),
    new LegacyPhotosController(),
    new MailController()
  ], PORT, "0.0.0.0"
);

app.listen();
