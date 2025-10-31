import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { productSchema, ProductFormData } from "../schemas/product-schema";
import { Product } from "@/lib/types";
import { NO_CATEGORY_VALUE } from "../constants/product-categories";

interface UseProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export const useProductForm = ({ product, onSubmit }: UseProductFormProps) => {
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: product?.nombre || "",
      descripcion: product?.descripcion || "",
      precio: product?.precio || 0,
      categoria: product?.categoria || NO_CATEGORY_VALUE,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Trigger validation on mount for edit mode
  useEffect(() => {
    if (isEditing && product) {
      form.trigger();
    }
  }, [isEditing, product, form]);

  return {
    form,
    isEditing,
    handleSubmit,
  };
}; 