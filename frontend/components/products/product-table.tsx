"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Product, SortConfig } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSort?: (config: SortConfig) => void;
  sortConfig?: SortConfig | null;
  loading?: boolean;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
  loading,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field: keyof Product) => {
    if (!onSort) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.field === field && sortConfig.direction === "asc") {
      direction = "desc";
    }

    onSort({ field, direction });
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortConfig?.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Productos ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("nombre")}
                      className="p-0 font-semibold text-left"
                    >
                      Nombre
                      {getSortIcon("nombre")}
                    </Button>
                  </TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("precio")}
                      className="p-0 font-semibold text-left"
                    >
                      Precio
                      {getSortIcon("precio")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("categoria")}
                      className="p-0 font-semibold text-left"
                    >
                      Categoría
                      {getSortIcon("categoria")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.nombre}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {product.descripcion || "-"}
                    </TableCell>
                    <TableCell>{formatPrice(product.precio)}</TableCell>
                    <TableCell>{product.categoria || ""}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Productos ({products.length})
          </h2>
        </div>
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{product.nombre}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {product.descripcion && (
                  <p className="text-gray-600 text-sm">{product.descripcion}</p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-green-600">
                    {formatPrice(product.precio)}
                  </span>
                  {product.categoria && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {product.categoria}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
