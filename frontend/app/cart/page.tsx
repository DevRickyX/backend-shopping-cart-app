'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store';
import { cartActions } from '@/lib/store';
import CartSummary from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize cart from localStorage on mount
    dispatch(cartActions.initializeCart());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartSummary />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your purchase by proceeding to checkout
              </p>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

