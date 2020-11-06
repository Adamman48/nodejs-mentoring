import App from './app';
import GroupsController from './controllers/groups.controller';
import userGroupController from './controllers/userGroup.controller';
import UsersController from './controllers/users.controller';

// * Models need Services to execute afterSync hook, DB only initializes if the relevant Service is required before
// TODO: consider refactor with TypeORM or sequelize-typescript instead sequelize

const PORT = 3000;

const app = new App([
  UsersController,
  GroupsController,
  userGroupController,
], PORT);

app.listen();
