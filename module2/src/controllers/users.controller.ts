import { Request, Response } from 'express';
import User from './user.interface';
import { Controller } from '../definitions/controller.abstract';
import { v4 as uuidv4 } from 'uuid';
import HttpException from '../exceptions/HttpException';
import { ValidatedRequest } from 'express-joi-validation';
import { usersValidator, headersSchema, paramSchema, UserRequestSchema, bodySchema } from '../validators/users.validator';

class UsersController extends Controller {
  private users: User[] = [
    {
      id: 'testId',
      login: 'test',
      age: 30,
      isDeleted: false,
      password: 'password',
    }
  ];

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
    res.status(200).send(this.users);
  }

  getUserById(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = this.users.find((user) => user.id === userId);

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(userData);
    }
  }

  addUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const newUserData: User = { ...req.body, id: uuidv4(), isDeleted: false };
    this.users.push(newUserData);
    res.setHeader('content-type', 'application/json');
    res.status(200).send(newUserData);
  }

  updateUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    const { login, password, age } = req.body;

    let updatedUserIndex = 0;
    const userData: User | undefined = this.users.find((user: User, i: number) => {
      if (user.id === userId) {
        updatedUserIndex = i;
      }
      return user.id === userId;
    });

    if(!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      this.users[updatedUserIndex] = { ...this.users[updatedUserIndex], login, password, age };
      res.setHeader('content-type', 'application/json');
      res.status(200).send(this.users[updatedUserIndex]); 
    }
  }

  softDeleteUser(req: ValidatedRequest<UserRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    let userIndex = 0;
    const userData: User | undefined = this.users.find((user: User, i: number) => {
      if(user.id === userId) {
        userIndex = i;
      }
      return user.id === userId;
    });

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      this.users[userIndex].isDeleted = true;
      res.setHeader('content-type', 'application/json');
      res.status(200).send(this.users[userIndex]);
    }
  }
}

export default UsersController;
