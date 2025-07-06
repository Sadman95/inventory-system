// src/modules/product/product.model.ts

import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>({
	material: {
		type: Number,
		required: [true, "Material is required"],
		trim: true,
	},
	barcode: {
		type: String,
		required: [true, "Barcode is required"],
		unique: true,
		trim: true,
	},
	description: {
		type: String,
		required: [true, "Description is required"],
		trim: true,
	},
	categoryId: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	addedAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export const Product = model<IProduct>("Product", productSchema);
