'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ItemTable from '@/components/items/item-table';
import DeleteDialog from '@/components/products/delete-dialog';
import LoadingSpinner from '@/components/common/loading';
import ErrorMessage from '@/components/common/error-message';
import CustomPagination from '@/components/common/pagination';
import { useItems } from '@/hooks/use-items';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Item } from '@/lib/types';

export default function ItemsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    items: paginatedItems,
    allItems: filteredItems,
    pagination,
    isLoading,
    error,
    searchQuery,
    sortConfig,
    selectedItem,
    setSearchQuery,
    setSortConfig,
    setSelectedItem,
    setCurrentPage,
    deleteItem: handleDeleteItem,
    isDeleting,
  } = useItems();

  const selectItem = (item: Item) => setSelectedItem(item);
  const clearSelectedItem = () => setSelectedItem(null);

  const handleEdit = (item: { id: string }) => {
    router.push(`/items/${item.id}/edit`);
  };

  const handleDelete = (id: string) => {
    const item = filteredItems.find((i) => i.id === id);
    if (item) {
      selectItem(item);
    }
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      await handleDeleteItem(selectedItem.id);
      clearSelectedItem();
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Authentication error"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Error loading items"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Items</h1>
        </div>

        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-10 rounded-full text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'No items found'
              : 'No items available'}
          </p>
          {!searchQuery && (
            <Link href="/items/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First Item
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ItemTable
          items={paginatedItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={setSortConfig}
          sortConfig={sortConfig}
          loading={isLoading}
        />
      )}

      {pagination && (
        <CustomPagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}

      <DeleteDialog
        isOpen={!!selectedItem}
        onClose={clearSelectedItem}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name || ''}
        loading={isDeleting}
      />
    </div>
  );
}

