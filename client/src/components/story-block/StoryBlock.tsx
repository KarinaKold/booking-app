import { useState, useEffect, useCallback } from 'react';
import { FullscreenViewer } from '../shared/fullscreen-viewer/FullscreenViewer';
import styled from 'styled-components';

export interface Story {
	id: number;
	imageUrl: string;
	duration: number;
	title: string;
}

interface StoryBlockProps {
	stories: Story[];
	initialIndex: number;
	onClose: () => void;
}

export const StoryBlock = ({ stories, initialIndex, onClose }: StoryBlockProps) => {
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
		<FullscreenViewer
			isOpen={true}
			onClose={onClose}
			onNext={currentIndex < stories.length - 1 ? handleNext : undefined}
			onPrev={currentIndex > 0 ? handlePrev : undefined}
		>
			<StyledStoryContent>
				<div className="progress-container">
					{stories.map((story, index) => (
						<div key={story.id} className="progress-track">
							<div
								className="progress-bar"
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
				<img
					className="story-image"
					key={stories[currentIndex].id}
					src={stories[currentIndex].imageUrl}
					alt={stories[currentIndex].title}
				/>
				<div className="tap-controls">
					<div className="area-prev" onClick={handlePrev} />
					<div className="area-next" onClick={handleNext} />
				</div>
			</StyledStoryContent>
		</FullscreenViewer>
	);
};

export const StyledStoryContent = styled.div`
	position: relative;
	width: 360px;
	height: 640px;
	background-color: #000;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
	display: flex;
	flex-direction: column;

	.story-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
	}

	.progress-container {
		position: absolute;
		top: 12px;
		left: 0;
		right: 0;
		padding: 0 8px;
		display: flex;
		gap: 4px;
		z-index: 100;
	}

	.progress-track {
		height: 2px;
		flex: 1;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: #fff;
		width: 0%;
	}

	.tap-controls {
		position: absolute;
		inset: 0;
		display: flex;
		z-index: 80;

		.area-prev {
			width: 30%;
			cursor: pointer;
		}
		.area-next {
			width: 70%;
			cursor: pointer;
		}
	}

	@media (max-width: 600px) {
		width: 100vw;
		height: 100dvh;
		border-radius: 0;
	}
`;
