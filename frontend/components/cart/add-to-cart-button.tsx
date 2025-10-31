'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { cartActions } from '@/lib/store';
import { useCheckStockMutation } from '@/lib/store/cart-api';
import { Item } from '@/lib/types';
import { stockUtils } from '@/lib/utils/stock-utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  item: Item;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  item,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [checkStock, { isLoading }] = useCheckStockMutation();

  const existingCartItem = cartItems.find((ci) => ci.itemId === item.id);
  const currentQuantity = existingCartItem?.quantity || 0;
  const requestedQuantity = currentQuantity + quantity;

  const handleAddToCart = async () => {
    if (!stockUtils.isInStock(item)) {
      toast.error('This item is out of stock');
      return;
    }

    try {
      // Check stock availability
      const stockCheck = await checkStock({
        itemId: item.id,
        quantity: requestedQuantity,
      }).unwrap();

      if (!stockCheck.available) {
        toast.error(
          `Only ${stockCheck.availableStock} available in stock. Requested: ${requestedQuantity}`,
        );
        return;
      }

      // Add to cart
      dispatch(
        cartActions.addItem({
          itemId: item.id,
          quantity,
          item,
        }),
      );

      toast.success(`Added ${quantity} ${item.name} to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
      console.error('Add to cart error:', error);
    }
  };

  const isDisabled =
    !stockUtils.isInStock(item) ||
    !stockUtils.isQuantityAvailable(item, requestedQuantity) ||
    isLoading;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking...
        </>
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
}

