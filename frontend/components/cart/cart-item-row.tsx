'use client';

import React from 'react';
import { Item } from '@/lib/types';
import QuantityControl from './quantity-control';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { cartActions } from '@/lib/store';
import { toast } from 'sonner';
import Image from 'next/image';

interface CartItemRowProps {
  itemId: string;
  item: Item;
  quantity: number;
}

export default function CartItemRow({
  itemId,
  item,
  quantity,
}: CartItemRowProps) {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(cartActions.removeItem(itemId));
    toast.success(`${item.name} removed from cart`);
  };

  const subtotal = item.price * quantity;
  const isProduct = item.type === 'product';

  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="flex items-center gap-4">
          {item.thumbnail && (
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <Image
                src={item.thumbnail}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">
              {isProduct ? `Product` : 'Event'}
              {isProduct && item.category && ` • ${item.category}`}
              {!isProduct && item.location && ` • ${item.location}`}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-center">
        <QuantityControl
          itemId={itemId}
          item={item}
          currentQuantity={quantity}
        />
      </td>
      <td className="p-4 text-right">
        {new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(item.price)}
      </td>
      <td className="p-4 text-right font-medium">
        {new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(subtotal)}
      </td>
      <td className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

