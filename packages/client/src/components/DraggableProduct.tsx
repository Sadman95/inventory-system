import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface DraggableProductProps {
	product: Product;
}

export const DraggableProduct: React.FC<DraggableProductProps> = ({
	product,
}: DraggableProductProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: product._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="cursor-grab active:cursor-grabbing"
		>
			<ProductCard product={product} />
		</div>
	);
};
