import express from 'express';

export abstract class Controller {
  public path: string;
  public router: express.Router;

  constructor(path: string) {
    this.path = path;
    this.router = express.Router();

    this.initRoutes();
  }

  abstract initRoutes(): void;
}
