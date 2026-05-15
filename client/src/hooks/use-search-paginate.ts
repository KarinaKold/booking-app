import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import { debounce } from '../pages/HomePage/utils';

export const useSearchPaginate = () => {
	const [page, setPage] = useState<number>(1);
	const [searchPhrase, setSearchPhrase] = useState<string>('');
	const [shouldSearch, setShouldSearch] = useState<string>('');

	const startDelayedSearch = useMemo(
		() =>
			debounce((value: string) => {
				setShouldSearch(value);
				setPage(1);
			}, 2000),
		[],
	);

	const onSearch = useCallback(
		({ target }: ChangeEvent<HTMLInputElement>) => {
			setSearchPhrase(target.value);
			startDelayedSearch(target.value);
		},
		[startDelayedSearch],
	);

	return {
		page,
		setPage,
		searchPhrase,
		shouldSearch,
		onSearch,
	};
};
