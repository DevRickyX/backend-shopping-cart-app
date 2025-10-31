// Main components
export { default as ProductForm } from "./product-form";
export { default as ProductTable } from "./product-table";
export { default as DeleteDialog } from "./delete-dialog";

// Form components
export { PriceInput } from "./components/price-input";
export { CategorySelect } from "./components/category-select";

// Hooks
export { useProductForm } from "./hooks/use-product-form";

// Schemas
export { productSchema } from "./schemas/product-schema";
export type { ProductFormData } from "./schemas/product-schema";

// Constants
export {
  PRODUCT_CATEGORIES,
  NO_CATEGORY_VALUE,
  NO_CATEGORY_LABEL,
} from "./constants/product-categories";

// Utils
export {
  formatCurrency,
  parseCurrency,
  isAllowedKeyCode,
} from "./utils/currency-utils";
