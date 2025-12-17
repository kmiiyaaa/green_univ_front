import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import OptionForm from '../../../components/form/OptionForm';
import ProfessorCounselRequestModal from './CounselRequestModal';

export default function MyRiskStudent() {
	// 데이터용
	const [pendingList, setPendingList] = useState([]); // 위험학생
	const [completedList, setCompletedList] = useState([]); // 상담 완료 위험학생

	// 검색 필터용
	const [subject, setSubject] = useState('');
	const [riskLevel, setRiskLevel] = useState('');

	// 교수 강의 목록 옵션
	const [subjectOptions, setSubjectOptions] = useState([{ value: '', label: '전체' }]);

	// 모달 상태
	const [openModal, setOpenModal] = useState(false);
	const [target, setTarget] = useState(null); // { studentId, studentName, subjectId, subjectName }

	useEffect(() => {
		loadProfessorSubjects();
	}, []);

	useEffect(() => {
		loadRiskStudents();
	}, [subject, riskLevel]);

	// 교수의 강의 목록
	const loadProfessorSubjects = async () => {
		try {
			const res = await api.get('/professor/subject');
			const list = res.data?.subjectList ?? [];
			const options = list.map((s) => ({
				value: s.id,
				label: s.name,
			}));
			setSubjectOptions([{ value: '', label: '전체' }, ...options]);
		} catch (e) {
			console.log('교수의 강의 목록을 불러올 수 없습니다: ', e);
		}
	};

	// 상담 완료/미완료로 분리된 위험학생 목록
	const loadRiskStudents = async () => {
		try {
			const params = {};
			if (subject) params.subjectId = subject;
			if (riskLevel) params.level = riskLevel;

			const res = await api.get('/risk/list/grouped', { params });
			setPendingList(res.data?.pending ?? []);
			setCompletedList(res.data?.resolved ?? []);
		} catch (e) {
			alert(e?.response?.data?.message || '에러 발생');
		}
	};

	// 상담요청 모달 열기
	const handleOpenModal = (r) => {
		setTarget({
			studentId: r.studentId,
			studentName: r.studentName,
			subjectId: r.subjectId,
			subjectName: r.subjectName,
		});
		setOpenModal(true);
	};

	// 테이블 데이터 변환
	const formatTableData = (list, showConsultButton = false) => {
		return list.map((r) => ({
			과목: r.subjectName ?? '',
			학생정보: `${r.studentName} (${r.studentId})`,
			위험타입: r.riskType ?? '',
			위험레벨: r.riskLevel ?? '',
			...(showConsultButton && { 상태: r.status ?? '' }),
			AI요약: r.aiSummary ?? '',
			...(showConsultButton && { 교수권장: r.aiRecommendation ?? '' }),
			태그: r.aiReasonTags ?? '',
			업데이트: r.updatedAt ?? '',
			...(showConsultButton && {
				상담요청:
					r.status === 'DETECTED' ? (
						<button
							type="button"
							onClick={(ev) => {
								ev.stopPropagation();
								handleOpenModal(r);
							}}
						>
							상담 요청
						</button>
					) : (
						'상담 신청 완료'
					),
			}),
		}));
	};

	const pendingData = useMemo(() => formatTableData(pendingList, true), [pendingList]);
	const completedData = useMemo(() => formatTableData(completedList, false), [completedList]);

	// 검색 옵션
	const riskLevelOptions = [
		{ value: '', label: '전체' },
		{ value: 'DANGER', label: '위험' },
		{ value: 'WARNING', label: '경고' },
	];

	// 헤더
	const pendingHeaders = [
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
	const completedHeaders = ['과목', '학생정보', '위험타입', '위험레벨', 'AI요약', '태그', '업데이트'];

	return (
		<div className="risk-wrap">
			<h2>(이번 학기) 내 담당 위험학생</h2>

			<div className="filter-bar">
				<OptionForm
					label="과목"
					name="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					options={subjectOptions}
				/>
				<OptionForm
					label="위험레벨"
					name="riskLevel"
					value={riskLevel}
					onChange={(e) => setRiskLevel(e.target.value)}
					options={riskLevelOptions}
				/>
			</div>

			<DataTable headers={pendingHeaders} data={pendingData} />

			<hr />

			<h2>상담완료된 학생 목록</h2>
			<DataTable headers={completedHeaders} data={completedData} />

			{/* 상담요청 모달 */}
			<ProfessorCounselRequestModal
				open={openModal}
				target={target}
				onClose={() => setOpenModal(false)}
				onSuccess={() => {
					// 요청 성공 후 UI 반영 필요하면 여기서 리로드
					// (예: 위험학생 상태가 서버에서 바뀌도록 처리했을 때)
					loadRiskStudents();
				}}
			/>
		</div>
	);
}
