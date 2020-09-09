import UserInterface from "../controllers/user.interface";
import { v4 as uuidv4 } from 'uuid';
import User from "../models/User.model";
import { Op } from "sequelize";

class UsersService {
  constructor() {}

  public async findAll(): Promise<User[]>  {
    return await User.findAll({
      attributes: ['id', 'login', 'password', 'age'],
    });
  }

  public async findOneById(userId: string): Promise<User | null> {
    return await User.findByPk(userId);
  }

  public async addOne(userData: UserInterface): Promise<User> {
    return await User.create({ ...userData, id: uuidv4() });
  }

  public async updateOne(userId: string, dataToUpdate: UserInterface): Promise<[number, User[]]> {
    return await User.update(dataToUpdate, {
      where: {
        id: userId,
      },
      returning: true,
    });
  }

  public async autoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
    return await User.findAll({
      attributes: ['login'],
      order: [
        ['login', 'ASC'],
      ],
      where: {
        login: {
          [Op.substring]: loginSubstring
        }
      },
      limit: limit,
    });
  }
}

export default new UsersService();
