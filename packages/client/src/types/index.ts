export interface ProductApiResponse {
	barcode: string;
	description: string;
	material: number;
}

export interface Product extends ProductApiResponse {
	_id: string;
	categoryId: string;
	image?: string;
	addedAt: Date;
	updatedAt: Date;
}

export interface Category {
	_id: string;
	name: string;
	productCount: number;
	products: Product[];
}

export interface InventoryStats {
	totalProducts: number;
	totalCategories: number;
	recentlyAdded: Product[];
	categoryDistribution: { [key: string]: number };
}

// src/types/index.ts (or types.ts)
export interface CategoryApiResponse extends Category {
	createdAt: string;
	updatedAt: string;
}
