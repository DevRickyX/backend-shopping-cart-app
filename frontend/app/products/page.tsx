"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ProductTable from "@/components/products/product-table";
import DeleteDialog from "@/components/products/delete-dialog";
import LoadingSpinner from "@/components/common/loading";
import ErrorMessage from "@/components/common/error-message";
import CustomPagination from "@/components/common/pagination";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    products: paginatedProducts,
    allProducts: filteredProducts,
    pagination,
    isLoading,
    error,
    searchQuery,
    sortConfig,
    selectedProduct,
    setSearchQuery,
    setSortConfig,
    setSelectedProduct,
    setCurrentPage,
    deleteProduct: handleDeleteProduct,
    isDeleting,
  } = useProducts();

  const selectProduct = (product: Product) => setSelectedProduct(product);
  const clearSelectedProduct = () => setSelectedProduct(null);

  const handleEdit = (product: { id: string }) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDelete = (id: string) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (product) {
      selectProduct(product);
    }
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      await handleDeleteProduct(selectedProduct.id);
      clearSelectedProduct();
    }
  };

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error if authentication failed (only after loading is complete)
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Error de autenticación"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Error al cargar los productos"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, descripción o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-10 rounded-full text-sm"
          />
        </div>
      </div>

      {/* Products Table */}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No se encontraron productos"
              : "No hay productos disponibles"}
          </p>
          {!searchQuery && (
            <Link href="/products/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Producto
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={setSortConfig}
          sortConfig={sortConfig}
          loading={isLoading}
        />
      )}

      {/* Pagination */}
      {pagination && (
        <CustomPagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={!!selectedProduct}
        onClose={clearSelectedProduct}
        onConfirm={confirmDelete}
        productName={selectedProduct?.nombre || ""}
        loading={isDeleting}
      />
    </div>
  );
}
