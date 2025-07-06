import httpStatus from "http-status";
// src/modules/product/product.controller.ts

import { Request, Response } from "express";
import { ProductService } from "./product.service";
import sendResponse from "../../../shared/send-response";
import { ResponseStatus } from "../../../enums";
import { IProduct } from "./product.interface";
import catchAsync from "../../../shared/catch-async";

/*
 * ProductController handles all product-related operations
 * such as adding, retrieving, and updating products.
 */
export const ProductController = {
	/*    * Add a new product
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	addProduct: catchAsync(async (req: Request, res: Response) => {
		const payload = req.body;

		await ProductService.addProduct(payload);

		sendResponse<IProduct>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.CREATED,
			success: true,
			message: "Product added successfully",
		});
	}),

	/*    * Get all products
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	getAllProducts: catchAsync(async (req: Request, res: Response) => {
		const { category } = req.query;
		const products = await ProductService.getAllProducts(category as string);

		sendResponse<IProduct[]>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.OK,
			success: true,
			data: products,
		});
	}),

	/*    * Update product category
	 * @param req - Express request object
	 * @param res - Express response object
	 */
	updateProductCategory: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params;
		const payload = req.body;

		const product = await ProductService.updateProductCategory(id, payload);

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		sendResponse<IProduct>(res, {
			status: ResponseStatus.SUCCESS,
			statusCode: httpStatus.OK,
			success: true,
			message: "Product updated successfully",
		});
	}),
};
