import { PORT } from './config';

import App from './App';

import AssetsController from './assets/asset.controller';

const app = new App([new AssetsController()], PORT, '0.0.0.0');

app.listen();
