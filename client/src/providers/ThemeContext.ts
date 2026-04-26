import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContext {
	theme: Theme;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
