"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/products/product-form";
import { useProducts } from "@/hooks/use-products";
import { CreateProductDto } from "@/lib/types";

export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct: handleCreateProduct, isCreating } = useProducts();

  const handleSubmit = async (data: CreateProductDto) => {
    try {
      await handleCreateProduct(data);
      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      // Error toast is already handled in the hook
    }
  };

  const handleCancel = () => {
    router.push("/products");
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Crear producto</h1>
        </div>
      </div>

      {/* Product Form */}
      <div className="max-w-2xl">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isCreating}
        />
      </div>
    </div>
  );
}
