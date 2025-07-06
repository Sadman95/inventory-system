import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

router
	.post("/", CategoryController.createCategory)
	.get("/", CategoryController.getAllCategories)
	.patch("/:id", CategoryController.updateCategory)
	.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
