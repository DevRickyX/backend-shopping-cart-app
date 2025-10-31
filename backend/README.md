# Product Catalog API

A RESTful API built with NestJS for managing a product catalog. This application provides authentication, CRUD operations for products, and comprehensive API documentation.

## Features

- **Authentication**: JWT-based authentication system
- **Product Management**: Full CRUD operations for products
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Request validation with class-validator
- **CORS**: Cross-Origin Resource Sharing support
- **Environment Configuration**: Flexible environment-based configuration

## Tech Stack

- **Language**: TypeScript
- **Database**: MongoDB 7.0
- **ORM**: Mongoose
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose (for local development)
- MongoDB (provided via Docker)

## Configuration

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGO_DB=product_catalog
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root
MONGO_PORT=27017
MONGO_HOST=localhost
MONGODB_URL=mongodb://root:root@localhost:27017/product_catalog?authSource=admin

# JWT Configuration
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRES_IN=1d

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3000
```

## API Documentation

The application interactive API documentation is at:

**Swagger UI**: http://localhost:3000/api/docs

## Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. **Get a token**: `POST /api/auth/token`
2. **Use the token**: Include `Authorization: Bearer <token>` in request headers

## API Endpoints

### Authentication

- `POST /api/auth/token` - Get JWT token

### Health Check

- `GET /api/health` - Application health status

### Products

- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Product Schema

```typescript
{
  id: string;
  nombre: string;           // Required
  descripcion?: string;     // Optional
  precio: number;           // Required, > 0
  categoria?: string;       // Optional
}
```

## Database Schema

### Product Collection

```typescript
{
  _id: ObjectId;
  nombre: string;           // Required
  descripcion?: string;     // Optional
  precio: number;           // Required, minimum 0.01
  categoria?: string;       // Optional
  createdAt: Date;
  updatedAt: Date;
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── ...
│   ├── config/              # Configuration module
│   │   ├── app.config.ts
│   │   └── validation.schema.ts
│   ├── health/              # Health check module
│   ├── products/            # Products module
│   │   ├── dto/            # Product DTOs
│   │   ├── schemas/        # MongoDB schemas
│   │   └── ...
│   ├── app.module.ts       # Root module
│   └── main.ts             # Application entry point
├── docker-compose.yml      # MongoDB Docker setup
├── package.json
└── ...
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Request Validation**: Input validation using class-validator
- **CORS Protection**: Configurable Cross-Origin Resource Sharing
- **Environment Variables**: Secure configuration management

## License

This project is part of my Croper Tech Test.
