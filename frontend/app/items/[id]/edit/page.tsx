'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemForm from '@/components/items/item-form';
import { useItems } from '@/hooks/use-items';
import { useGetItemQuery } from '@/lib/store/items-api';
import { UpdateItemDto } from '@/lib/types';
import { ItemFormData } from '@/components/items/schemas/item-schema';
import LoadingSpinner from '@/components/common/loading';
import ErrorMessage from '@/components/common/error-message';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const { updateItem: handleUpdateItem, isUpdating } = useItems();

  const {
    data: item,
    isLoading,
    error,
  } = useGetItemQuery(itemId, {
    skip: !itemId,
  });

  const handleSubmit = async (data: ItemFormData) => {
    if (!item) return;

    try {
      const updateDto: UpdateItemDto = {
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
      await handleUpdateItem(itemId, updateDto);
      router.push('/items');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancel = () => {
    router.push('/items');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Error loading item"
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-0">
      <div className="flex items-start sm:items-center gap-4">
        <Link href="/items">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Item</h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <ItemForm
          item={item}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isUpdating}
        />
      </div>
    </div>
  );
}

