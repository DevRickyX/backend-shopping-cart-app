import { Item } from '../types';

export const stockUtils = {
  // Check if item is in stock
  isInStock(item: Item): boolean {
    return item.stock > 0;
  },

  // Check if requested quantity is available
  isQuantityAvailable(item: Item, requestedQuantity: number): boolean {
    return item.stock >= requestedQuantity;
  },

  // Get stock status text
  getStockStatus(item: Item): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (item.stock === 0) {
      return 'out_of_stock';
    }
    if (item.stock < 5) {
      return 'low_stock';
    }
    return 'in_stock';
  },

  // Get stock status label
  getStockLabel(item: Item): string {
    const status = this.getStockStatus(item);
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return `Low Stock (${item.stock} left)`;
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  },
};

