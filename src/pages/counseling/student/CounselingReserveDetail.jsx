// 선택한 과목의 상담 일정 목록 표시
// 상담 시간 선택 + 상담 신청 처리

import { useState } from 'react';
import api from '../../../api/httpClient';

export default function CounselingReserveDetail({
	counselingSchedule,
	subId,
	subName,
}) {
	const [selected, setSelected] = useState(null);
	const [reason, setReason] = useState('');

	if (!Array.isArray(counselingSchedule) || counselingSchedule.length === 0) {
		return <div>상담 가능 일정이 없습니다.</div>;
	}

	// 교수 정보 (모든 일정은 같은 교수)
	const professor = counselingSchedule[0]?.professor;

	// 상담 신청
	const submit = async () => {
		if (!selected) {
			alert('상담 시간을 선택해 주세요.');
			return;
		}

		try {
			await api.post('/reserve', {
				counselingScheduleId: selected.id,
				subjectId: subId,
				reason,
			});
			alert('상담 신청 완료');
		} catch (e) {
			alert(e?.response?.data?.message ?? '상담 신청 실패');
		}
	};

	return (
		<div>
			<h3>{subName}</h3>

			{/* 교수 정보 */}
			{professor && (
				<div style={{ marginBottom: '10px' }}>
					<strong>담당 교수</strong> : {professor.name}
					{professor.deptName && ` (${professor.deptName})`}
				</div>
			)}

			{/* 상담 시간 선택 */}
			<div>
				{counselingSchedule.map((s) => (
					<button
						key={s.id}
						onClick={() => setSelected(s)}
						style={{
							fontWeight: selected?.id === s.id ? 'bold' : 'normal',
							marginRight: '6px',
						}}
					>
						{s.startTime}:00 ~ {s.endTime}:50
					</button>
				))}
			</div>

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
