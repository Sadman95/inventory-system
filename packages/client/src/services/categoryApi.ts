import axios, { AxiosResponse } from "axios";
import { Category, CategoryApiResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api/v1/categories";
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

export const categoryApi = {
	fetchAllCategories: async (): Promise<
		AxiosResponse<CategoryApiResponse[]>
	> => {
		const res = await apiClient.get(API_BASE_URL);
		return res.data.data;
	},

	createCategory: async (
		payload: Pick<Category, "name">
	): Promise<AxiosResponse<CategoryApiResponse>> => {
		const res = await apiClient.post(API_BASE_URL, payload);
		return res.data;
	},

	updateCategory: async (
		id: string,
		payload: Pick<Category, "name">
	): Promise<AxiosResponse<CategoryApiResponse>> => {
		const res = await apiClient.patch(`${API_BASE_URL}/${id}`, payload);
		return res.data;
	},

	deleteCategory: async (id: string): Promise<AxiosResponse<void>> => {
		const res = await apiClient.delete(`${API_BASE_URL}/${id}`);
		return res.data;
	},
};

export const categoryQueryKeys = {
	all: ["categories"] as const,
};
