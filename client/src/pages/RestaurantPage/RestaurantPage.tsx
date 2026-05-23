import { useEffect, useLayoutEffect } from 'react';
import { useMatch, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Loader } from '../../components';
import {
	selectRestaurant,
	selectRestaurantError,
	selectRestaurantLoading,
	selectUserId,
	selectUserRole,
} from '../../selectors';
import { ACTION_TYPE, loadRestaurantAsync } from '../../actions';
import { RestaurantContent } from './components/restaurant-content/RestaurantContent';
import { RestaurantForm } from './components/restaurant-form/RestaurantForm';
import { PrivateContent } from '../../components/private-content/PrivateContent';
import { Error } from '../../components/shared/error/Error';
import { ROLE, EMPTY_RESTAURANT } from '../../constants';

export const RestaurantPage = () => {
	const dispatch = useAppDispatch();
	const params = useParams<{ id: string }>();
	const isCreating = !!useMatch('/rest');
	const isEditing = !!useMatch('/rest/:id/edit');
	const restaurant = useAppSelector(selectRestaurant);
	const loading = useAppSelector(selectRestaurantLoading);
	const error = useAppSelector(selectRestaurantError);
	const userId = useAppSelector(selectUserId);
	const userRole = useAppSelector(selectUserRole);

	useLayoutEffect(() => {
		if (isCreating) {
			dispatch({ type: ACTION_TYPE.RESET_RESTAURANT_DATA });
		}
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

	const currentRestaurantData = isCreating ? EMPTY_RESTAURANT : restaurant;

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
				<RestaurantForm restaurant={currentRestaurantData} />
			</PrivateContent>
		) : (
			<RestaurantContent
				key={restaurant.id || 'new-restaurant'}
				restaurant={restaurant}
			/>
		);
	return error ? <Error error={error} /> : SpecificPage;
};
