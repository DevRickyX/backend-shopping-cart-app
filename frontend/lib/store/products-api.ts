import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, CreateProductDto, UpdateProductDto } from "../types";

// Base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/products`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<Product[], void>({
      query: () => "",
      providesTags: ["Product"],
    }),

    // Get single product by ID
    getProduct: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // Create new product
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (newProduct) => ({
        url: "",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update existing product
    updateProduct: builder.mutation<
      Product,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        "Product",
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
