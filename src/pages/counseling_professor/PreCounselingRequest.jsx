import { useCallback, useEffect, useState } from 'react'; // 상담 요청 관리
import api from '../../api/httpClient';
import { toHHMM } from '../../utils/DateTimeUtil';
import DataTable from '../../components/table/DataTable';

export default function PreCounselingRequest() {
	const [subList, setSubList] = useState([]); // 이번 학기에 내가 강의하는 과목
	const [selectedSubId, setSelectedSubId] = useState(null);
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		const loadSubjectList = async () => {
			const res = await api.get('/subject/semester/professor'); // 교수 기준 수강 과목
			setSubList(res.data.subjectList);
		};
		loadSubjectList();
	}, []);

	const subjectOptions = subList.map((s) => ({
		value: s.id,
		label: s.name,
	}));

	useEffect(() => {
		// 검색한 과목의 예약 리스트 불러오기
		if (selectedSubId === undefined) setSelectedSubId(null);
		const loadPreList = async () => {
			try {
				const res = await api.get('/preReserve/preList', {
					params: { subjectId: selectedSubId },
				});
				setRequests(res.data.preList);
				console.log(requests);
			} catch (e) {
				console.log(e);
			}
		};
		loadPreList();
	}, [selectedSubId]);

	const tableData = requests.map((r, idx) => ({
		번호: idx + 1,
		이름: r.student.name,
		'신청 과목': r.subject.name,
		'위험 등급': r.dropoutRisk?.riskLevel ?? '',
		'AI 상담 가이드': r.dropoutRisk?.aiRecommendation ?? '',
		'상담 사유': r.reason,
		'상담 일자': r.counselingSchedule.counselingDate,
		'상담 시간': `${toHHMM(r.counselingSchedule.startTime)} ~ ${toHHMM(r.counselingSchedule.endTime)}`,
		상태: r.approvalState === 'REQUESTED' ? '승인 대기' : r.approvalState === 'APPROVED' ? '승인 완료' : '반려',
		상세: (
			<button
				onClick={() => {
					sessionStorage.setItem(
						'counselingDetail',
						JSON.stringify(r) // r = 선택한 행 데이터
					);
					window.open('/counseling/info', '_blank', 'width=900,height=700');
				}}
			>
				상세 보기
			</button>
		),
	}));

	const headers = [
		'번호',
		'이름',
		'신청 과목',
		'위험 등급',
		'AI 상담 가이드',
		'상담 사유',
		'상담 일자',
		'상담 시간',
		'상태',
		'상세',
	];

	return (
		<div>
			<h2>금주 상담 요청 관리</h2>
			<hr></hr>
			{/* 과목 선택 */}
			<select onChange={(e) => setSelectedSubId(e.target.value ? Number(e.target.value) : null)}>
				<option value="">전체 과목</option>
				{subjectOptions.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>

			<DataTable headers={headers} data={tableData} />
		</div>
	);
}
