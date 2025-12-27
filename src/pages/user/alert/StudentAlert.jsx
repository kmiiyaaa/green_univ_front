import React, { useEffect, useState } from 'react';
import api from '../../../api/httpClient';

export default function StudentAlerts({ onGoRisk, onGoRequest, onGoUpcoming }) {
	const [riskCount, setRiskCount] = useState(0);
	const [requestCount, setRequestCount] = useState(0);
	const [upcomingCount, setUpcomingCount] = useState(0);

	useEffect(() => {
		const load = async () => {
			try {
				const [riskRes, countRes] = await Promise.all([api.get('/risk/me'), api.get('/reserve/count/student')]);

				const riskList = riskRes.data?.riskList ?? riskRes.data ?? [];
				setRiskCount(Array.isArray(riskList) ? riskList.length : 0);

				//서비스가 requested/approved 내려줌
				setRequestCount(Number(countRes.data?.requested) || 0);
				setUpcomingCount(Number(countRes.data?.approved) || 0);
			} catch (e) {
				console.error('학생 알림 로드 실패:', e);
				setRiskCount(0);
				setRequestCount(0);
				setUpcomingCount(0);
			}
		};

		load();
	}, []);

	if (riskCount + requestCount + upcomingCount <= 0) return null;

	return (
		<div className="main--page--info">
			<ul className="d-flex align-items-start">
				<li>📢 알림</li>
			</ul>

			<p style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				{riskCount > 0 && (
					<a
						href="/status"
						onClick={(e) => {
							e.preventDefault();
							onGoRisk?.();
						}}
					>
						위험 과목이 <span className="count-bold">{riskCount}</span>개 있습니다.
					</a>
				)}

				{requestCount > 0 && (
					<a
						href="/counseling/manage"
						onClick={(e) => {
							e.preventDefault();
							onGoRequest?.();
						}}
					>
						교수 상담 요청이 <span className="count-bold">{requestCount}</span>건 도착했습니다.
					</a>
				)}

				{upcomingCount > 0 && (
					<a
						href="/counseling/manage"
						onClick={(e) => {
							e.preventDefault();
							onGoUpcoming?.();
						}}
					>
						확정된 상담 일정이 <span className="count-bold">{upcomingCount}</span>건 있습니다.
					</a>
				)}
			</p>
		</div>
	);
}
