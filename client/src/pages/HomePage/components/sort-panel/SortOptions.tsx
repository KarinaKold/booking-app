import {
	FaSortAmountDown,
	FaSortAmountUp,
	FaSortAlphaDown,
	FaSortAlphaUp,
} from 'react-icons/fa';
import type { SortOption } from '../../types';

export const SORT_OPTIONS: SortOption[] = [
	{
		id: 'createdAt_desc',
		label: 'сначала новые',
		field: 'createdAt',
		order: 'desc',
		icon: <FaSortAmountDown />,
	},
	{
		id: 'createdAt_asc',
		label: 'сначала старые',
		field: 'createdAt',
		order: 'asc',
		icon: <FaSortAmountUp />,
	},
	{
		id: 'rating_desc',
		label: 'рейтинг: сначала высокий',
		field: 'rating',
		order: 'desc',
		icon: <FaSortAmountDown />,
	},
	{
		id: 'rating_asc',
		label: 'рейтинг: сначала низкий',
		field: 'rating',
		order: 'asc',
		icon: <FaSortAmountUp />,
	},
	{
		id: 'name_asc',
		label: 'по названию (А-Я)',
		field: 'name',
		order: 'asc',
		icon: <FaSortAlphaDown />,
	},
	{
		id: 'name_desc',
		label: 'по названию (Я-А)',
		field: 'name',
		order: 'desc',
		icon: <FaSortAlphaUp />,
	},
];
