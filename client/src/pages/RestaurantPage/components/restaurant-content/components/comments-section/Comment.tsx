import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaCalendarAlt, FaTrashAlt, FaStar } from 'react-icons/fa';
import { useGetConfirmation } from '../../../../../../providers';
import { selectUserId, selectUserRole } from '../../../../../../selectors';
import { removeCommentAsync } from '../../../../../../actions';
import { ROLE } from '../../../../../../constants';
import styled from 'styled-components';

const CommentContainer = ({
	className,
	restaurantId,
	id,
	author,
	authorId,
	publishedAt,
	content,
	rating,
}) => {
	const dispatch = useDispatch();
	const { getConfirmation } = useGetConfirmation();
	const userRole = useSelector(selectUserRole);
	const currentUserId = useSelector(selectUserId);

	const onCommentRemove = async (id) => {
		const confirmed = await getConfirmation({
			title: 'Удалить отзыв',
			description: 'Вы уверены, что хотите удалить отзыв?',
			confirmText: 'Удалить',
			closeText: 'Отмена',
		});

		if (confirmed) {
			dispatch(removeCommentAsync(restaurantId, id));
		}
	};

	const isAdmin = [ROLE.ADMIN].includes(userRole);
	const isAuthor = currentUserId === authorId;
	const canRemove = isAdmin || isAuthor;

	const formattedDate = new Date(publishedAt).toLocaleDateString();

	return (
		<div className={className}>
			<div className="comment-body">
				<div className="information-panel">
					<div>
						<div className="comment-rating">
							{[1, 2, 3, 4, 5].map((star) => (
								<FaStar
									key={star}
									color={star <= rating ? '#ffc107' : '#e4e5e9'}
									size="14px"
								/>
							))}
						</div>
						<div className="user-info">
							<FaUserCircle className="icon" />
							<span>{author}</span>
						</div>
					</div>
					<div className="date-info">
						<FaCalendarAlt className="icon" />
						<span>{formattedDate}</span>
					</div>
				</div>
				<div className="comment-text">{content}</div>
			</div>
			{canRemove && (
				<button className="delete-button" onClick={() => onCommentRemove(id)}>
					<FaTrashAlt size="18px" />
				</button>
			)}
		</div>
	);
};

export const Comment = styled(CommentContainer)`
	display: flex;
	align-items: flex-start;
	width: 100%;
	margin-top: 15px;
	gap: 10px;

	& .comment-body {
		flex-grow: 1;
		padding: 12px 15px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	& .information-panel {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 14px;
		color: #666;
	}

	& .user-info,
	& .date-info {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	& .comment-rating {
		display: flex;
		gap: 2px;
	}

	& .icon {
		color: #888;
	}

	& .comment-text {
		font-size: 16px;
		line-height: 1.4;
		color: #333;
		word-break: break-word;
	}

	& .delete-button {
		background: none;
		border: none;
		color: #ff4d4f;
		cursor: pointer;
		padding: 8px;
		display: flex;
		align-items: center;
		transition:
			transform 0.2s,
			color 0.2s;
	}

	& .delete-button:hover {
		color: #cf1322;
		transform: scale(1.1);
	}
	// display: flex;
	// width: 100%;
	// margin-top: 10px;

	// & .comment {
	// 	width: 550px;
	// 	padding: 5px 10px;
	// 	border: 1px solid #000;
	// }

	// & .information-panel {
	// 	display: flex;
	// 	justify-content: space-between;
	// }

	// & .author {
	// 	display: flex;
	// }

	// & .published-at {
	// 	display: flex;
	// }
`;
