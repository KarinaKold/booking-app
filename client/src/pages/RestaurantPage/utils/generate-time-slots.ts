export const generateTimeSlots = (workingHours: string, selectedDate: Date): string[] => {
	if (!workingHours || !workingHours.includes(' - ')) return [];
	const [startStr, endStr] = workingHours.split(' - ');
	const [startH, startM] = startStr.split(':').map(Number);
	const [endH, endM] = endStr.split(':').map(Number);

	const slots: string[] = [];

	const startTime = new Date(selectedDate);
	startTime.setHours(startH, startM, 0, 0);

	const endTime = new Date(selectedDate);
	endTime.setHours(endH, endM, 0, 0);

	if (endTime <= startTime) {
		endTime.setDate(endTime.getDate() + 1);
	}

	const now = new Date();
	const currentSlot = new Date(startTime);

	while (currentSlot < endTime) {
		if (currentSlot > now || selectedDate.toDateString() !== now.toDateString()) {
			const h = currentSlot.getHours().toString().padStart(2, '0');
			const m = currentSlot.getMinutes().toString().padStart(2, '0');
			slots.push(`${h}:${m}`);
		}
		currentSlot.setHours(currentSlot.getHours() + 1);
	}
	return slots;
};
