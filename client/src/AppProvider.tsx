import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ConfirmationProvider, ThemeProvider } from './providers';
import { store } from './store.ts';

export const AppProvider = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>
		<ConfirmationProvider>
			<Provider store={store}>{children}</Provider>
		</ConfirmationProvider>
	</ThemeProvider>
);
