import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '../../../../../../../components';
import styled from 'styled-components';

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
		<StyledCalendar>
			<div className="header">
				<span className="monthLabel">{displayMonth}</span>
			</div>
			<div className="wrapper">
				<Button
					type="button"
					className="navBtn"
					onClick={() =>
						scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' })
					}
				>
					<FaChevronLeft />
				</Button>
				<div className="scrollArea" ref={scrollRef}>
					{days.map((day) => {
						const isSelected = isSameDay(day, selectedDate);
						const isAvailable = checkIsAvailable(day);
						const dateKey = day.toISOString();

						return (
							<button
								key={dateKey}
								disabled={!isAvailable}
								onClick={() => onDateChange(day)}
								className={`dayCard ${isSelected ? 'selected' : ''}`}
							>
								<span className="dayName">
									{day.toLocaleString(i18n.language, {
										weekday: 'short',
									})}
								</span>
								<span className="dayNum">{day.getDate()}</span>
							</button>
						);
					})}
				</div>
				<Button
					type="button"
					className="navBtn"
					onClick={() =>
						scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' })
					}
				>
					<FaChevronRight />
				</Button>
			</div>
		</StyledCalendar>
	);
};

const StyledCalendar = styled.div`
	background: #f8fafc;
	padding: 16px;
	border-radius: 24px;
	margin-bottom: 20px;
	max-width: 500px;

	.header {
		margin-bottom: 15px;
		padding-left: 8px;
	}

	.monthLabel {
		font-weight: 700;
		font-size: 0.75rem;
		color: #64748b;
		letter-spacing: 0.05em;
	}

	.wrapper {
		display: flex;
		align-items: center;
		position: relative;
		gap: 4px;
	}

	.scrollArea {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		scroll-behavior: smooth;
		padding: 8px 4px;
		scrollbar-width: none;
	}

	.scrollArea::-webkit-scrollbar {
		display: none;
	}

	.dayCard {
		flex: 0 0 52px;
		height: 68px;
		border: none;
		border-radius: 16px;
		background: #f8fafc;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow:
			5px 5px 10px #e2e8f0,
			-5px -5px 10px #ffffff;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid transparent;

		&:hover:not(:disabled) {
			transform: translateY(-2px);
		}

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
			box-shadow: none;
			background: transparent;
		}
	}

	.selected {
		background: #0ea5e9;
		color: white;
		border-color: #0ea5e9;
	}

	.dayNum {
		font-weight: 700;
		font-size: 1rem;
		margin-top: 2px;
	}

	.dayName {
		font-size: 0.6rem;
		text-transform: uppercase;
		font-weight: 600;
		opacity: 0.8;
	}

	.selected .dayName {
		opacity: 1;
	}

	.navBtn {
		background: white;
		border: none;
		width: 30px;
		border-radius: 50%;
		display: grid;
		align-items: center;
		justify-content: center;
		color: #94a3b8;
		cursor: pointer;
		box-shadow: 2px 2px 5px #e2e8f0;
		z-index: 2;

		&:hover {
			color: #0ea5e9;
			background: #fff;
		}
	}
`;
