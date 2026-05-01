import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router';
import { useAppDispatch } from './hooks';
import { Header, Footer } from './components';
import { setUser } from './actions';

export const App = () => {
	const dispatch = useAppDispatch();

	useLayoutEffect(() => {
		const currentUserDataJSON = sessionStorage.getItem('userData');
		if (!currentUserDataJSON) return;

		const currentUserData = JSON.parse(currentUserDataJSON);
		dispatch(
			setUser({
				...currentUserData,
				roleId: Number(currentUserData.roleId),
			}),
		);
	}, [dispatch]);

	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	);
};
