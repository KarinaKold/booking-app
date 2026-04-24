import styles from './Time.module.css';

interface TimeGridProps {
	slots: string[];
	selectedTime: string;
	onSelect: (time: string) => void;
}

export const Time = ({ slots, selectedTime, onSelect }: TimeGridProps) => {
	return (
		<div className={styles.grid}>
			{slots.map((time) => (
				<button
					key={time}
					type="button"
					className={`${styles.slot} ${selectedTime === time ? styles.active : ''}`}
					onClick={() => onSelect(time)}
				>
					{time}
				</button>
			))}
		</div>
	);
};
