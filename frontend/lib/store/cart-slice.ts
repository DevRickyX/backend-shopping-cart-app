import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, Item } from '../types';
import { cartUtils } from '../utils/cart-utils';

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart from localStorage
    initializeCart: (state) => {
      const cart = cartUtils.loadCart();
      state.items = cart.items;
    },

    // Add item to cart
    addItem: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number; item?: Item }>,
    ) => {
      const { itemId, quantity, item } = action.payload;
      state.items = cartUtils.addItem(state.items, itemId, quantity, item);
      cartUtils.saveCart({
        items: state.items,
        ...cartUtils.calculateTotals(state.items),
      });
    },

    // Update item quantity
    updateItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>,
    ) => {
      const { itemId, quantity } = action.payload;
      state.items = cartUtils.updateItemQuantity(
        state.items,
        itemId,
        quantity,
      );
      cartUtils.saveCart({
        items: state.items,
        ...cartUtils.calculateTotals(state.items),
      });
    },

    // Remove item from cart
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = cartUtils.removeItem(state.items, action.payload);
      cartUtils.saveCart({
        items: state.items,
        ...cartUtils.calculateTotals(state.items),
      });
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.error = null;
      cartUtils.clearCart();
    },

    // Update item data in cart (when item details change)
    updateItemData: (
      state,
      action: PayloadAction<{ itemId: string; item: Item }>,
    ) => {
      const { itemId, item } = action.payload;
      state.items = state.items.map((ci) =>
        ci.itemId === itemId ? { ...ci, item } : ci,
      );
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Mark cart as validated
    setValidated: (state, action: PayloadAction<Date>) => {
      state.lastValidated = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;

