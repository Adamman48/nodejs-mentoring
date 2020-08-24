import App from './app';
import UsersController from './users/users.controller';

const PORT = 3000;

const app = new App([
  new UsersController(),
], PORT);

app.listen();
