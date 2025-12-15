import { useState } from 'react';
import api from '../../api/httpClient';
import TextField from '../../components/form/TextField';

export default function CounselingScheduleDetail({ counselingSchedule, subName }) {
	const [selectedSlot, setSelectedSlot] = useState(null);

	if (!Array.isArray(counselingSchedule) || counselingSchedule.length === 0) {
		return <div>상담 가능 일정이 없습니다.</div>;
	}

    

	//교수 정보
	const { professorName, deptName, counselingDate } = counselingSchedule[0];

	const handleReserve = async () => {
		try {
			const res = await api.post('/');
		} catch (e) {
            console.log(e)
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
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			{/* 예약 버튼 */}
			<button
				className="reserve-btn"
				disabled={!selectedSlot}
				onClick={() => {
					console.log('선택된 상담:', selectedSlot);
				}}
			>
				상담 신청
			</button>
		</div>
	);
}
