import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useAppDispatch } from '../../../../hooks';
import { useGetConfirmation } from '../../../../providers';
import { removeRestaurantAsync } from '../../../../actions';
// import { checkAccess } from '../../../../utils';
import { selectRestaurant, selectUserId, selectUserRole } from '../../../../selectors';
import { ROLE } from '../../../../constants';
import styled from 'styled-components';

interface SpecialPanelProps {
	className?: string;
	margin?: string;
	id: string;
	createdAt: string;
	editButton: ReactNode;
}

const SpecialPanelContainer = ({
	className,
	id,
	createdAt,
	editButton,
}: SpecialPanelProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { getConfirmation } = useGetConfirmation();
	const userRole = useSelector(selectUserRole);
	const userId = useSelector(selectUserId);
	const restaurant = useSelector(selectRestaurant);

	const onRestaurantRemove = async (restaurantId: string): Promise<void> => {
		const confirmed = await getConfirmation({
			title: 'Удаление ресторана',
			description:
				'Вы действительно хотите удалить этот ресторан? Это действие нельзя будет отменить.',
			confirmText: 'Удалить',
			closeText: 'Отмена',
		});

		if (confirmed) {
			const response = dispatch(removeRestaurantAsync(restaurantId));
			if (response && !('error' in response && response.error)) {
				navigate('/');
			}
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
	justify-content: flex-end;
	margin: ${({ margin }) => margin};
	font-size: 18px;

	& .buttons {
		display: flex;
		align-items: center;
	}

	& i {
		position: relative;
	}

	& .trash-icon {
		font-size: 21px;
		margin: 0 30px;
		cursor: pointer;
		color: #333;
		transition: color 0.2s;

		&:hover {
			color: #cc0000;
		}
	}
`;
