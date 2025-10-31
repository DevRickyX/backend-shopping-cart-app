'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { cartActions } from '@/lib/store';
import { Item } from '@/lib/types';
import { toast } from 'sonner';

interface QuantityControlProps {
  itemId: string;
  item: Item;
  currentQuantity: number;
  maxQuantity?: number;
}

export default function QuantityControl({
  itemId,
  item,
  currentQuantity,
  maxQuantity,
}: QuantityControlProps) {
  const dispatch = useAppDispatch();

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      dispatch(
        cartActions.updateItemQuantity({
          itemId,
          quantity: currentQuantity - 1,
        }),
      );
    } else {
      handleRemove();
    }
  };

  const handleIncrease = () => {
    const newQuantity = currentQuantity + 1;
    const max = maxQuantity ?? item.stock;

    if (newQuantity > max) {
      toast.error(`Only ${max} available in stock`);
      return;
    }

    dispatch(
      cartActions.updateItemQuantity({
        itemId,
        quantity: newQuantity,
      }),
    );
  };

  const handleRemove = () => {
    dispatch(cartActions.removeItem(itemId));
    toast.success(`${item.name} removed from cart`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
      return;
    }

    const max = maxQuantity ?? item.stock;
    if (value > max) {
      toast.error(`Only ${max} available in stock`);
      return;
    }

    if (value === 0) {
      handleRemove();
    } else {
      dispatch(
        cartActions.updateItemQuantity({
          itemId,
          quantity: value,
        }),
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        min="0"
        max={maxQuantity ?? item.stock}
        value={currentQuantity}
        onChange={handleQuantityChange}
        className="w-16 text-center"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={currentQuantity >= (maxQuantity ?? item.stock)}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

