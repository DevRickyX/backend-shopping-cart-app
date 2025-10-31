import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  formatCurrency,
  parseCurrency,
  isAllowedKeyCode,
} from "../utils/currency-utils";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../schemas/product-schema";

interface PriceInputProps {
  form: UseFormReturn<ProductFormData>;
}

export const PriceInput: React.FC<PriceInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="precio"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Precio *</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="$ 0"
              value={formatCurrency(field.value)}
              className={fieldState.error ? "border-destructive" : ""}
              onKeyDown={(e) => {
                if (!isAllowedKeyCode(e.keyCode, e.ctrlKey)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const rawValue = e.target.value;
                const numValue = parseCurrency(rawValue);
                field.onChange(numValue);
              }}
              onBlur={(e) => {
                const numValue = parseCurrency(e.target.value);
                if (numValue <= 0) {
                  field.onChange(0);
                }
              }}
              onFocus={(e) => {
                // Select all text when focusing
                e.target.select();
              }}
            />
          </FormControl>
          <FormMessage className="text-sm font-medium" />
        </FormItem>
      )}
    />
  );
};
