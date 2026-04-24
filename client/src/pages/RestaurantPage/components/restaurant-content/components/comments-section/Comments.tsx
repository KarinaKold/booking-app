import { useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FaPaperPlane, FaStar } from 'react-icons/fa';
import { selectUserRole } from '../../../../../../selectors';
import { addCommentAsync } from '../../../../../../actions';
import { ROLE } from '../../../../../../constants';
import { Comment } from './Comment';
import styled from 'styled-components';

const CommentsContainer = ({ className, comments, restaurantId }) => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const [newComment, setNewComment] = useState('');
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(0);

	const onNewCommentAdd = (restaurantId, content, ratingValue) => {
		if (!content.trim()) return;
		dispatch(addCommentAsync(restaurantId, { content, rating: ratingValue }));
		// dispatch(addCommentAsync(restaurantId, content));
		setNewComment('');
		setRating(5);
	};

	const isGuest = userRole === ROLE.GUEST;

	return (
		<div className={className}>
			{!isGuest && (
				<>
					<div className="rating-selector">
						<span>Ваша оценка:</span>
						<div className="stars">
							{[1, 2, 3, 4, 5].map((star) => (
								<FaStar
									key={star}
									className="star"
									color={
										star <= (hoverRating || rating)
											? '#ffc107'
											: '#e4e5e9'
									}
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
								/>
							))}
						</div>
					</div>
					<div className="new-comment">
						<textarea
							value={newComment}
							name="comment"
							placeholder="Оставить отзыв..."
							onChange={({ target }) => setNewComment(target.value)}
						></textarea>
						<button
							className="send-button"
							onClick={() =>
								onNewCommentAdd(restaurantId, newComment, rating)
							}
						>
							<FaPaperPlane size="18px" />
						</button>
					</div>
				</>
			)}
			<div>
				{comments.length > 0
					? comments.map(
							({ id, author, authorId, content, rating, publishedAt }) => (
								<Comment
									key={id}
									restaurantId={restaurantId}
									id={id}
									author={author}
									authorId={authorId}
									content={content}
									rating={rating}
									publishedAt={publishedAt}
								/>
							),
						)
					: isGuest && (
							<div>
								<Link to="/login">Войдите</Link>, чтобы оставить свой
								первый отзыв.
							</div>
						)}
			</div>
		</div>
	);
};

export const Comments = styled(CommentsContainer)`
	margin: 20px auto;
	width: 100%;
	max-width: 800px;

	& .rating-selector {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-bottom: 15px;
		font-weight: 600;
	}

	& .stars {
		display: flex;
		gap: 5px;
	}

	& .star {
		cursor: pointer;
		font-size: 20px;
		transition: transform 0.1s;
	}

	& .new-comment {
		display: flex;
		width: 100%;
		margin: 20px 0;
		gap: 10px;
	}

	& .new-comment textarea {
		flex-grow: 1;
		height: 100px;
		font-size: 16px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 8px;
		resize: none;
	}

	& .send-button {
		background: none;
		border: none;
		cursor: pointer;
		color: #4caf50;
		display: flex;
		align-items: center;
		transition: color 0.2s;
	}

	& .send-button:hover {
		color: #45a049;
	}

	& .send-button:disabled {
		color: #ccc;
		cursor: not-allowed;
	}

	// margin: 0 auto;
	// width: 580px;

	// & .new-comment {
	// 	display: flex;
	// 	width: 100%;
	// 	margin: 20px 0 0;
	// }

	// & .new-comment textarea {
	// 	width: 550px;
	// 	height: 120px;
	// 	font-size: 18px;
	// 	resize: none;
	// }
`;
