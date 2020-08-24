import { Request, Response } from 'express';
import User from './user.interface';
import { Controller } from '../definitions/controller.abstract';
import HttpException from '../exceptions/HttpException';
import { ValidatedRequest } from 'express-joi-validation';
import { usersValidator, headersSchema, paramSchema, UserRequestSchema, bodySchema } from '../validators/users.validator';
import usersService from '../services/users.service';

class UsersController extends Controller {
  constructor() {
    super('/users');
  }

  initRoutes() {
    this.router.get(this.path, this.getAllUsers.bind(this));
    this.router.get(
      `${this.path}/:id`,
      usersValidator.params(paramSchema),
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
      usersValidator.params(paramSchema),
      usersValidator.body(bodySchema),
      this.updateUser.bind(this)
    );
    this.router.delete(
      `${this.path}/:id`,
      usersValidator.params(paramSchema),
      this.softDeleteUser.bind(this)
    );
  }

  getAllUsers(req: Request, res: Response): void {
    const allUsers = usersService.findAll();
    res.status(200).send(allUsers);
  }

  getUserById(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.findOneById(userId);

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(userData);
    }
  }

  addUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const newUserData: User = usersService.addOne(req.body);
    res.setHeader('content-type', 'application/json');
    res.status(200).send(newUserData);
  }

  updateUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.updateOne(userId, req.body);

    if(!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(userData); 
    }
  }

  softDeleteUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = usersService.updateOne(userId, { isDeleted: true });

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(userData);
    }
  }
}

export default UsersController;
