import { useNavigate } from 'react-router';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './Card.module.css';

// interface CardProps {
// 	id: string;
// 	title: string;
// 	imageUrl: string;
// 	description: string;
// 	rating: number;
// 	isFavorite?: boolean;
// 	handleFavorite?: (id: string) => void;
// }

export const Card = ({
	id,
	title,
	imageUrl,
	description,
	rating,
	isFavorite = false,
	handleFavorite,
}) => {
	const navigate = useNavigate();

	const handleBookClick = () => {
		navigate(`/rest/${id}`);
	};

	return (
		<div className={styles.card}>
			<div className={styles.imageWrapper}>
				<img src={imageUrl} alt={title} className={styles.image} />

				{/* СЕРДЕЧКО СПРАВА СВЕРХУ */}
				<button
					className={styles.favoriteBtn}
					onClick={() => handleFavorite?.(id)}
					type="button"
					title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
				>
					{isFavorite ? (
						<FaHeart className={styles.heartFull} />
					) : (
						<FaRegHeart className={styles.heartEmpty} />
					)}
				</button>
			</div>

			<div className={styles.content}>
				<div className={styles.header}>
					<h3 className={styles.title}>{title}</h3>
					<div className={styles.rating}>
						<FaStar className={styles.starIcon} />
						<span>{rating}</span>
					</div>
				</div>

				<p className={styles.description}>{description}</p>

				{/* КНОПКА ЗАБРОНИРОВАТЬ */}
				<div className={styles.footer}>
					<button className={styles.bookButton} onClick={handleBookClick}>
						Забронировать
					</button>
				</div>
			</div>
		</div>
	);
};
