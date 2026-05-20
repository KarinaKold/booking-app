import styled from 'styled-components';

interface BurgerProps {
	isOpen: boolean;
	onClick: () => void;
}

export const Burger = ({ isOpen, onClick }: BurgerProps) => {
	return (
		<StyledBurger onClick={onClick} $isOpen={isOpen}>
			<span />
			<span />
			<span />
		</StyledBurger>
	);
};

const StyledBurger = styled.button<{ $isOpen: boolean }>`
	display: none !important;
	flex-direction: column;
	justify-content: space-around;
	width: 30px;
	height: 26px;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	z-index: 1001;

	span {
		width: 30px;
		height: 3px;
		background: #1a1a1a;
		border-radius: 10px;
		transition: all 0.3s linear;
		position: relative;
		transform-origin: 1px;

		&:first-child {
			transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0)')};
		}
		&:nth-child(2) {
			opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
			transform: ${({ $isOpen }) =>
				$isOpen ? 'translateX(20px)' : 'translateX(0)'};
		}
		&:nth-child(3) {
			transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
		}
	}

	@media (max-width: 768px) {
		display: flex !important;
		z-index: 1005 !important;
	}
`;
