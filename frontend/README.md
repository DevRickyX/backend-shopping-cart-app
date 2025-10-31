# Croper Tech Test - Frontend

A React application for product management with authentication, search, and CRUD operations.

## Features

- **Product Management**: Full CRUD operations for products
- **Authentication**: JWT-based authentication system
- **Search & Filtering**: Real-time search across product names, descriptions, and categories
- **Pagination**: Efficient data pagination for large datasets
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with Radix UI components and Lucide React icons
- **State Management**: Redux Toolkit for global state management
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── products/          # Product management pages
│   │   ├── create/        # Create product page
│   │   └── [id]/edit/     # Edit product page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   ├── layout/           # Layout components
│   ├── products/         # Product-specific components
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── store/           # Redux store configuration
│   └── types.ts         # TypeScript type definitions
└── public/              # Static assets
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://api.com:3000
```

The application connects to a backend API.

## UI Components

The application uses a custom component library built with:

- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe component variants

## Authentication

The application includes a JWT-based authentication system with:

- Automatic token refresh
- Protected routes
- User session management

## Responsive Design

The application is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## License

This project is part of my Croper Tech Test.
