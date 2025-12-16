// 승인된 상담 일정 조회


import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';

export default function MyApprovedCounseling() {
	const [list, setList] = useState([]);
	const [subjectId, setSubjectId] = useState('');

	useEffect(() => {
		api.get('/reserve/list/professor').then((res) => {
			setList(
				(res.data ?? []).filter((r) => r.approvalState === 'APPROVED')
			);
		});
	}, []);

	// 과목 목록 (중복 제거)
	const subjects = useMemo(() => {
		const map = new Map();

		list.forEach((r) => {
			if (r.subject) {
				map.set(r.subject.id, r.subject.name);
			}
		});

		return Array.from(map.entries()).map(([id, name]) => ({
			id,
			name,
		}));
	}, [list]);

	// 과목 필터 적용
	const filteredList = useMemo(() => {
		if (!subjectId) return list;
		return list.filter((r) => r.subject?.id === Number(subjectId));
	}, [list, subjectId]);

	const headers = [
		'학생',
		'과목',
		'상담일자',
		'방코드',
	];

	const data = useMemo(() => {
		return filteredList.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			방코드: r.roomCode ?? '',
		}));
	}, [filteredList]);

	return (
		<div>
			<h2>내 상담 일정</h2>

			{/* 과목 선택 필터 */}
			<div style={{ marginBottom: '10px' }}>
				<select
					value={subjectId}
					onChange={(e) => setSubjectId(e.target.value)}
				>
					<option value="">전체 과목</option>
					{subjects.map((s) => (
						<option key={s.id} value={s.id}>
							{s.name}
						</option>
					))}
				</select>
			</div>

			<DataTable headers={headers} data={data} />
		</div>
	);
}
