export type SortOrder = 'asc' | 'desc';

export const getNextSortOrder = (
	currentField: string,
	clickedField: string,
	currentOrder: SortOrder,
): SortOrder => {
	return currentField === clickedField && currentOrder === 'desc' ? 'asc' : 'desc';
};

export const getSortSymbol = (
	currentField: string,
	targetField: string,
	currentOrder: SortOrder,
): string => {
	if (currentField === targetField) {
		return currentOrder === 'asc' ? '▲' : '▼';
	}
	return '↕';
};
