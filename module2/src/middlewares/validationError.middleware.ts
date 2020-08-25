import { Request, Response, NextFunction } from "express";
import { ExpressJoiError } from "express-joi-validation";
import { ConsoleColorsEnum } from "../../../utils/consoleUtils";

function validationErrorMiddleware(err: ExpressJoiError, req: Request, res: Response, next: NextFunction) {
  if (err && err.error && err.error.isJoi) {
    console.error(ConsoleColorsEnum.RED, err);
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    next(err);
  }
};

export default validationErrorMiddleware;
