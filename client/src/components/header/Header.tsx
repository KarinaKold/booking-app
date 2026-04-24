// import styled from 'styled-components';
import { ControlPanel, Logo } from './components';
import styles from './Header.module.css';

export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo />
			<ControlPanel />
		</header>
	);
};
