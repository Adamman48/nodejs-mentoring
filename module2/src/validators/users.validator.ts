import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

export const substringParamSchema: Joi.ObjectSchema = Joi.object({
  substr: Joi.string().required(),
});

export const limitQuerySchema: Joi.ObjectSchema = Joi.object({
  limit: Joi.number().integer().max(5).required(),
});

export const userBodySchema: Joi.ObjectSchema = Joi.object({
  login: Joi.string().trim(false).min(1).max(25),
  password: Joi.string().pattern(
    new RegExp('^(?=.*[0-9]{1,})(?=.*[a-zA-Z]{1,})([a-zA-Z0-9]+)$'),
    'Password must contain at least one letter and one number'
  ).min(8).max(16).required(),
  age: Joi.number().integer().max(130).min(4).required(),
});

export interface UsersRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string,
    substr: string,
  },
  [ContainerTypes.Body]: {
    login: string,
    password: string,
    age: number,
  },
}
