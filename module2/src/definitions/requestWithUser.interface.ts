import { Request } from "express";
import User from "../models/User.model";

export interface RequestWithUserInterface extends Request {
  user?: User;
}
