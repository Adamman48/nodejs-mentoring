import { Application, NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import jwt from 'jsonwebtoken';
import AuthTokenMissingException from "../exceptions/AuthTokenMissingException";
import { DataStoredInTokenInterface } from '../definitions/token.interface';
import User from "../models/User.model";
import { RequestWithUserInterface } from "../definitions/requestWithUser.interface";
import AuthTokenInvalidException from "../exceptions/AuthTokenInvalidException";

async function authMiddleware(req: RequestWithUserInterface, res: Response, next: NextFunction): Promise<void> {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      if (!secret) {
        throw new HttpException(500, 'Failure during authorization!');
      } else {
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInTokenInterface;
        const id = verificationResponse._id;
        const user = await User.findByPk(id);
        if (user) {
          req.user = user;
          next();
        } else {
          next(new AuthTokenInvalidException());
        }
      }
    } catch {
      next(new AuthTokenInvalidException());
    }
  } else {
    next(new AuthTokenMissingException());
  }
}

export default authMiddleware;
