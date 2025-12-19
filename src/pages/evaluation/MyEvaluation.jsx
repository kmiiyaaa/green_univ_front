import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function MyEvaluation() {
	// 교수 - 내 강의 평가 조회 + 담당 강의 옵션으로 검색 (페이징 x)
	const [subName, setSubName] = useState(null); // 선택한 학과이름
	const [evalList, setEvalList] = useState([]); // 강의평가 리스트
	const [subNameList, setSubNameList] = useState([]); // 교수의 과목 리스트

	const loadMyEvaluation = async () => {
		try {
			// 검색 값 있을 때
			let subject_Name = null;
			if (subName !== null) {
				subject_Name = subName;
			}
			const res = await api.get('/evaluation/read', {
				params: {
					subject_Name: subject_Name,
				},
			});
			setSubNameList(res.data.subNames);
			setEvalList(res.data.eval);
		} catch (e) {
			alert(e.response.data.message);
		}
	};

	useEffect(() => {
		// 처음 로딩
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
			<h2>내 강의 평가</h2>
			<br></br>

			{evalList.length > 0 ? (
				<div>
					<select name="subName" value={subName ?? '과목 선택'} onChange={(e) => setSubName(e.target.value)}>
						{subNameList.map((sub, idx) => (
							<option key={idx}>{sub.name}</option>
						))}
					</select>
					<button onClick={() => loadMyEvaluation()}>검색</button>

					<DataTable headers={headers} data={tableData} />
				</div>
			) : (
				'아직 등록된 강의 평가가 없습니다.'
			)}
		</div>
	);
}
