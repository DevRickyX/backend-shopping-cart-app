import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CheckStockDto,
  CheckStockResponse,
  CartValidationDto,
  CartValidationResponse,
} from '../types';

// Base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/cart`,
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Check stock availability
    checkStock: builder.mutation<CheckStockResponse, CheckStockDto>({
      query: (data) => ({
        url: '/check-stock',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: unknown) => {
        // Handle wrapped response {data: CheckStockResponse} or direct CheckStockResponse
        if (response && typeof response === 'object' && response !== null && 'data' in response) {
          return (response as { data: CheckStockResponse }).data;
        }
        return response as CheckStockResponse;
      },
    }),

    // Validate cart
    validateCart: builder.mutation<
      CartValidationResponse,
      CartValidationDto
    >({
      query: (data) => ({
        url: '/validate',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: unknown) => {
        // Handle wrapped response {data: CartValidationResponse} or direct CartValidationResponse
        if (response && typeof response === 'object' && response !== null && 'data' in response) {
          return (response as { data: CartValidationResponse }).data;
        }
        return response as CartValidationResponse;
      },
    }),
  }),
});

// Export hooks
export const { useCheckStockMutation, useValidateCartMutation } = cartApi;

