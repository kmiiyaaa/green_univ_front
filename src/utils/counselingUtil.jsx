// 상담 시 필요한

import { getMonday, formatDateLocal } from './DateTimeUtil';

// 지난 시간인지 체크하는 함수
export const isPastSlot = (date, startTime) => {
	// ✅ date: "YYYY-MM-DD"
	// ✅ startTime: 15 or "15" or "15:00" 등이 올 수 있으니 hour만 추출
	const hour = (() => {
		if (startTime == null) return null;
		if (typeof startTime === 'number') return startTime;

		const s = String(startTime);
		const m = s.match(/^(\d{1,2})(?::\d{2})?(?::\d{2})?$/);
		return m ? Number(m[1]) : null;
	})();

	if (!date || hour == null) return false;

	// 타임존 없는 문자열 Date 파싱이 UTC로 잡히는 케이스 방지: +09:00 강제
	const hh = String(hour).padStart(2, '0');
	const slotTime = new Date(`${date}T${hh}:00:00+09:00`);
	return slotTime.getTime() <= Date.now(); // 지금보다 과거면 true
};

// 날짜별로 그룹 만드는 함수
// export const groupByDate = (schedules) => {
// 	const result = {};
// 	schedules.forEach((schedule) => {
// 		const date = schedule.counselingDate;
// 		if (!result[date]) result[date] = [];
// 		result[date].push(schedule);
// 	});

// 	return result;
// };

// 오늘 날짜 기준으로 weekStartDate 계산
export const getThisAndNextWeekStartDates = () => {
	const today = new Date();
	const thisMonday = getMonday(today);

	// ✅ 기존 getWeekDates()[0]가 toISOString(UTC) 기반이면 날짜가 밀릴 수 있어서
	// 로컬 기준 YYYY-MM-DD로 반환
	return formatDateLocal(thisMonday);
};
