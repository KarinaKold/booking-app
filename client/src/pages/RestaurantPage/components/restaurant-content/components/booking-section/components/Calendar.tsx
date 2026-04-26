import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Calendar.module.css';

interface BookingCalendarProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	availableDates: Date[];
}

export const Calendar = ({
	selectedDate,
	onDateChange,
	availableDates,
}: BookingCalendarProps) => {
	const { i18n } = useTranslation();
	const scrollRef = useRef<HTMLDivElement>(null);

	const days = Array.from({ length: 30 }, (_, i) => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		d.setDate(d.getDate() + i);
		return d;
	});

	const displayMonth = selectedDate
		.toLocaleString(i18n.language, {
			month: 'long',
			year: 'numeric',
		})
		.toUpperCase();

	const isSameDay = (d1: Date, d2: Date) => {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	};

	const checkIsAvailable = (day: Date) => {
		return availableDates.some((availDate) => isSameDay(availDate, day));
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className={styles.monthLabel}>{displayMonth}</span>
			</div>
			<div className={styles.wrapper}>
				<button
					type="button"
					className={styles.navBtn}
					onClick={() =>
						scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' })
					}
				>
					<FaChevronLeft />
				</button>
				<div className={styles.scrollArea} ref={scrollRef}>
					{days.map((day) => {
						const isSelected = isSameDay(day, selectedDate);
						const isAvailable = checkIsAvailable(day);
						const dateKey = day.toISOString();

						return (
							<button
								key={dateKey}
								disabled={!isAvailable}
								onClick={() => onDateChange(day)}
								className={`${styles.dayCard} ${isSelected ? styles.selected : ''}`}
							>
								<span className={styles.dayName}>
									{day.toLocaleString(i18n.language, {
										weekday: 'short',
									})}
								</span>
								<span className={styles.dayNum}>{day.getDate()}</span>
							</button>
						);
					})}
				</div>
				<button
					type="button"
					className={styles.navBtn}
					onClick={() =>
						scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' })
					}
				>
					<FaChevronRight />
				</button>
			</div>
		</div>
	);
};
