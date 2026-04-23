import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
	FaUtensils,
	FaMapMarkerAlt,
	FaClock,
	FaStar,
	FaEdit,
	FaChevronDown,
	FaChevronUp,
	FaTimes,
	FaChevronLeft,
	FaChevronRight,
} from 'react-icons/fa';
import { Calendar } from '../../components/Calendar';
import styled from 'styled-components';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { Loader } from '../../../../components';
import { request } from '../../../../utils/request';
import { setRestaurantData } from '../../../../actions';
import { selectRestaurant } from '../../../../selectors';
import styles from '../../RestaurantPage.module.css';
import { TableGrid } from '../TableGrid';
import { Time } from '../Time';
import { Button } from '../../../../components/buttons/Button';
import { Comments } from '../Comments';

const RestaurantContentContainer = ({ restaurant: { id, createdAt } }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const restaurant = useSelector(selectRestaurant);

	// Состояния для галереи
	const [sideOffset, setSideOffset] = useState(0);
	const [viewerIndex, setViewerIndex] = useState(null);

	// Логика слайдера превью
	const itemsToShow = 2;
	const sideImages = restaurant.images.slice(1);
	const canScrollUp = sideOffset > 0;
	const canScrollDown = sideOffset < sideImages.length - itemsToShow;

	const [loading, setLoading] = useState(true);
	const [isBooking, setIsBooking] = useState(false); // Состояние отправки
	const [isSuccess, setIsSuccess] = useState(false);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [selectedTable, setSelectedTable] = useState<number | null>(null);
	const [busyTableIds, setBusyTableIds] = useState<number[]>([]);

	const generateTimeSlots = (workingHours: string) => {
		if (!workingHours || !workingHours.includes(' - ')) return [];

		const [startStr, endStr] = workingHours.split(' - ');
		const startHour = parseInt(startStr.split(':')[0], 10);
		const endHour = parseInt(endStr.split(':')[0], 10);

		const slots = [];
		const effectiveEnd = endHour <= startHour ? endHour + 24 : endHour;

		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();
		const currentDate = now.getDate();
		const currentHour = now.getHours();

		const isToday =
			selectedDate.getFullYear() === currentYear &&
			selectedDate.getMonth() === currentMonth &&
			selectedDate.getDate() === currentDate;

		for (let hour = startHour; hour < effectiveEnd; hour++) {
			const hour24 = hour % 24;
			if (isToday) {
				if (hour < 24 && hour <= currentHour) continue;
				if (hour >= 24 && hour24 <= currentHour) continue;
			}

			const formattedHour = hour24 < 10 ? `0${hour24}:00` : `${hour24}:00`;
			slots.push(formattedHour);
		}
		return slots;
	};

	useEffect(() => {
		setLoading(true);
		request(`/restaurants/${id}`)
			.then(({ data }) => {
				dispatch(setRestaurantData(data));
			})
			.finally(() => setLoading(false));
	}, [dispatch, id]);

	useEffect(() => {
		if (selectedDate && selectedTime && id) {
			const year = selectedDate.getFullYear();
			const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
			const day = String(selectedDate.getDate()).padStart(2, '0');
			const dateStr = `${year}-${month}-${day}`;

			request(`/restaurants/${id}/busy-tables?date=${dateStr}&time=${selectedTime}`)
				.then(({ data }) => {
					setBusyTableIds(data || []);
					setSelectedTable(null);
				})
				.catch((err) => console.error('Ошибка загрузки занятых столов:', err));
		}
	}, [selectedDate, selectedTime, id]);

	const timeSlots = useMemo(() => {
		return restaurant ? generateTimeSlots(restaurant.workingHours) : [];
	}, [selectedDate, restaurant]);

	const availableDates = useMemo(() => {
		return Array.from({ length: 14 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() + i);

			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');

			return `${year}-${month}-${day}`;
		});
	}, []);

	const handleBooking = async () => {
		if (!selectedTable || !selectedTime) return;
		setIsBooking(true);

		const year = selectedDate.getFullYear();
		const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
		const day = String(selectedDate.getDate()).padStart(2, '0');
		const dateStr = `${year}-${month}-${day}`;

		try {
			await request('/bookings', 'POST', {
				restaurantId: id,
				date: dateStr,
				time: selectedTime,
				tableNumber: selectedTable,
			});
			setIsSuccess(true);
			const { data } = await request(
				`/restaurants/${id}/busy-tables?date=${dateStr}&time=${selectedTime}`,
			);
			setBusyTableIds(data || []);
		} catch (e) {
			console.error('Ошибка бронирования:', e);
		} finally {
			setIsBooking(false);
		}
	};

	if (loading) return <Loader />;
	if (!restaurant) return <div>Ресторан не найден</div>;

	const scrollUp = (e) => {
		e.stopPropagation();
		setSideOffset((prev) => prev - 1);
	};
	const scrollDown = (e) => {
		e.stopPropagation();
		setSideOffset((prev) => prev + 1);
	};

	// Логика полноэкранного вьювера
	const openViewer = (index) => setViewerIndex(index);
	const closeViewer = () => setViewerIndex(null);
	const nextImg = (e) => {
		e.stopPropagation();
		setViewerIndex((prev) => (prev + 1) % restaurant.images.length);
	};
	const prevImg = (e) => {
		e.stopPropagation();
		setViewerIndex(
			(prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length,
		);
	};

	return (
		<>
			<div className={styles.page}>
				<SpecialPanel
					id={id}
					createdAt={createdAt}
					margin="-20px 0 20px"
					editButton={
						<FaEdit
							className={styles.editIcon}
							onClick={() => navigate(`/rest/${id}/edit`)}
						/>
					}
				/>
				{/* ВЕРХНИЙ БЛОК: ИНТЕРАКТИВНАЯ ГАЛЕРЕЯ И ИНФО */}
				<div className={styles.topSection}>
					<section className={styles.galleryGrid}>
						<div className={styles.mainImage} onClick={() => openViewer(0)}>
							<img src={restaurant.images[0]} alt="Main" />
						</div>
						<div className={styles.sideGalleryContainer}>
							<button
								className={styles.navBtn}
								onClick={scrollUp}
								style={{ visibility: canScrollUp ? 'visible' : 'hidden' }}
							>
								<FaChevronUp />
							</button>
							<div className={styles.sideImagesWindow}>
								<div
									className={styles.sideImagesTrack}
									style={{
										transform: `translateY(-${sideOffset * 208}px)`,
									}}
								>
									{sideImages.map((img, index) => (
										<div
											key={index}
											className={styles.sideImageWrapper}
											onClick={() => openViewer(index + 1)}
										>
											<img src={img} alt={`Side ${index}`} />
										</div>
									))}
								</div>
							</div>
							<button
								className={styles.navBtn}
								onClick={scrollDown}
								style={{
									visibility: canScrollDown ? 'visible' : 'hidden',
								}}
							>
								<FaChevronDown />
							</button>
						</div>
					</section>
					<section className={styles.infoSide}>
						<div className={styles.heroInfo}>
							<div className={styles.headerMain}>
								<h2>{restaurant.name}</h2>
								<div className={styles.ratingBadge}>
									<FaStar /> {Number(restaurant.rating).toFixed(1)}
								</div>
							</div>
							<div className={styles.meta}>
								<span>
									<FaMapMarkerAlt /> {restaurant.address}
								</span>
								<span>
									<FaClock /> {restaurant.workingHours}
								</span>
								<span>
									<FaUtensils /> {restaurant.cuisine}
								</span>
							</div>
						</div>
						<div className={styles.aboutSection}>
							<h3>{t('restaurant.about')}</h3>
							<p className={styles.descriptionText}>
								{restaurant.description}
							</p>
						</div>
					</section>
				</div>
				{/* LIGHTBOX: ПОЛНОЭКРАННЫЙ ПРОСМОТР */}
				{viewerIndex !== null && (
					<div className={styles.viewerOverlay} onClick={closeViewer}>
						<button className={styles.closeViewer} onClick={closeViewer}>
							<FaTimes />
						</button>
						<button className={styles.viewerNavLeft} onClick={prevImg}>
							<FaChevronLeft />
						</button>

						<div
							className={styles.viewerContent}
							onClick={(e) => e.stopPropagation()}
						>
							<img
								src={restaurant.images[viewerIndex]}
								alt="Fullscreen view"
							/>
							<div className={styles.viewerCounter}>
								{viewerIndex + 1} / {restaurant.images.length}
							</div>
						</div>

						<button className={styles.viewerNavRight} onClick={nextImg}>
							<FaChevronRight />
						</button>
					</div>
				)}

				{/* ВЫБОР СТОЛОВ И КОРЗИНА */}
				<div className={styles.contentGrid}>
					<div className={styles.mainInfo}>
						<section className={styles.bookingControls}>
							<h3>{t('restaurant.select_datetime')}</h3>
							<Calendar
								selectedDate={selectedDate}
								onDateChange={setSelectedDate}
								availableDates={availableDates}
							/>
							<Time
								slots={timeSlots}
								selectedTime={selectedTime}
								onSelect={setSelectedTime}
							/>
						</section>

						<section className={styles.section}>
							<h3>{t('restaurant.choose_table')}</h3>
							<TableGrid
								tables={restaurant.tables}
								busyTableIds={busyTableIds}
								selectedId={selectedTable}
								onSelect={setSelectedTable}
								isSelectionDisabled={!selectedTime}
							/>
						</section>
					</div>
					<aside className={styles.bookingSidebar}>
						<div className={styles.bookingCard}>
							{/* Содержимое карточки бронирования (isSuccess ? ... : ...) */}
							{isSuccess ? (
								<div className={styles.successMessage}>
									<h4>Готово!</h4>
									<p>
										Стол №{selectedTable} забронирован на{' '}
										{selectedTime}
									</p>
									<Button
										onClick={() => {
											setIsSuccess(false);
											setSelectedTable(null);
										}}
									>
										Забронировать еще
									</Button>
								</div>
							) : (
								<>
									<h4>{t('restaurant.your_booking')}</h4>
									<div className={styles.summary}>
										<p>
											<strong>{t('restaurant.date')}:</strong>{' '}
											{selectedDate.toLocaleDateString()}
										</p>
										<p>
											<strong>{t('restaurant.time')}:</strong>{' '}
											{selectedTime || t('common.not_selected')}
										</p>
										<p>
											<strong>{t('restaurant.table')}:</strong>{' '}
											{selectedTable
												? `№${selectedTable}`
												: t('common.not_selected')}
										</p>
									</div>
									<Button
										disabled={
											!selectedTable || !selectedTime || isBooking
										}
										style={{ width: '100%' }}
										onClick={handleBooking}
									>
										{isBooking
											? 'Отправка...'
											: t('restaurant.book_btn')}
									</Button>
								</>
							)}
						</div>
					</aside>
				</div>

				<div className={styles.commentsSection}>
					<hr className={styles.separator} />
					<h3>Отзывы</h3>
					<Comments
						restaurantId={restaurant.id}
						comments={restaurant.comments}
					/>
				</div>
			</div>
		</>
	);
};

export const RestaurantContent = styled(RestaurantContentContainer)`
	// & img {
	// 	float: left;
	// 	margin: 0 20px 10px 0;
	// }

	// & .post-text {
	// 	font-size: 18px;
	// 	white-space: pre-line;
	// }

	.description-text {
		font-size: 18px;
		white-space: pre-line;
		line-height: 1.5;
		color: #333;
	}

	.post-text {
		font-size: 18px;
		white-space: pre-line;
	}
`;
