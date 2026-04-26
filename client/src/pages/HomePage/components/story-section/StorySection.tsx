import { useState } from 'react';
import { StoryBlock } from '../../../../components/story-block/StoryBlock';
import styled from 'styled-components';
import type { Story } from '../../types';

interface StorySectionProps {
	stories: Story[];
}

export const StorySection = ({ stories }: StorySectionProps) => {
	const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
	const [viewedIds, setViewedIds] = useState<number[]>([]);

	const handleOpenStory = (index: number, id: number) => {
		setSelectedStoryIndex(index);
		if (!viewedIds.includes(id)) {
			setViewedIds((prev) => [...prev, id]);
		}
	};

	return (
		<StyledSection>
			<div className="preview-list">
				{stories.map((story, index) => {
					const isViewed = viewedIds.includes(story.id);
					return (
						<div
							key={story.id}
							className={`preview-item ${isViewed ? 'viewed' : ''}`}
							onClick={() => handleOpenStory(index, story.id)}
						>
							<div className="avatar-wrapper">
								<div className="avatar-ring" />
								<img
									src={story.imageUrl}
									className="avatar"
									alt={story.title}
								/>
							</div>
							<span className="story-title">{story.title}</span>
						</div>
					);
				})}
			</div>
			{selectedStoryIndex !== null && (
				<StoryBlock
					stories={stories}
					initialIndex={selectedStoryIndex}
					onClose={() => setSelectedStoryIndex(null)}
				/>
			)}
		</StyledSection>
	);
};

const StyledSection = styled.section`
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;

	.preview-list {
		display: flex;
		gap: 20px;
		padding: 10px 5px;
		overflow-x: auto;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.preview-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		min-width: 100px;
		transition: transform 0.2s ease;

		&:hover {
			transform: scale(1.05);
		}

		&.viewed {
			.avatar-ring {
				background: #e0e0e0;
			}
			.avatar {
				filter: grayscale(0.6);
				opacity: 0.8;
			}
			span {
				color: #999;
			}
		}
	}

	.avatar-wrapper {
		position: relative;
		width: 100px;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
	}

	.avatar-ring {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffd700 0%, #00ced1 50%, #191970 100%);
		z-index: 1;
		transition: background 0.3s ease;
	}

	.preview-item:hover:not(.viewed) .avatar-ring {
		animation: rotateRing 4s linear infinite;
	}

	.avatar {
		width: 92px;
		height: 92px;
		border-radius: 50%;
		object-fit: cover;
		background-color: #fff;
		border: 3px solid #fff;
		position: relative;
		z-index: 2;
		transition: all 0.3s ease;
	}

	.story-title {
		font-size: 14px;
		font-weight: 500;
		color: #333;
		max-width: 90px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@keyframes rotateRing {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;
