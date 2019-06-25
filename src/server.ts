import App from './App';
import AssetsController from './controllers/asset.controller';
 
const app = new App(
  [
    new AssetsController(),
  ],
  3004,
  '0.0.0.0'
);
 
app.listen();