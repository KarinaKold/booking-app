import styled from 'styled-components';
import { ControlPanel, Logo } from './components';

const HeaderContainer = ({ className }: { className?: string }) => {
	return (
		<header className={className}>
			<Logo />
			<ControlPanel />
		</header>
	);
};

export const Header = styled(HeaderContainer)`
	display: flex;
	justify-content: space-between;
	top: 0;
	width: 100%;
	height: 80px;
	padding: 10px;
	box-shadow: 0 -2px 17px #000;
	background-color: #f0f0f0;
`;
