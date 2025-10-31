'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Item, SortConfig, BaseItem } from '@/lib/types';
import AddToCartButton from '../cart/add-to-cart-button';
import { stockUtils } from '@/lib/utils/stock-utils';

interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onSort?: (config: SortConfig) => void;
  sortConfig?: SortConfig | null;
  loading?: boolean;
}

export default function ItemTable({
  items,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
  loading,
}: ItemTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field: keyof BaseItem) => {
    if (!onSort) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    onSort({ field, direction });
  };

  const getSortIcon = (field: keyof BaseItem) => {
    if (sortConfig?.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No items found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-8 p-0"
                >
                  Name
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('price')}
                  className="h-8 p-0"
                >
                  Price
                  {getSortIcon('price')}
                </Button>
              </TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span className="capitalize">{item.type}</span>
                  {item.type === 'product' && item.category && (
                    <span className="text-muted-foreground ml-2">
                      • {item.category}
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <span
                    className={
                      stockUtils.getStockStatus(item) === 'out_of_stock'
                        ? 'text-destructive'
                        : stockUtils.getStockStatus(item) === 'low_stock'
                          ? 'text-orange-500'
                          : 'text-green-600'
                    }
                  >
                    {stockUtils.getStockLabel(item)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AddToCartButton item={item} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
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
  );
}

