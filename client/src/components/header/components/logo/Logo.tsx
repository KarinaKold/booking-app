import { Link } from 'react-router';
import { MAIN_TITLE } from '../../../../constants/titles';
import styled from 'styled-components';

export const Logo = ({ isMenuOpen }: { isMenuOpen: boolean }) => (
	<StyledLogoLink $isMenuOpen={!!isMenuOpen} className="logo" to="/">
		<div className="logo-img"></div>
		<h1 id="h1">{MAIN_TITLE}</h1>
	</StyledLogoLink>
);

const StyledLogoLink = styled(Link)<{ $isMenuOpen: boolean }>`
	display: flex;
	align-items: center;
	text-decoration: none;
	gap: 12px;
	transition: 
		opacity 0.2s ease,
		visibility 0.2s;

	@media (max-width: 500px) {
		opacity: ${({ $isMenuOpen }) => ($isMenuOpen ? '0' : '1')};
		visibility: ${({ $isMenuOpen }) => ($isMenuOpen ? 'hidden' : 'visible')};
		pointer-events: ${({ $isMenuOpen }) => ($isMenuOpen ? 'none' : 'auto')};
	}
`;
