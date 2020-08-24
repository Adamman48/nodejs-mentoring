import App from './app';
import UsersController from './controllers/users.controller';

const PORT = 3000;

const app = new App([
  new UsersController(),
], PORT);

app.listen();
