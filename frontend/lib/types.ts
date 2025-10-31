// Item related types
export type ItemType = 'product' | 'event';

export interface BaseItem {
  id: string;
  type: ItemType;
  name: string;
  description?: string;
  price: number;
  thumbnail?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductItem extends BaseItem {
  type: 'product';
  category?: string;
}

export interface EventItem extends BaseItem {
  type: 'event';
  eventDate?: Date;
  location?: string;
  capacity?: number;
  startTime?: string;
  endTime?: string;
}

export type Item = ProductItem | EventItem;

export interface CreateItemDto {
  type: ItemType;
  name: string;
  description?: string;
  price: number;
  thumbnail?: string;
  stock: number;
  // Product-specific
  category?: string;
  // Event-specific
  eventDate?: string;
  location?: string;
  capacity?: number;
  startTime?: string;
  endTime?: string;
}

export interface UpdateItemDto {
  type?: ItemType;
  name?: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  stock?: number;
  // Product-specific
  category?: string;
  // Event-specific
  eventDate?: string;
  location?: string;
  capacity?: number;
  startTime?: string;
  endTime?: string;
}

// Cart related types
export interface CartItem {
  itemId: string;
  quantity: number;
  // Cached item data for display
  item?: Item;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface AddToCartDto {
  itemId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  itemId: string;
  quantity: number;
}

export interface CheckStockDto {
  itemId: string;
  quantity: number;
}

export interface CheckStockResponse {
  available: boolean;
  availableStock: number;
  requestedQuantity: number;
}

export interface CartValidationDto {
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
}

export interface CartValidationResponse {
  isValid: boolean;
  errors: string[];
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

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  lastValidated?: Date;
}

export interface RootState {
  auth: AuthState;
  items: ItemsState;
  cart: CartState;
}

// Form types
export interface ItemFormData {
  type: ItemType;
  name: string;
  description: string;
  price: number;
  thumbnail?: string;
  stock: number;
  // Product-specific
  category?: string;
  // Event-specific
  eventDate?: string;
  location?: string;
  capacity?: number;
  startTime?: string;
  endTime?: string;
}

// UI Component types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export interface ItemFormProps {
  item?: Item;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// ItemFormData type from schema (description is optional)
export type ItemFormDataFromSchema = {
  type: ItemType;
  name: string;
  description?: string;
  price: number;
  thumbnail?: string;
  stock: number;
  category?: string;
  eventDate?: string;
  location?: string;
  capacity?: number;
  startTime?: string;
  endTime?: string;
};

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
}

// Filter and Sort types
export interface ItemFilters {
  search?: string;
  type?: ItemType;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  [key: string]: string | number | undefined;
}

export interface SortConfig {
  field: keyof BaseItem;
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
