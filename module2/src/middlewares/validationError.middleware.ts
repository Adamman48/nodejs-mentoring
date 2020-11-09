import { Request, Response, NextFunction } from "express";
import { ExpressJoiError } from "express-joi-validation";
import { ConsoleColorsEnum } from "../../../utils/consoleUtils";
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from "../definitions/constants";

function validationErrorMiddleware(err: ExpressJoiError, req: Request, res: Response, next: NextFunction) {
  if (err && err.error && err.error.isJoi) {
    console.error(ConsoleColorsEnum.RED, err);
    res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    next(err);
  }
};

export default validationErrorMiddleware;
