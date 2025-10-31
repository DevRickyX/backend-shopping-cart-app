# Shopping Cart App - Backend API

A RESTful API built with NestJS for managing items (products and events) and validating shopping cart operations.

## Features

- **Items Management**: Full CRUD operations for Products and Events
- **Cart Validation**: Stock checking and cart validation endpoints
- **Authentication**: JWT-based authentication system
- **Stock Management**: Track and validate item availability
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Request validation with class-validator
- **Error Handling**: Global exception filter with standardized responses
- **CORS**: Cross-Origin Resource Sharing support
- **Testing**: Unit and E2E tests with Jest

## Tech Stack

- **Language**: TypeScript
- **Framework**: NestJS 11
- **Database**: MongoDB 7.0
- **ORM**: Mongoose
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose (for local development)
- MongoDB (provided via Docker)

## Quick Start

### Using Docker (Recommended)

```bash
# Start MongoDB and backend
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Manual Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
Create a `.env` file:
```env
PORT=3000
MONGODB_URL=mongodb://root:root@localhost:27017/shopping_cart_app?authSource=admin
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

3. **Start MongoDB**:
```bash
pnpm db:up
```

4. **Run the application**:
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

## API Endpoints

### Authentication
- `POST /api/auth/token` - Get JWT token (no authentication required)

### Items
- `GET /api/items` - List all items (requires authentication)
- `POST /api/items` - Create a new item (requires authentication)
- `GET /api/items/:id` - Get a specific item (requires authentication)
- `PUT /api/items/:id` - Update an item (requires authentication)
- `DELETE /api/items/:id` - Delete an item (requires authentication)

### Cart Validation
- `POST /api/cart/check-stock` - Check stock availability (no authentication required)
- `POST /api/cart/validate` - Validate entire cart (no authentication required)

### Health Check
- `GET /api/health` - Application health status (no authentication required)

## Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. **Get a token**: `POST /api/auth/token`
2. **Use the token**: Include `Authorization: Bearer <token>` in request headers

Example:
```bash
curl -X POST http://localhost:3000/api/auth/token

# Use the token
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/items
```

## Data Models

### Item Schema
```typescript
{
  type: 'product' | 'event';
  name: string;              // Required
  description?: string;      // Optional
  price: number;             // Required, min: 0.01
  thumbnail?: string;         // Optional, URL
  stock: number;             // Required, min: 0
  // Product-specific
  category?: string;
  // Event-specific
  eventDate?: Date;
  location?: string;
  capacity?: number;         // min: 1
  startTime?: string;
  endTime?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Create Item DTO
```typescript
{
  type: 'product' | 'event';
  name: string;
  description?: string;
  price: number;
  thumbnail?: string;
  stock: number;
  // Product-specific (only for type: 'product')
  category?: string;
  // Event-specific (only for type: 'event')
  eventDate?: string;        // ISO date string
  location?: string;
  capacity?: number;
  startTime?: string;        // HH:mm format
  endTime?: string;          // HH:mm format
}
```

### Check Stock DTO
```typescript
{
  itemId: string;
  quantity: number;          // min: 1
}
```

### Cart Validation DTO
```typescript
{
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
}
```

## Error Handling

The API uses a global exception filter that returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type",
  "details": ["Additional validation errors"]
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (item not found)
- `500` - Internal Server Error

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:3000/api/docs

## Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Coverage
```bash
pnpm test:cov
```

### Test Files
- `src/items/items.service.spec.ts` - Items service unit tests
- `src/cart/cart.service.spec.ts` - Cart service unit tests
- `test/items.e2e-spec.ts` - Items endpoints E2E tests
- `test/cart.e2e-spec.ts` - Cart endpoints E2E tests

## Project Structure

```
backend/
├── src/
│   ├── items/                 # Items module
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── schemas/          # MongoDB schemas
│   │   ├── items.controller.ts
│   │   ├── items.service.ts
│   │   └── items.module.ts
│   ├── cart/                  # Cart validation module
│   │   ├── dto/              # Cart DTOs
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── cart.module.ts
│   ├── auth/                  # Authentication module
│   ├── common/                # Shared utilities
│   │   ├── filters/          # Exception filters
│   │   ├── interceptors/     # Response interceptors
│   │   └── dto/              # Common DTOs
│   ├── config/               # Configuration
│   ├── health/                # Health check
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── test/                      # E2E tests
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Docker

### Build Image
```bash
docker build -t shopping-cart-backend .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e MONGODB_URL=mongodb://root:root@mongo:27017/shopping_cart_app?authSource=admin \
  -e JWT_SECRET=your-secret \
  shopping-cart-backend
```

### Using Docker Compose
```bash
# Start MongoDB and backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URL` | MongoDB connection string (full URI) | Optional* |
| `MONGO_DB` | MongoDB database name | Optional* |
| `MONGO_HOST` | MongoDB host | `localhost` |
| `MONGO_PORT` | MongoDB port | `27017` |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | Optional* |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | Optional* |
| `JWT_SECRET` | Secret key for JWT tokens | `default-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` |
| `CORS_ORIGINS` | Comma-separated allowed origins | Optional |

\* **MongoDB Configuration**: You must provide either:
- `MONGODB_URL` (recommended): A complete MongoDB connection string, OR
- `MONGO_DB` along with authentication variables (`MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`) if needed

**Security Note**: The default `JWT_SECRET` should be changed in production environments.

## Scripts

- `pnpm start:dev` - Start in development mode with watch
- `pnpm build` - Build for production
- `pnpm start:prod` - Start in production mode
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:cov` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm db:up` - Start MongoDB with Docker
- `pnpm db:down` - Stop MongoDB

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Request Validation**: Input validation using class-validator
- **CORS Protection**: Configurable Cross-Origin Resource Sharing
- **Environment Variables**: Secure configuration management
- **Error Handling**: No sensitive information leaked in errors

## License

This project is part of a technical test.
