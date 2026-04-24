import { Link } from 'react-router';
import styles from './Card.module.css';

interface CardProps {
	id: string;
	title: string;
	imageUrl: string;
	description?: string;
	rating?: number;
}

export const Card = ({ id, title, imageUrl, description, rating = 0 }: CardProps) => {
	return (
		<div className={styles.card}>
			<Link to={`/rest/${id}`} className={styles.link}>
				<img src={imageUrl} alt={title} />
				<div className={styles.cardContent}>
					<h3 className={styles.cardTitle}>{title}</h3>
					<p className={styles.cardDescription}>
						{description || 'Уютное место для вашего отдыха.'}
					</p>
					<div className={styles.cardRating}>
						{'⭐️'.repeat(rating)}
						{'☆'.repeat(5 - rating)}
					</div>
					<button className={styles.bookButton}>Забронировать</button>
				</div>
			</Link>
		</div>
	);
};
