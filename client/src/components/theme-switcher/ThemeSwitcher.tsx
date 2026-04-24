// import styles from './ThemeSwitcher.module.css';
import { useTheme } from '../../providers';

export const ThemeSwitcher = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<label htmlFor="theme-toggl" className="ui-switch">
			<input
				id="theme-toggl"
				type="checkbox"
				checked={theme === 'dark'}
				// #1c1d36
				// #10101e
				onChange={toggleTheme}
			/>
			<div className="slider">
				<div className="circle" />
			</div>
		</label>
	);
};
