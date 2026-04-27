import { useState, useEffect, useMemo, useCallback } from 'react';
import { request } from '../utils/request';
import { formatDate, generateTimeSlots } from '../pages/RestaurantPage/utils';

export interface BookingState {
	selectedDate: Date;
	selectedTime: string | null;
	selectedTable: number | null;
	busyTableIds: number[];
	isBooking: boolean;
	isSuccess: boolean;
}

export interface BookingData {
	timeSlots: string[];
	availableDates: Date[];
}
export interface BookingHandlers {
	onDateChange: (date: Date) => void;
	onTimeSelect: (time: string) => void;
	onTableSelect: (tableNumber: number) => void;
	onResetBookingStatus: () => void;
	onBookingSubmit: () => Promise<void>;
}

export const useBooking = (restaurantId: string, workingHours: string) => {
	const [isBooking, setIsBooking] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	});
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [selectedTable, setSelectedTable] = useState<number | null>(null);
	const [busyTableIds, setBusyTableIds] = useState<number[]>([]);

	useEffect(() => {
		if (selectedDate && selectedTime && restaurantId) {
			const dateStr = formatDate(selectedDate);
			request<string[]>(
				`/restaurants/${restaurantId}/busy-tables?date=${dateStr}&time=${selectedTime}`,
			)
				.then(({ data }) => {
					setBusyTableIds(data ? data.map(Number) : []);
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
				date.setHours(0, 0, 0, 0);
				date.setDate(date.getDate() + i);
				return date;
			}),
		[],
	);

	const onDateChange = useCallback((date: Date) => {
		setSelectedDate(date);
		setSelectedTime('');
		setSelectedTable(null);
	}, []);

	const onTimeSelect = useCallback((time: string) => {
		setSelectedTime(time);
		setSelectedTable(null);
	}, []);

	const onTableSelect = useCallback((tableId: number) => {
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
				const { data } = await request<string[]>(
					`/restaurants/${restaurantId}/busy-tables?date=${dateStr}&time=${selectedTime}`,
				);
				setBusyTableIds(data ? data.map(Number) : []);
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
		} as BookingState,
		bookingData: {
			timeSlots,
			availableDates,
		} as BookingData,
		bookingHandlers: {
			onDateChange,
			onTimeSelect,
			onTableSelect,
			onResetBookingStatus,
			onBookingSubmit,
		} as BookingHandlers,
	};
};
