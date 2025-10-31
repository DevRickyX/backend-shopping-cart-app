import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  ProductsState,
  PaginationMeta,
  ProductFilters,
  SortConfig,
} from "../types";

// Initial state
const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrevious: false,
  },
};

// Extended state for local UI management
interface ExtendedProductsState extends ProductsState {
  filters: ProductFilters;
  sortConfig: SortConfig | null;
  searchQuery: string;
}

const extendedInitialState: ExtendedProductsState = {
  ...initialState,
  filters: {},
  sortConfig: null,
  searchQuery: "",
};

export const productsSlice = createSlice({
  name: "products",
  initialState: extendedInitialState,
  reducers: {
    // Set selected product
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    // Update pagination
    setPagination: (state, action: PayloadAction<PaginationMeta>) => {
      state.pagination = action.payload;
    },

    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    // Update filters
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },

    // Update a specific filter
    updateFilter: (
      state,
      action: PayloadAction<{
        key: keyof ProductFilters;
        value: string | number | undefined;
      }>
    ) => {
      const { key, value } = action.payload;
      if (value === undefined || value === null || value === "") {
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = "";
    },

    // Set sort configuration
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },

    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Optimistic update for create
    optimisticAddProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.pagination.totalItems += 1;
    },

    // Optimistic update for update
    optimisticUpdateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct = action.payload;
      }
    },

    // Optimistic update for delete
    optimisticDeleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.pagination.totalItems -= 1;
      if (state.selectedProduct?.id === action.payload) {
        state.selectedProduct = null;
      }
    },
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
