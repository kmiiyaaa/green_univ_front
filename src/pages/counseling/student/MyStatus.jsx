// - 학생의 위험 과목 상태 조회
// - 위험 과목에서 바로 상담 예약 페이지로 이동

import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import { useNavigate } from 'react-router-dom';

export default function MyStatus() {
	const [list, setList] = useState([]);
	const [subjectId, setSubjectId] = useState('');
	const navigate = useNavigate();

	// 위험 학생 데이터 조회
	useEffect(() => {
		api.get('/risk/me').then((res) => {
			setList(res.data ?? []);
		});
	}, []);

	// 과목 목록
	const subjects = useMemo(() => {
		const map = new Map();
		list.forEach((r) => map.set(r.subjectId, r.subjectName));
		return [...map.entries()].map(([id, name]) => ({ id, name }));
	}, [list]);

	const filtered = subjectId
		? list.filter((r) => String(r.subjectId) === subjectId)
		: list;

	return (
		<div>
			<h2>내 학업 상태</h2>

			<SubjectSelect
				subjects={subjects}
				value={subjectId}
				onChange={(e) => setSubjectId(e.target.value)}
			/>

			{filtered.map((r) => (
				<div key={r.subjectId}>
					<p>{r.subjectName}</p>
					<p>{r.aiStudentMessage}</p>

					<button
						onClick={() =>
							navigate(`/counseling/reserve?subjectId=${r.subjectId}`)
						}
					>
						상담 요청
					</button>
				</div>
			))}
		</div>
	);
}
