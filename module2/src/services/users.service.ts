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

  public autoSuggestUsers(loginSubstring: string, limit: number): User[] {
    let suggestedUserLogins: User[] = this.users.reduce((accumulator: User[], user: User) => {
      if(user.login && user.login.toLowerCase().includes(loginSubstring) && accumulator.length < limit) {
        accumulator.push({ login: user.login });
      }
      return accumulator;
    }, []);

    suggestedUserLogins = suggestedUserLogins.sort((a: User, b: User): number => {
      if (a.login && b.login) {
        const nameA = a.login.toLowerCase();
        const nameB = b.login.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
      }
      return 0;
     });

    return suggestedUserLogins;
  }
}

export default new UsersService();
