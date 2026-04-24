import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { BookingSection, BookingWidget, Comments, Gallery, Info } from './components';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { selectRestaurant } from '../../../../selectors';
import styled from 'styled-components';
import { useBooking } from '../../../../hooks/use-booking';

export const RestaurantContent = ({ restaurant: { id, createdAt } }) => {
	const navigate = useNavigate();
	const restaurant = useSelector(selectRestaurant);
	const { bookingState, bookingData, bookingHandlers } = useBooking(
		id,
		restaurant?.workingHours,
	);

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
						{...bookingState}
						{...bookingData}
						tables={restaurant.tables}
						onDateChange={bookingHandlers.onDateChange}
						onTimeSelect={bookingHandlers.onTimeSelect}
						onTableSelect={bookingHandlers.onTableSelect}
					/>
					<BookingWidget
						{...bookingState}
						onResetSuccess={bookingHandlers.onResetBookingStatus}
						onBooking={bookingHandlers.onBookingSubmit}
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
