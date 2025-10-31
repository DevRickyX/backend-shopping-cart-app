"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/products/product-form";
import LoadingSpinner from "@/components/common/loading";
import ErrorMessage from "@/components/common/error-message";
import { useProducts } from "@/hooks/use-products";
import { UpdateProductDto, Product } from "@/lib/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const {
    allProducts: filteredProducts,
    updateProduct: handleUpdateProduct,
    isUpdating,
    isLoading,
    error,
  } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoading && filteredProducts.length > 0) {
      const foundProduct = filteredProducts.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setNotFound(true);
      }
    }
  }, [productId, filteredProducts, isLoading]);

  const handleSubmit = async (data: UpdateProductDto) => {
    try {
      await handleUpdateProduct(productId, data);
      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      // Error toast is already handled in the hook
    }
  };

  const handleCancel = () => {
    router.push("/products");
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message="Error al cargar el producto"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground">
            El producto que estás buscando no existe o ha sido eliminado.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Editar producto</h1>
          <p className="text-muted-foreground">
            Modifica la información de &quot;{product.nombre}&quot;
          </p>
        </div>
      </div>

      {/* Product Form */}
      <div className="max-w-2xl">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isUpdating}
        />
      </div>
    </div>
  );
}
