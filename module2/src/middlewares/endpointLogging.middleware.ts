import { NextFunction, Request, Response } from "express";
import { ConsoleColorsEnum } from "../../../utils/consoleUtils";

function endpointLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const { 
    path,
    method,
    body,
    params,
    query
  } = req;
  const logMessage = `${method} ${path}:
  body = ${JSON.stringify(body)}
  params = ${JSON.stringify(params)}
  query = ${JSON.stringify(query)}\n`;
  console.log(ConsoleColorsEnum.CYAN, logMessage);
  next();
}

export default endpointLoggingMiddleware;
