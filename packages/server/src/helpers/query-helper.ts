// Main Return Type
export interface QueryHelperResult {
	filterConditions: Record<string, unknown>;
	sortConditions: Record<string, 1 | -1>;
}

// Input Options for the Helper
export interface QueryHelperOptions {
	filterableOptions: Record<string, any>;
	searchableFields: string[];
}

export const queryHelper = (options: QueryHelperOptions): QueryHelperResult => {
	const { filterableOptions, searchableFields } = options;

	let { searchTerm, ...filtersData } = filterableOptions;

	const andConditions: Record<string, unknown>[] = [];
	const sortConditions: Record<string, 1 | -1> = {};

	if (searchTerm) {
		andConditions.push({
			$or: searchableFields.map((field) => ({
				[field]: {
					$regex: searchTerm,
					$options: "i",
				},
			})),
		});
	}

	if (Object.keys(filtersData).length) {
		Object.entries(filtersData).forEach(([field, value]) => {
			andConditions.push({ [field]: value });
		});
	}

	const filterConditions =
		andConditions.length > 0 ? { $and: andConditions } : {};

	return {
		filterConditions,
		sortConditions,
	};
};
