'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Item } from '@/lib/types';
import { ItemFormData } from './schemas/item-schema';
import { useItemForm } from './hooks/use-item-form';
import { PriceInput } from '../products/components/price-input';
import { CategorySelect } from '../products/components/category-select';

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}


export default function ItemForm({
  item,
  onSubmit,
  onCancel,
  loading,
}: ItemFormProps) {
  const { form, isEditing, handleSubmit } = useItemForm({
    item,
    onSubmit,
  });

  const itemType = form.watch('type');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Item' : 'Create New Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Item name"
                      {...field}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Item description (optional)"
                      {...field}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceInput form={form} />
              <FormField
                control={form.control}
                name="stock"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Stock *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                        className={fieldState.error ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            {itemType === 'product' && (
              <CategorySelect form={form} />
            )}

            {itemType === 'event' && (
              <>
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className={
                            fieldState.error ? 'border-destructive' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Event location"
                          {...field}
                          className={
                            fieldState.error ? 'border-destructive' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-medium" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value, 10) || undefined,
                              )
                            }
                            className={
                              fieldState.error ? 'border-destructive' : ''
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-sm font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className={
                              fieldState.error ? 'border-destructive' : ''
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-sm font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className={
                              fieldState.error ? 'border-destructive' : ''
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-sm font-medium" />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditing ? 'Update' : 'Create'} Item
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

