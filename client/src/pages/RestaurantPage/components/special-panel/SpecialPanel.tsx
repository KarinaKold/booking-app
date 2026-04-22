import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useGetConfirmation } from '../../../../providers';
import { removeRestaurantAsync } from '../../../../actions';
// import { checkAccess } from '../../../../utils';
import { selectRestaurant, selectUserId, selectUserRole } from '../../../../selectors';
import { ROLE } from '../../../../constants';
import styled from 'styled-components';

const SpecialPanelContainer = ({ className, id, createdAt, editButton }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { getConfirmation } = useGetConfirmation();
	const userRole = useSelector(selectUserRole);
	const userId = useSelector(selectUserId);
	const restaurant = useSelector(selectRestaurant);

	const onRestaurantRemove = async (restaurantId) => {
		const confirmed = await getConfirmation({
			title: 'Удаление ресторана',
			description:
				'Вы действительно хотите удалить этот ресторан? Это действие нельзя будет отменить.',
			confirmText: 'Удалить',
			closeText: 'Отмена',
		});

		if (confirmed) {
			dispatch(removeRestaurantAsync(restaurantId)).then(() => {
				navigate('/');
			});
		}
	};

	const isAdmin = userRole === ROLE.ADMIN;
	const isModerator = userRole === ROLE.MODERATOR;
	const isOwner = restaurant && restaurant.owner === userId;

	const canControl = !createdAt
		? isAdmin || isModerator
		: isAdmin || (isModerator && isOwner);

	return (
		<div className={className}>
			{canControl && (
				<div className="buttons">
					{editButton}
					{createdAt && (
						<FaRegTrashAlt
							className="trash-icon"
							onClick={() => onRestaurantRemove(id)}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export const SpecialPanel = styled(SpecialPanelContainer)`
	display: flex;
	justify-content: space-between;
	margin: ${({ margin }) => margin};
	font-size: 18px;

	& .published-at {
		display: flex;
		align-items: center;
	}

	& .calendar-icon {
		margin-right: 7px;
		font-size: 18px;
		color: #666;
	}

	& .buttons {
		display: flex;
		align-items: center;
	}

	& i {
		position: relative;
		top: -1px;
	}
	& .trash-icon {
		font-size: 21px;
		margin-left: 10px;
		cursor: pointer;
		color: #333;
		transition: color 0.2s;

		&:hover {
			color: #cc0000;
		}
	}

	& svg {
		cursor: pointer;
		transition: opacity 0.2s;

		&:hover {
			opacity: 0.7;
		}
	}
`;
