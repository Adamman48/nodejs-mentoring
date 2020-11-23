import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ConsoleColorsEnum } from '../../utils/consoleUtils';
import { Controller } from './definitions/controller.abstract';
import endpointLoggingMiddleware from './middlewares/endpointLogging.middleware';
import errorMiddleware from './middlewares/error.middleware';
import validationErrorMiddleware from './middlewares/validationError.middleware';
import cookieParser from 'cookie-parser';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initLogging();
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorMiddlewares();
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initErrorMiddlewares() {
    this.app.use(validationErrorMiddleware);
    this.app.use(errorMiddleware);
  }

  private initLogging() {
    this.app.use(endpointLoggingMiddleware);
    this.app.use(
      morgan('combined', {
        skip: (req, res) => {
          return res.statusCode < 400;
        },
      })
    );
    process.on('uncaughtException', (err: Error, origin: string) => {
      const logMessage = `Caught following exception at ${origin}:\n${err}`;
      console.error(ConsoleColorsEnum.RED, logMessage);
    });
    process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<void>) => {
      const logMessage = `Unhandled rejection at ${promise}\n${reason}`;
      console.error(ConsoleColorsEnum.RED, logMessage);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(ConsoleColorsEnum.CYAN, `App listening on port ${this.port}`);
    });
  }
}

export default App;
