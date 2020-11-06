import { Association, DataTypes, Model } from 'sequelize';
import DatabaseManager from '../databaseManager';
import Group from './Group.model';
import User from './User.model';

class UserGroup extends Model {
  public readonly users?: User[];
  public readonly groups?: Group[];

  public static associations: {
    users: Association<UserGroup, User>;
    groups: Association<UserGroup, Group>;
  }
}

UserGroup.init({
  userId: {
    type: DataTypes.STRING(100),
    references: {
      model: User,
      key: 'id',
    },
  },
  groupId: {
    type: DataTypes.STRING(100),
    references: {
      model: Group,
      key: 'id',
    },
  }
}, {
  sequelize: DatabaseManager.databases['defaultDB'],
  tableName: 'user_group',
  hooks: {
    beforeSync: () => {
      Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });
      User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
    }
  }
});

export default UserGroup;
