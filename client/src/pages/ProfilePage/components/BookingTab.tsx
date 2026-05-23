import { useTranslation } from 'react-i18next';
import type { Booking } from '../../../types';
import styled from 'styled-components';

interface BookingsTabProps {
	bookings: Booking[];
	onCancel: (id: string) => Promise<void>;
}

export const BookingsTab = ({ bookings, onCancel }: BookingsTabProps) => {
	const { t } = useTranslation();

	if (!bookings.length) {
		return <p>{t('profile.no_bookings')}</p>;
	}

	return (
		<>
			{bookings.map((booking) => (
				<BookingCard key={booking._id}>
					<h4>{booking.restaurant?.name || t('common.unknown_restaurant')}</h4>
					<div className="summary">
						<p>
							<strong>{t('restaurant.date')}:</strong> {booking.date}
						</p>
						<p>
							<strong>{t('restaurant.time')}:</strong> {booking.time}
						</p>
						<p>
							<strong>{t('restaurant.table')}:</strong> №
							{booking.tableNumber}
						</p>
					</div>
					<button className="cancel-btn" onClick={() => onCancel(booking._id)}>
						{t('common.cancel_booking')}
					</button>
				</BookingCard>
			))}
		</>
	);
};

const BookingCard = styled.div`
	width: 300px;
	background: var(--card-background);
	color: var(--color);
	padding: 20px;
	border-radius: 15px;
	box-shadow: var(--nm-shadow-flat);

	h4 {
		margin: 0 0 10px 0;
		color: var(--color);
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
