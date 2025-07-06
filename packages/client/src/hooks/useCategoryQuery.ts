import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, CategoryApiResponse } from "../types";
import { categoryApi, categoryQueryKeys } from "@/services/categoryApi";

// Hook for fetching all categories
export const useCategories = () => {
	return useQuery({
		queryKey: categoryQueryKeys.all,
		queryFn: categoryApi.fetchAllCategories,
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
};

// Mutation hook to create a new category
export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			payload: Pick<Category, "name">
		): Promise<CategoryApiResponse> => {
			const response = await categoryApi.createCategory(payload);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Category created successfully");
			queryClient.invalidateQueries({
				queryKey: categoryQueryKeys.all,
			});
		},
		onError: (error: Error) => {
			const errorMessage = error.message || "Failed to create category";
			toast.error(errorMessage);
		},
	});
};

// Mutation hook to update a category
export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: Pick<Category, "name">;
		}): Promise<CategoryApiResponse> => {
			const response = await categoryApi.updateCategory(id, payload);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Category updated successfully");
			queryClient.invalidateQueries({
				queryKey: categoryQueryKeys.all,
			});
		},
		onError: (error: Error) => {
			const errorMessage = error.message || "Failed to update category";
			toast.error(errorMessage);
		},
	});
};

// Mutation hook to delete a category
export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await categoryApi.deleteCategory(id);
		},
		onSuccess: () => {
			toast.success("Category deleted successfully");
			queryClient.invalidateQueries({
				queryKey: categoryQueryKeys.all,
			});
		},
		onError: (error: Error) => {
			const errorMessage = error.message || "Failed to delete category";
			toast.error(errorMessage);
		},
	});
};
