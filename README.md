# Croper Tech Test - Catálogo de productos

## Características principales

### Backend (API REST)
- **Autenticación JWT**: Sistema seguro de autenticación
- **CRUD de Productos**: Operaciones completas de gestión
- **Base de Datos**: MongoDB con Mongoose
- **Documentación API**: Swagger/OpenAPI integrado
- **Validación**: Validación de datos con class-validator
- **CORS**: Soporte para Cross-Origin Resource Sharing

### Frontend (Aplicación Web)
- **Gestión de Productos**: Interfaz completa para CRUD
- **Autenticación**: Sistema JWT integrado
- **Búsqueda y Filtros**: Búsqueda en tiempo real
- **Paginación**: Navegación eficiente de datos
- **Diseño Responsivo**: Optimizado para móviles y desktop
- **UI Moderna**: Componentes Radix UI con Tailwind CSS

## Stack Tecnológico

### Backend
- **Lenguaje**: TypeScript
- **Framework**: NestJS
- **Base de Datos**: MongoDB 7.0
- **ORM**: Mongoose
- **Autenticación**: JWT con Passport
- **Documentación**: Swagger/OpenAPI

### Frontend
- **Framework**: React / Next.js
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: Radix UI
- **Estado**: Redux Toolkit
- **Formularios**: React Hook Form + Zod

## Estructura del Proyecto

```
croper-tech-test/
├── backend/              # API REST con NestJS
│   ├── src/
│   │   ├── auth/        # Módulo de autenticación
│   │   ├── products/    # Módulo de productos
│   │   └── config/      # Configuración
│   └── docker-compose.yml
└── frontend/            # Aplicación Web
    ├── app/             # Páginas (App Router)
    ├── components/      # Componentes reutilizables
    └── lib/            # Utilidades y configuración
```

## Autenticación

El sistema utiliza autenticación JWT:
1. Obtener token: `POST /api/auth/token`
2. Usar token en headers: `Authorization: Bearer <token>`

## Diseño Responsivo

La aplicación frontend está optimizada para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## Seguridad

- Autenticación JWT segura
- Validación de datos en backend
- Protección CORS configurable
- Variables de entorno para configuración
