import { useEffect } from "react";
import api from "../../api/httpClient";

export default function MyCounselingSchedule() {

	// 이번 학기 수강 강의 목록 조회
	useEffect(() => {
		const loadSubjects = async() => {
			try {
				const res = await api.get("")
			} catch {
				
			}
		}
	},[])


	// 예시 데이터
	const schedules = [
		{
			id: 1,
			date: '2025-12-15',
			time: '15:00 ~ 15:50',
			professor: '김OO 교수',
			status: 'RESERVED',
		},
		{
			id: 2,
			date: '2025-12-10',
			time: '16:00 ~ 16:50',
			professor: '이OO 교수',
			status: 'DONE',
		},
	];

	return (
		<div className="my-schedule-wrap">
			<h2>내 상담 일정</h2>

			<div className="schedule-list">
				{schedules.length === 0 ? (
					<p className="empty">예약된 상담이 없습니다.</p>
				) : (
					schedules.map((s) => (
						<div key={s.id} className="schedule-card">
							<div className="info">
								<p className="date">{s.date}</p>
								<p className="time">{s.time}</p>
								<p className="prof">{s.professor}</p>
							</div>

							<div className="action">
								{s.status === 'RESERVED' && <button className="join">화상 상담 입장</button>}
								{s.status === 'DONE' && <span className="done">상담 완료</span>}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
