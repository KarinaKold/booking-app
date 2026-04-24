import { useState } from 'react';
import {
	FaChevronUp,
	FaChevronDown,
	FaChevronLeft,
	FaChevronRight,
	FaTimes,
} from 'react-icons/fa';
import styled from 'styled-components';

export const Gallery = ({ images, name }) => {
	const [sideOffset, setSideOffset] = useState(0);
	const [viewerIndex, setViewerIndex] = useState(null);

	const itemsToShow = 2;
	const sideImages = images.slice(1);
	const canScrollUp = sideOffset > 0;
	const canScrollDown = sideOffset < sideImages.length - itemsToShow;

	const scrollUp = (e) => {
		e.stopPropagation();
		setSideOffset((prev) => prev - 1);
	};
	const scrollDown = (e) => {
		e.stopPropagation();
		setSideOffset((prev) => prev + 1);
	};

	const openViewer = (index) => setViewerIndex(index);
	const closeViewer = () => setViewerIndex(null);
	const nextImg = (e) => {
		e.stopPropagation();
		setViewerIndex((prev) => (prev + 1) % images.length);
	};
	const prevImg = (e) => {
		e.stopPropagation();
		setViewerIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<StyledGallery>
			<div className="gallery">
				<div className="main-image" onClick={() => openViewer(0)}>
					<img src={images[0]} alt={name} />
				</div>

				<div className="side-container">
					<button
						className="nav-btn"
						onClick={scrollUp}
						style={{ visibility: canScrollUp ? 'visible' : 'hidden' }}
					>
						<FaChevronUp />
					</button>

					<div className="images-window">
						<div
							className="images-track"
							style={{ transform: `translateY(-${sideOffset * 210}px)` }}
						>
							{sideImages.map((img, index) => (
								<div
									key={index}
									className="side-item"
									onClick={() => openViewer(index + 1)}
								>
									<img src={img} alt={`Side ${index}`} />
								</div>
							))}
						</div>
					</div>
					<button
						className="nav-btn"
						onClick={scrollDown}
						style={{
							visibility: canScrollDown ? 'visible' : 'hidden',
						}}
					>
						<FaChevronDown />
					</button>
				</div>
			</div>
			{viewerIndex !== null && (
				<div className="viewer-overlay">
					<button className="close-btn" onClick={closeViewer}>
						<FaTimes />
					</button>
					<button className="arrow prev" onClick={prevImg}>
						<FaChevronLeft />
					</button>
					<div className="viewer-content" onClick={(e) => e.stopPropagation()}>
						<img src={images[viewerIndex]} alt="Fullscreen view" />
						<div className="viewer-counter">
							{viewerIndex + 1} / {images.length}
						</div>
					</div>
					<button className="arrow next" onClick={nextImg}>
						<FaChevronRight />
					</button>
				</div>
			)}
		</StyledGallery>
	);
};

const StyledGallery = styled.div`
	.gallery {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 20px;
		height: 480px;
		align-items: center;
	}

	.main-image {
		height: 100%;
		background: #f0f0f0;
		border-radius: 24px;
		overflow: hidden;
		box-shadow:
			6px 6px 12px #bebebe,
			-6px -6px 12px #ffffff;
		padding: 6px;
		cursor: pointer;
	}

	.main-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 20px;
	}

	.side-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		height: 100%;
		padding: 0 10px;
	}

	.images-window {
		height: 410px;
		overflow: hidden;
		width: 100%;
	}

	.images-track {
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.side-item {
		height: 200px;
		min-height: 200px;
		border-radius: 18px;
		overflow: hidden;
		padding: 4px;
		cursor: pointer;
	}

	.side-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 14px;
	}

	.nav-btn {
		background: #f0f0f0;
		border: none;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-shadow:
			3px 3px 6px #bebebe,
			-3px -3px 6px #ffffff;
		color: #666;
		transition: all 0.2s;
	}

	.nav-btn:active {
		box-shadow:
			inset 2px 2px 5px #bebebe,
			inset -2px -2px 5px #ffffff;
	}

	.viewer-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.92);
		z-index: 5000;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(8px);
	}

	.viewer-content {
		position: relative;
		max-width: 90%;
		max-height: 85%;
		text-align: center;
	}

	.viewer-content img {
		max-width: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: 10px;
		box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
	}

	.close-btn,
	.arrow {
		position: absolute;
		color: white;
		background: none;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.close-btn {
		top: 30px;
		right: 30px;
		font-size: 2rem;
	}

	.arrow {
		font-size: 3rem;
	}

	.prev {
		left: 40px;
	}

	.next {
		right: 40px;
	}

	.viewer-counter {
		color: #aaa;
		margin-top: 20px;
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: 1fr;
			height: auto;
		}
		.side-container {
			display: none;
		}
	}
`;
