import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function MyRiskStudent() {
	const [students, setStudents] = useState([]);

	const loadRiskStudents = async () => {
		try {
			const res = await api.get('/counseling/riskStu');
			setStudents(res.data.riskStuList);
		} catch (e) {
			alert(e.response.default.message);
		}
	};

	useEffect(() => {
		loadRiskStudents();
		console.log(students);
	}, []);

	const riskHeaders = [
		'학번',
		'이름',
		'위험타입',
		'위험레벨',
		'상태',
		'AI요약',
		'교수권장',
		'학생메시지',
		'태그',
		'업데이트',
		'상담요청',
	];

	const riskTableData = useMemo(() => {
		return students.map((r) => ({
			학번: r.studentId ?? '',
			이름: r.studentName ?? '',
			위험타입: r.riskType ?? '',
			위험레벨: r.riskLevel ?? '',
			상태: r.status ?? '',
			AI요약: r.aiSummary ?? '',
			교수권장: r.aiRecommendation ?? '',
			학생메시지: r.aiStudentMessage ?? '',
			태그: r.aiReasonTags ?? '',
			업데이트: r.updatedAt ?? '',
			상담요청: <button>상담 요청</button>,
		}));
	}, [students]);

	return (
		<div className="risk-wrap">
			<h2>(이번 학기)내 담당 위험학생</h2>

			{/* 필터 영역 */}
			<div className="filter-bar">
				<select>
					<option>과목</option>
				</select>

				<select>
					<option value="">전체</option>
					<option value="DANGER">출결</option>
					<option value="WARNING">경고</option>
				</select>
			</div>

			{/* 리스트 */}
			<DataTable headers={riskHeaders} data={riskTableData} />
		</div>
	);
}
