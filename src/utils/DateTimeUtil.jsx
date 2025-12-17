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

// 로컬 기준 YYYY-MM-DD (KST에서도 안전)
// 위에꺼 UTC 기준이라, 한국시간 새벽에 날짜가 하루 밀려 보일 가능성
export function formatDateLocal(input) {
	const d = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(d.getTime())) return String(input ?? '');

	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

const DAY_KR = {
	SUNDAY: '일',
	MONDAY: '월',
	TUESDAY: '화',
	WEDNESDAY: '수',
	THURSDAY: '목',
	FRIDAY: '금',
	SATURDAY: '토',
};

/**
 * @param dateStr 2025-12-17
 * @param dayOfWeek WEDNESDAY (optional)
 */
export function formatDayOfWeek(dateStr, dayOfWeek) {
	if (dayOfWeek && DAY_KR[dayOfWeek]) {
		return `${dateStr} (${DAY_KR[dayOfWeek]})`;
	}

	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const day = days[new Date(dateStr).getDay()];
	return `${dateStr} (${day})`;
}
