import httpStatus from "http-status";
import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import {
	createCategorySchema,
	updateCategorySchema,
} from "./category.validation";
import mongoose from "mongoose";
import catchAsync from "../../../shared/catch-async";
import ApiError from "../../../errors/api-error";
import sendResponse from "../../../shared/send-response";
import { ICategory } from "./category.interface";
import { ResponseStatus } from "../../../enums";

/**
 * CategoryController handles all category-related operations
 * such as creating, retrieving, updating, and deleting categories.
 */
export const CategoryController = {
	/**
	 * Create a new category
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	createCategory: catchAsync(async (req: Request, res: Response) => {
		const payload = req.body;

		const existCategory = await CategoryService.getSingleCategory({
			name: payload.name,
		});
		if (existCategory) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");
		}
		await CategoryService.createCategory(payload);

		sendResponse<ICategory[]>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.CREATED,
			success: true,
		});
	}),

	/**
	 * Get all categories
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	getAllCategories: catchAsync(async (req: Request, res: Response) => {
		const categories = await CategoryService.getAllCategories();

		sendResponse<ICategory[]>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.CREATED,
			success: true,
			data: categories,
		});
	}),

	/**
	 * Update a category by ID
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	updateCategory: catchAsync(async (req: Request, res: Response) => {
		const id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Category ID");
		}
		const payload = req.body;
		const updatedCategory = await CategoryService.updateCategory(id, payload);
		if (!updatedCategory) {
			throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
		}
		sendResponse<ICategory>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.OK,
			success: true,
			data: updatedCategory,
		});
	}),

	/**
	 * Delete a category by ID
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	deleteCategory: catchAsync(async (req: Request, res: Response) => {
		const id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Category ID");
		}
		await CategoryService.deleteCategory(id);
		sendResponse(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.OK,
			success: true,
			message: "Category deleted successfully",
		});
	}),
};
