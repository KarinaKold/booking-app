import { useState, useEffect, useMemo, useCallback } from 'react';
import { request } from '../utils/request';
import { formatDate, generateTimeSlots } from '../pages/RestaurantPage/utils';

export const useBooking = (restaurantId, workingHours) => {
	const [isBooking, setIsBooking] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState('');
	const [selectedTable, setSelectedTable] = useState(null);
	const [busyTableIds, setBusyTableIds] = useState([]);

	useEffect(() => {
		if (selectedDate && selectedTime && restaurantId) {
			const dateStr = formatDate(selectedDate);
			request(
				`/restaurants/${restaurantId}/busy-tables?date=${dateStr}&time=${selectedTime}`,
			)
				.then(({ data }) => {
					setBusyTableIds(data || []);
					setSelectedTable(null);
				})
				.catch((e) => console.error('Ошибка загрузки столов:', e));
		}
	}, [selectedDate, selectedTime, restaurantId]);

	const timeSlots = useMemo(
		() => generateTimeSlots(workingHours, selectedDate),
		[workingHours, selectedDate],
	);

	const availableDates = useMemo(
		() =>
			Array.from({ length: 14 }, (_, i) => {
				const date = new Date();
				date.setDate(date.getDate() + i);
				return formatDate(date);
			}),
		[],
	);

	const onDateChange = useCallback((date) => {
		setSelectedDate(date);
		setSelectedTime('');
		setSelectedTable(null);
	}, []);

	const onTimeSelect = useCallback((time) => {
		setSelectedTime(time);
		setSelectedTable(null);
	}, []);

	const onTableSelect = useCallback((tableId) => {
		setSelectedTable(tableId);
	}, []);

	const onResetBookingStatus = useCallback(() => {
		setIsSuccess(false);
		setSelectedTable(null);
		setSelectedTime('');
	}, []);

	const onBookingSubmit = async () => {
		if (!selectedTable || !selectedTime) return;
		setIsBooking(true);
		const dateStr = formatDate(selectedDate);

		try {
			const { error } = await request('/bookings', 'POST', {
				restaurantId,
				date: dateStr,
				time: selectedTime,
				tableNumber: selectedTable,
			});
			if (!error) {
				setIsSuccess(true);
				const { data } = await request(
					`/restaurants/${restaurantId}/busy-tables?date=${dateStr}&time=${selectedTime}`,
				);
				setBusyTableIds(data || []);
			}
		} catch (e) {
			console.log('Ошибка при бронировании:', e);
		} finally {
			setIsBooking(false);
		}
	};

	return {
		bookingState: {
			selectedDate,
			selectedTime,
			selectedTable,
			busyTableIds,
			isBooking,
			isSuccess,
		},
		bookingData: {
			timeSlots,
			availableDates,
		},
		bookingHandlers: {
			onDateChange,
			onTimeSelect,
			onTableSelect,
			onResetBookingStatus,
			onBookingSubmit,
		},
	};
};
