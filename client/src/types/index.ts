export interface Role {
	id: number;
	name: string;
}

export interface UserData {
	id: string;
	login: string;
	roleId: number;
	session: string;
	registeredAt: string;
}

export interface Restaurant {
	id: string;
	_id?: string;
	name: string;
	images: string[];
	description: string;
	rating: number;
	cuisine: string;
	address: string;
	startTime: number;
	endTime: number;
	hasBarCard: boolean;
}

export interface Booking {
	_id: string;
	date: string;
	time: string;
	tableNumber: number;
	restaurant?: {
		name: string;
	};
}

export interface ServerResponse<T> {
	data: T | null;
	error: string | null;
}
