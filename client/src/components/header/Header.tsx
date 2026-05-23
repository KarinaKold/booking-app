import { useState } from 'react';
import { Burger, ControlPanel, Logo } from './components';
import styled from 'styled-components';

const HeaderContainer = ({ className }: { className?: string }) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);
	const closeMenu = () => setIsMenuOpen(false);

	return (
		<header className={className}>
			<Logo isMenuOpen={isMenuOpen} />
			<Burger isOpen={isMenuOpen} onClick={toggleMenu} />
			{isMenuOpen && <MenuOverlay onClick={closeMenu} />}
			<ControlPanel $isOpen={isMenuOpen} onClose={closeMenu} />
		</header>
	);
};

export const Header = styled(HeaderContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	width: 100%;
	height: 80px;
	padding: 0 20px;
	box-shadow: var(--nm-shadow-flat);
	background-color: var(--background-color);
	z-index: 1000;

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		gap: 12px;
		z-index: 99995;
	}

	& > button,
	& > .burger-classname {
		z-index: 99995 !important;
	}
`;

const MenuOverlay = styled.div`
	display: none;

	@media (max-width: 768px) {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 99980;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;
