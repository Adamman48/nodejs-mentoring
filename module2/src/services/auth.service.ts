import { DataStoredInTokenInterface, TokenDataInterface } from "../definitions/token.interface";
import User from "../models/User.model";
import jwt from 'jsonwebtoken';

class AuthService {
  constructor() {}

  public async loginUser(login: string, password: string): Promise<User | null | undefined> {
    const user = await User.findOne({
      where: {
        login
      }
    });

    if (user) {
      const userPassword = user.getDataValue('password');
      if (userPassword === password) {
        return user;
      }
    }
  }

  public createToken(user: User): TokenDataInterface | undefined {
    const expiresIn = 60 * 60; // 1 hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInTokenInterface = {
      _id: user.getDataValue('id'),
    };
    if (secret) {
      return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      }
    }
  }
}

export default new AuthService() as AuthService;
