import { z } from 'zod';

export const itemSchema = z
  .object({
    type: z.enum(['product', 'event']),
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(200, 'Name cannot exceed 200 characters'),
    description: z
      .string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional(),
    price: z
      .number({ message: 'Price must be greater than $0' })
      .min(0.01, 'Price must be greater than $0'),
    thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    stock: z
      .number({ message: 'Stock must be a number' })
      .min(0, 'Stock cannot be negative')
      .int('Stock must be an integer'),
    // Product-specific
    category: z.string().optional(),
    // Event-specific
    eventDate: z.string().optional(),
    location: z.string().max(200).optional(),
    capacity: z
      .number()
      .min(1, 'Capacity must be at least 1')
      .int('Capacity must be an integer')
      .optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'product') {
        return true; // Category is optional for products
      }
      return true; // Events don't require all fields
    },
    {
      message: 'Invalid field combination',
    },
  );

export type ItemFormData = z.infer<typeof itemSchema>;

