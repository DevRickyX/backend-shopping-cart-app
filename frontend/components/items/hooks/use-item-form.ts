import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { itemSchema, ItemFormData } from '../schemas/item-schema';
import { Item } from '@/lib/types';

interface UseItemFormProps {
  item?: Item;
  onSubmit: (data: ItemFormData) => Promise<void>;
}

export const useItemForm = ({ item, onSubmit }: UseItemFormProps) => {
  const isEditing = !!item;

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: item?.type || 'product',
      name: item?.name || '',
      description: item?.description ?? '',
      price: item?.price || 0,
      thumbnail: item?.thumbnail || '',
      stock: item?.stock || 0,
      category: item?.type === 'product' ? item.category || '' : '',
      eventDate:
        item?.type === 'event' && item.eventDate
          ? new Date(item.eventDate).toISOString().split('T')[0]
          : '',
      location: item?.type === 'event' ? item.location || '' : '',
      capacity: item?.type === 'event' ? item.capacity || undefined : undefined,
      startTime: item?.type === 'event' ? item.startTime || '' : '',
      endTime: item?.type === 'event' ? item.endTime || '' : '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Trigger validation on mount for edit mode
  useEffect(() => {
    if (isEditing && item) {
      form.trigger();
    }
  }, [isEditing, item, form]);

  return {
    form,
    isEditing,
    handleSubmit,
  };
};

