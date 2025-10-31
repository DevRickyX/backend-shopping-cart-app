import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().optional().default(3000),

  // Database
  DATABASE_NAME: Joi.string().optional(),
  DATABASE_PORT: Joi.string().optional(),

  // MongoDB - make optional if MONGODB_URL is provided
  MONGO_DB: Joi.string().optional(),
  MONGO_INITDB_ROOT_USERNAME: Joi.string().optional(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.string().optional(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_CONNECTION: Joi.string().optional(),
  MONGODB_URL: Joi.string().optional(),

  // JWT
  JWT_SECRET: Joi.string().optional().default('default-secret-key-change-in-production'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // CORS
  CORS_ORIGINS: Joi.string().optional(),
}).or('MONGODB_URL', 'MONGO_DB'); // Require either MONGODB_URL or MONGO_DB
