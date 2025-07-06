import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search products...",
}: SearchBarProps) => {
	const [query, setQuery] = useState("");

	const handleSearch = (value: string) => {
		setQuery(value);
		onSearch(value);
	};

	const clearSearch = () => {
		setQuery("");
		onSearch("");
	};

	return (
		<div className="relative flex-1 max-w-md">
			<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
			<Input
				type="text"
				placeholder={placeholder}
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
				className="pl-10 pr-10"
			/>
			{query && (
				<Button
					variant="ghost"
					size="sm"
					onClick={clearSearch}
					className="absolute w-8 h-8 p-0 transform -translate-y-1/2 right-1 top-1/2"
				>
					<X className="w-4 h-4" />
				</Button>
			)}
		</div>
	);
};
