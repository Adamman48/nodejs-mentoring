import { Association, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import DatabaseManager from '../databaseManager';
import usersService from '../services/users.service';
import Group from './Group.model';
import UserGroup from './UserGroup.model';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         login:
 *           type: string
 *         password:
 *           type: string
 *         age:
 *           type: number
 *         isDeleted:
 *           type: boolean
 *           default: false
 *       xml:
 *         name: "User"
 */
class User extends Model {
  public readonly groups?: Group[];

  public static associations: {
    groups: Association<User, Group>;
    userGroup: Association<User, UserGroup>;
  }
};

User.init({
  id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING(25),
    allowNull: false,
    validate: { len: [1, 25] },
  },
  password: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: { 
      len: [8, 16],
      is: new RegExp('^(?=.*[0-9]{1,})(?=.*[a-zA-Z]{1,})([a-zA-Z0-9]+)$'),
    },
  },
  age: {
    type: DataTypes.SMALLINT(),
    allowNull: false,
    validate: { min: 4, max: 130 },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_deleted'
  },
}, {
  sequelize: DatabaseManager.databases['defaultDB'],
  tableName: 'users',
  hooks: {
    afterSync: () => {
      usersService.addOne({
        id: uuidv4(),
        login: 'default',
        age: 30,
        isDeleted: false,
        password: 'password1',
      })
    }
  }
});

export default User;
