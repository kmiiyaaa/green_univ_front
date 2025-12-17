import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import TextField from '../../components/form/TextField';
import '../../assets/css/CounselingScheduleDetail.css';

/**
 * CounselingScheduleDetail
 * - 선택한 과목의 교수 상담 상세 예약 폼
 * - 시간 선택 + 상담 사유 입력 후 가예약 신청
 */
export default function CounselingScheduleDetail({ counselingSchedule, subName, subId }) {
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [formValue, setFormValue] = useState({ content: '' });

	// 상담 일정 변경 시 입력값 초기화
	useEffect(() => {
		setFormValue({ content: '' });
		setSelectedSlot(null);
	}, [counselingSchedule]);

	// 상담 일정 없음
	if (!Array.isArray(counselingSchedule) || counselingSchedule.length === 0) {
		return <div className="CounselingScheduleDetail-empty">상담 가능 일정이 없습니다.</div>;
	}

	// 교수 정보 (동일 교수/날짜 기준)
	const { professorName, deptName, counselingDate } = counselingSchedule[0];

	// 상담 신청
	const handleReserve = async () => {
		if (!selectedSlot) {
			alert('예약 시간을 선택해 주세요.');
			return;
		}

		const payload = {
			counselingScheduleId: selectedSlot.id,
			subjectId: subId,
			reason: formValue.content,
		};

		try {
			await api.post('/preReserve', payload);
			alert('상담 신청이 완료되었습니다.');
		} catch (e) {
			console.error(e);
			alert('상담 신청에 실패했습니다.');
		}
	};

	return (
		<div className="CounselingScheduleDetail">
			{/* 교수 정보 */}
			<div className="CounselingScheduleDetail-professor">
				<h3>{professorName}</h3>
				<p>{deptName}</p>
				<p className="CounselingScheduleDetail-subject">{subName}</p>
			</div>

			{/* 상담 날짜 */}
			<div className="CounselingScheduleDetail-date">
				상담 날짜: <strong>{counselingDate}</strong>
			</div>

			{/* 시간 선택 */}
			<div className="CounselingScheduleDetail-time">
				<p className="CounselingScheduleDetail-label">상담 가능 시간</p>

				<div className="CounselingScheduleDetail-slots">
					{counselingSchedule.map((s) => (
						<button
							key={s.id}
							className={
								selectedSlot?.id === s.id ? 'CounselingScheduleDetail-slot selected' : 'CounselingScheduleDetail-slot'
							}
							onClick={() => setSelectedSlot(s)}
						>
							{s.startTime}:00 ~ {s.endTime}:50
						</button>
					))}
				</div>
			</div>

			{/* 상담 사유 */}
			<div className="CounselingScheduleDetail-content">
				<label>상담 사유</label>
				<TextField
					name="content"
					cols="100"
					rows="8"
					placeholder="상담 사유를 입력하세요"
					value={formValue.content}
					onChange={(e) => setFormValue({ content: e.target.value })}
				/>
			</div>

			<button
				className="CounselingScheduleDetail-submit"
				disabled={!selectedSlot || !formValue.content}
				onClick={handleReserve}
			>
				상담 신청
			</button>
		</div>
	);
}
