import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../../../components/shared/buttons/Button';

interface BookingWidgetProps {
	selectedDate: Date;
	selectedTime: string | null;
	selectedTable: number | null;
	isBooking: boolean;
	isSuccess: boolean;
	onResetSuccess: () => void;
	onBooking: () => void;
}

export const BookingWidget = ({
	selectedDate,
	selectedTime,
	selectedTable,
	isBooking,
	isSuccess,
	onResetSuccess,
	onBooking,
}: BookingWidgetProps) => {
	const { t } = useTranslation();

	return (
		<StyledWidget>
			<div className="booking-card">
				{isSuccess ? (
					<div className="success-message">
						<h4>{t('restaurant.ready', 'Готово!')}</h4>
						{/* <p>
							Стол №{selectedTable} забронирован на {selectedTime}
						</p> */}
						<p>
							{t(
								'restaurant.booked_at',
								'Стол №{{table}} забронирован на {{time}}',
								{
									table: selectedTable,
									time: selectedTime,
								},
							)}
						</p>
						<Button onClick={onResetSuccess}>
							{t('restaurant.book_more', 'Забронировать еще')}
						</Button>
					</div>
				) : (
					<>
						<h4>{t('restaurant.your_booking', 'Ваше бронирование')}</h4>
						<div className="summary">
							<p>
								<strong>{t('restaurant.date', 'Дата')}:</strong>{' '}
								{selectedDate.toLocaleDateString()}
							</p>
							<p>
								<strong>{t('restaurant.time', 'Время')}:</strong>{' '}
								{selectedTime || t('common.not_selected', 'не выбрано')}
							</p>
							<p>
								<strong>{t('restaurant.table', 'Стол')}:</strong>{' '}
								{selectedTable
									? `№${selectedTable}`
									: t('common.not_selected', 'не выбран')}
							</p>
						</div>
						<Button
							disabled={!selectedTable || !selectedTime || isBooking}
							style={{ width: '100%' }}
							onClick={onBooking}
						>
							{isBooking
								? '...'
								: t('restaurant.book_btn', 'Забронировать')}
						</Button>
					</>
				)}
			</div>
		</StyledWidget>
	);
};

const StyledWidget = styled.aside`
	width: 100%;
	max-width: 350px;

	.booking-card {
		background: #f0f0f0;
		padding: 30px;
		border-radius: 28px;
		box-shadow:
			10px 10px 20px #bebebe,
			-10px -10px 20px #ffffff;
		position: sticky;
		top: 40px;

		h4 {
			margin-top: 0;
			margin-bottom: 20px;
			font-size: 1.2rem;
			color: #1a1a1a;
		}
	}

	.summary {
		margin: 20px 0;
		padding: 15px;
		border-radius: 15px;
		background: #f0f0f0;
		box-shadow:
			inset 4px 4px 8px #bebebe,
			inset -4px -4px 8px #ffffff;

		p {
			margin-bottom: 10px;
			font-size: 0.95rem;
			color: #333;

			strong {
				color: #666;
				margin-right: 5px;
			}
		}
	}

	.success-message {
		text-align: center;

		h4 {
			color: #4caf50;
			font-size: 1.4rem;
		}

		p {
			margin-bottom: 20px;
			line-height: 1.5;
			color: #444;
		}
	}

	@media (max-width: 1200px) {
		max-width: 100%;

		.booking-card {
			position: static;
			margin: 0 auto;
			max-width: 500px;
		}
	}
`;
