import { z } from "zod";

export const productSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional()
    .refine((val) => !val || val.trim().length >= 0, {
      message: "La descripción no puede estar vacía si se proporciona",
    }),
  precio: z
    .number({ message: "El precio debe ser mayor a $0" })
    .min(1, "El precio debe ser mayor a $0"),
  categoria: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
