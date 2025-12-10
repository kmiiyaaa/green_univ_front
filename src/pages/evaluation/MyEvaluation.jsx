import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function MyEvaluation() {
	// 교수 - 내 강의 평가 조회 + 담당 강의 옵션으로 검색
	const [subName, setSubName] = useState(null); // 선택한 학과이름
	const [evalList, setEvalList] = useState([]); // 강의평가 리스트
	const [subNameList, setSubNameList] = useState([]); // 교수의 과목 리스트

	useEffect(() => {
		const loadMyEvaluation = async () => {
			try {
				let subject_name = null;
				if (subName !== null) {
					subject_name = subName;
				}
				const res = await api.get('/evaluation/read', {
					subject_name,
				});
				setSubNameList(res.data.subNames);
				setEvalList(res.data.eval);
				console.log(res.data);
			} catch (e) {
				alert(e.response.data.message);
			}
		};
		loadMyEvaluation();
	}, []);

	// 테이블 데이터
	const headers = ['과목 이름', '	총 평가 점수', '건의 사항'];

	const tableData = useMemo(() => {
		return evalList.map((p) => ({
			'과목 이름': p.name ?? '',
			'	총 평가 점수': p.answerSum ?? '',
			'건의 사항': p.improvements ?? '',
		}));
	}, [evalList]);

	return (
		<div>
			<DataTable headers={headers} data={tableData} />
		</div>
	);
}
