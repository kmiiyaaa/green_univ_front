// 상담 신청 상세 조회
// 상담 승인 / 반려 처리
// 위험 학생 정보 확인

import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import RiskInfoPanel from '../RiskInfoPanel';

export default function CounselingInfoPop() {
	const [data, setData] = useState(null);

	// 상담 상세 정보 로드
	useEffect(() => {
		const raw = sessionStorage.getItem('counselingDetail');
		if (!raw) {
			window.close();
			return;
		}
		setData(JSON.parse(raw));
	}, []);

	if (!data) return null;

	// 승인 / 반려 처리
	const decide = async (decision) => {
		if(!window.confirm(`정말 ${decision} 하시겠습니까? ${decision} 후 철회는 불가능합니다.`)) return;
		await api.post('/reserve/decision', null, {
			params: { reserveId: data.id, decision },
		});
		alert('처리 완료');
		window.close();
	};

	return (
		<div>
			<h2>상담 상세</h2>

			<p>학생: {data.student.name}</p>
			<p>과목: {data.subject.name}</p>
			<p>사유: {data.reason}</p>

			<RiskInfoPanel risk={data.dropoutRisk} />

			<button onClick={() => decide('승인')}>승인</button>
			<button onClick={() => decide('반려')}>반려</button>
		</div>
	);
}
