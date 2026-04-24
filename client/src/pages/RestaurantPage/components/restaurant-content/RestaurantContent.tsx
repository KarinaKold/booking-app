import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaEdit } from 'react-icons/fa';
import { BookingSection, BookingWidget, Comments, Gallery, Info } from './components';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { Loader } from '../../../../components';
import { formatDate, generateTimeSlots } from '../../utils';
import { request } from '../../../../utils/request';
import { setRestaurantData } from '../../../../actions';
import { selectRestaurant } from '../../../../selectors';
import styled from 'styled-components';

export const RestaurantContent = ({ restaurant: { id, createdAt } }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const restaurant = useSelector(selectRestaurant);

	const [loading, setLoading] = useState(true);
	const [isBooking, setIsBooking] = useState(false); // Состояние отправки
	const [isSuccess, setIsSuccess] = useState(false);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [selectedTable, setSelectedTable] = useState<number | null>(null);
	const [busyTableIds, setBusyTableIds] = useState<number[]>([]);

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
			const dateStr = formatDate(selectedDate);
			request(`/restaurants/${id}/busy-tables?date=${dateStr}&time=${selectedTime}`)
				.then(({ data }) => {
					setBusyTableIds(data || []);
					setSelectedTable(null);
				})
				.catch((e) => console.error('Ошибка загрузки занятых столов:', e));
		}
	}, [selectedDate, selectedTime, id]);

	const timeSlots = useMemo(() => {
		return restaurant ? generateTimeSlots(restaurant.workingHours, selectedDate) : [];
	}, [selectedDate, restaurant]);

	const availableDates = useMemo(() => {
		return Array.from({ length: 14 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() + i);
			return formatDate(date);
		});
	}, []);

	const handleBooking = async () => {
		if (!selectedTable || !selectedTime) return;
		setIsBooking(true);
		const dateStr = formatDate(selectedDate);
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

	return (
		<>
			<StyledRestaurantContent>
				<SpecialPanel
					id={id}
					createdAt={createdAt}
					margin="10px 0 30px"
					editButton={
						<FaEdit
							className="edit-icon"
							onClick={() => navigate(`/rest/${id}/edit`)}
						/>
					}
				/>
				<div className="top-section">
					<Gallery images={restaurant.images} name={restaurant.name} />
					<Info
						name={restaurant.name}
						rating={restaurant.rating}
						address={restaurant.address}
						workingHours={restaurant.workingHours}
						cuisine={restaurant.cuisine}
						hasBarCard={restaurant.hasBarCard}
						description={restaurant.description}
					/>
				</div>
				<div className="booking">
					<BookingSection
						selectedDate={selectedDate}
						onDateChange={setSelectedDate}
						availableDates={availableDates}
						timeSlots={timeSlots}
						selectedTime={selectedTime}
						onTimeSelect={setSelectedTime}
						tables={restaurant.tables}
						busyTableIds={busyTableIds}
						selectedTable={selectedTable}
						onTableSelect={setSelectedTable}
					/>
					<BookingWidget
						selectedDate={selectedDate}
						selectedTime={selectedTime}
						selectedTable={selectedTable}
						isBooking={isBooking}
						isSuccess={isSuccess}
						onResetSuccess={() => {
							setIsSuccess(false);
							setSelectedTable(null);
						}}
						onBooking={handleBooking}
					/>
				</div>
				<div className="comments-section">
					<hr className="hr" />
					<h3>Отзывы</h3>
					<Comments
						restaurantId={restaurant.id}
						comments={restaurant.comments}
					/>
				</div>
			</StyledRestaurantContent>
		</>
	);
};

const StyledRestaurantContent = styled.div`
	max-width: 1400px;
	margin: 0 auto;
	padding: 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	.edit-icon {
		font-size: 22px;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: #4caf50;
		}
	}

	.top-section {
		display: grid;
		grid-template-columns: 800px 1fr;
		gap: 40px;
		align-items: start;
		width: 100%;
	}

	.booking {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 40px;
		width: 100%;
	}

	.comments-section {
		margin-top: 20px;
		padding-bottom: 60px;
	}

	.hr {
		border: 0;
		border-top: 1px solid #ddd;
		margin: 40px 0;
	}

	@media (max-width: 1200px) {
		.top-section,
		.booking {
			grid-template-columns: 1fr;
		}

		.bookingSidebar {
			max-width: 100%;
		}

		.bookingCard {
			position: static;
			margin: 0 auto;
			max-width: 500px;
		}
	}
`;
