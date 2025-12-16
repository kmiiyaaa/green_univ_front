import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import TextField from '../../components/form/TextField';

export default function CounselingScheduleDetail({ counselingSchedule, subName, subId }) {
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [formValue, setFormValue] = useState({ content: '' });

	useEffect(() => {
		setFormValue({ content: '' });
	}, [counselingSchedule]);

	if (!Array.isArray(counselingSchedule) || counselingSchedule.length === 0) {
		return <div>상담 가능 일정이 없습니다.</div>;
	}

	//교수 정보
	const { professorName, deptName, counselingDate } = counselingSchedule[0];

	const handleReserve = async () => {
		// 예약 등록
		if (!selectedSlot) {
			alert('예약 시간을 선택해 주세요!');
			return;
		}
		const payload = {
			counselingScheduleId: selectedSlot.id,
			subjectId: subId,
			reason: formValue.content,
		};
		console.log(payload);
		try {
			await api.post('/preReserve', payload);
			alert('상담 신청이 완료되었습니다.');
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="counseling-detail-wrap">
			{/* 교수 정보 */}
			<div className="professor-card">
				<h3>{professorName}</h3>
				<p>{deptName}</p>
				<p>{subName}</p>
			</div>

			{/* 상담 날짜 */}
			<div className="date-box">
				상담 날짜: <strong>{counselingDate}</strong>
			</div>

			{/* 상담 시간 선택 */}
			<div className="time-section">
				<p className="label">상담 가능 시간</p>

				<div className="time-slots">
					{counselingSchedule.map((s) => (
						<button
							key={s.id}
							className={selectedSlot?.id === s.id ? 'time-btn selected' : 'time-btn'}
							onClick={() => setSelectedSlot(s)}
						>
							{s.startTime}:00 ~ {s.endTime}:50
						</button>
					))}
				</div>
			</div>
			{/* 상담 사유 */}
			<div className="content--container">
				<label>내용</label>
				<TextField
					name="content"
					cols="100"
					rows="20"
					placeholder="내용을 입력하세요"
					value={formValue.content}
					onChange={(e) => setFormValue({ content: e.target.value })}
				/>
			</div>

			<button className="reserve-btn" disabled={!selectedSlot || !formValue.content} onClick={handleReserve}>
				상담 신청
			</button>
		</div>
	);
}
