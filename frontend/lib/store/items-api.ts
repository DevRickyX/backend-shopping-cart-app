import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Item, CreateItemDto, UpdateItemDto } from '../types';

// Base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/items`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    // Get all items
    getItems: builder.query<Item[], void>({
      query: () => '',
      providesTags: ['Item'],
      transformResponse: (response: unknown) => {
        // Handle wrapped response {data: Item[]} or direct Item[]
        if (response && typeof response === 'object' && response !== null && 'data' in response && Array.isArray((response as { data: unknown }).data)) {
          return (response as { data: Item[] }).data;
        }
        if (Array.isArray(response)) {
          return response as Item[];
        }
        // If somehow it's not an array, return empty array
        console.warn('Items response is not an array:', response);
        return [];
      },
    }),

    // Get single item by ID
    getItem: builder.query<Item, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Item', id }],
      transformResponse: (response: unknown) => {
        // Handle wrapped response {data: Item} or direct Item
        if (response && typeof response === 'object' && response !== null && 'data' in response) {
          return (response as { data: Item }).data;
        }
        return response as Item;
      },
    }),

    // Create new item
    createItem: builder.mutation<Item, CreateItemDto>({
      query: (newItem) => ({
        url: '',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['Item'],
    }),

    // Update existing item
    updateItem: builder.mutation<Item, { id: string; data: UpdateItemDto }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Item', id },
        'Item',
      ],
    }),

    // Delete item
    deleteItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Item', id },
        'Item',
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;

