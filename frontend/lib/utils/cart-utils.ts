import { Cart, CartItem, Item } from '../types';

const CART_STORAGE_KEY = 'shopping_cart_app_cart';

export const cartUtils = {
  // Load cart from localStorage
  loadCart(): Cart {
    if (typeof window === 'undefined') {
      return { items: [], totalQuantity: 0, totalPrice: 0 };
    }

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        return { items: [], totalQuantity: 0, totalPrice: 0 };
      }

      const cart = JSON.parse(stored) as Cart;
      return {
        items: cart.items || [],
        totalQuantity: cart.totalQuantity || 0,
        totalPrice: cart.totalPrice || 0,
      };
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return { items: [], totalQuantity: 0, totalPrice: 0 };
    }
  },

  // Save cart to localStorage
  saveCart(cart: Cart): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  // Calculate totals from items
  calculateTotals(items: CartItem[], itemsMap?: Map<string, Item>): {
    totalQuantity: number;
    totalPrice: number;
  } {
    let totalQuantity = 0;
    let totalPrice = 0;

    items.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;

      // If we have item data, use it for price calculation
      if (cartItem.item) {
        totalPrice += cartItem.item.price * cartItem.quantity;
      } else if (itemsMap && itemsMap.has(cartItem.itemId)) {
        const item = itemsMap.get(cartItem.itemId)!;
        totalPrice += item.price * cartItem.quantity;
      }
    });

    return { totalQuantity, totalPrice };
  },

  // Add item to cart (increase quantity if exists)
  addItem(
    currentItems: CartItem[],
    itemId: string,
    quantity: number,
    item?: Item,
  ): CartItem[] {
    const existingIndex = currentItems.findIndex(
      (ci) => ci.itemId === itemId,
    );

    if (existingIndex >= 0) {
      // Increase quantity
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
        item: item || updated[existingIndex].item,
      };
      return updated;
    } else {
      // Add new item
      return [
        ...currentItems,
        {
          itemId,
          quantity,
          item,
        },
      ];
    }
  },

  // Update item quantity (remove if quantity is 0)
  updateItemQuantity(
    currentItems: CartItem[],
    itemId: string,
    quantity: number,
  ): CartItem[] {
    if (quantity <= 0) {
      return currentItems.filter((ci) => ci.itemId !== itemId);
    }

    return currentItems.map((ci) =>
      ci.itemId === itemId ? { ...ci, quantity } : ci,
    );
  },

  // Remove item from cart
  removeItem(currentItems: CartItem[], itemId: string): CartItem[] {
    return currentItems.filter((ci) => ci.itemId !== itemId);
  },

  // Clear cart
  clearCart(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(CART_STORAGE_KEY);
  },
};

