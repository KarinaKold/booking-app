export async function request<T>(
	path: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
	data?: unknown,
): Promise<T> {
	const token = localStorage.getItem('token');

	const headers: Record<string, string> = {
		'Content-type': 'application/json',
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const res = await fetch('/api' + path, {
			headers,
			method,
			body: data ? JSON.stringify(data) : undefined,
		});

		if (res.status === 204) {
			return {} as T;
		}

		const result = await res.json();

		if (!res.ok) {
			if (res.status === 401) {
				localStorage.removeItem('token');
			}
			throw new Error(result.error || `Ошибка сервера: ${res.status}`);
		}

		if (result.token) {
			localStorage.setItem('token', result.token);
		}

		return result;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}
