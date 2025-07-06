import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, productQueryKeys } from "../services/productApi";
import { Product, ProductApiResponse } from "../types";
import { toast } from "sonner";

// Hook for fetching a single product by barcode
export const useProductByBarcode = (
	barcode: string,
	enabled: boolean = true
) => {
	return useQuery({
		queryKey: productQueryKeys.byBarcode(barcode),
		queryFn: () => productApi.fetchProductByBarcode(barcode),
		enabled: enabled && !!barcode.trim(),
		staleTime: 10 * 60 * 1000, // 10 minutes - product data doesn't change often
		gcTime: 30 * 60 * 1000, // 30 minutes in cache
		retry: (failureCount: number, error: Error) => {
			// Don't retry for 404 errors (product not found)
			if (error instanceof Error && error.message.includes("not found")) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// Mutation hook for scanning barcodes with optimistic updates
export const useScanBarcode = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (barcode: string): Promise<ProductApiResponse> => {
			if (!barcode.trim()) {
				throw new Error("Please enter a valid barcode");
			}
			return productApi.fetchProductByBarcode(barcode.trim());
		},
		onSuccess: (data: ProductApiResponse, barcode: string) => {
			// Cache the successful result
			queryClient.setQueryData(productQueryKeys.byBarcode(barcode), data);

			// Optionally prefetch related products or update other caches
			toast.success("Product found successfully");
		},
		onError: (error: Error) => {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to scan barcode";
			toast.error(errorMessage);
		},
	});
};

// Mutation hook for scanning barcodes with optimistic updates
export const useAddProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			payload: Partial<Product>
		): Promise<ProductApiResponse> => {
			return productApi.addProduct(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: productQueryKeys.all,
			});

			// Optionally prefetch related products or update other caches
			toast.success("Product found successfully");
		},
		onError: (error: Error) => {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to scan barcode";
			toast.error(errorMessage);
		},
	});
};

// Mutation hook for scanning barcodes with optimistic updates
export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			productId,
			payload,
		}: {
			productId: string;
			payload: Partial<Product>;
		}): Promise<Partial<Product>> => {
			return productApi.updateProduct(productId, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: productQueryKeys.all,
			});
		},
		onError: (error: Error) => {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to scan barcode";
			toast.error(errorMessage);
		},
	});
};

// Hook for getting cached product data without triggering a request
export const useCachedProduct = (barcode: string) => {
	const queryClient = useQueryClient();

	return queryClient.getQueryData<ProductApiResponse>(
		productQueryKeys.byBarcode(barcode)
	);
};
