import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styled from 'styled-components';

const ScrollButton = styled.button`
	position: fixed;
	bottom: 40px;
	left: 40px;
	width: 50px;
	height: 50px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	transition:
		opacity 0.3s,
		visibility 0.3s;
	opacity: ${({ $visible }) => ($visible ? '1' : '0')};
	visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

	&.docked {
		position: absolute;
		left: calc(40px - (100vw - 100%) / 2);
		bottom: auto;
		top: 50%;
		transform: translateY(-50%);
	}

	&:hover {
		background-color: #45a049;
	}
`;

export const ScrollToTop = ({ paginationRef }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isDocked, setIsDocked] = useState(false);

	useEffect(() => {
		// после прокрутки 400px
		const toggleVisibility = () => {
			if (window.pageYOffset > 400) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};
		// пагинация
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsDocked(entry.isIntersecting);
			},
			{ threshold: 0.1 },
		);

		if (paginationRef.current) {
			observer.observe(paginationRef.current);
		}

		window.addEventListener('scroll', toggleVisibility);

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
			if (paginationRef.current) observer.unobserve(paginationRef.current);
		};
	}, [paginationRef]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<ScrollButton
			$visible={isVisible}
			onClick={scrollToTop}
			className={isDocked ? 'docked' : ''}
		>
			<FaArrowUp size="20px" />
		</ScrollButton>
	);
};
