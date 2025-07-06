import mongoose, { Document } from "mongoose";
// src/modules/product/product.service.ts

import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { Category } from "../category/category.model";

/**
 * ProductService handles all product-related operations
 * such as adding, retrieving, and updating products.
 */
// It interacts with the Product model to perform database operations.
export const ProductService = {
	/*  * Add a new product
	 * @param payload - Product data
	 * @returns Created product
	 */
	async addProduct(payload: Partial<IProduct>): Promise<IProduct> {
		const session = await mongoose.startSession();

		try {
			session.startTransaction();

			// Check for existing 'Uncategorized' category
			let category = await Category.findOne({ name: "Uncategorized" }).session(
				session
			);

			// Create category if not exists
			if (!category) {
				category = await Category.create([{ name: "Uncategorized" }], {
					session,
				}).then((res) => res[0]);
			}

			// Assign category ID to product
			payload.categoryId = category!._id as mongoose.Types.ObjectId;

			// Save product
			const createdProduct = await Product.create([payload], {
				session,
			}).then((res) => res[0]);

			await session.commitTransaction();
			session.endSession();

			return createdProduct;
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	},

	/*  * Get all products
	 * @param category - Optional category filter
	 * @returns List of products
	 */
	async getAllProducts(category?: string): Promise<IProduct[]> {
		const filter = category ? { category } : {};
		return Product.find(filter).sort({ addedAt: -1 });
	},

	/*  * Update product category
	 * @param productId - Product ID
	 * @param newCategory - New category to set
	 * @returns Updated product or null if not found
	 */
	async updateProductCategory(
		productId: string,
		payload: Partial<IProduct>
	): Promise<IProduct | null> {
		return Product.findByIdAndUpdate(productId, { ...payload }, { new: true });
	},
};
