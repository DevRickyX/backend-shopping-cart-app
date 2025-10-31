import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from '../lib/store/items-api';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { itemsActions } from '../lib/store/items-slice';
import {
  Item,
  CreateItemDto,
  UpdateItemDto,
  ItemFilters,
  SortConfig,
} from '../lib/types';

export const useItems = () => {
  const dispatch = useAppDispatch();

  const { selectedItem, filters, sortConfig, searchQuery, pagination } =
    useAppSelector((state) => state.items);

  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useGetItemsQuery(undefined, {
    // Skip query if not authenticated OR if token is not yet available
    skip: !isAuthenticated || !token,
  });

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          (item.type === 'product' && item.category?.toLowerCase().includes(query)),
      );
    }

    if (filters.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters.category) {
      result = result.filter(
        (item) => item.type === 'product' && item.category === filters.category,
      );
    }

    if (filters.priceMin !== undefined) {
      result = result.filter((item) => item.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      result = result.filter((item) => item.price <= filters.priceMax!);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [items, searchQuery, filters, sortConfig]);

  const paginatedItems = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, pagination]);

  const handleCreateItem = useCallback(
    async (data: CreateItemDto) => {
      try {
        await createItem(data).unwrap();
        toast.success('Item created successfully');
        dispatch(itemsActions.setCurrentPage(1));
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to create item');
        throw error;
      }
    },
    [createItem, dispatch],
  );

  const handleUpdateItem = useCallback(
    async (id: string, data: UpdateItemDto) => {
      try {
        await updateItem({ id, data }).unwrap();
        toast.success('Item updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update item');
        throw error;
      }
    },
    [updateItem],
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      try {
        await deleteItem(id).unwrap();
        toast.success('Item deleted successfully');
        if (selectedItem?.id === id) {
          dispatch(itemsActions.setSelectedItem(null));
        }
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete item');
        throw error;
      }
    },
    [deleteItem, dispatch, selectedItem],
  );

  return {
    items: paginatedItems,
    allItems: filteredItems,
    pagination: {
      ...pagination,
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / pagination.itemsPerPage),
      hasNext: pagination.currentPage < Math.ceil(filteredItems.length / pagination.itemsPerPage),
      hasPrevious: pagination.currentPage > 1,
    },
    isLoading,
    error,
    searchQuery,
    sortConfig,
    selectedItem,
    setSearchQuery: (query: string) =>
      dispatch(itemsActions.setSearchQuery(query)),
    setSortConfig: (config: SortConfig | null) =>
      dispatch(itemsActions.setSortConfig(config)),
    setSelectedItem: (item: Item | null) =>
      dispatch(itemsActions.setSelectedItem(item)),
    setCurrentPage: (page: number) =>
      dispatch(itemsActions.setCurrentPage(page)),
    createItem: handleCreateItem,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  };
};

