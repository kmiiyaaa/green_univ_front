import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import OptionForm from '../../../components/form/OptionForm';

// 유림 님이 수정중임
export default function MyRiskStudent() {
	const [riskList, setRiskList] = useState([]);

	const loadRiskStudents = async () => {
		try {
			const res = await api.get(`/risk/list`);
			console.log(res.data);
			setRiskList(res.data);
		} catch (e) {
			alert(e.response.default.message);
		}
	};

	useEffect(() => {
		loadRiskStudents();
		console.log(students);
	}, []);

	const riskHeaders = [
		'과목',
		'학생정보',
		'위험타입',
		'위험레벨',
		'상태',
		'AI요약',
		'교수권장',
		'태그',
		'업데이트',
		'상담요청',
	];

	const riskTableData = useMemo(() => {
		return riskList.map((r) => ({
			과목: r.subjectName ?? '',
			학생정보: `${r.studentName} (${r.studentId})`,
			이름: r.studentName ?? '',
			위험타입: r.riskType ?? '',
			위험레벨: r.riskLevel ?? '',
			상태: r.status ?? '',
			AI요약: r.aiSummary ?? '',
			교수권장: r.aiRecommendation ?? '',
			태그: r.aiReasonTags ?? '',
			업데이트: r.updatedAt ?? '',
			상담요청: r.status === 'DETECTED' ? <button>상담 요청</button> : '상담 신청 완료',
		}));
	}, [riskList]);

	const subjectOptions = [
		{ value: 'subject1', label: '교수과목1' },
		{ value: 'subject2', label: '교수과목2' },
	];

	const riskLevelOptions = [
		{ value: 'DANGER', label: '위험' },
		{ value: 'WARNING', label: '경고' },
	];

	const value = 'value는뭘넣어야할까';

	return (
		<div className="risk-wrap">
			<h2>(이번 학기)내 담당 위험학생</h2>

			<OptionForm label="과목" name="subject" value={value} options={subjectOptions} />
			<OptionForm label="위험레벨" name="subject" value={value} options={riskLevelOptions} />

			{/* 상담이 필요한 학생 목록 */}
			<DataTable headers={riskHeaders} data={riskTableData} />
			<hr />
			{/* 상담완료된 학생 목록 */}
			<DataTable headers={riskHeaders} data={riskTableData} />
		</div>
	);
}
