import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import { useNavigate } from 'react-router-dom';
import OptionForm from '../../../components/form/OptionForm';
import DataTable from '../../../components/table/DataTable';

export default function MyStatus() {
	const [riskList, setRiskList] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');
	const navigate = useNavigate();

	const loadMyRisk = async () => {
		try {
			const res = await api.get('/risk/me');

			// 서버가 list를 바로 주는 경우가 대부분이라 방어차원 둘다 대응
			const list = res.data?.riskList ?? res.data ?? [];
			setRiskList(list);
		} catch (e) {
			alert(e?.response?.data?.message ?? '조회 실패');
			console.error(e);
		}
	};

	const subjectOptions = useMemo(() => {
		const map = new Map();
		riskList.forEach((r) => {
			if (r.subjectId) map.set(String(r.subjectId), r.subjectName ?? '');
		});

		const options = [{ value: '', label: '전체' }];
		for (const [value, label] of map.entries()) {
			options.push({ value, label });
		}
		return options;
	}, [riskList]);

	const filteredRiskList = useMemo(() => {
		if (!selectedSubjectId) return riskList;
		return riskList.filter((r) => String(r.subjectId) === String(selectedSubjectId));
	}, [riskList, selectedSubjectId]);

	const headers = ['과목', '교수', '메시지', '상담요청'];

	const tableData = useMemo(() => {
		return filteredRiskList.map((r) => ({
			과목: r.subjectName ?? '',
			교수: r.professorName ?? '',
			메시지: r.aiStudentMessage ?? '',
			상담요청: (
				<button
					type="button"
					onClick={(ev) => {
						ev.stopPropagation();
						navigate(`/counseling/reserve?subjectId=${r.subjectId}`);
					}}
				>
					상담 요청
				</button>
			),
		}));
	}, [filteredRiskList, navigate]);

	return (
		<div className="risk-wrap">
			<h1>내 학업 상태</h1>

			<div>
				<h3>내 위험 과목</h3>
				{/* 과목 선택 옵션 */}
				<div className="filter-bar">
					<OptionForm
						label="과목"
						name="subjectId"
						value={selectedSubjectId}
						onChange={(e) => setSelectedSubjectId(e.target.value)}
						options={subjectOptions}
					/>
				</div>
				<DataTable headers={headers} data={tableData} />
			</div>
		</div>
	);
}
