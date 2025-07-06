import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Header } from "./components/Header";
import { KanbanBoard } from "./components/KanbanBoard";
import { BarcodeScanner } from "./components/BarcodeScanner";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "./lib/queryClient";
import "./App.css";

type ViewType = "inventory" | "scanner" | "analytics";

function App() {
	const [currentView, setCurrentView] = useState<ViewType>("inventory");
	const [searchQuery, setSearchQuery] = useState("");

	const renderCurrentView = () => {
		switch (currentView) {
			case "inventory":
				return <KanbanBoard searchQuery={searchQuery} />;
			case "scanner":
				return (
					<div className="p-4 sm:p-6 lg:p-8">
						<BarcodeScanner />
					</div>
				);
			case "analytics":
				return (
					<div className="p-4 sm:p-6 lg:p-8">
						<AnalyticsDashboard />
					</div>
				);
			default:
				return <KanbanBoard />;
		}
	};

	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen bg-gray-50">
				<Header
					currentView={currentView}
					onViewChange={setCurrentView}
					onSearch={setSearchQuery}
				/>
				<main className="min-h-[calc(100vh-64px)]">{renderCurrentView()}</main>
				<Toaster />
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
