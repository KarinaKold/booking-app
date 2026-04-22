import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetConfirmation } from '../../providers';
import { request } from '../../utils/request';
import { updateFavoritesAsync, setUser } from '../../actions';
import { Card } from '../HomePage/components';
import { Loader } from '../../components';
import { selectUserFavorites, selectUserRole } from '../../selectors';
import styles from './Profile.module.css';
import { ROLE } from '../../constants';

export const ProfilePage = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	// const { getConfirmation } = useGetConfirmation();
	const roleId = useSelector(selectUserRole);
	const userFavorites = useSelector(selectUserFavorites);
	const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
	const [ownedRestaurants, setOwnedRestaurants] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	const loadProfileData = useCallback(async () => {
		setLoading(true);
		try {
			const [bookingsRes, userRes, favDetailsRes] = await Promise.all([
				request('/bookings/user'),
				request('/users/me'),
				request('/restaurants/favorites-details'),
			]);

			setBookings(bookingsRes.data || []);

			if (userRes.data) {
				dispatch(setUser(userRes.data));
				setFavoriteRestaurants(favDetailsRes.data || []);
			}
		} catch (error) {
			console.error('Ошибка загрузки профиля:', error);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		loadProfileData();
	}, [loadProfileData]);

	// const handleCancel = (id: string) => {
	// 	request(`/bookings/${id}`, 'DELETE').then(({ error }) => {
	// 		if (!error) loadProfileData();
	// 	});
	// };

	const handleCancel = async (id: string) => {
		const confirmed = await getConfirmation({
			title: t('common.confirm_cancel_title') || 'Отмена бронирования',
			description:
				t('common.confirm_cancel_desc') ||
				'Вы уверены, что хотите отменить бронь?',
			confirmText: t('common.yes') || 'Да',
			closeText: t('common.no') || 'Нет',
		});

		if (confirmed) {
			const { error } = await request(`/bookings/${id}`, 'DELETE');
			if (!error) {
				setBookings((prev) => prev.filter((book) => book._id !== id));
			}
		}
	};

	const handleFavorite = (id: string) => {
		// dispatch(updateFavoritesAsync(id));
		setFavoriteRestaurants((prev) =>
			prev.filter((rest) => (rest.id || rest._id) !== id),
		);
		dispatch(updateFavoritesAsync(id)).then((res) => {
			if (res.error) {
				loadProfileData();
			}
		});
	};

	if (loading) return <Loader />;

	return (
		<div className={styles.container}>
			<h1>{t('profile.title')}</h1>

			{(roleId === ROLE.MODERATOR || roleId === ROLE.ADMIN) && (
				<section className={styles.section}>
					<h2>Мои заведения</h2>
					<div className={styles.favoritesGrid}>
						{ownedRestaurants.length > 0 ? (
							ownedRestaurants.map((rest) => (
								<Card
									key={rest.id}
									id={rest.id}
									title={rest.name}
									imageUrl={rest.imageUrl}
									description={rest.description}
									rating={rest.rating}
									isFavorite={userFavorites.includes(rest.id)}
									handleFavorite={() => handleFavorite(rest.id)}
								/>
							))
						) : (
							<p>Вы еще не создали ни одного ресторана.</p>
						)}
					</div>
				</section>
			)}

			<section className={styles.section}>
				<h2>{t('profile.my_bookings')}</h2>
				{bookings.length > 0 ? (
					<div className={styles.bookingsGrid}>
						{bookings.map((booking) => (
							<div key={booking._id} className={styles.bookingCard}>
								<h4>
									{booking.restaurant?.name ||
										t('common.unknown_restaurant')}
								</h4>
								<div className={styles.summary}>
									<p>
										<strong>{t('restaurant.date')}:</strong>{' '}
										{booking.date}
									</p>
									<p>
										<strong>{t('restaurant.time')}:</strong>{' '}
										{booking.time}
									</p>
									<p>
										<strong>{t('restaurant.table')}:</strong> №
										{booking.tableNumber}
									</p>
								</div>
								<button
									className={styles.cancelBtn}
									onClick={() => handleCancel(booking._id)}
								>
									{t('common.cancel_booking')}
								</button>
							</div>
						))}
					</div>
				) : (
					<p>{t('profile.no_bookings')}</p>
				)}
			</section>

			<section className={styles.section}>
				<h2>{t('profile.favorites')}</h2>
				<div className={styles.favoritesGrid}>
					{favoriteRestaurants.length > 0 ? (
						favoriteRestaurants.map((rest) => (
							<Card
								key={rest._id || rest.id}
								id={rest._id || rest.id}
								title={rest.name}
								imageUrl={rest.imageUrl}
								description={rest.description}
								rating={rest.rating}
								isFavorite={true}
								handleFavorite={() => handleFavorite(rest._id || rest.id)}
							/>
						))
					) : (
						<p>{t('profile.no_favorites')}</p>
					)}
				</div>
			</section>
		</div>
	);
};
