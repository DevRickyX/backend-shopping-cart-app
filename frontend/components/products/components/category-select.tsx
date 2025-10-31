import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ItemFormData } from "../../items/schemas/item-schema";
import {
  PRODUCT_CATEGORIES,
  NO_CATEGORY_VALUE,
  NO_CATEGORY_LABEL,
} from "../constants/product-categories";

interface CategorySelectProps {
  form: UseFormReturn<ItemFormData>;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value === NO_CATEGORY_VALUE ? undefined : value);
            }}
            value={field.value || NO_CATEGORY_VALUE}
          >
            <FormControl>
              <SelectTrigger
                className={`w-full ${
                  fieldState.error ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={NO_CATEGORY_VALUE}>
                {NO_CATEGORY_LABEL}
              </SelectItem>
              {PRODUCT_CATEGORIES.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-sm font-medium" />
        </FormItem>
      )}
    />
  );
};
