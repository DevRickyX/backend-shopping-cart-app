import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().required(),

  // Database
  DATABASE_NAME: Joi.string().optional(),
  DATABASE_PORT: Joi.string().optional(),

  // MongoDB
  MONGO_DB: Joi.string().required(),
  MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_CONNECTION: Joi.string().optional(),
  MONGODB_URL: Joi.string().optional(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // CORS
  CORS_ORIGINS: Joi.string().optional(),
});
