import { useEffect } from 'react';
import { useStore } from 'react-redux';

interface AppState {
	app: {
		wasLogout: boolean;
	};
}

export const useResetForm = (reset: () => void): void => {
	const store = useStore<AppState>();

	useEffect(() => {
		let currentWasLogout = store.getState().app.wasLogout;

		return store.subscribe(() => {
			const prevWasLogout = currentWasLogout;
			currentWasLogout = store.getState().app.wasLogout;

			if (currentWasLogout !== prevWasLogout) {
				reset();
			}
		});
	}, [reset, store]);
};
