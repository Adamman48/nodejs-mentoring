import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ExpressJoiInstance, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

export const usersValidator: ExpressJoiInstance = createValidator({ passError: true });

export const headersSchema: Joi.ObjectSchema = Joi.object({
  ['content-type']: Joi.equal('application/json').required(),
});

export const paramSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().required(),
});

export const bodySchema: Joi.ObjectSchema = Joi.object({
  login: Joi.string().trim(false).min(1).max(25),
  password: Joi.string().pattern(
    new RegExp('^(?=.*[0-9]{1,})(?=.*[a-zA-Z]{1,})([a-zA-Z0-9]+)$'),
    'Password must contain at least one letter and one number'
  ).min(8).max(16).required(),
  age: Joi.number().integer().max(130).min(4).required(),
});

export interface UserRequestSchema extends ValidatedRequestSchema {
  /* [ContainerTypes.Headers]: {
    ['content-type']: string,
  }, */
  [ContainerTypes.Params]: {
    id: string,
  },
  [ContainerTypes.Body]: {
    login: string,
    password: string,
    age: number,/* 
    isDeleted: boolean, */
  },
};
