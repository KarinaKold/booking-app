import type { ReactNode } from 'react';
import type { Restaurant } from '../../../types';

export interface CommentData {
	id: string;
	author: string;
	authorId: string;
	content: string;
	rating: number;
	publishedAt: string;
}

export interface Table {
	_id?: string;
	number: number;
	seats: number;
}

export interface RestaurantData extends Restaurant {
	tables: Table[];
	comments: CommentData[];
	owner: string;
	createdAt: string;
}

export interface RestaurantFilters {
	cuisines: string[];
	minRating: number;
	hasBarCard: boolean;
	openNow: boolean;
}

export type SortField = 'createdAt' | 'rating' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
	id: string;
	label: string;
	field: SortField;
	order: SortOrder;
	icon: ReactNode;
}

export interface Story {
	id: number;
	imageUrl: string;
	duration: number;
	title: string;
}
