import * as Joi from '@hapi/joi';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import 'joi-extract-type';
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from '../definitions/constants';

export const coreValidator: ExpressJoiInstance = createValidator({ passError: true });

export const headersSchema: Joi.ObjectSchema = Joi.object({
  [CONTENT_TYPE]: Joi.equal(CONTENT_TYPE_APP_JSON).required(),
});

export const idParamSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().required(),
});
