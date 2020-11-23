import { Request, Response } from "express";
import { controllerErrorLogger } from "../../../utils/consoleUtils";
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from "../definitions/constants";
import { Controller } from "../definitions/controller.abstract";
import { TokenDataInterface } from "../definitions/token.interface";
import HttpException from "../exceptions/HttpException";
import AuthService from "../services/auth.service";

class AuthController extends Controller {
  constructor() {
    super('/auth');
  }

  initRoutes() {
    const { router, path } = this;
    router.post(`${path}/login`, this.login.bind(this));
  }

  login(req: Request, res: Response): void {
    const { login, password } = req.body;
    AuthService.loginUser(login, password)
      .then((result) => {
        if(!result) {
          throw new HttpException(404, 'Wrong user or password!');
        } else {
          const tokenData = AuthService.createToken(result);
          if (tokenData) {
            res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            res.status(200).json(result);
          } else {
            throw new HttpException(404, 'Wrong user or password!');
          }
        }
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
        controllerErrorLogger(AuthService.loginUser.name, [login, password], err);
      })
  }

  private createCookie(tokenData: TokenDataInterface): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default new AuthController() as AuthController;
