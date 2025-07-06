import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Palette } from "lucide-react";
import { Category, Product } from "../types";
import { DraggableProduct } from "./DraggableProduct";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { useDeleteCategory } from "@/hooks/useCategoryQuery";

interface CategoryColumnProps {
	category: Category;
	products: Product[];
}

export const CategoryColumn: React.FC<CategoryColumnProps> = ({
	category,
	products,
}: CategoryColumnProps) => {
	const [showAddDialog, setShowAddDialog] = useState(false);
	const { mutate: deleteCategory } = useDeleteCategory();
	const { setNodeRef, isOver } = useDroppable({
		id: category._id,
	});

	const handleDeleteCategory = () => {
		if (category.name === "Uncategorized") return; // Prevent deleting uncategorized

		if (products.length > 0) {
			const confirmDelete = window.confirm(
				`This category contains ${products.length} product(s). They will be moved to "Uncategorized". Continue?`
			);
			if (!confirmDelete) return;
		}

		deleteCategory(category._id);
	};

	return (
		<>
			<Card
				ref={setNodeRef}
				className={`w-full min-w-[280px] max-w-[320px] h-fit transition-all duration-200 ${
					isOver ? "ring-2 ring-blue-500 bg-blue-50 scale-[1.02]" : ""
				}`}
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<CardTitle className="text-base font-semibold text-gray-900">
								{category.name}
							</CardTitle>
							<Badge variant="secondary">{category.productCount}</Badge>
						</div>

						{/* Category Actions Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="w-8 h-8 p-0 hover:bg-gray-100"
								>
									<MoreHorizontal className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => setShowAddDialog(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Add Category
								</DropdownMenuItem>

								{category.name !== "Uncategorized" && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem disabled>
											<Edit className="w-4 h-4 mr-2" />
											Edit Category
										</DropdownMenuItem>
										<DropdownMenuItem disabled>
											<Palette className="w-4 h-4 mr-2" />
											Change Color
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleDeleteCategory}
											className="text-red-600 focus:text-red-600"
										>
											<Trash2 className="w-4 h-4 mr-2" />
											Delete Category
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<SortableContext
						items={products.map((p) => p._id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-2 min-h-[200px]">
							{products.length === 0 ? (
								<div className="flex items-center justify-center h-32 text-center">
									<div className="text-gray-400">
										<div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
											<Plus className="w-6 h-6" />
										</div>
										<p className="text-sm font-medium">No products yet</p>
										<p className="mt-1 text-xs">
											Drag products here or scan new ones
										</p>
									</div>
								</div>
							) : (
								products.map((product) => (
									<DraggableProduct key={product._id} product={product} />
								))
							)}
						</div>
					</SortableContext>

					{/* Add Category Button - Only show in uncategorized */}
					{category.name === "Uncategorized" && (
						<div className="pt-4 mt-4 border-t border-gray-200">
							<Button
								variant="outline"
								size="sm"
								className="w-full transition-colors hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
								onClick={() => setShowAddDialog(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								Add New Category
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<AddCategoryDialog
				isOpen={showAddDialog}
				onClose={() => setShowAddDialog(false)}
			/>
		</>
	);
};
