import type { RestaurantData } from '../pages/HomePage/types';

export const EMPTY_RESTAURANT: RestaurantData = {
	id: '',
	name: '',
	rating: 0,
	images: [],
	address: '',
	startTime: 600,
	endTime: 1320,
	cuisine: '',
	hasBarCard: false,
	description: '',
	tables: [{ _id: 'temp-1', number: 1, seats: 2 }],
	comments: [],
	owner: '',
	createdAt: '',
};
