// 승인된 상담 일정 조회

import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';

export default function MyApprovedCounseling() {
	const [list, setList] = useState([]);

	useEffect(() => {
		api.get('/reserve/list/professor').then((res) => {
			setList(
				(res.data ?? []).filter((r) => r.approvalState === 'APPROVED')
			);
		});
	}, []);

	const headers = [
		'학생',
		'과목',
		'상담일자',
		'방코드',
	];

	const data = useMemo(() => {
		return list.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			방코드: r.roomCode ?? '',
		}));
	}, [list]);

	return (
		<div>
			<h2>내 상담 일정</h2>
			<DataTable headers={headers} data={data} />
		</div>
	);
}