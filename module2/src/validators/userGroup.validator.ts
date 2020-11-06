import * as Joi from '@hapi/joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import 'joi-extract-type';

export const userGroupBodySchema: Joi.ObjectSchema = Joi.object({
  userIdList: Joi.array().items(Joi.string()).required(),
});

export interface UserGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string,
  };
  [ContainerTypes.Body]: {
    userIdList: string[],
  };
}
