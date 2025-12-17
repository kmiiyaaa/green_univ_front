// 교수에게 들어온 상담 신청 목록 조회
// 상담 상세 페이지로 이동

import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';

export default function CounselingRequestManage() {
	const [list, setList] = useState([]);

	useEffect(() => {
		api.get('/reserve/list/professor').then((res) => {
			setList(res.data ?? []);
		});
	}, []);

	const headers = [
		'학생',
		'과목',
		'상담사유',
		'상태',
		'상세',
	];

	const data = useMemo(() => {
		return list.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상태: r.approvalState ?? '',
			상세: (
				<button
					onClick={() => {
						sessionStorage.setItem(
							'counselingDetail',
							JSON.stringify(r)
						);
						window.open('/counseling/info', '_blank');
					}}
				>
					보기
				</button>
			),
		}));
	}, [list]);

	return (
		<div>
			<h2>상담 요청 관리</h2>
			<DataTable headers={headers} data={data} />
		</div>
	);
}