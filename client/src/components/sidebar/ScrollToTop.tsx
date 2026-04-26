import { useState, useEffect, type RefObject } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styled from 'styled-components';

interface ScrollButtonProps {
	$visible: boolean;
	$isDocked: boolean;
}

const ScrollButton = styled.button<ScrollButtonProps>`
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

	${({ $isDocked }) =>
		$isDocked &&
		`
		position: absolute;
		left: calc(40px - (100vw - 100%) / 2);
		bottom: auto;
		top: 50%;
		transform: translateY(-50%);
	`}

	&:hover {
		background-color: #45a049;
	}
`;

interface ScrollToTopProps {
	paginationRef: RefObject<HTMLDivElement | null>;
}

export const ScrollToTop = ({ paginationRef }: ScrollToTopProps) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [isDocked, setIsDocked] = useState<boolean>(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 400) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsDocked(entry.isIntersecting);
			},
			{ threshold: 0.1 },
		);

		const refElement = paginationRef.current;

		if (refElement) {
			observer.observe(refElement);
		}

		window.addEventListener('scroll', toggleVisibility);

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
			if (refElement) observer.unobserve(refElement);
		};
	}, [paginationRef]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<ScrollButton $visible={isVisible} $isDocked={isDocked} onClick={scrollToTop}>
			<FaArrowUp size="20px" />
		</ScrollButton>
	);
};
