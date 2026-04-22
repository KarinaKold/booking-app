import styles from './CardList.module.css';

export const CardList = () => {
	return (
		<div className={styles.cardList}>
			{data.map((item) => (
				<Card key={item.id} />
			))}
		</div>
	);
};
