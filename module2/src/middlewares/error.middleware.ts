import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { ConsoleColorsEnum } from '../../../utils/consoleUtils';

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong :(';

  console.error(ConsoleColorsEnum.RED, err.stack);
  res.setHeader('content-type', 'text/html');
  res.status(status).send(message);
}

export default errorMiddleware;
