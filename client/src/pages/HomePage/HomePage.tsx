import { useEffect, useMemo, useRef, useState } from 'react';
import { StoryBlock, type Story } from '../../components/story-block/StoryBlock';
import { request } from '../../utils/request';
import { PAGINATION_LIMIT, ROLE } from '../../constants';
import { debounce } from './utils';
import { Card, Pagination, Search } from './components';
import { Loader, Sidebar } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserFavorites, selectUserRole } from '../../selectors';
import { updateFavoritesAsync } from '../../actions/update-favorites-async';
import styles from './App.module.css';
import { ScrollToTop } from '../../components/sidebar/ScrollToTop';

const MOCK_STORIES: Story[] = [
	{
		id: 1,
		title: 'Nature',
		imageUrl:
			'https://i.pinimg.com/736x/66/d1/d7/66d1d782ad32fed9a6cd32a15dc77a6a.jpg',
		duration: 5000,
	},
	{
		id: 2,
		title: 'Cities',
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
		id: 4,
		title: 'Food',
		imageUrl:
			'https://avatars.mds.yandex.net/get-altay/11471993/2a0000018f3e9b87d0cc9bd56153d19b5057/L_height',
		duration: 5000,
	},
];

export const HomePage = () => {
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const userFavorites = useSelector(selectUserFavorites);

	const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
	const [restaurants, setRestaurants] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({});
	const paginationRef = useRef(null);

	// useEffect(() => {
	// 	setLoading(true);
	// 	request(
	// 		`/restaurants?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`,
	// 	).then(({ data: { restaurants, lastPage } }) => {
	// 		setRestaurants(restaurants);
	// 		setLastPage(lastPage);
	// 		setLoading(false);
	// 	});
	// }, [page, shouldSearch]);

	useEffect(() => {
		setLoading(true);

		const params = {
			search: searchPhrase || '',
			page: page.toString(),
			limit: PAGINATION_LIMIT.toString(),
		};
		// фильтры только если выбраны
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

		const queryParams = new URLSearchParams(params).toString();

		request(`/restaurants?${queryParams}`).then(({ data, error }) => {
			if (data) {
				setRestaurants(data.restaurants || []);
				setLastPage(data.lastPage || 1);
			}
			if (error) {
				console.error('Ошибка загрузки:', error);
			}
			setLoading(false);
		});
	}, [page, shouldSearch, filters]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		startDelayedSearch(!shouldSearch);
		setPage(1);
	};

	const onFilterChange = (newFilters) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleFavorite = (id: string) => {
		if (roleId === ROLE.GUEST) {
			alert('Пожалуйста, войдите в аккаунт, чтобы добавлять в избранное');
			return;
		}
		dispatch(updateFavoritesAsync(id));
	};

	return (
		<div className={styles.container}>
			<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
				{/* Горизонтальный список превью */}
				<div className={styles.storiesWrapper}>
					<div className={styles.previewList}>
						{MOCK_STORIES.map((story, index) => (
							<div
								key={story.id}
								className={styles.previewItem}
								onClick={() => setSelectedStoryIndex(index)}
							>
								<div className={styles.avatarRing}>
									<img
										src={story.imageUrl}
										className={styles.avatar}
										alt={story.title}
									/>
								</div>
								<span style={{ fontSize: '14px', color: '#333' }}>
									{story.title}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Модальное окно плеера */}
				{selectedStoryIndex !== null && (
					<StoryBlock
						stories={MOCK_STORIES}
						initialIndex={selectedStoryIndex}
						onClose={() => setSelectedStoryIndex(null)}
					/>
				)}
			</div>
			<Search searchPhrase={searchPhrase} onChange={onSearch} />
			<div className={styles.mainLayout}>
				<Sidebar
					onFilterChange={onFilterChange}
					amount={restaurants.length}
					loading={loading}
				/>
				<div className={styles.restaurantsContent}>
					{loading ? (
						<Loader />
					) : restaurants.length ? (
						<div className={styles.postList}>
							{restaurants.map(
								({ id, name, imageUrl, description, rating }) => (
									<Card
										key={id}
										id={id}
										title={name}
										imageUrl={imageUrl}
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
			{/* {data.map((item) => (
				<div key={item.id}>
					{item.title}
					<button onClick={handleDelete.bind(null, item.id)}>
						Удалить задачу
					</button>
				</div>
			))}
			<button onClick={handleOpen}>Открыть окно</button> */}
		</div>
	);
};
