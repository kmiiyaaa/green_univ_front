export function toHHMM(hour) {
	// 14 -> 14:00 형식으로 변환
	const h = String(hour).padStart(2, '0');
	return `${h}:00`;
}

export function getMonday(date = new Date()) {
	// 월요일 계산
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

// YYYY-MM-DD
export function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

// 월~금 날짜 배열
export function getWeekDates(monday) {
	const dates = [];
	for (let i = 0; i < 5; i++) {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		dates.push(formatDate(d));
	}
	return dates;
}
