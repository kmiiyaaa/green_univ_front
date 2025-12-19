import React, { useEffect, useState } from 'react';
import api from '../../../api/httpClient';

export default function ProfessorAlert({ onGoPending, onGoToday }) {
	const [pendingCount, setPendingCount] = useState(0);
	const [scheduleCount, setScheduleCount] = useState(0);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await api.get('/reserve/list/professor');
				const all = res.data ?? [];
				const studentRequested = all.filter((r) => r.approvalState === 'REQUESTED' && r.requester === 'STUDENT');
				setPendingCount(studentRequested.length);
			} catch (e) {
				console.error('교수 알림 로드 실패:', e);
				setPendingCount(0);
				setScheduleCount(0);
			}
		};

		load();
	}, []);

	// 둘 다 없으면 숨김
	if (pendingCount <= 0 && scheduleCount <= 0) return null;

	return (
		<>
			{pendingCount > 0 && (
				<div className="main--page--info">
					<ul className="d-flex align-items-start">
						<li>📢 상담 요청 알림</li>
					</ul>

					<p>
						<a
							href="/professor/counseling/approved"
							onClick={(e) => {
								e.preventDefault();
								onGoPending?.();
							}}
						>
							처리되지 않은 학생 상담 신청이 {pendingCount}건 존재합니다.
						</a>
					</p>
				</div>
			)}

			{scheduleCount > 0 && (
				<div className="main--page--info">
					<ul className="d-flex align-items-start">
						<li>📢 오늘의 상담 건수</li>
					</ul>

					<p>
						<a
							href="/videotest"
							onClick={(e) => {
								e.preventDefault();
								onGoToday?.();
							}}
						>
							오늘의 상담이 {scheduleCount}건 존재합니다.
						</a>
					</p>
				</div>
			)}
		</>
	);
}
