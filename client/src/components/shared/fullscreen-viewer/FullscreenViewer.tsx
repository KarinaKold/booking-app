import { type ReactNode, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import { ModalCloseButton } from '../buttons';

interface FullscreenViewerProps {
	isOpen: boolean;
	onClose: () => void;
	onNext?: () => void;
	onPrev?: () => void;
	currentIndex?: number;
	totalItems?: number;
	children: ReactNode;
	className?: string;
}

export const FullscreenViewer = ({
	isOpen,
	onClose,
	onNext,
	onPrev,
	currentIndex,
	totalItems,
	children,
	className,
}: FullscreenViewerProps) => {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowRight' && onNext) onNext();
			if (e.key === 'ArrowLeft' && onPrev) onPrev();
		},
		[onClose, onNext, onPrev],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	return (
		<StyledOverlay className={className} onClick={onClose}>
			<ModalCloseButton onClick={onClose} />
			{onPrev && (
				<button
					className="nav-arrow prev"
					onClick={(e) => {
						e.stopPropagation();
						onPrev();
					}}
				>
					<FaChevronLeft />
				</button>
			)}
			<div className="viewer-content" onClick={(e) => e.stopPropagation()}>
				{children}
				{currentIndex !== undefined && totalItems !== undefined && (
					<div className="counter">
						{currentIndex + 1} / {totalItems}
					</div>
				)}
			</div>
			{onNext && (
				<button
					className="nav-arrow next"
					onClick={(e) => {
						e.stopPropagation();
						onNext();
					}}
				>
					<FaChevronRight />
				</button>
			)}
		</StyledOverlay>
	);
};

const StyledOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.95);
	backdrop-filter: blur(8px);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;

	.viewer-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 90%;
		max-height: 85%;
	}

	.close-btn,
	.nav-arrow {
		position: absolute;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		opacity: 0.6;
		transition: all 0.2s;
		&:hover {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.close-btn {
		top: 30px;
		right: 30px;
		font-size: 2.5rem;
	}
	.nav-arrow {
		font-size: 3rem;
		top: 50%;
	}
	.prev {
		left: 40px;
	}
	.next {
		right: 40px;
	}

	.counter {
		color: #aaa;
		margin-top: 20px;
		font-size: 1.1rem;
		font-family: sans-serif;
	}
`;
