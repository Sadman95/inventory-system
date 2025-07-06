import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { ProductRoutes } from "../modules/product/product.route";

export type IRoute = {
	path: string;
	router: Router;
};

export const routes: IRoute[] = [
	{
		path: "/auth",
		router: AuthRoutes,
	},
	{
		path: "/products",
		router: ProductRoutes,
	},
	{
		path: "/categories",
		router: CategoryRoutes,
	},
];
