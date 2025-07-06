import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "../types";
import { Package, Calendar, Trash2, Edit, Wifi } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCachedProduct } from "../hooks/useProductQuery";

interface ProductCardProps {
	product: Product;
	onEdit?: (product: Product) => void;
	onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onEdit,
	onDelete,
}: ProductCardProps) => {
	const cachedApiData = useCachedProduct(product.barcode);
	const hasApiData = !!cachedApiData;

	return (
		<Card className="w-full transition-shadow duration-200 bg-white border border-gray-200 shadow-sm hover:shadow-md">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0">
							{product.image ? (
								<img
									src={product.image}
									alt={product.barcode}
									className="object-cover w-12 h-12 rounded-lg"
								/>
							) : (
								<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
									<Package className="w-6 h-6 text-gray-400" />
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2">
									{product.barcode && `Product ${product.barcode}`}
								</CardTitle>
								{hasApiData && (
									<Badge variant="secondary" className="text-xs">
										<Wifi className="w-3 h-3 mr-1" />
										API
									</Badge>
								)}
							</div>
							<p className="mt-1 font-mono text-xs text-gray-500">
								{product.barcode}
							</p>
						</div>
					</div>
					<div className="flex gap-1">
						{onEdit && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onEdit(product)}
								className="w-8 h-8 p-0"
							>
								<Edit className="w-3 h-3" />
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onDelete(product._id)}
								className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
							>
								<Trash2 className="w-3 h-3" />
							</Button>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0 space-y-3">
				{product.description && (
					<p className="text-xs text-gray-600 line-clamp-2">
						{product.description}
					</p>
				)}

				<div className="space-y-2">
					{product.material && (
						<div className="flex items-center justify-between">
							<span className="text-xs text-gray-500">Material ID</span>
							<span className="text-xs font-medium">{product.material}</span>
						</div>
					)}
				</div>

				{product.addedAt && (
					<div className="flex items-center justify-between pt-2 border-t border-gray-100">
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<Calendar className="w-3 h-3" />
							Added{" "}
							{formatDistanceToNow(new Date(product.addedAt), {
								addSuffix: true,
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
