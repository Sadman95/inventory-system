import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/useCategoryQuery";
import { Loader2, Palette, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface AddCategoryDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

interface CategoryFormValues {
	name: string;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
	isOpen,
	onClose,
}) => {
	const { mutate: addCategory, isPending } = useCreateCategory();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CategoryFormValues>({
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: CategoryFormValues) => {
		addCategory({ name: values.name.trim() });
		reset();
		onClose();
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Add New Category
					</DialogTitle>
					<DialogDescription>
						Create a new category to organize your inventory products.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="categoryName">Category Name</Label>
						<Input
							id="categoryName"
							placeholder="Enter category name..."
							{...register("name", {
								required: "Category name is required",
								minLength: { value: 2, message: "Minimum 2 characters" },
							})}
						/>
						{errors.name && (
							<p className="text-sm text-red-600">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-3">
						<Label className="flex items-center gap-2">
							<Palette className="w-4 h-4" />
							Color Theme
						</Label>
						<div className="p-3 rounded-lg bg-gray-50">
							<Badge>
								{/* Watch the name field */}
								{watch("name")?.trim() || "Category Name"}
							</Badge>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button type="button" variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isPending || isSubmitting}
							className="min-w-[100px]"
						>
							{isSubmitting ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
									Adding...
								</div>
							) : isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<>
									<Plus className="w-4 h-4 mr-2" />
									Add Category
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
