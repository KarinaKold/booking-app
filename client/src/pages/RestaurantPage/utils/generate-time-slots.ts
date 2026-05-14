export const generateTimeSlots = (
	startTime: number,
	endTime: number,
	selectedDate: Date,
): string[] => {
	const slots: string[] = [];

	if (endTime <= startTime) {
		endTime += 24 * 60;
	}

	const now = new Date();
	const isToday = selectedDate.toDateString() === now.toDateString();
	const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

	while (startTime < endTime) {
		if (!isToday || startTime > currentTotalMinutes) {
			const realMins = startTime % (24 * 60);
			const h = Math.floor(realMins / 60)
				.toString()
				.padStart(2, '0');
			const m = (realMins % 60).toString().padStart(2, '0');

			slots.push(`${h}:${m}`);
		}

		startTime += 60;
	}
	return slots;
};
