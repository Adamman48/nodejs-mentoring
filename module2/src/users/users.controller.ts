import { Request, Response } from 'express';
import User from './user.interface';
import { Controller } from '../definitions/controller.abstract';
import { v4 as uuidv4 } from 'uuid';
import HttpException from '../exceptions/HttpException';

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
    this.router.get(`${this.path}/:id`, this.getUserById.bind(this));
    this.router.post(this.path, this.addUser.bind(this));
    this.router.put(`${this.path}/:id`, this.updateUser.bind(this));
    this.router.delete(`${this.path}/:id`, this.softDeleteUser.bind(this));
  }

  getAllUsers(req: Request, res: Response): void {
    res.status(200).send(this.users);
  }

  getUserById(req: Request, res: Response): void {
    const userId: string = req.params.id;
    const userData: User | undefined = this.users.find((user) => user.id === userId);

    if (!userData) {
      throw new HttpException(404, 'User not found!');
    } else {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(userData);
    }
  }

  addUser(req: Request, res: Response): void {
    const reqContentType = req.header('content-type');
    if (reqContentType !== 'application/json') {
      throw new HttpException(415, 'Content-Type is not of a supported media type!');
    } else {
      const newUserData: User = { ...req.body, id: uuidv4() }
      this.users.push(newUserData);
      res.setHeader('content-type', 'application/json');
      res.status(200).send(newUserData);
    }
  }

  updateUser(req: Request, res: Response): void {
    const reqContentType = req.header('content-type');
    if (reqContentType !== 'application/json') {
      throw new HttpException(415, 'Content-Type is not of a supported media type!')
    } else {
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
  }

  softDeleteUser(req: Request, res: Response) {
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
