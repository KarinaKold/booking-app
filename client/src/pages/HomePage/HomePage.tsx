import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { PAGINATION_LIMIT, ROLE } from '../../constants';
import { useGetConfirmation } from '../../providers';
import { useSearchPaginate } from '../../hooks';
import { MOCK_STORIES } from './constants/stories';
import { Card, Pagination, Search, SortPanel, StorySection } from './components';
import { ScrollToTop } from '../../components/sidebar/ScrollToTop';
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
import type { RestaurantFilters, SortField, SortOrder } from './types';
import type { Restaurant } from '../../types';
import styled from 'styled-components';

export const HomePage = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { getConfirmation } = useGetConfirmation();
	const { page, setPage, searchPhrase, shouldSearch, onSearch } = useSearchPaginate();

	const roleId = useAppSelector(selectUserRole);
	const restaurants = useAppSelector(selectRestaurants);
	const loading = useAppSelector(selectRestaurantsLoading);
	const lastPage = useAppSelector(selectLastPage);
	const serverError = useAppSelector(selectRestaurantsError);
	const userFavorites = useAppSelector(selectUserFavorites);

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
	}, [dispatch, page, shouldSearch, filters, sortBy, sortOrder]);

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
			getConfirmation({
				title: t('common.auth_required_title', 'Требуется авторизация'),
				description: t(
					'common.auth_required_desc',
					'Пожалуйста, войдите в аккаунт, чтобы добавлять рестораны в избранное',
				),
				confirmText: t('common.ok', 'Понятно'),
				closeText: '',
			});
		}
		dispatch(updateFavoritesAsync(id));
	};

	if (serverError) return <div className="error">{serverError}</div>;

	return (
		<Main>
			<StorySection stories={MOCK_STORIES} />
			<Search searchPhrase={searchPhrase} onChange={onSearch} />
			<div className="layout">
				<Sidebar
					onFilterChange={onFilterChange}
					amount={restaurants.length}
					loading={loading}
				/>
				<div className="content">
					<SortPanel
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSortChange={handleSort}
					/>
					{loading ? (
						<Loader />
					) : restaurants.length ? (
						<CardList>
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
						</CardList>
					) : (
						<div className="no-results">
							<p>{t('home.no_results')}</p>
						</div>
					)}
				</div>
			</div>
			{lastPage > 1 && restaurants.length > 0 && (
				<PaginationSection>
					<div ref={paginationRef} className="anchor">
						<Pagination page={page} setPage={setPage} lastPage={lastPage} />
					</div>
					<ScrollToTop paginationRef={paginationRef} />
				</PaginationSection>
			)}
		</Main>
	);
};

const Main = styled.main`
	.layout {
		display: flex;
		max-width: 1400px;
		margin: 30px auto;
		padding: 0 20px;
		gap: 50px;
		align-items: flex-start;
		width: 100%;

		@media (max-width: 800px) {
			flex-direction: column;
		}
	}

	.content {
		flex: 1 0 auto;
		display: flex;
		flex-direction: column;
	}

	.no-results {
		width: 100%;
		text-align: center;
		margin-top: 100px;
		font-size: 1.2rem;
		color: #888;
	}
`;

const CardList = styled.div`
	flex-grow: 1;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 30px;
	width: 100%;

	@media (max-width: 1350px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (max-width: 1050px) {
		grid-template-columns: 1fr;
	}
`;

const PaginationSection = styled.footer`
	width: 100%;
	margin: 40px 0;
	display: flex;
	justify-content: center;
	position: relative;

	.anchor {
		max-width: 1400px;
		width: 100%;
		display: flex;
		justify-content: center;
	}
`;
