'use client';

import React from 'react';
import { useAppSelector } from '@/lib/store';
import { cartUtils } from '@/lib/utils/cart-utils';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CartItemRow from './cart-item-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetItemsQuery } from '@/lib/store/items-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Item } from '@/lib/types';

export default function CartSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { data: items, isLoading } = useGetItemsQuery();

  // Create a map of items for quick lookup
  const itemsMap = new Map(items?.map((item) => [item.id, item]) || []);

  // Enhance cart items with item data
  const enhancedCartItems = cartItems
    .map((cartItem) => {
      const item = itemsMap.get(cartItem.itemId) || cartItem.item;
      return item ? { ...cartItem, item } : null;
    })
    .filter((cartItem): cartItem is { itemId: string; quantity: number; item: Item } => 
      cartItem !== null && cartItem.item !== undefined
    );

  const { totalQuantity, totalPrice } = cartUtils.calculateTotals(
    enhancedCartItems,
    itemsMap,
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (enhancedCartItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enhancedCartItems.map((cartItem) => (
              <CartItemRow
                key={cartItem.itemId}
                itemId={cartItem.itemId}
                item={cartItem.item}
                quantity={cartItem.quantity}
              />
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-between text-lg">
            <span>Total Quantity:</span>
            <span className="font-medium">{totalQuantity}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total Price:</span>
            <span>
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

