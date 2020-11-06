import { Association, DataTypes, HasManyAddAssociationsMixin, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import DatabaseManager from '../databaseManager';
import groupsService from '../services/groups.service';
import User from './User.model';
import UserGroup from './UserGroup.model';

class Group extends Model {
  public addUsers!: HasManyAddAssociationsMixin<User, string>;

  public readonly users?: User[];

  public static associations: {
    users: Association<Group, User>;
    userGroup: Association<Group, UserGroup>;
  };
};

Group.init({
  id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(25),
    allowNull: false,
    validate: { len: [1, 25] },
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['READ'],
    allowNull: false,
  }
}, {
  sequelize: DatabaseManager.databases['defaultDB'],
  tableName: 'groups',
  hooks: {
    afterSync: () => {
      groupsService.createOne({
        id: uuidv4(),
        name: 'default',
      })
    }
  },
});

export default Group;
