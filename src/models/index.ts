import { Sequelize } from 'sequelize-typescript';
import * as config from '../config';
import { Asset } from './asset.model';

export const sequelize = new Sequelize({
  host: config.dbHost,
  database: config.dbSchema,
  dialect: 'mysql',
  username: config.dbUsername,
  password: config.dbPassword,
  logging: false,
  storage: ':memory:'
});

sequelize.addModels([Asset]);

export { Asset } from './asset.model';
