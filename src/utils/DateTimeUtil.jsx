// ✅ 날짜/시간 파싱 보정 (KST 강제)
function normalizeDateInput(input) {
	if (typeof input !== 'string') return input;

	// "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD HH:mm" -> KST로 강제
	if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(input)) {
		const iso = input.replace(' ', 'T');
		// 초가 없으면 :00 붙이고 +09:00 붙임
		return iso.length === 16 ? `${iso}:00+09:00` : `${iso}+09:00`;
	}

	// "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm" (timezone 없음) -> KST로 강제
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(input) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(input)) {
		return input.length === 16 ? `${input}:00+09:00` : `${input}+09:00`;
	}

	// RFC 1123 ("Tue, 30 Dec 2025 06:54:08 GMT") 같은 건 그대로 둬도 됨
	return input;
}

// ✅ Date 생성 안전 헬퍼
function safeDate(input) {
	if (input instanceof Date) return input;
	return new Date(normalizeDateInput(input));
}

export function toHHMM(input) {
	if (input == null) return '';

	// Date 객체
	if (input instanceof Date) {
		if (Number.isNaN(input.getTime())) return '';
		const hh = String(input.getHours()).padStart(2, '0');
		const mm = String(input.getMinutes()).padStart(2, '0');
		return `${hh}:${mm}`;
	}

	// 문자열 (ISO, "YYYY-MM-DD HH:mm:ss", HH:mm 등)
	if (typeof input === 'string') {
		// 이미 HH:mm 형식이면 그대로 (이 케이스는 Date 파싱보다 먼저 처리하는 게 안전)
		if (/^\d{1,2}:\d{2}$/.test(input)) {
			const [h, m] = input.split(':');
			return `${String(h).padStart(2, '0')}:${m}`;
		}

		const d = safeDate(input);
		if (!Number.isNaN(d.getTime())) {
			const hh = String(d.getHours()).padStart(2, '0');
			const mm = String(d.getMinutes()).padStart(2, '0');
			return `${hh}:${mm}`;
		}

		return '';
	}

	// 숫자 (시 단위: 15 → 15:00)
	if (typeof input === 'number') {
		const h = String(input).padStart(2, '0');
		return `${h}:00`;
	}

	return '';
}

export function getMonday(date = new Date()) {
	// 월요일 계산
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

// ✅ YYYY-MM-DD (로컬 기준으로!)
// 기존 toISOString()은 UTC 기준이라 한국시간 새벽에 날짜가 하루 밀릴 수 있음
export function formatDate(date) {
	const d = date instanceof Date ? date : safeDate(date);
	if (Number.isNaN(d.getTime())) return '';
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
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

// 이번 주 + 다음 주 평일만 (최대 10개, 주말 제외)
export function generateWeekdays(startDateStr) {
	const weekdays = [];
	const start = safeDate(startDateStr);
	let current = new Date(start);
	const endDate = new Date(start);
	endDate.setDate(start.getDate() + 13); // 2주 범위(월~일 * 2)

	while (current <= endDate) {
		const day = current.getDay();

		// 평일만 추가 (1~5 = 월~금)
		if (day >= 1 && day <= 5) {
			const yyyy = current.getFullYear();
			const mm = String(current.getMonth() + 1).padStart(2, '0');
			const dd = String(current.getDate()).padStart(2, '0');
			weekdays.push(`${yyyy}-${mm}-${dd}`);
		}

		current.setDate(current.getDate() + 1);
	}

	return weekdays;
}

// 로컬 기준 YYYY-MM-DD (KST에서도 안전)
export function formatDateLocal(input) {
	const d = input instanceof Date ? input : safeDate(input);
	if (Number.isNaN(d.getTime())) return String(input ?? '');

	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

export const DAY_KR = {
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
	const day = days[safeDate(dateStr).getDay()];
	return `${dateStr} (${day})`;
}

export const endMinus10 = (endHour) => {
	if (endHour == null) return '';
	const d = new Date();
	d.setHours(endHour, 0, 0, 0); // 15:00
	d.setMinutes(d.getMinutes() - 10); // 14:50
	return toHHMM(d);
};
