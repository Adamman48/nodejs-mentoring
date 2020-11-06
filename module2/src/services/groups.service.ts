import GroupInterface from '../definitions/group.interface';
import { v4 as uuidv4 } from 'uuid';
import Group from '../models/Group.model';

class GroupsService {
  constructor() {}

  public async findAll(): Promise<Group[]> {
    return await Group.findAll({
      attributes: ['id', 'name', 'permissions'],
    });
  }

  public async findOneById(groupId: string): Promise<Group | null> {
    return await Group.findByPk(groupId);
  }

  public async createOne(groupData: GroupInterface): Promise<Group> {
    return await Group.create({ ...groupData, id: uuidv4() });
  }

  public async updateOne(groupId: string, dataToUpdate: GroupInterface): Promise<[number, Group[]]> {
    return await Group.update(dataToUpdate, {
      where: {
        id: groupId,
      },
      returning: true,
    });
  }

  public async removeOne(groupId: string): Promise<number> {
    return await Group.destroy({
      where: {
        id: groupId,
      },
    });
  }

}

export default new GroupsService() as GroupsService;
