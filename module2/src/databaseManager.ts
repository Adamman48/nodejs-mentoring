import { Sequelize } from 'sequelize';
import { ConsoleColorsEnum } from "../../utils/consoleUtils";

interface DatabaseInterface {
  [key: string]: Sequelize;
}

const defaultDB = new Sequelize('lrevvzdj', 'lrevvzdj', 'Wq7wgCijm89IeVuu5_pZVndL6L9me6qW', {
  host: 'balarama.db.elephantsql.com',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

class DatabaseManager {
  static databases: DatabaseInterface;

  static addDatabases(databaseCollection: DatabaseInterface): void {
    DatabaseManager.databases = databaseCollection;
  }

  static connectToDatabases(): void {
    Object.values(DatabaseManager.databases).forEach((database) => {
      database.authenticate()
      .then(() => {
        console.log(ConsoleColorsEnum.MAGENTA, 'Successfully connected to remote DB!');
      })
      .catch((err) => {
        console.error('Connection failure to remote DB', err);
      });
    });
  }
}

DatabaseManager.addDatabases({
  defaultDB,
});
DatabaseManager.connectToDatabases();


export default DatabaseManager;
