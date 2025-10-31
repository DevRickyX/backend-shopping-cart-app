import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  },
  mongo: {
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT, 10) : 27017,
    host: process.env.MONGO_HOST || 'localhost',
    connection:
      process.env.MONGODB_URL ||
      process.env.MONGO_CONNECTION ||
      'mongodb://localhost:27017',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000'],
  },
}));
