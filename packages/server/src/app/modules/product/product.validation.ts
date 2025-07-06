// src/modules/product/product.validation.ts

import { z } from "zod";
import mongoose from "mongoose";

// Validation for adding product
export const addProductSchema = z.object({
	body: z.object({
		barcode: z.string({
			required_error: "Barcode is required",
		}),
		material: z.number({
			required_error: "Material is required",
		}),
		description: z.string({
			required_error: "Description is required",
		}),
	}),
});

// Validation for updating product category
export const updateProductCategorySchema = z.object({
	body: z.object({
		barcode: z.string().optional(),
		material: z.number().optional(),
		description: z.string().optional(),
		category: z
			.string()
			.refine(
				(value) => {
					if (!mongoose.Types.ObjectId.isValid(value)) {
						throw new Error("Invalid category ID");
					}
					return true;
				},
				{
					message: "Category ID must be a valid ObjectId",
				}
			)
			.optional(),
	}),
});
