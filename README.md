# Shopping Cart App

A full-stack shopping cart application built with NestJS (backend) and Next.js (frontend). The application supports managing items (products and events) with stock control and a localStorage-based shopping cart with backend validation.

## Features

### Backend (NestJS API)
- **Items Management**: CRUD operations for Products and Events
- **Cart Validation**: Stock checking and cart validation endpoints
- **Authentication**: JWT-based authentication
- **Stock Management**: Track and validate item availability
- **Error Handling**: Standardized error responses
- **API Documentation**: Swagger/OpenAPI integration

### Frontend (Next.js)
- **Items Management**: Create, read, update, and delete items (Products and Events)
- **Shopping Cart**: Add items, modify quantities, remove items
- **Cart Summary**: Display item details, quantities, prices, and totals
- **Stock Validation**: Real-time stock checking before adding to cart
- **localStorage Persistence**: Cart persists across browser sessions
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
shopping-cart-app/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── items/        # Items module (Products & Events)
│   │   ├── cart/         # Cart validation module
│   │   ├── auth/         # Authentication module
│   │   ├── common/       # Shared utilities (filters, interceptors)
│   │   └── health/       # Health check module
│   ├── test/             # E2E tests
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/             # Next.js application
    ├── app/              # Pages (App Router)
    │   ├── items/        # Items management pages
    │   └── cart/         # Cart page
    ├── components/       # React components
    │   ├── items/        # Item-related components
    │   ├── cart/         # Cart components
    │   └── ui/           # Base UI components
    ├── lib/              # Utilities and store
    │   ├── store/        # Redux store
    │   └── utils/        # Helper functions
    ├── Dockerfile
    └── next.config.ts
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose (for local development)
- MongoDB (provided via Docker)

## Quick Start with Docker

### Using Docker Compose (Recommended)

1. **Start all services**:
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 3000
- Frontend on port 3001

2. **Access the application**:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- API Documentation: http://localhost:3000/api/docs

3. **Stop services**:
```bash
docker-compose down
```

## Manual Setup

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
Create a `.env` file:
```env
PORT=3000
MONGODB_URL=mongodb://root:root@localhost:27017/shopping_cart_app?authSource=admin
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. **Start MongoDB** (if not using Docker):
```bash
pnpm db:up
```

5. **Run the backend**:
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. **Run the frontend**:
```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/auth/token` - Get JWT token

### Items
- `GET /api/items` - List all items
- `POST /api/items` - Create a new item
- `GET /api/items/:id` - Get a specific item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Cart (Validation)
- `POST /api/cart/check-stock` - Check stock availability for an item
- `POST /api/cart/validate` - Validate entire cart

### Health Check
- `GET /api/health` - Application health status

## Data Models

### Item (Base)
- `id`: string (MongoDB ObjectId)
- `type`: 'product' | 'event'
- `name`: string (required)
- `description`: string (optional)
- `price`: number (required, min: 0.01)
- `thumbnail`: string (optional, URL)
- `stock`: number (required, min: 0)
- `createdAt`: Date
- `updatedAt`: Date

### Product (extends Item)
- `type`: 'product'
- `category`: string (optional)

### Event (extends Item)
- `type`: 'event'
- `eventDate`: Date (optional)
- `location`: string (optional)
- `capacity`: number (optional, min: 1)
- `startTime`: string (optional)
- `endTime`: string (optional)

### Cart Item (Frontend)
- `itemId`: string
- `quantity`: number
- `item`: Item (cached item data)

## Business Rules

1. **Adding Items to Cart**:
   - If the same item is added again, the quantity increases (no duplicates)
   - Stock availability is checked before adding
   - Cannot add items with zero stock

2. **Modifying Quantity**:
   - Quantity can be increased or decreased
   - Quantity cannot exceed available stock
   - Setting quantity to 0 removes the item from cart

3. **Stock Control**:
   - Stock is tracked per item
   - Backend validates stock before allowing cart operations
   - Stock availability is displayed in the UI

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests (if configured)
pnpm test
```

## Docker Commands

### Build and Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

### Individual Services

```bash
# Backend only
cd backend
docker-compose up -d mongo
docker build -t shopping-cart-backend .
docker run -p 3000:3000 --network backend_app-network shopping-cart-backend

# Frontend only
cd frontend
docker build -t shopping-cart-frontend .
docker run -p 3001:3001 shopping-cart-frontend
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000, optional)
- `MONGODB_URL`: MongoDB connection string (optional* - recommended)
- `MONGO_DB`: MongoDB database name (optional* - alternative to MONGODB_URL)
- `MONGO_HOST`: MongoDB host (default: localhost)
- `MONGO_PORT`: MongoDB port (default: 27017)
- `MONGO_INITDB_ROOT_USERNAME`: MongoDB root username (optional*)
- `MONGO_INITDB_ROOT_PASSWORD`: MongoDB root password (optional*)
- `JWT_SECRET`: Secret key for JWT tokens (default: `default-secret-key-change-in-production`, should be changed in production)
- `JWT_EXPIRES_IN`: JWT expiration time (default: 1d)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (optional)

\* **MongoDB Configuration**: Provide either `MONGODB_URL` (full connection string) OR `MONGO_DB` with authentication variables as needed.

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Error Handling

The API uses standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type",
  "details": ["Additional error details"]
}
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:3000/api/docs

## Development

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode enabled

### Git Workflow
- Main branch: `main` or `master`
- Feature branch: `shopping-app` (current)

## License

This project is part of a technical test.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## Support

For issues or questions, please open an issue in the repository.
