import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  useGetProductsQuery,
  // useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../lib/store/products-api";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { productsActions } from "../lib/store/products-slice";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  SortConfig,
} from "../lib/types";

export const useProducts = () => {
  const dispatch = useAppDispatch();

  // Get local state
  const { selectedProduct, filters, sortConfig, searchQuery, pagination } =
    useAppSelector((state) => state.products);

  // Get auth state
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // RTK Query hooks - only fetch when authenticated
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.nombre.toLowerCase().includes(query) ||
          product.descripcion?.toLowerCase().includes(query) ||
          product.categoria?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.categoria) {
      result = result.filter(
        (product) => product.categoria === filters.categoria
      );
    }

    if (filters.priceMin !== undefined) {
      result = result.filter((product) => product.precio >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      result = result.filter((product) => product.precio <= filters.priceMax!);
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchQuery, filters, sortConfig]);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination meta when filtered products change
  const paginationMeta = useMemo(() => {
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    return {
      currentPage: pagination.currentPage,
      totalPages,
      totalItems,
      itemsPerPage: pagination.itemsPerPage,
      hasNext: pagination.currentPage < totalPages,
      hasPrevious: pagination.currentPage > 1,
    };
  }, [
    filteredProducts.length,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  // Action creators
  const handleCreateProduct = useCallback(
    async (productData: CreateProductDto) => {
      try {
        // Convert "no-category" to empty string for API
        const apiData = {
          ...productData,
          categoria:
            productData.categoria === "no-category"
              ? ""
              : productData.categoria,
        };

        // Optimistic update
        const tempProduct: Product = {
          id: `temp-${Date.now()}`,
          ...productData,
        };
        dispatch(productsActions.optimisticAddProduct(tempProduct));

        const result = await createProduct(apiData).unwrap();

        // Remove optimistic update
        dispatch(productsActions.optimisticDeleteProduct(tempProduct.id));

        toast.success("Producto creado exitosamente");
        return result;
      } catch (error: any) {
        toast.error(error?.message || "Error al crear el producto");
        throw error;
      }
    },
    [createProduct, dispatch]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, productData: UpdateProductDto) => {
      try {
        // Convert "no-category" to empty string for API
        const apiData = {
          ...productData,
          categoria:
            productData.categoria === "no-category"
              ? ""
              : productData.categoria,
        };

        const result = await updateProduct({ id, data: apiData }).unwrap();
        toast.success("Producto actualizado exitosamente");
        return result;
      } catch (error: any) {
        toast.error(error?.message || "Error al actualizar el producto");
        throw error;
      }
    },
    [updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Producto eliminado exitosamente");

        // Clear selected product
        if (selectedProduct?.id === id) {
          dispatch(productsActions.setSelectedProduct(null));
        }
      } catch (error: any) {
        toast.error(error?.message || "Error al eliminar el producto");
        throw error;
      }
    },
    [deleteProduct, selectedProduct?.id, dispatch]
  );

  // Filter and search actions
  const setFilters = useCallback(
    (filters: ProductFilters) => {
      dispatch(productsActions.setFilters(filters));
      dispatch(productsActions.setCurrentPage(1));
    },
    [dispatch]
  );

  const updateFilter = useCallback(
    (key: keyof ProductFilters, value: string | number | undefined) => {
      dispatch(productsActions.updateFilter({ key, value }));
      dispatch(productsActions.setCurrentPage(1));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(productsActions.clearFilters());
    dispatch(productsActions.setCurrentPage(1));
  }, [dispatch]);

  const setSearchQuery = useCallback(
    (query: string) => {
      dispatch(productsActions.setSearchQuery(query));
      dispatch(productsActions.setCurrentPage(1));
    },
    [dispatch]
  );

  const setSortConfig = useCallback(
    (config: SortConfig | null) => {
      dispatch(productsActions.setSortConfig(config));
    },
    [dispatch]
  );

  // Pagination actions
  const setCurrentPage = useCallback(
    (page: number) => {
      dispatch(productsActions.setCurrentPage(page));
    },
    [dispatch]
  );

  const setSelectedProduct = useCallback(
    (product: Product | null) => {
      dispatch(productsActions.setSelectedProduct(product));
    },
    [dispatch]
  );

  return {
    // Data
    products: paginatedProducts,
    allProducts: filteredProducts,
    selectedProduct,
    pagination: paginationMeta,
    filters,
    sortConfig,
    searchQuery,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Error
    error,

    // Actions
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    refetch,

    // Filter and search
    setFilters,
    updateFilter,
    clearFilters,
    setSearchQuery,
    setSortConfig,

    // Pagination
    setCurrentPage,

    // Selection
    setSelectedProduct,
  };
};

export default useProducts;
