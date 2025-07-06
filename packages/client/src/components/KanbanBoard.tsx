import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategoryQuery";
import { useUpdateProduct } from "@/hooks/useProductQuery";
import {
	DndContext,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Category, Product } from "../types";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { CategoryColumn } from "./CategoryColumn";
import { ProductCard } from "./ProductCard";

// Skeleton Component for loading state
const CategorySkeleton = () => (
	<div className="w-64 h-[400px] rounded-md bg-gray-200 animate-pulse" />
);

type KanbanBoardProps = {
	searchQuery?: string;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
	searchQuery = "",
}) => {
	const [products, setProducts] = useState<Product[]>([]);
	const { data: categories, isPending, isSuccess } = useCategories();
	const [activeProduct, setActiveProduct] = useState<Product | null>(null);
	const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
	const { mutate: updateProductMutation } = useUpdateProduct();

	useEffect(() => {
		if (isSuccess && categories && categories.data) {
			const allProducts = categories.data.reduce(
				(acc: Product[], category: Category) => {
					return [...acc, ...category.products];
				},
				[]
			);
			setProducts(allProducts);
		}
	}, [isSuccess, categories]);

	useEffect(() => {
		if (searchQuery) {
			const filteredProducts = products.filter((product: Product) =>
				product.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setProducts(filteredProducts);
		} else if (isSuccess && categories && categories.data) {
			const allProducts = categories.data.reduce(
				(acc: Product[], category: Category) => {
					return [...acc, ...category.products];
				},
				[]
			);
			setProducts(allProducts);
		}
	}, [searchQuery, categories, isSuccess, products]);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const product = products.find((p: Product) => p._id === active.id);
		setActiveProduct(product || null);
	};

	const moveProduct = (productId: string, newCategoryId: string) => {
		setProducts((prev: Product[]) =>
			prev.map((product) =>
				product._id === productId
					? { ...product, categoryId: newCategoryId, updatedAt: new Date() }
					: product
			)
		);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		const activeProduct = products.find((p: Product) => p._id === activeId);
		if (!activeProduct) return;

		const overCategory =
			categories && categories.data.find((c: Category) => c._id === overId);
		if (!overCategory) return;

		if (activeProduct.categoryId !== overCategory._id) {
			moveProduct(activeId as string, overCategory._id);
			updateProductMutation({
				productId: activeId as string,
				payload: {
					categoryId: overCategory._id,
				},
			});
		}
	};

	const handleDragEnd = () => {
		setActiveProduct(null);
	};

	return (
		<div className="h-full">
			<DndContext
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Inventory Board
						</h2>
						<p className="text-sm text-gray-500">
							Organize your products by dragging them between categories
						</p>
					</div>
					<Button
						onClick={() => setShowAddCategoryDialog(true)}
						className="flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Add Category
					</Button>
				</div>

				{/* Kanban Board */}
				<div className="flex gap-4 p-4 overflow-x-auto min-h-[600px] bg-gray-50">
					{isPending ? (
						// Skeleton while loading
						Array.from({ length: 3 }).map((_, idx) => (
							<CategorySkeleton key={idx} />
						))
					) : categories && categories.data?.length > 0 ? (
						categories.data.map((category: Category) => {
							const categoryProducts = products.filter(
								(p: Product) => p.categoryId === category._id
							);
							return (
								<CategoryColumn
									key={category._id}
									category={category}
									products={categoryProducts}
								/>
							);
						})
					) : (
						// Empty state
						<div className="flex items-center justify-center flex-1">
							<div className="max-w-md text-center">
								<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
									<Plus className="w-8 h-8 text-gray-400" />
								</div>
								<h3 className="mb-2 text-lg font-medium text-gray-900">
									No categories yet
								</h3>
								<p className="mb-4 text-gray-500">
									Create your first category to start organizing your inventory
								</p>
								<Button onClick={() => setShowAddCategoryDialog(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Create First Category
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Drag Overlay */}
				<DragOverlay>
					{activeProduct ? (
						<div className="scale-105 rotate-6 opacity-90">
							<ProductCard product={activeProduct} />
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			{/* Add Category Dialog */}
			<AddCategoryDialog
				isOpen={showAddCategoryDialog}
				onClose={() => setShowAddCategoryDialog(false)}
			/>
		</div>
	);
};
