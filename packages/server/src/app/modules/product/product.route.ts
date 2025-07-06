// src/modules/product/product.route.ts

import express from "express";
import { ProductController } from "./product.controller";
import validateRequest from "../../middlewares/validate-request";
import {
	addProductSchema,
	updateProductCategorySchema,
} from "./product.validation";

const router = express.Router();

router
	.post("/", validateRequest(addProductSchema), ProductController.addProduct)
	.get("/", ProductController.getAllProducts)
	.patch(
		"/:id",
		validateRequest(updateProductCategorySchema),
		ProductController.updateProductCategory
	);

export const ProductRoutes = router;
