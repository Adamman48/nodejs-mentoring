import User from "../controllers/user.interface";
import { v4 as uuidv4 } from 'uuid';

class UsersService {
  private users: User[];

  constructor() {
    this.users = [
      {
        id: 'testId',
        login: 'test',
        age: 30,
        isDeleted: false,
        password: 'password',
      }
    ];
  }

  public findAll(): User[] {
    return this.users;
  }

  public findOneById(userId: string): User | undefined {
    const userData: User | undefined = this.users.find((user) => user.id === userId);
    return userData;
  }

  public addOne(userData: User): User {
    const newUserData: User = { ...userData, id: uuidv4(), isDeleted: false };
    this.users.push(newUserData);
    return newUserData;
  }

  public updateOne(userId: string, dataToUpdate: User): User | undefined {
    let updatedUserIndex = 0;
    const userData = this.users.find((user: User, i: number) => {
      if (user.id === userId) {
        updatedUserIndex = i;
      }
      return user.id === userId;
    });

    if(!userData) {
      return userData;
    } else {
      this.users[updatedUserIndex] = { ...this.users[updatedUserIndex], ...dataToUpdate };
    }
    return this.users[updatedUserIndex];
  }
}

export default new UsersService();
