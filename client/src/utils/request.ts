export interface ServerResponse<T> {
	data: T | null;
	error: string | null;
}

export function request<T>(
	path: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
	data?: unknown,
): Promise<ServerResponse<T>> {
	return fetch('/api' + path, {
		headers: {
			'Content-type': 'application/json',
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
	}).then((res) => res.json());
}
