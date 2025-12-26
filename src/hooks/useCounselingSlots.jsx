// hooks/useCounselingSlots.js 복붙만 하고 못 쓰겠음 ㅠ
import { useState, useEffect } from 'react';
import api from '../api/httpClient';

// 지난 날짜, 시간 체크 유틸
const isPastSlot = (date, startTime) => {
	if (!date || startTime == null) return true;
	const slotTime = new Date(`${date}T${String(startTime).padStart(2, '0')}:00:00`);
	return slotTime <= new Date();
};

// 교수 ID로 예약 가능한 슬롯 조회
export const useCounselingSlots = (professorId, weekStartDates = []) => {
	const [slots, setSlots] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!professorId) return;

		const fetchSlots = async () => {
			try {
				setLoading(true);

				// weekStartDates 배열만큼 API 호출
				const promises = weekStartDates.map((wsd) =>
					api.get('/counseling/professor', { params: { weekStartDate: wsd } })
				);

				const responses = await Promise.all(promises);
				const merged = responses.flatMap((res) => res.data?.list ?? []);

				// 중복 제거 (id 기준)
				const unique = Array.from(new Map(merged.map((s) => [s.id, s])).values());

				// 예약 안 됨 + 지난 시간 제외
				const available = unique
					.filter((s) => !s.reserved && !isPastSlot(s.counselingDate, s.startTime))
					.sort((a, b) => {
						const dateDiff = String(a.counselingDate).localeCompare(String(b.counselingDate));
						return dateDiff !== 0 ? dateDiff : a.startTime - b.startTime;
					});

				setSlots(available);
			} catch (e) {
				console.error(e);
				setSlots([]);
			} finally {
				setLoading(false);
			}
		};

		fetchSlots();
	}, [professorId, weekStartDates]);

	return { slots, loading };
};

// 학생용: 과목 ID로 조회
export const useSlotsBySubject = (subjectId) => {
	const [slots, setSlots] = useState([]);
	const [subName, setSubName] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!subjectId) return;

		const fetch = async () => {
			try {
				setLoading(true);
				const res = await api.get('/counseling/schedule', { params: { subjectId } });
				setSlots(res.data?.scheduleList ?? []);
				setSubName(res.data?.subjectName ?? '');
			} catch (e) {
				console.error(e);
				setSlots([]);
			} finally {
				setLoading(false);
			}
		};

		fetch();
	}, [subjectId]);

	return { slots, subName, loading };
};
