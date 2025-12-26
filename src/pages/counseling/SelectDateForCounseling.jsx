// 교수나 학생이 상담 요청할 때 상담 가능한 날짜를 보여주는 컴포넌트
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import { getThisAndNextWeekStartDates, isPastSlot } from '../../utils/counselingUtil';
import { endMinus10, toHHMM } from '../../utils/DateTimeUtil';

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

			// 응답이 {list: []} 형태면 list만 꺼내기 (배열이면 그대로)
			const payload = res.data;
			const list = Array.isArray(payload) ? payload : payload?.list ?? [];

			setAvailableList(list);
			console.log('requestToStudent', payload);
		} catch (e) {
			console.error(e);
			setAvailableList([]);
		}
	};

	// 학생이 교수한테 상담 요청 할 때
	const requestToProfessor = async () => {
		try {
			const res = await api.get('/counseling/schedule', { params: { subjectId } });
			setAvailableList(res.data?.scheduleList ?? []);
			console.log('requestToProfessor', res.data?.scheduleList);
		} catch (e) {
			console.error(e);
			setAvailableList([]);
		}
	};

	useEffect(() => {
		setSelectedSlot(null);
		onSelectSlot?.(null); // 과목 바뀌거나 mode 바뀔 때 부모가 이전 slotId 잡고 있다가 잘못 POST할 수 있음

		if (mode === 'professor') {
			requestToStudent();
		} else if (mode === 'student' && subjectId) {
			requestToProfessor();
		} else {
			setAvailableList([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, subjectId]);

	// 지난 날짜/시간 필터링
	const filteredList = useMemo(
		() =>
			(availableList ?? [])
				.filter((t) => t?.reserved !== true) // 예약된거 안보이게 처리
				.filter((t) => !isPastSlot(t?.counselingDate, t?.startTime)),
		[availableList]
	);

	const handleSlotClick = (slot) => {
		console.log('clicked slot =>', slot);
		setSelectedSlot(slot);
		onSelectSlot?.(slot); // 부모로 선택값 전달
	};

	return (
		<>
			<div>
				<h3>{mode === 'professor' ? '교수가 선택 가능한 시간' : '학생이 선택 가능한 시간'}</h3>

				{filteredList.map((t) => (
					<button
						key={t.id}
						type="button"
						onClick={() => handleSlotClick(t)}
						className={selectedSlot?.id === t.id ? 'selected' : ''}
					>
						<div>
							{t.counselingDate} ({t.dayOfWeek})
						</div>
						<div>
							{toHHMM(Number(t.startTime))} ~ {endMinus10(Number(t.endTime))}
						</div>
					</button>
				))}
			</div>
		</>
	);
}
