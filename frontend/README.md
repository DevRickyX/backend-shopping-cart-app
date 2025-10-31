# Shopping Cart App - Frontend

A React/Next.js application for managing items (products and events) and shopping cart functionality with localStorage persistence.

## Features

- **Items Management**: Full CRUD operations for Products and Events
- **Shopping Cart**: Add items, modify quantities, remove items
- **Cart Summary**: Display item details, quantities, unit prices, subtotals, and totals
- **Stock Validation**: Real-time stock checking before adding to cart
- **localStorage Persistence**: Cart persists across browser sessions
- **Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with Radix UI components and Lucide React icons

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Backend API running (see backend README)

## Quick Start

### Using Docker

```bash
# Build and run
docker build -t shopping-cart-frontend .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api \
  shopping-cart-frontend
```

### Manual Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Run the application**:
```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

The application will be available at http://localhost:3001

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── items/             # Items management pages
│   │   ├── create/        # Create item page
│   │   └── [id]/edit/     # Edit item page
│   ├── cart/              # Cart page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to /items)
├── components/            # React components
│   ├── items/             # Item-related components
│   │   ├── item-form.tsx
│   │   ├── item-table.tsx
│   │   └── hooks/
│   ├── cart/              # Cart components
│   │   ├── cart-icon.tsx
│   │   ├── cart-summary.tsx
│   │   ├── add-to-cart-button.tsx
│   │   ├── quantity-control.tsx
│   │   └── cart-item-row.tsx
│   ├── layout/            # Layout components
│   ├── common/            # Common UI components
│   └── ui/                # Base UI components (Radix UI)
├── hooks/                 # Custom React hooks
│   ├── use-items.ts
│   └── use-auth.ts
├── lib/                   # Utilities and configurations
│   ├── store/             # Redux store
│   │   ├── items-api.ts
│   │   ├── items-slice.ts
│   │   ├── cart-api.ts
│   │   ├── cart-slice.ts
│   │   └── index.ts
│   ├── utils/             # Helper functions
│   │   ├── cart-utils.ts
│   │   └── stock-utils.ts
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Pages

### Items Page (`/items`)
- List all items (products and events)
- Search and filter items
- Add to cart functionality
- Edit and delete items

### Create Item Page (`/items/create`)
- Form to create new items
- Support for both Products and Events
- Dynamic form fields based on item type

### Edit Item Page (`/items/[id]/edit`)
- Form to edit existing items
- Pre-populated with item data

### Cart Page (`/cart`)
- Display cart summary
- Show item details, quantities, prices
- Modify quantities
- Remove items
- Display total quantity and total price

## Components

### Item Components
- `ItemForm`: Form for creating/editing items
- `ItemTable`: Table displaying items with actions
- `AddToCartButton`: Button to add items to cart with stock validation

### Cart Components
- `CartIcon`: Cart icon with item count badge (in header)
- `CartSummary`: Main cart display with item list and totals
- `CartItemRow`: Individual cart item row with quantity controls
- `QuantityControl`: +/- controls for modifying quantities
- `AddToCartButton`: Button with stock validation

## State Management

### Redux Store Structure
```typescript
{
  auth: AuthState,
  items: ItemsState,
  cart: CartState,
  itemsApi: RTK Query API,
  cartApi: RTK Query API
}
```

### Cart State
- `items`: Array of cart items
- `loading`: Loading state
- `error`: Error state
- `lastValidated`: Last validation timestamp

Cart is persisted to localStorage automatically on changes.

## Cart Functionality

### Adding Items
- Click "Add to Cart" button on item
- Stock is validated via backend API
- If available, item is added or quantity increased
- Cart persists to localStorage

### Modifying Quantity
- Use +/- buttons or input field
- Quantity cannot exceed available stock
- Setting quantity to 0 removes item

### Removing Items
- Click trash icon on cart item
- Item is immediately removed from cart

### Cart Summary
- Displays all cart items
- Shows item name, type, quantity, unit price, subtotal
- Calculates total quantity and total price
- Prices displayed in Colombian Pesos (COP)

## Stock Management

- Stock status is displayed for each item:
  - **In Stock**: Green indicator
  - **Low Stock** (< 5): Orange indicator
  - **Out of Stock**: Red indicator
- Stock is validated before adding to cart
- Quantity cannot exceed available stock

## Authentication

The application includes JWT-based authentication:
- Token is stored in localStorage
- Protected routes require authentication
- Token is automatically included in API requests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Docker

### Build Image
```bash
docker build -t shopping-cart-frontend .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api \
  shopping-cart-frontend
```

## Styling

The application uses Tailwind CSS v4 with:
- Responsive design (mobile-first)
- Dark mode support (via next-themes)
- Custom component variants using CVA
- Radix UI for accessible components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Next.js App Router for optimal performance
- Static page generation where possible
- Code splitting and lazy loading
- Optimized images with Next.js Image component

## License

This project is part of a technical test.
