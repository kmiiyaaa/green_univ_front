// 교수나 학생이 상담 요청할 때 상담 가능한 날짜를 보여주는 컴포넌트
import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import { getThisAndNextWeekStartDates } from '../../utils/counselingUtil';

export default function SelectDateForCounseling({
	mode, // professor 또는 student
	subjectId, // 학생용일 때 필요
	onSelectSlot, // 선택된 슬롯을 부모로 전달하는 함수
}) {
	const [availableList, setAvailableList] = useState([]); // 가능한 상담 날짜 목록
	const [selectedSlot, setSelectedSlot] = useState(null);

	// 교수가 학생한테 상담 요청 할 때
	const requestToStudent = async () => {
		try {
			const weekStartDate = getThisAndNextWeekStartDates();
			const res = await api.get('/counseling/professor', { params: { weekStartDate } });
			setAvailableList(res.data);
			console.log('requestToStudent', res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 학생이 교수한테 상담 요청 할 때
	const requestToProfessor = async () => {
		try {
			const res = await api.get('/counseling/schedule', { params: { subjectId } });
			setAvailableList(res.data.scheduleList);
			console.log('requestToProfessor', res.data.scheduleList);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (mode === 'professor') {
			requestToStudent();
		} else if (mode === 'student' && subjectId) {
			requestToProfessor();
		}
	}, [mode, subjectId]);

	const handleSlotClick = (slot) => {
		setSelectedSlot(slot);
		onSelectSlot?.(slot); // 부모로 선택값 전달
	};

	return (
		<>
			<div>
				<h3>{mode === 'professor' ? '교수가 선택 가능한 시간' : '학생이 선택 가능한 시간'}</h3>
				{availableList.map((t) => (
					<button key={t.id} onClick={() => handleSlotClick(t)} className={selectedSlot?.id === t.id ? 'selected' : ''}>
						<div>
							{t.counselingDate} ({t.dayOfWeek})
						</div>
						<div>
							{t.startTime}:00 ~ {t.endTime}:00
						</div>
					</button>
				))}
			</div>
		</>
	);
}
