'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store';
import { cartUtils } from '@/lib/utils/cart-utils';

export default function CartIcon() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalQuantity = cartUtils.calculateTotals(cartItems).totalQuantity;

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingCart className="h-6 w-6" />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </span>
      )}
    </Link>
  );
}

