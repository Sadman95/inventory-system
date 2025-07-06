import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./SearchBar";
import { Package, BarChart3, Scan, Menu, X, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategoryQuery";
import { Category, InventoryStats, Product } from "@/types";

interface HeaderProps {
	currentView: "inventory" | "scanner" | "analytics";
	onViewChange: (view: "inventory" | "scanner" | "analytics") => void;
	onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
	currentView,
	onViewChange,
	onSearch,
}: HeaderProps) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const { data: categories, isPending, isSuccess } = useCategories();
	const [stats, setStats] = useState<InventoryStats | null>(null);

	useEffect(() => {
		if (isSuccess && categories && categories.data) {
			const allProducts = categories.data.reduce(
				(acc: Product[], category: Category) => {
					return [...acc, ...category.products];
				},
				[]
			);
			const calculatedStats = calculateStats(allProducts);
			setStats(calculatedStats);
		}
	}, [categories, isSuccess]);

	const calculateStats = (param: Product[]): InventoryStats => {
		const categoryDistribution: { [key: string]: number } = {};
		if (categories && categories.data) {
			categories.data.forEach((cat: Category) => {
				categoryDistribution[cat.name] = param.filter(
					(p) => p.categoryId === cat._id
				).length;
			});
		}

		const recentlyAdded = param
			.sort(
				(a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
			)
			.slice(0, 5);

		return {
			totalProducts: param.length,
			totalCategories: categories ? categories.data.length : 0,
			recentlyAdded,
			categoryDistribution,
		};
	};

	const navItems = [
		{
			id: "inventory",
			label: "Inventory",
			icon: Package,
			badge: stats ? stats.totalProducts : 0,
		},
		{ id: "scanner", label: "Scanner", icon: Scan },
		{ id: "analytics", label: "Analytics", icon: BarChart3 },
	];

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-gray-200">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Package className="w-8 h-8 text-blue-600" />
							<h1 className="text-xl font-bold text-gray-900">
								Inventory<span className="text-blue-600">Pro</span>
							</h1>
						</div>

						{/* Desktop Navigation */}
						<nav className="items-center hidden gap-2 md:flex">
							{isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								navItems.map((item) => (
									<Button
										key={item.id}
										variant={currentView === item.id ? "default" : "ghost"}
										onClick={() =>
											onViewChange(
												item.id as "inventory" | "scanner" | "analytics"
											)
										}
										className="flex items-center gap-2"
									>
										<item.icon className="w-4 h-4" />
										{item.label}
										{item.badge !== undefined && (
											<Badge variant="secondary" className="ml-1">
												{item.badge}
											</Badge>
										)}
									</Button>
								))
							)}
						</nav>
					</div>

					{/* Search Bar - Hidden on mobile when not in inventory view */}
					{currentView === "inventory" && (
						<div className="hidden sm:block">
							<SearchBar onSearch={onSearch} />
						</div>
					)}

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</Button>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="py-4 border-t border-gray-200 md:hidden">
						<nav className="flex flex-col gap-2">
							{navItems.map((item) => (
								<Button
									key={item.id}
									variant={currentView === item.id ? "default" : "ghost"}
									onClick={() => {
										onViewChange(
											item.id as "inventory" | "scanner" | "analytics"
										);
										setMobileMenuOpen(false);
									}}
									className="flex items-center justify-start gap-2"
								>
									<item.icon className="w-4 h-4" />
									{item.label}
									{item.badge !== undefined && (
										<Badge variant="secondary" className="ml-1">
											{item.badge}
										</Badge>
									)}
								</Button>
							))}
						</nav>

						{/* Mobile Search Bar */}
						{currentView === "inventory" && (
							<div className="pt-4 mt-4 border-t border-gray-200">
								<SearchBar onSearch={onSearch} />
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
};
