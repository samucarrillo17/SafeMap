import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string().required(),
  PORT: Joi.number().default(3001),
  DB_NAME: Joi.string().default('safe-map'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  JWT_SECRET: Joi.string(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
