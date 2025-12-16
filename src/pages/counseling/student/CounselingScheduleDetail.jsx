// - 선택한 과목의 상담 일정 목록 표시
// - 상담 시간 선택 + 상담 신청 처리

import { useState } from 'react';
import api from '../../../api/httpClient';

export default function CounselingScheduleDetail({
	counselingSchedule,
	subId,
	subName,
}) {
	const [selected, setSelected] = useState(null);
	const [reason, setReason] = useState('');

	if (!counselingSchedule?.length) {
		return <div>상담 가능 일정이 없습니다.</div>;
	}

	// 상담 신청
	const submit = async () => {
		await api.post('/reserve', {
			counselingScheduleId: selected.id,
			subjectId: subId,
			reason,
		});
		alert('상담 신청 완료');
	};

	return (
		<div>
			<h3>{subName}</h3>

			{/* 상담 시간 선택 */}
			{counselingSchedule.map((s) => (
				<button key={s.id} onClick={() => setSelected(s)}>
					{s.startTime}:00 ~ {s.endTime}:50
				</button>
			))}

			{/* 상담 사유 입력 */}
			<textarea
				value={reason}
				onChange={(e) => setReason(e.target.value)}
				placeholder="상담 사유를 입력하세요"
			/>

			<button disabled={!selected || !reason} onClick={submit}>
				신청
			</button>
		</div>
	);
}
