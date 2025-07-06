import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Scan, Plus, Camera } from "lucide-react";
import { CameraScanner } from "./CameraScanner";
import { useScanBarcode, useAddProduct } from "../hooks/useProductQuery";
import { ProductApiResponse } from "../types";
import { toast } from "sonner";

export const BarcodeScanner: React.FC = () => {
	const [barcode, setBarcode] = useState("");
	const [scannedProduct, setScannedProduct] =
		useState<ProductApiResponse | null>(null);
	const [showCameraScanner, setShowCameraScanner] = useState(false);
	const { mutate: addProduct, isPending, isSuccess } = useAddProduct();

	useEffect(() => {
		if (isSuccess) {
			toast.success("Product added successfully");
		}
	}, [isSuccess]);

	// React Query hooks
	const scanMutation = useScanBarcode();

	const handleScan = async (barcodeValue?: string) => {
		const codeToScan = barcodeValue || barcode;
		if (!codeToScan.trim()) return;

		try {
			const data = await scanMutation.mutateAsync(codeToScan);
			setScannedProduct(data);
			setBarcode(codeToScan);
		} catch (error) {
			// Error is handled by the mutation's onError
			console.error("Scan failed:", error);
		}
	};

	const handleCameraScan = (scannedBarcode: string) => {
		setShowCameraScanner(false);
		handleScan(scannedBarcode);
	};

	const handleAddProduct = () => {
		if (scannedProduct) {
			addProduct({
				barcode: scannedProduct.barcode,
				material: scannedProduct.material,
				description: scannedProduct.description,
			});
			setScannedProduct(null);
			setBarcode("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleScan();
		}
	};

	const isLoading = scanMutation.isPending;

	return (
		<>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Scan className="w-5 h-5" />
							Barcode Scanner
						</CardTitle>
						<CardDescription>
							Scan or enter a barcode to add products to your inventory
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="barcode">Barcode</Label>
							<div className="flex gap-2">
								<Input
									id="barcode"
									placeholder="Enter barcode or scan..."
									value={barcode}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setBarcode(e.target.value)
									}
									onKeyPress={handleKeyPress}
									className="flex-1"
								/>
								<Button
									onClick={() => handleScan()}
									disabled={isLoading || !barcode.trim()}
									size="sm"
								>
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Scan className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="flex-1 border-t border-gray-200"></div>
							<span className="px-2 text-xs text-gray-500">OR</span>
							<div className="flex-1 border-t border-gray-200"></div>
						</div>

						<Button
							onClick={() => setShowCameraScanner(true)}
							variant="outline"
							className="w-full"
							size="lg"
						>
							<Camera className="w-5 h-5 mr-2" />
							Use Camera to Scan
						</Button>
					</CardContent>
				</Card>

				{scannedProduct && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								Product Found
							</CardTitle>
							<CardDescription>
								Review the product details and add to inventory
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-3">
									<div>
										<Label className="text-sm font-medium text-muted-foreground">
											Barcode
										</Label>
										<p className="font-mono text-sm">
											{scannedProduct.barcode}
										</p>
									</div>

									{scannedProduct.description && (
										<div>
											<Label className="text-sm font-medium text-muted-foreground">
												Description
											</Label>
											<p className="text-sm">{scannedProduct.description}</p>
										</div>
									)}

									<div className="grid grid-cols-2 gap-4">
										{scannedProduct.material && (
											<div>
												<Label className="text-sm font-medium text-muted-foreground">
													Material ID
												</Label>
												<p className="text-lg font-semibold text-blue-600">
													{scannedProduct.material}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="flex gap-2 pt-4">
								<Button
									disabled={isPending}
									onClick={handleAddProduct}
									className="flex-1"
								>
									{isPending ? (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									) : (
										<>
											<Plus className="w-4 h-4 mr-2" />
											Add to Inventory
										</>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setScannedProduct(null);
										setBarcode("");
									}}
								>
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			<CameraScanner
				isOpen={showCameraScanner}
				onScan={handleCameraScan}
				onClose={() => setShowCameraScanner(false)}
			/>
		</>
	);
};
