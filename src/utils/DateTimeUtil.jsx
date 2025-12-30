// ===============================
// ✅ 공통 파서: 서버 값(Date/문자열/숫자)을 "일관된 Date"로 변환
// 규칙 A) 시간까지 있는데 timezone 없으면 -> UTC로 간주(Z)
// 규칙 B) 날짜만(YYYY-MM-DD) -> KST 날짜로 간주(+09:00)
// ===============================
export function parseServerDate(input) {
	if (input == null) return null;
	if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;

	let s = String(input).trim();
	if (!s) return null;

	// 1. 날짜만 있는 경우 (YYYY-MM-DD)
	if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
		const d = new Date(`${s}T00:00:00+09:00`);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	// 2. 타임존 정보가 이미 포함된 경우 (Z 또는 +09:00)
	if (/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) {
		const d = new Date(s);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	// 3. 핵심 수정: 백엔드 포맷(공백 사용, 초 생략 가능) 대응
	// yyyy-MM-dd HH:mm 또는 yyyy-MM-dd HH:mm:ss 대응
	if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?/.test(s)) {
		const formatted = s.replace(' ', 'T'); // 공백을 T로 교체
		const d = new Date(`${formatted}+09:00`); // 한국 시간임을 명시
		return Number.isNaN(d.getTime()) ? null : d;
	}

	const d = new Date(s);
	return Number.isNaN(d.getTime()) ? null : d;
}

// ===============================
// ✅ KST 포맷터
// ===============================
export function formatDateTimeKST(input) {
	const d = parseServerDate(input);
	if (!d) return String(input ?? '');

	const parts = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(d);

	const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
	return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

export function formatDateKST(input) {
	const d = parseServerDate(input);
	if (!d) return String(input ?? '');

	const parts = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(d);

	const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
	return `${get('year')}-${get('month')}-${get('day')}`;
}

export function formatTimeKST(input) {
	const d = parseServerDate(input);
	if (!d) return String(input ?? '');

	const parts = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(d);

	const hh = parts.find((p) => p.type === 'hour')?.value ?? '';
	const mm = parts.find((p) => p.type === 'minute')?.value ?? '';
	return `${hh}:${mm}`;
}

// ===============================
// ✅ 시간 "HH:mm" 출력 (상담 startTime/endTime 대응 강화)
// - number(15) -> 15:00
// - "HH:mm" -> 그대로
// - "HH:mm:ss" -> HH:mm
// - 날짜시간 문자열(UTC tz 없음 포함) -> KST로 HH:mm
// ===============================
export function toHHMM(input) {
	if (input == null) return '';

	// 숫자(시 단위)
	if (typeof input === 'number') {
		const h = String(input).padStart(2, '0');
		return `${h}:00`;
	}

	// 문자열 시간만
	if (typeof input === 'string') {
		const s = input.trim();

		// HH:mm
		if (/^\d{1,2}:\d{2}$/.test(s)) {
			const [h, m] = s.split(':');
			return `${String(h).padStart(2, '0')}:${m}`;
		}

		// HH:mm:ss
		if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) {
			const [h, m] = s.split(':');
			return `${String(h).padStart(2, '0')}:${m}`;
		}
	}

	// 그 외(Date/날짜시간문자열)은 KST 기준으로 시간 추출
	return formatTimeKST(input);
}

// ===============================
// ✅ 기존 함수들 (날짜 처리 통일)
// ===============================
export function getMonday(date = new Date()) {
	const base = parseServerDate(date) ?? new Date(date);
	const d = new Date(base);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

// YYYY-MM-DD (KST 기준으로 안전하게)
export function formatDate(input) {
	return formatDateKST(input);
}

// 로컬 기준 YYYY-MM-DD(기존 이름 유지) -> 이제 KST 기준으로 통일
export function formatDateLocal(input) {
	return formatDateKST(input);
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
	const start = parseServerDate(startDateStr) ?? new Date(startDateStr);
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

export function formatDayOfWeek(dateStr, dayOfWeek) {
	if (dayOfWeek && DAY_KR[dayOfWeek]) {
		return `${dateStr} (${DAY_KR[dayOfWeek]})`;
	}
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const d = parseServerDate(dateStr) ?? new Date(dateStr);
	return `${dateStr} (${days[d.getDay()]})`;
}

export const endMinus10 = (endHour) => {
	if (endHour == null) return '';
	const d = new Date();
	d.setHours(endHour, 0, 0, 0);
	d.setMinutes(d.getMinutes() - 10);
	return toHHMM(d);
};
