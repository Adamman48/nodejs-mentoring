import { Request, Response } from 'express';
import User from './user.interface';
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
    const allUsers = usersService.findAll();
    res.status(200).json(allUsers);
  }

  getUserById(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.findOneById(userId);

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).json(userData);
    }
  }

  addUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const newUserData: User = usersService.addOne(req.body);
    res.setHeader('content-type', 'application/json');
    res.status(200).json(newUserData);
  }

  updateUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.updateOne(userId, req.body);

    if(!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).json(userData); 
    }
  }

  softDeleteUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.updateOne(userId, { isDeleted: true });

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).json(userData);
    }
  }

  getAutoSuggestUsers(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const substring: string = req.params.substr;
    const limit: number = req.query.limit;

    const suggestedUserLogins: User[] = usersService.autoSuggestUsers(substring, limit);

    if(!suggestedUserLogins.length) {
      res.setHeader('content-type', 'text/html');
      res.sendStatus(204);
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).json(suggestedUserLogins);
    }
  }
}

export default UsersController;
