import express, { Application } from "express";
import compression from 'compression';
import cookieParse from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

// import dynamo from "./helpers/database/dynamo";
import sequelize from "./helpers/database/sequelize";
import sequelizeMiddleware from "./helpers/middlewares/sequelize-middleware";
import loggerMiddleware from "./helpers/middlewares/logger-middleware";
import errorMiddleware from "./helpers/middlewares/error-middleware";

class App {
  public app: Application;
  public port: number;
  public host: string;

  constructor(controllers: any, port: number, host: string) {
    this.app = express();
    this.port = port;
    this.host = host;
    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeDatabase(): void {
    // dynamo();
    sequelize.initialize();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(sequelizeMiddleware);
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParse());
    this.app.use(compression());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: any): void {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      console.info(`API * Assets * listening on ${this.host}:${this.port}`);
    });
  }
}

export default App;
