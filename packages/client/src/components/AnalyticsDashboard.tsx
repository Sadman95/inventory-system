import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Layers, TrendingUp, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
	Category,
	CategoryApiResponse,
	InventoryStats,
	Product,
} from "@/types";
import { useCategories } from "@/hooks/useCategoryQuery";

export const AnalyticsDashboard: React.FC = () => {
	const { data: categories, isPending, isSuccess } = useCategories();
	const [stats, setStats] = useState<InventoryStats | null>(null);

	useEffect(() => {
		if (isSuccess && categories && categories.data) {
			const allProducts = (categories.data as CategoryApiResponse[]).reduce(
				(acc: Product[], category: CategoryApiResponse) => {
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
		categories?.data.forEach((cat: Category) => {
			categoryDistribution[cat.name] = param.filter(
				(p) => p.categoryId === cat._id
			).length;
		});

		const recentlyAdded = param
			.sort(
				(a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
			)
			.slice(0, 5);

		return {
			totalProducts: param.length,
			totalCategories: categories ? categories?.data.length : 0,
			recentlyAdded,
			categoryDistribution,
		};
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Total Products
						</CardTitle>
						<Package className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{stats && (
							<div className="text-2xl font-bold">{stats.totalProducts}</div>
						)}
						<p className="text-xs text-muted-foreground">
							Across all categories
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Categories</CardTitle>
						<Layers className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{stats && (
							<div className="text-2xl font-bold">{stats.totalCategories}</div>
						)}
						<p className="text-xs text-muted-foreground">Active categories</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Most Populated
						</CardTitle>
						<TrendingUp className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats && Math.max(...Object.values(stats.categoryDistribution))}
						</div>
						<p className="text-xs text-muted-foreground">
							Products in largest category
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Recently Added
						</CardTitle>
						<Clock className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats && stats.recentlyAdded.length}
						</div>
						<p className="text-xs text-muted-foreground">In the last session</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Category Distribution</CardTitle>
						<CardDescription>
							Number of products in each category
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{isPending ? (
							<Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
						) : (
							categories?.data?.map((category: Category) => {
								const count = stats
									? stats.categoryDistribution[category.name]
									: 0;
								const percentage =
									stats && stats.totalProducts > 0
										? (count / stats.totalProducts) * 100
										: 0;

								return (
									<div key={category._id} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">
													{category.name}
												</span>
												<Badge variant="secondary">{count}</Badge>
											</div>
											<span className="text-sm text-muted-foreground">
												{percentage.toFixed(1)}%
											</span>
										</div>
										<Progress value={percentage} className="h-2" />
									</div>
								);
							})
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recently Added Products</CardTitle>
						<CardDescription>
							Latest products added to inventory
						</CardDescription>
					</CardHeader>
					{stats && (
						<CardContent>
							<div className="space-y-4">
								{stats.recentlyAdded.length === 0 ? (
									<p className="py-8 text-sm text-center text-muted-foreground">
										No products added yet
									</p>
								) : (
									stats.recentlyAdded.map((product) => (
										<div
											key={product._id}
											className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
										>
											<div className="flex-shrink-0">
												{product.image ? (
													<img
														src={product.image}
														alt={product.barcode}
														className="object-cover w-10 h-10 rounded"
													/>
												) : (
													<div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded">
														<Package className="w-5 h-5 text-gray-400" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{product.description}
												</p>
												{product.addedAt && (
													<p className="text-xs text-gray-500">
														{formatDistanceToNow(new Date(product.addedAt), {
															addSuffix: true,
														})}
													</p>
												)}
											</div>
										</div>
									))
								)}
							</div>
						</CardContent>
					)}
				</Card>
			</div>
		</div>
	);
};
