import express from 'express';
import { ConsoleColorsEnum } from '../../utils/consoleUtils';
import { Controller } from './definitions/controller.abstract';
import errorMiddleware from './middlewares/error.middleware';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorMiddleware();
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(ConsoleColorsEnum.CYAN, `App listening on port ${this.port}`);
    });
  }
}

export default App;