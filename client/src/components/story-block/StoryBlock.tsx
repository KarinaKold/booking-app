import { useState, useEffect, useCallback } from 'react';
import styles from './StoryBlock.module.css';

export interface Story {
	id: number;
	imageUrl: string;
	duration: number;
	title: string;
}

interface StoriesBlockProps {
	stories: Story[];
	initialIndex: number;
	onClose: () => void;
}

export const StoryBlock = ({ stories, initialIndex, onClose }: StoriesBlockProps) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [isActive, setIsActive] = useState(false);

	const handleNext = useCallback(() => {
		setIsActive(false);
		if (currentIndex < stories.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			onClose();
		}
	}, [currentIndex, stories.length, onClose]);

	const handlePrev = useCallback(() => {
		setIsActive(false);
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
		}
	}, [currentIndex]);

	useEffect(() => {
		const startTimer = setTimeout(() => setIsActive(true), 10);
		const autoNext = setTimeout(handleNext, stories[currentIndex].duration);

		return () => {
			clearTimeout(startTimer);
			clearTimeout(autoNext);
		};
	}, [currentIndex, handleNext, stories]);

	return (
		<div className={styles.overlay} onClick={onClose}>
			{/* Стрелки */}
			{currentIndex > 0 && (
				<button
					className={`${styles.navArrow} ${styles.prevArrow}`}
					onClick={(e) => {
						e.stopPropagation();
						handlePrev();
					}}
				>
					&#10094;
				</button>
			)}

			<div className={styles.container} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={onClose}>
					&times;
				</button>

				{/* Полоски времени */}
				<div className={styles.progressContainer}>
					{stories.map((story, index) => (
						<div key={story.id} className={styles.progressTrack}>
							<div
								className={styles.progressBar}
								style={{
									width:
										index < currentIndex
											? '100%'
											: index === currentIndex && isActive
												? '100%'
												: '0%',
									transition:
										index === currentIndex && isActive
											? `width ${stories[index].duration}ms linear`
											: 'none',
								}}
							/>
						</div>
					))}
				</div>

				{/* Сама история */}
				<img
					key={stories[currentIndex].id}
					src={stories[currentIndex].imageUrl}
					className={styles.image}
					alt={stories[currentIndex].title}
				/>

				{/* лево/право */}
				<div className={styles.controls}>
					<div
						className={styles.areaPrev}
						onClick={(e) => {
							e.stopPropagation();
							handlePrev();
						}}
					/>
					<div
						className={styles.areaNext}
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
					/>
				</div>
			</div>

			{currentIndex < stories.length - 1 && (
				<button
					className={`${styles.navArrow} ${styles.nextArrow}`}
					onClick={(e) => {
						e.stopPropagation();
						handleNext();
					}}
				>
					&#10095;
				</button>
			)}
		</div>
	);
};
