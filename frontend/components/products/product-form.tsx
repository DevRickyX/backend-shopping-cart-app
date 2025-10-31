"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductFormData } from "./schemas/product-schema";
import { useProductForm } from "./hooks/use-product-form";
import { PriceInput } from "./components/price-input";
import { CategorySelect } from "./components/category-select";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading,
}: ProductFormProps) {
  const { form, isEditing, handleSubmit } = useProductForm({
    product,
    onSubmit,
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar producto" : "Crear nuevo producto"}
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
              name="nombre"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Tractor John Deere 5075E"
                      {...field}
                      className={fieldState.error ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción del producto (opcional)"
                      {...field}
                      className={fieldState.error ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceInput form={form} />
              <CategorySelect form={form} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"} Producto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
