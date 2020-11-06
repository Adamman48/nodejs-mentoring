import { Request, Response } from 'express';
import { Controller } from '../definitions/controller.abstract';
import HttpException from '../exceptions/HttpException';
import { ValidatedRequest } from 'express-joi-validation';
import { UsersRequestSchema, userBodySchema, limitQuerySchema, substringParamSchema } from '../validators/users.validator';
import UsersService from '../services/users.service';
import { coreValidator, headersSchema, idParamSchema } from '../validators/core.validator';
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from '../definitions/constants';

class UsersController extends Controller {
  constructor() {
    super('/users');
  }

  initRoutes() {
    const { router, path } = this;
    router.get(path, this.getAllUsers.bind(this));
    router.get(
      `${path}/:id`,
      coreValidator.params(idParamSchema),
      this.getUserById.bind(this)
    );
    router.post(
      path,
      coreValidator.headers(headersSchema),
      coreValidator.body(userBodySchema),
      this.addUser.bind(this)
    );
    router.put(
      `${path}/:id`,
      coreValidator.headers(headersSchema),
      coreValidator.params(idParamSchema),
      coreValidator.body(userBodySchema),
      this.updateUser.bind(this)
    );
    router.delete(
      `${path}/:id`,
      coreValidator.params(idParamSchema),
      this.softDeleteUser.bind(this)
    );
    router.get(
      `${path}/suggest/:substr`,
      coreValidator.params(substringParamSchema),
      coreValidator.query(limitQuerySchema),
      this.getAutoSuggestUsers.bind(this)
    )
  }

  getAllUsers(req: Request, res: Response): void {
    UsersService.findAll()
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'No user found!');
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  getUserById(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    UsersService.findOneById(userId)
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'User not found!');
        } else {
          res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  addUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    UsersService.addOne(req.body)
      .then((result) => {
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result);
      })
      .catch((err) => res.status(418).send(err));
  }

  updateUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    UsersService.updateOne(userId, req.body)
      .then((result) => {
        if(!result[0]) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result[1]);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  softDeleteUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    UsersService.updateOne(userId, { isDeleted: true })
      .then((result) => {
        if(!result[0]) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result[1]);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  getAutoSuggestUsers(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const substring: string = req.params.substr;
    const limit: number = req.query.limit;

    UsersService.autoSuggestUsers(substring, limit)
      .then((result) => {
        if (!result.length) {
          res.setHeader(CONTENT_TYPE, 'text/html');
          res.sendStatus(204);
        } else {
          res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }
}

export default  new UsersController() as UsersController;
