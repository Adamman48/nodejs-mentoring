import DatabaseManager from "../databaseManager";
import Group from "../models/Group.model";
import User from "../models/User.model";
import UserGroup from "../models/UserGroup.model";

class UserGroupService {
  constructor() {}

  public async findAll(): Promise<UserGroup[]> {
    return await UserGroup.findAll({
      attributes: ['userId', 'groupId'],
    });
  }

  public async addUsersToGroup(userIdList: string[], groupId: string): Promise<any> {
    const db = DatabaseManager.databases['defaultDB'];
      try {
        return await db.transaction(async (t) => {
          const group: Group | null = await Group.findByPk(groupId, { transaction: t });
          if (group) {
            return await group.addUsers(userIdList, { transaction: t })
          }
        }
        );
      } catch(e) {
        return e;
      }
  }
}

export default new UserGroupService() as UserGroupService;
