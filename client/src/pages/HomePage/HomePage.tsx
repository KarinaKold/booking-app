import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks';
import { type Story } from '../../components/story-block/StoryBlock';
import { PAGINATION_LIMIT, ROLE } from '../../constants';
import { debounce } from './utils';
import { Card, Pagination, Search, SortPanel, StorySection } from './components';
import { Loader, Sidebar } from '../../components';
import { loadRestaurantsAsync, updateFavoritesAsync } from '../../actions';
import {
	selectLastPage,
	selectRestaurants,
	selectRestaurantsError,
	selectRestaurantsLoading,
	selectUserFavorites,
	selectUserRole,
} from '../../selectors';
import styles from './App.module.css';
import { ScrollToTop } from '../../components/sidebar/ScrollToTop';
import type { RestaurantFilters, SortField, SortOrder } from './types';
import type { Restaurant } from '../../types';

const MOCK_STORIES: Story[] = [
	{
		id: 1,
		title: 'Morning',
		imageUrl:
			'https://i.pinimg.com/736x/66/d1/d7/66d1d782ad32fed9a6cd32a15dc77a6a.jpg',
		duration: 5000,
	},
	{
		id: 2,
		title: 'Today',
		imageUrl:
			'https://i.pinimg.com/236x/68/26/61/682661b9d4705f695bea49bf24ec6d82.jpg',
		duration: 3000,
	},
	{
		id: 3,
		title: 'Travel',
		imageUrl:
			'https://i.pinimg.com/736x/66/d1/d7/66d1d782ad32fed9a6cd32a15dc77a6a.jpg',
		duration: 7000,
	},
	{
		id: 4,
		title: 'Food',
		imageUrl:
			'https://i.pinimg.com/736x/52/f1/03/52f10339432a0db0ccf5a4e16c8eaa2e.jpg',
		duration: 4000,
	},
	{
		id: 5,
		title: 'Restaurant',
		imageUrl:
			'https://avatars.mds.yandex.net/get-altay/11471993/2a0000018f3e9b87d0cc9bd56153d19b5057/L_height',
		duration: 5000,
	},
];

export const HomePage = () => {
	const dispatch = useAppDispatch();
	const roleId = useSelector(selectUserRole);
	const restaurants = useSelector(selectRestaurants);
	const loading = useSelector(selectRestaurantsLoading);
	const lastPage = useSelector(selectLastPage);
	const serverError = useSelector(selectRestaurantsError);
	const userFavorites = useSelector(selectUserFavorites);
	const [page, setPage] = useState<number>(1);
	const [searchPhrase, setSearchPhrase] = useState<string>('');
	const [shouldSearch, setShouldSearch] = useState<boolean>(false);
	const [filters, setFilters] = useState<RestaurantFilters>({
		cuisines: [],
		minRating: 0,
		hasBarCard: false,
		openNow: false,
	});
	const [sortBy, setSortBy] = useState<SortField>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const paginationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const params: Record<string, string | number> = {
			search: searchPhrase || '',
			page,
			limit: PAGINATION_LIMIT,
			sortBy,
			sortOrder,
		};

		if (filters.cuisines?.length > 0) {
			params.cuisines = filters.cuisines.join(',');
		}
		if (Number(filters.minRating) > 0) params.minRating = filters.minRating;
		if (filters.hasBarCard) {
			params.hasBarCard = 'true';
		}
		if (filters.openNow) {
			params.openNow = 'true';
		}
		dispatch(loadRestaurantsAsync(params));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, shouldSearch, filters, sortBy, sortOrder]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	const onSearch = ({ target }: ChangeEvent<HTMLInputElement>) => {
		setSearchPhrase(target.value);
		startDelayedSearch(!shouldSearch);
		setPage(1);
	};

	const onFilterChange = (newFilters: RestaurantFilters) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleSort = (field: SortField, order: SortOrder): void => {
		setSortBy(field);
		setSortOrder(order);
		setPage(1);
	};

	const handleFavorite = (id: string) => {
		if (roleId === ROLE.GUEST) {
			alert('Пожалуйста, войдите в аккаунт, чтобы добавлять в избранное');
			return;
		}
		dispatch(updateFavoritesAsync(id));
	};

	if (serverError) return <div className="error">{serverError}</div>;

	return (
		<div className={styles.container}>
			<StorySection stories={MOCK_STORIES} />
			<Search searchPhrase={searchPhrase} onChange={onSearch} />
			<div className={styles.mainLayout}>
				<Sidebar
					onFilterChange={onFilterChange}
					amount={restaurants.length}
					loading={loading}
				/>
				<div className={styles.restaurantsContent}>
					<SortPanel
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSortChange={handleSort}
					/>
					{loading ? (
						<Loader />
					) : restaurants.length ? (
						<div className={styles.postList}>
							{restaurants.map(
								({
									id,
									name,
									images,
									description,
									rating,
								}: Restaurant) => (
									<Card
										key={id}
										id={id}
										title={name}
										imageUrl={images[0]}
										description={description}
										rating={rating}
										isFavorite={userFavorites.includes(id)}
										handleFavorite={() => handleFavorite(id)}
									/>
								),
							)}
						</div>
					) : (
						<div className={styles.noResults}>Рестораны не найдены</div>
					)}
				</div>
			</div>
			{lastPage > 1 && restaurants.length > 0 && (
				<div className={styles.paginationWrapper}>
					<div ref={paginationRef} className={styles.paginationAnchor}>
						<Pagination page={page} setPage={setPage} lastPage={lastPage} />
					</div>
					<ScrollToTop paginationRef={paginationRef} />
				</div>
			)}
		</div>
	);
};
