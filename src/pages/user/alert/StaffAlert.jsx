import React from 'react';

export default function StaffAlert({ pendingCount = 0, onGoList }) {
	if (pendingCount > 0) {
		return (
			<div className="main--page--info">
				<ul className="d-flex align-items-start">
					<li>📢 업무 알림</li>
				</ul>

				<p>
					<a
						href="/break/list/staff"
						onClick={(e) => {
							e.preventDefault();
							onGoList?.();
						}}
					>
						처리되지 않은 휴학 신청이 {pendingCount}건 존재합니다.
					</a>
				</p>
			</div>
		);
	}

	return (
		<div className="main--page--info empty">
			<p>처리해야 할 업무가 없습니다.</p>
		</div>
	);
}
