import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
	FaCalendarCheck,
	FaHeart,
	FaUtensils,
	FaUsers,
	FaPlusCircle,
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useGetConfirmation } from '../../providers';
import { request } from '../../utils/request';
import { updateFavoritesAsync, setUser } from '../../actions';
import { Card } from '../HomePage/components';
import { Loader } from '../../components';
import { selectUserFavorites, selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';
import type { Restaurant, UserData } from '../../types';

type TabType = 'bookings' | 'favorites' | 'owned';

interface Booking {
	_id: string;
	date: string;
	time: string;
	tableNumber: number;
	restaurant?: {
		name: string;
	};
}

interface ServerResponse<T> {
	data: T | null;
	error: string | null;
}

const ProfileLayout = styled.div`
	display: flex;
	max-width: 1400px;
	margin: 30px auto;
	gap: 40px;
	padding: 0 20px;
	align-items: flex-start;

	@media (max-width: 900px) {
		flex-direction: column;
	}
`;

const Sidebar = styled.aside`
	width: 300px;
	background: #fff;
	border-radius: 25px;
	padding: 20px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
	position: sticky;
	top: 100px;

	@media (max-width: 900px) {
		width: 100%;
		position: static;
	}
`;

const TabButton = styled.button<{ $active?: boolean; $isAction?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 15px 20px;
	margin-bottom: 10px;
	border: none;
	border-radius: 15px;
	background: ${(props) => (props.$active ? '#f0f0f0' : 'transparent')};
	color: ${(props) => (props.$isAction ? '#e91e63' : '#333')};
	font-size: 16px;
	font-weight: ${(props) => (props.$active ? '600' : '500')};
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #f5f5f5;
		transform: translateX(5px);
	}
	svg {
		font-size: 20px;
		min-width: 20px;
	}
`;

const ContentArea = styled.section`
	flex-grow: 1;
	width: 100%;
	h2 {
		margin-bottom: 25px;
		font-size: 24px;
		color: #1a1a1a;
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 25px;
`;

const BookingCard = styled.div`
	background: #f9f9f9;
	padding: 20px;
	border-radius: 15px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
	h4 {
		margin: 0 0 10px 0;
		color: #333;
	}
	.summary {
		font-size: 14px;
		margin-bottom: 15px;
		p {
			margin: 5px 0;
		}
	}
	.cancel-btn {
		background: #ff4d4f;
		color: white;
		border: none;
		padding: 8px 15px;
		border-radius: 8px;
		cursor: pointer;
		width: 100%;
		font-weight: 600;
		&:hover {
			opacity: 0.8;
		}
	}
`;

export const ProfilePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { getConfirmation } = useGetConfirmation();
	const roleId = useAppSelector(selectUserRole);
	const userFavorites = useAppSelector(selectUserFavorites);
	const [activeTab, setActiveTab] = useState<TabType>('bookings');
	const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
	const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);

	const isAdmin = roleId === ROLE.ADMIN;
	const isModerator = roleId === ROLE.MODERATOR;

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const isOwner = isAdmin || isModerator;
			const [bRes, uRes, fRes, oRes] = await Promise.all([
				request<ServerResponse<Booking[]>>('/bookings/user'),
				request<ServerResponse<UserData>>('/users/me'),
				request<ServerResponse<Restaurant[]>>('/restaurants/favorites-details'),
				isOwner
					? request<ServerResponse<Restaurant[]>>('/restaurants/my')
					: Promise.resolve({ data: [], error: null }),
			]);

			setBookings(bRes.data || []);
			setFavoriteRestaurants(fRes.data || []);
			setOwnedRestaurants(oRes.data || []);
			if (uRes.data) dispatch(setUser(uRes.data));
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}, [isAdmin, isModerator, dispatch]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleCancel = async (id: string) => {
		const confirmed = await getConfirmation({
			title: t('common.confirm_cancel_title') || 'Отмена бронирования',
			description: t('common.confirm_cancel_desc') || 'Вы уверены?',
			confirmText: t('common.yes') || 'Да',
			closeText: t('common.no') || 'Нет',
		});

		if (confirmed) {
			const { error } = await request<ServerResponse<null>>(
				`/bookings/${id}`,
				'DELETE',
			);
			if (!error) {
				setBookings((prev) => prev.filter((book) => book._id !== id));
			}
		}
	};

	const handleFavorite = async (id: string | undefined) => {
		if (!id) return;
		const res = await (dispatch(updateFavoritesAsync(id)) as unknown as Promise<
			ServerResponse<string[]>
		>);
		if (!res?.error) {
			if (userFavorites.includes(id)) {
				setFavoriteRestaurants((prev) =>
					prev.filter((r) => (r.id || r._id) !== id),
				);
			} else {
				loadData();
			}
		}
	};

	const renderContent = () => {
		if (loading) return <Loader />;

		switch (activeTab) {
			case 'bookings':
				return (
					<>
						<h2>{t('profile.my_bookings')}</h2>
						{bookings.length ? (
							<Grid>
								{bookings.map((booking) => (
									<BookingCard key={booking._id}>
										<h4>
											{booking.restaurant?.name ||
												t('common.unknown_restaurant')}
										</h4>
										<div className="summary">
											<p>
												<strong>{t('restaurant.date')}:</strong>{' '}
												{booking.date}
											</p>
											<p>
												<strong>{t('restaurant.time')}:</strong>{' '}
												{booking.time}
											</p>
											<p>
												<strong>{t('restaurant.table')}:</strong>{' '}
												№{booking.tableNumber}
											</p>
										</div>
										<button
											className="cancel-btn"
											onClick={() => handleCancel(booking._id)}
										>
											{t('common.cancel_booking')}
										</button>
									</BookingCard>
								))}
							</Grid>
						) : (
							<p>{t('profile.no_bookings')}</p>
						)}
					</>
				);
			case 'favorites':
				return (
					<>
						<h2>{t('profile.favorites')}</h2>
						{favoriteRestaurants.length ? (
							<Grid>
								{favoriteRestaurants.map((rest) => (
									<Card
										key={rest.id || rest._id}
										id={rest.id || rest._id || ''}
										title={rest.name}
										imageUrl={rest.images?.[0]}
										description={rest.description}
										rating={rest.rating}
										isFavorite={true}
										handleFavorite={() =>
											handleFavorite(rest.id || rest._id)
										}
									/>
								))}
							</Grid>
						) : (
							<p>{t('profile.no_favorites')}</p>
						)}
					</>
				);
			case 'owned':
				return (
					<>
						<h2>Мои заведения</h2>
						{ownedRestaurants.length ? (
							<Grid>
								{ownedRestaurants.map((rest) => (
									<Card
										key={rest.id}
										id={rest.id}
										title={rest.name}
										imageUrl={rest.images?.[0]}
										description={rest.description}
										rating={rest.rating}
										isFavorite={userFavorites.includes(rest.id)}
										handleFavorite={() => handleFavorite(rest.id)}
									/>
								))}
							</Grid>
						) : (
							<p>У вас еще нет созданных заведений.</p>
						)}
					</>
				);
			default:
				return null;
		}
	};

	return (
		<ProfileLayout>
			<Sidebar>
				<TabButton
					$active={activeTab === 'bookings'}
					onClick={() => setActiveTab('bookings')}
				>
					<FaCalendarCheck /> {t('profile.my_bookings')}
				</TabButton>
				<TabButton
					$active={activeTab === 'favorites'}
					onClick={() => setActiveTab('favorites')}
				>
					<FaHeart /> {t('profile.favorites')}
				</TabButton>
				{(isAdmin || isModerator) && (
					<TabButton
						$active={activeTab === 'owned'}
						onClick={() => setActiveTab('owned')}
					>
						<FaUtensils /> Мои заведения
					</TabButton>
				)}
				<hr
					style={{
						margin: '15px 0',
						border: 'none',
						borderTop: '1px solid #eee',
					}}
				/>
				{isAdmin && (
					<TabButton onClick={() => navigate('/users')}>
						<FaUsers /> Пользователи
					</TabButton>
				)}
				{(isAdmin || isModerator) && (
					<TabButton $isAction onClick={() => navigate('/rest')}>
						<FaPlusCircle /> Создать ресторан
					</TabButton>
				)}
			</Sidebar>
			<ContentArea>{renderContent()}</ContentArea>
		</ProfileLayout>
	);
};
