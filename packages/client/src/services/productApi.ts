import axios from "axios";
import { Product, ProductApiResponse } from "../types";

const PRODUCT_BASE_URL = "https://products-test-aci.onrender.com";
const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/v1`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

export const productApi = {
	// Fetch product by barcode
	fetchProductByBarcode: async (
		barcode: string
	): Promise<ProductApiResponse> => {
		try {
			const response = await apiClient.get(
				`${PRODUCT_BASE_URL}/product/${barcode}`
			);
			return response.data.product;
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 404) {
					throw new Error("Product not found for this barcode");
				}
				throw new Error(
					`Failed to fetch product data: ${error.response.statusText}`
				);
			}
			throw new Error("Network error while fetching product data");
		}
	},

	// Add product
	addProduct: async (
		payload: Partial<Product>
	): Promise<ProductApiResponse> => {
		try {
			const response = await apiClient.post(
				`${API_BASE_URL}/products`,
				payload
			);
			return response.data;
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Failed to add product: ${error.response.statusText}`);
			}
			throw new Error("Network error while adding product");
		}
	},

	// Update product
	updateProduct: async (
		id: string,
		payload: Partial<Product>
	): Promise<ProductApiResponse> => {
		try {
			const response = await apiClient.patch(
				`${API_BASE_URL}/products/${id}`,
				payload
			);
			return response.data;
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Failed to update product: ${error.response.statusText}`
				);
			}
			throw new Error("Network error while updating product");
		}
	},
};

// Query keys for consistent caching
export const productQueryKeys = {
	all: ["products"] as const,
	byBarcode: (barcode: string) =>
		[...productQueryKeys.all, "barcode", barcode] as const,
};
