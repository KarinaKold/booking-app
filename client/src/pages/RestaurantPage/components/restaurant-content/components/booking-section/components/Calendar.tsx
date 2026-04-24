import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Calendar.module.css';

interface BookingCalendarProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	availableDates: string[];
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
		d.setDate(d.getDate() + i);
		return d;
	});

	// текущий месяц и год
	const displayMonth = selectedDate
		.toLocaleString(i18n.language, {
			month: 'long',
			year: 'numeric',
		})
		.toUpperCase();

	const isSameDay = (d1: Date, d2: Date) =>
		d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className={styles.monthLabel}>{displayMonth}</span>
			</div>

			<div className={styles.wrapper}>
				<button
					className={styles.navBtn}
					onClick={() =>
						scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
					}
				>
					<FaChevronLeft />
				</button>

				<div className={styles.scrollArea} ref={scrollRef}>
					{days.map((day) => {
						const dateStr = day.toISOString().split('T')[0];
						const isSelected = isSameDay(day, selectedDate);
						const isAvailable = availableDates.includes(dateStr);

						return (
							<button
								key={dateStr}
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
					className={styles.navBtn}
					onClick={() =>
						scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
					}
				>
					<FaChevronRight />
				</button>
			</div>
		</div>
	);
};
