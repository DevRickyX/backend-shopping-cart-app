import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Item,
  ItemsState,
  PaginationMeta,
  ItemFilters,
  SortConfig,
} from '../types';

// Initial state
const initialState: ItemsState = {
  items: [],
  selectedItem: null,
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
interface ExtendedItemsState extends ItemsState {
  filters: ItemFilters;
  sortConfig: SortConfig | null;
  searchQuery: string;
}

const extendedInitialState: ExtendedItemsState = {
  ...initialState,
  filters: {},
  sortConfig: null,
  searchQuery: '',
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState: extendedInitialState,
  reducers: {
    // Set selected item
    setSelectedItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
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
    setFilters: (state, action: PayloadAction<ItemFilters>) => {
      state.filters = action.payload;
    },

    // Update a specific filter
    updateFilter: (
      state,
      action: PayloadAction<{
        key: keyof ItemFilters;
        value: string | number | undefined;
      }>,
    ) => {
      const { key, value } = action.payload;
      if (value === undefined || value === null || value === '') {
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
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
    optimisticAddItem: (state, action: PayloadAction<Item>) => {
      state.items.unshift(action.payload);
      state.pagination.totalItems += 1;
    },

    // Optimistic update for update
    optimisticUpdateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload;
      }
    },

    // Optimistic update for delete
    optimisticDeleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.pagination.totalItems -= 1;
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null;
      }
    },
  },
});

export const itemsActions = itemsSlice.actions;
export default itemsSlice.reducer;

