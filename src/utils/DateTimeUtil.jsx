// ✅ 날짜/시간 파싱 보정 (timezone 없는 문자열은 UTC(Z)로 해석)
function normalizeDateInput(input) {
	if (typeof input !== 'string') return input;

	// 1) "HH:mm" 같은 순수 시간은 여기서 처리하지 않음 (toHHMM에서 선처리)

	// 2) 이미 timezone이 있는 ISO는 그대로 사용하되,
	//    마이크로초/나노초(.026089 같은 6자리)를 JS Date가 안정적으로 먹게 3자리로 줄임
	if (/[zZ]|[+-]\d{2}:\d{2}$/.test(input)) {
		return input.replace(/\.(\d{3})\d+/, '.$1'); // .026089 -> .026
	}

	// 3) "YYYY-MM-DD HH:mm[:ss][.ffffff]" 또는 "YYYY-MM-DDTHH:mm[:ss][.ffffff]"
	//    -> timezone이 없으면 "UTC"로 간주해서 Z 붙임
	const m = input.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?(?:\.(\d+))?$/);

	if (m) {
		const yyyyMMdd = m[1];
		const hhmm = m[2];
		const ss = m[3] ?? '00';

		// 마이크로초/나노초 -> 밀리초 3자리로 정규화
		const ms = (m[4] ?? '0').slice(0, 3).padEnd(3, '0'); // 026089 -> 026

		// ✅ timezone 없는 값은 UTC로 간주
		return `${yyyyMMdd}T${hhmm}:${ss}.${ms}Z`;
	}

	// 4) 그 외(RFC1123 등)는 그대로
	return input;
}

// ✅ Date 생성 안전 헬퍼
function safeDate(input) {
	if (input instanceof Date) return input;
	return new Date(normalizeDateInput(input));
}

export function toHHMM(input) {
	if (input == null) return '';

	// "HH:mm"는 그대로 반환
	if (typeof input === 'string' && /^\d{1,2}:\d{2}$/.test(input)) {
		const [h, m] = input.split(':');
		return `${String(h).padStart(2, '0')}:${m}`;
	}

	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return '';

	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getMonday(date = new Date()) {
	const d = safeDate(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

// ✅ YYYY-MM-DD (로컬 기준)
export function formatDate(input) {
	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return String(input ?? '');

	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

// ✅ formatDateLocal은 formatDate와 동일
export const formatDateLocal = formatDate;

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
	if (Number.isNaN(start.getTime())) return weekdays;

	let current = new Date(start);
	const endDate = new Date(start);
	endDate.setDate(start.getDate() + 13);

	while (current <= endDate) {
		const day = current.getDay();

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
	d.setHours(endHour, 0, 0, 0);
	d.setMinutes(d.getMinutes() - 10);
	return toHHMM(d);
};

// ✅ YYYY-MM-DD HH:mm (KST 기준으로 표시)
export function formatDateTimeKST(input) {
	if (!input) return '';
	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return String(input);

	const parts = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(d);

	const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
	return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}
