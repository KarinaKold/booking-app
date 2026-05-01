import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { FaPaperPlane, FaStar } from 'react-icons/fa';
import { useAppDispatch } from '../../../../../../hooks';
import {
	selectCommentError,
	selectCommentSubmitting,
	selectUserRole,
} from '../../../../../../selectors';
import { addCommentAsync } from '../../../../../../actions';
import { ROLE } from '../../../../../../constants';
import { Comment as CommentItem } from './Comment';
import type { CommentData } from '../../../../../HomePage/types';
import styled from 'styled-components';

interface CommentsProps {
	className?: string;
	comments: CommentData[];
	restaurantId: string;
}

const CommentsContainer = ({ className, comments, restaurantId }: CommentsProps) => {
	const dispatch = useAppDispatch();
	const userRole = useSelector(selectUserRole);
	const isCommentSubmitting = useSelector(selectCommentSubmitting);
	const commentError = useSelector(selectCommentError);
	const [newComment, setNewComment] = useState<string>('');
	const [rating, setRating] = useState<number>(5);
	const [hoverRating, setHoverRating] = useState<number>(0);

	const onNewCommentAdd = async (
		restaurantId: string,
		content: string,
		ratingValue: number,
	) => {
		if (!content.trim() || isCommentSubmitting) return;

		const response = await dispatch(
			addCommentAsync(restaurantId, { content, rating: ratingValue }),
		);

		if (response && !response.error) {
			setNewComment('');
			setRating(5);
		}
	};

	const isGuest = userRole === ROLE.GUEST;

	const onTextareaChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
		setNewComment(target.value);
	};

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
							onChange={onTextareaChange}
							disabled={isCommentSubmitting}
						></textarea>
						<button
							type="button"
							className="send-button"
							disabled={isCommentSubmitting}
							onClick={(e) => {
								e.preventDefault(); // Блокируем нативное событие
								onNewCommentAdd(restaurantId, newComment, rating);
							}}
							// onClick={() =>
							// 	onNewCommentAdd(restaurantId, newComment, rating)
							// }
						>
							{isCommentSubmitting ? (
								<FaPaperPlane size="18px" style={{ opacity: 0.5 }} />
							) : (
								<FaPaperPlane size="18px" />
							)}
						</button>
						{commentError && <div className="error">{commentError}</div>}
					</div>
				</>
			)}
			<div>
				{comments.length > 0
					? comments.map(
							({ id, author, authorId, content, rating, publishedAt }) => (
								<CommentItem
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
							<div className="login-link">
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

	& .login-link a {
		text-decoration: none;
		color: #0ea5e9;
		font-weight: 600;
	}
`;
