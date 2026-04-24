export const generateTimeSlots = (workingHours: string, selectedDate: Date) => {
	if (!workingHours || !workingHours.includes(' - ')) return [];

	const [startStr, endStr] = workingHours.split(' - ');
	const startHour = parseInt(startStr.split(':')[0], 10);
	const endHour = parseInt(endStr.split(':')[0], 10);

	const slots = [];
	const effectiveEnd = endHour <= startHour ? endHour + 24 : endHour;

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	const currentDate = now.getDate();
	const currentHour = now.getHours();

	const isToday =
		selectedDate.getFullYear() === currentYear &&
		selectedDate.getMonth() === currentMonth &&
		selectedDate.getDate() === currentDate;

	for (let hour = startHour; hour < effectiveEnd; hour++) {
		const hour24 = hour % 24;
		if (isToday) {
			if (hour < 24 && hour <= currentHour) continue;
			if (hour >= 24 && hour24 <= currentHour) continue;
		}

		const formattedHour = hour24 < 10 ? `0${hour24}:00` : `${hour24}:00`;
		slots.push(formattedHour);
	}
	return slots;
};
