import React from 'react';

export default function StudentAlerts({
	riskCount = 0,
	requestCount = 0,
	upcomingCount = 0,
	onGoRisk,
	onGoRequest,
	onGoUpcoming,
}) {
	const alerts = [
		{
			key: 'risk',
			title: '📢 상담 권유 알림',
			text: `위험 과목이 ${riskCount}건 존재합니다.`,
			href: '/risk/me',
			onClick: onGoRisk,
			show: riskCount > 0,
		},
		{
			key: 'request',
			title: '📢 상담 요청 알림',
			text: `상담 요청이 ${requestCount}건 존재합니다.`,
			href: '/counseling/request',
			onClick: onGoRequest,
			show: requestCount > 0,
		},
		{
			key: 'upcoming',
			title: '📢 상담 예정 알림',
			text: `상담 예정이 ${upcomingCount}건 존재합니다.`,
			href: '/counseling/upcoming',
			onClick: onGoUpcoming,
			show: upcomingCount > 0,
		},
	].filter((a) => a.show);

	// 전부 0이면 아무것도 안 보이게
	if (alerts.length === 0) return null;

	return (
		<>
			{alerts.map((a) => (
				<div key={a.key} className="main--page--info">
					<ul className="d-flex align-items-start">
						<li>{a.title}</li>
					</ul>

					<p>
						<a
							href={a.href}
							onClick={(e) => {
								e.preventDefault();
								a.onClick?.();
							}}
						>
							{a.text}
						</a>
					</p>
				</div>
			))}
		</>
	);
}
