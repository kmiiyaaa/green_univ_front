// 교수에게 들어온 상담 신청 목록 조회
// 상담 상세 페이지로 이동

import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import ReservationStatus from '../ReservationStatus';

export default function CounselingRequestManagePage() {
	const [list, setList] = useState([]);

	// 교수 기준 상담 신청 목록 조회
	useEffect(() => {
		api.get('/reserve/list/professor').then((res) => {
			setList(res.data);
		});
	}, []);

	return (
		<div>
			<h2>상담 요청 관리</h2>

			{list.map((r) => (
				<div key={r.id}>
					<p>학생: {r.student.name}</p>
					<p>과목: {r.subject.name}</p>
					<p>사유: {r.reason}</p>

					<ReservationStatus status={r.approvalState} />

					<button
						onClick={() => {
							sessionStorage.setItem(
								'counselingDetail',
								JSON.stringify(r)
							);
							window.open('/counseling/info', '_blank');
						}}
					>
						상세
					</button>
				</div>
			))}
		</div>
	);
}
