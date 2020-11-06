import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

export const groupBodySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim(false).min(1).max(25),
});

export interface GroupsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string,
  },
  [ContainerTypes.Body]: {
    name: string,
  }
}