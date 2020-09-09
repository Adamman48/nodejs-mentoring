import { Request, Response } from 'express';
import { Controller } from '../definitions/controller.abstract';
import HttpException from '../exceptions/HttpException';
import { ValidatedRequest } from 'express-joi-validation';
import { usersValidator, headersSchema, idParamSchema, UserRequestSchema, bodySchema, substringParamSchema, limitQuerySchema } from '../validators/users.validator';
import usersService from '../services/users.service';

class UsersController extends Controller {
  constructor() {
    super('/users');
  }

  initRoutes() {
    this.router.get(this.path, this.getAllUsers.bind(this));
    this.router.get(
      `${this.path}/:id`,
      usersValidator.params(idParamSchema),
      this.getUserById.bind(this)
    );
    this.router.post(
      this.path,
      usersValidator.headers(headersSchema),
      usersValidator.body(bodySchema),
      this.addUser.bind(this)
    );
    this.router.put(
      `${this.path}/:id`,
      usersValidator.headers(headersSchema),
      usersValidator.params(idParamSchema),
      usersValidator.body(bodySchema),
      this.updateUser.bind(this)
    );
    this.router.delete(
      `${this.path}/:id`,
      usersValidator.params(idParamSchema),
      this.softDeleteUser.bind(this)
    );
    this.router.get(
      `${this.path}/suggest/:substr`,
      usersValidator.params(substringParamSchema),
      usersValidator.query(limitQuerySchema),
      this.getAutoSuggestUsers.bind(this)
    )
  }

  getAllUsers(req: Request, res: Response): void {
    usersService.findAll()
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'No user found!');
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  getUserById(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    usersService.findOneById(userId)
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'User not found!');
        } else {
          res.setHeader('content-type', 'application/json');
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
      });
  }

  addUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    usersService.addOne(req.body)
      .then((result) => {
        res.setHeader('content-type', 'application/json');
        res.status(200).json(result);
      })
      .catch((err) => res.status(418).send(err));
  }

  updateUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    usersService.updateOne(userId, req.body)
      .then((result) => {
        if(!result[0]) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader('content-type', 'application/json');
        res.status(200).json(result[1]);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  softDeleteUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    usersService.updateOne(userId, { isDeleted: true })
      .then((result) => {
        if(!result[0]) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader('content-type', 'application/json');
        res.status(200).json(result[1]);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  getAutoSuggestUsers(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const substring: string = req.params.substr;
    const limit: number = req.query.limit;

    usersService.autoSuggestUsers(substring, limit)
      .then((result) => {
        if (!result.length) {
          res.setHeader('content-type', 'text/html');
          res.sendStatus(204);
        } else {
          res.setHeader('content-type', 'application/json');
          console.log(result)
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }
}

export default UsersController;
