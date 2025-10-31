'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemForm from '@/components/items/item-form';
import { useItems } from '@/hooks/use-items';
import { CreateItemDto } from '@/lib/types';
import { ItemFormData } from '@/components/items/schemas/item-schema';

export default function CreateItemPage() {
  const router = useRouter();
  const { createItem: handleCreateItem, isCreating } = useItems();

  const handleSubmit = async (data: ItemFormData) => {
    try {
      const createDto: CreateItemDto = {
        type: data.type,
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        thumbnail: data.thumbnail || undefined,
        stock: data.stock,
        ...(data.type === 'product'
          ? { category: data.category }
          : {
              eventDate: data.eventDate,
              location: data.location,
              capacity: data.capacity,
              startTime: data.startTime,
              endTime: data.endTime,
            }),
      };
      await handleCreateItem(createDto);
      router.push('/items');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleCancel = () => {
    router.push('/items');
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-0">
      <div className="flex items-start sm:items-center gap-4">
        <Link href="/items">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Item</h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isCreating}
        />
      </div>
    </div>
  );
}

