export const debounce = <Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number,
) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Args): void => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};
