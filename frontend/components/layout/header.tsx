'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import CartIcon from '../cart/cart-icon';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white border-dashed">
      <div className="container mx-auto py-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="text-xl font-bold">Shopping Cart App</div>
          </Link>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant={pathname === '/items' ? 'default' : 'outline'}
            >
              <Link href="/items">Items</Link>
            </Button>
            <Button
              variant={pathname === '/items/create' ? 'default' : 'outline'}
            >
              <Link href="/items/create">Create Item</Link>
            </Button>
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}

