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
	name: string;
	images: string[];
	description: string;
	rating: number;
	cuisine: string;
	address: string;
	workingHours: string;
	hasBarCard: boolean;
}
