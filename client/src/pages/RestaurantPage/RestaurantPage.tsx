import { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMatch, useParams } from 'react-router';
import { Loader } from '../../components';
import {
	selectRestaurant,
	selectRestaurantError,
	selectRestaurantLoading,
	selectUserId,
	selectUserRole,
} from '../../selectors';
import { loadRestaurantAsync, RESET_RESTAURANT_DATA } from '../../actions';
import { ROLE } from '../../constants';
import { RestaurantContent } from './components/restaurant-content/RestaurantContent';
import { RestaurantForm } from './components/restaurant-form/RestaurantForm';
import { PrivateContent } from '../../components/private-content/PrivateContent';
import { Error } from '../../components/shared/error/Error';
import { useAppDispatch } from '../../hooks';

export const RestaurantPage = () => {
	const dispatch = useAppDispatch();
	const params = useParams<{ id: string }>();
	const isCreating = !!useMatch('/rest');
	const isEditing = !!useMatch('/rest/:id/edit');
	const restaurant = useSelector(selectRestaurant);
	const loading = useSelector(selectRestaurantLoading);
	const error = useSelector(selectRestaurantError);
	const userId = useSelector(selectUserId);
	const userRole = useSelector(selectUserRole);

	useLayoutEffect(() => {
		dispatch(RESET_RESTAURANT_DATA);
	}, [dispatch, isCreating]);

	useEffect(() => {
		if (isCreating) {
			return;
		}
		if (params.id) {
			dispatch(loadRestaurantAsync(params.id));
		}
	}, [dispatch, params.id, isCreating]);

	if (loading && !restaurant.id && !isCreating) {
		return <Loader />;
	}

	if (error && !restaurant.id) {
		return <Error error={error} />;
	}

	const isOwner = restaurant.owner === userId;
	const isAdmin = userRole === ROLE.ADMIN;
	const canEdit = isAdmin || isOwner;

	const SpecificPage =
		isCreating || isEditing ? (
			<PrivateContent
				access={[ROLE.MODERATOR, ROLE.ADMIN]}
				serverError={error}
				check={isCreating ? true : canEdit}
			>
				<RestaurantForm restaurant={restaurant} />
			</PrivateContent>
		) : (
			<RestaurantContent
				key={restaurant.id || 'new-restaurant'}
				restaurant={restaurant}
			/>
		);
	return error ? <Error error={error} /> : SpecificPage;
};
