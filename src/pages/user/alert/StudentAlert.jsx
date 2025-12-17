import React from 'react';

export default function StudentAlerts({
	riskCount = 0,
	requestCount = 0,
	upcomingCount = 0,
	onGoRisk,
	onGoRequest,
	onGoUpcoming,
}) {
	const items = [
		{
			key: 'risk',
			title: '● 상담 권유 알림',
			desc: `위험 과목이 ${riskCount}건 존재합니다.`,
			onClick: onGoRisk,
			show: riskCount > 0,
		},
		{
			key: 'req',
			title: '● 상담 요청 알림',
			desc: `상담 요청이 ${requestCount}건 존재합니다.`,
			onClick: onGoRequest,
			show: requestCount > 0,
		},
		{
			key: 'up',
			title: '● 상담 예정 알림',
			desc: `상담 예정이 ${upcomingCount}건 존재합니다.`,
			onClick: onGoUpcoming,
			show: upcomingCount > 0,
		},
	].filter((x) => x.show);

	if (items.length === 0) return null;

	return (
		<div className="portal-alert-box">
			<div className="portal-alert-title">📢 학생 알림</div>

			<div className="portal-alert-list">
				{items.map((it) => (
					<button key={it.key} type="button" className="portal-alert-item" onClick={it.onClick}>
						<div className="portal-alert-item-title">{it.title}</div>
						<div className="portal-alert-item-desc">{it.desc}</div>
					</button>
				))}
			</div>
		</div>
	);
}
