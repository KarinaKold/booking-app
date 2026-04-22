import { useState, useEffect, useLayoutEffect } from 'react';
import { useMatch, useParams } from 'react-router';
import { Loader } from '../../components';
import { Comments } from './components/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { selectRestaurant, selectUserId, selectUserRole } from '../../selectors';
import { loadRestaurantAsync, RESET_RESTAURANT_DATA } from '../../actions';
import { ROLE } from '../../constants';
import { RestaurantContent } from './components/restaurant-content/RestaurantContent';
import { RestaurantForm } from './components/restaurant-form/RestaurantForm';
import { PrivateContent } from '../../components/private-content/PrivateContent';
import { Error } from '../../components/error/Error';

// export interface Comment {
// 	id: string;
// 	author: string;
// 	authorId: string;
// 	content: string;
// 	publishedAt: string;
// }
// interface RestaurantData {
// 	id: string;
// 	name: string;
// 	rating: number;
// 	images: string[];
// 	address: string;
// 	workingHours: string;
// 	cuisine: string;
// 	description: string;
// 	tables: Array<{ _id: string; number: number; seats: number }>;
// 	comments: Comment[];
// }

export const RestaurantPage = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const isCreating = !!useMatch('/rest');
	const isEditing = !!useMatch('/rest/:id/edit');
	const restaurant = useSelector(selectRestaurant);

	const userId = useSelector(selectUserId);
	const userRole = useSelector(selectUserRole);

	useLayoutEffect(() => {
		dispatch(RESET_RESTAURANT_DATA);
	}, [dispatch, isCreating]);

	useEffect(() => {
		if (isCreating) {
			setIsLoading(false);
			return;
		}
		dispatch(loadRestaurantAsync(params.id)).then((res) => {
			if (res.error) {
				setError(res.error);
			}
			setIsLoading(false);
		});
	}, [dispatch, params.id, isCreating]);

	if (isLoading) return <Loader />;

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
			<div>
				<RestaurantContent restaurant={restaurant} />
				{/* <Comments comments={restaurant.comments} restaurantId={restaurant.id} /> */}
			</div>
		);
	return error ? <Error error={error} /> : SpecificPage;
};
