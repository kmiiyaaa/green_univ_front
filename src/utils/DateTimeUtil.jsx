// ✅ 날짜/시간 파싱 보정 (KST 강제)
function normalizeDateInput(input) {
	if (typeof input !== 'string') return input;

	// "YYYY-MM-DD HH:mm:ss(.SSSSSS)" or "YYYY-MM-DD HH:mm" -> KST로 강제
	if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?$/.test(input)) {
		const iso = input.replace(' ', 'T');
		// timezone이 없으면 +09:00을 붙여서 KST로 고정
		return /[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}+09:00`;
	}

	// "YYYY-MM-DDTHH:mm:ss(.SSSSSS)" or "YYYY-MM-DDTHH:mm" (timezone 없음) -> KST로 강제
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?$/.test(input) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(input)) {
		return `${input}+09:00`;
	}

	// RFC 1123 ("Tue, 30 Dec 2025 06:54:08 GMT") 같은 건 그대로 둬도 됨
	return input;
}

// ✅ Date 생성 안전 헬퍼
function safeDate(input) {
	if (input instanceof Date) return input;
	return new Date(normalizeDateInput(input));
}

// ✅ 숫자/문자/Date에서 "시(hour)"만 뽑아내는 헬퍼 (endMinus10 안전화)
function parseHour(v) {
	if (v == null) return null;

	// Date 객체
	if (v instanceof Date) {
		if (Number.isNaN(v.getTime())) return null;
		return v.getHours();
	}

	// 숫자 (15)
	if (typeof v === 'number') return v;

	// 문자열 ("15", "15:00", "15:00:00")
	if (typeof v === 'string') {
		const m = v.match(/^(\d{1,2})(?::\d{2})?(?::\d{2})?$/);
		if (m) return Number(m[1]);
	}

	return null;
}

// ✅ millis 변환(서버 endAt 등 숫자/문자 모두 대응)
export function toMillis(input) {
	if (input == null) return null;

	// 이미 number면 그대로
	if (typeof input === 'number') {
		// seconds 단위로 내려올 수도 있으니(10자리) 방어
		return input < 1e12 ? input * 1000 : input;
	}

	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return null;
	return d.getTime();
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

	// 문자열 (ISO, HH:mm 등)
	if (typeof input === 'string') {
		// 이미 HH:mm 형식이면 그대로
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
	const d = safeDate(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

// ✅ YYYY-MM-DD (로컬 기준으로!)
// 기존 toISOString()은 UTC 기준이라 한국시간 새벽에 날짜가 하루 밀릴 수 있음
export function formatDate(input) {
	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return String(input ?? '');
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

// 로컬 기준 YYYY-MM-DD (KST에서도 안전)
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

	// ✅ "YYYY-MM-DD"는 new Date로 파싱하면 UTC로 잡혀서 하루 밀릴 수 있음
	// 그래서 로컬 날짜 생성으로 고정
	let start;
	if (typeof startDateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
		const [y, m, d] = startDateStr.split('-').map(Number);
		start = new Date(y, m - 1, d, 0, 0, 0, 0);
	} else {
		start = safeDate(startDateStr);
	}

	if (Number.isNaN(start.getTime())) return weekdays;

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

	// ✅ endHour가 "18:00:00" 같은 문자열로 와도 안전하게 처리
	const h = parseHour(endHour);
	if (h == null) return '';

	const d = new Date();
	d.setHours(h, 0, 0, 0); // 15:00
	d.setMinutes(d.getMinutes() - 10); // 14:50
	return toHHMM(d);
};

// ✅ "표시용" 날짜시간: 무조건 KST로 찍기 ("YYYY-MM-DD HH:mm")
export function formatDateTimeKST(input) {
	if (!input) return '';

	const d = safeDate(input);
	if (Number.isNaN(d.getTime())) return String(input);

	// timeZone 강제 + formatToParts로 조립 (로케일 포맷 영향 제거)
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(d);

	const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
	const yyyy = get('year');
	const mm = get('month');
	const dd = get('day');
	const hh = get('hour');
	const mi = get('minute');

	return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
