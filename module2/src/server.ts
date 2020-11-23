import App from './app';
import dotenv from 'dotenv';
import GroupsController from './controllers/groups.controller';
import userGroupController from './controllers/userGroup.controller';
import UsersController from './controllers/users.controller';
import AuthController from './controllers/authentication.controller';

dotenv.config();

// * Models need Services to execute afterSync hook, DB only initializes if the relevant Service is required before
// TODO: consider refactor with TypeORM or sequelize-typescript instead sequelize

const PORT = Number(process.env.PORT) || 3030;

const app = new App([
  AuthController,
  UsersController,
  GroupsController,
  userGroupController,
], PORT);

app.listen();
