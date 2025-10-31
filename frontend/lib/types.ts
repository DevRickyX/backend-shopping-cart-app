// Product related types
export interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
}

export interface CreateProductDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
}

export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Authentication types
export interface AuthToken {
  access_token: string;
  expires_in?: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

// Redux State types
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

export interface RootState {
  auth: AuthState;
  products: ProductsState;
}

// Form types
export interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

// UI Component types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  loading?: boolean;
}

// Filter and Sort types
export interface ProductFilters {
  search?: string;
  categoria?: string;
  priceMin?: number;
  priceMax?: number;
  [key: string]: string | number | undefined;
}

export interface SortConfig {
  field: keyof Product;
  direction: "asc" | "desc";
}

// HTTP Client types
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
}

// Toast notification types
export interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

// Loading states
export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

// Common utility types
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

// Environment variables
export interface AppConfig {
  apiUrl: string;
  environment: "development" | "production" | "test";
  enableLogging: boolean;
}
