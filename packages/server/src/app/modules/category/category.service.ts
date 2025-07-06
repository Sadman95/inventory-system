import { ICategory } from "./category.interface";
import { Category } from "./category.model";

/* * Category Service
 * This service handles all operations related to categories,
 * such as creating, retrieving, updating, and deleting categories.
 * It interacts with the Category model to perform database operations.
 */
export const CategoryService = {
	/**
	 * Create a new category
	 * @param payload - Category data
	 * @returns Created category
	 */
	createCategory: async (payload: { name: string }) => {
		const category = await Category.create(payload);
		return category;
	},

	/**
	 * Get all categories
	 * @returns List of categories
	 */
	getAllCategories: async () => {
		const categories = await Category.aggregate([
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "categoryId",
					as: "products",
				},
			},
			{
				$addFields: {
					productCount: { $size: "$products" },
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);
		return categories;
	},

	/**
	 * Get a single category by name
	 * @param name - Category name
	 * @returns Category object or null if not found
	 */
	getSingleCategory: async <K extends keyof ICategory>(
		prop: Record<K, ICategory[K]>
	) => {
		const category = await Category.findOne(prop);
		return category;
	},

	/**
	 * Update a category by ID
	 * @param id - Category ID
	 * @param payload - Updated category data
	 * @returns Updated category object or null if not found
	 */
	updateCategory: async (id: string, payload: { name: string }) => {
		const updated = await Category.findByIdAndUpdate(id, payload, {
			new: true,
		});
		return updated;
	},

	/**
	 * Delete a category by ID
	 * @param id - Category ID
	 */
	deleteCategory: async (id: string) => {
		await Category.findByIdAndDelete(id);
	},
};
