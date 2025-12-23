import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import OptionForm from '../../../components/form/OptionForm';
import ProfessorCounselRequestModal from './CounselRequestModal';
import '../../../assets/css/MyRiskStudent.css';
import DataTable from '../../../components/table/DataTable';

// 컴포넌트 분리
import RiskStudentOverall from './RiskStudentOverall';
import RiskPending from './RiskPending';

export default function MyRiskStudent() {
	// 데이터용
	const [pendingList, setPendingList] = useState([]); // 위험학생
	const [completedList, setCompletedList] = useState([]); // 상담 완료 위험학생

	// 학생 통합(탈락 위험) 목록
	const [studentList, setStudentList] = useState([]);

	// 우리학과 위험학생 클릭 시, 해당 학생의 "위험 과목 리스트"를 별도로 보관
	const [deptRiskList, setDeptRiskList] = useState([]);

	// 학생 선택(아래 과목 위험 테이블 필터용)
	const [selectedStudentId, setSelectedStudentId] = useState('');

	// 내 교수 id , UserProvider에서 localStorage에 user 저장해두는 경우 대응
	const myProfessorId = JSON.parse(localStorage.getItem('user') || '{}')?.id ?? localStorage.getItem('userId') ?? null;

	// 우리과 위험학생(통합) 행 클릭
	const handleStudentRowClick = (row) => {
		// studentData에서 숨김키로 __studentId 를 넣어두고 있어서 그걸 우선 사용
		// 혹시 다른 형태로 넘어와도 대응하도록 studentId도 fallback 처리
		const id = row?.__studentId ?? row?.studentId;
		if (!id) return;

		setSelectedStudentId((prev) => (String(prev) === String(id) ? '' : String(id)));
	};

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
		loadDeptStudents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		loadMyRiskStudents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subject, riskLevel]);

	// 선택 학생이 바뀌면 해당 학생의 위험 과목 전체를 백엔드에서 조회
	useEffect(() => {
		if (!selectedStudentId) {
			setDeptRiskList([]);
			return;
		}
		loadDeptStudentRisks(selectedStudentId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStudentId]);

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

	// 우리학과 위험학생
	const loadDeptStudents = async () => {
		try {
			// subject/level 없이 호출 → 우리학과 통합은 항상 동일 기준으로 유지
			// /risk/list/grouped 에는 students가 더 이상 내려오지 않음
			// 우리학과 통합 학생 리스트는 /risk/professor/overview 의 departmentStudents 로 받아야 함
			const res = await api.get('/risk/professor/overview');
			const students = res.data?.departmentStudents ?? [];
			setStudentList(students);

			// 선택된 학생이 없으면 선택 해제
			if (selectedStudentId) {
				const exists = students.some((s) => String(s.studentId) === String(selectedStudentId));
				if (!exists) setSelectedStudentId('');
			}
		} catch (e) {
			console.log('우리학과 위험학생(통합) 목록을 불러올 수 없습니다: ', e);
		}
	};

	// 내 담당 과목 위험학생(상담 완료/미완료 분리)
	const loadMyRiskStudents = async () => {
		try {
			const params = {};
			if (subject) params.subjectId = subject;
			if (riskLevel) params.level = riskLevel;

			// 이 API는 pending/resolved만 내려줌 (students 없음)
			const res = await api.get('/risk/list/grouped', { params });
			const pending = res.data?.pending ?? [];
			const resolved = res.data?.resolved ?? [];

			setPendingList(pending);
			setCompletedList(resolved);
		} catch (e) {
			alert(e?.response?.data?.message || '에러 발생');
		}
	};

	// 우리학과 위험학생 클릭 → 해당 학생의 위험 과목 전체 조회
	const loadDeptStudentRisks = async (studentId) => {
		try {
			const params = { studentId };
			// 필요하면 레벨 필터를 붙일 수도 있음
			// if (riskLevel) params.level = riskLevel;

			const res = await api.get('/risk/list/department', { params });
			const list = res.data?.pending ?? [];
			setDeptRiskList(list);
		} catch (e) {
			console.log('선택 학생 위험과목을 불러올 수 없습니다: ', e);
			setDeptRiskList([]);
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

	// 임시: 레벨/ 태그 처리
	const levelLabel = (lvl) => {
		if (lvl === 'DANGER') return '위험';
		if (lvl === 'WARNING') return '경고';
		return lvl || '-';
	};

	const renderTags = (tags) => {
		const arr = Array.isArray(tags)
			? tags
			: String(tags ?? '')
					.split(/[,#]/)
					.map((t) => t.trim())
					.filter(Boolean);

		if (!arr.length) return <span className="muted">-</span>;
		return (
			<div className="chip-row">
				{arr.slice(0, 4).map((t, i) => (
					<span key={i} className="chip">
						{t}
					</span>
				))}
				{arr.length > 4 && <span className="chip chip-more">+{arr.length - 4}</span>}
			</div>
		);
	};

	// 날짜 포맷(백엔드 LocalDateTime 문자열이면 보기 좋게)
	const fmtDateTime = (v) => {
		if (!v) return '-';
		// "2025-12-23T15:00:00" -> "2025-12-23 15:00"
		return String(v).replace('T', ' ').slice(0, 16);
	};

	// 내 과목 여부 판단용: 교수 과목 옵션에 포함되면 "내 과목"
	const mySubjectIdSet = useMemo(() => {
		return new Set((subjectOptions ?? []).map((o) => String(o.value)).filter(Boolean));
	}, [subjectOptions]);

	// 테이블 데이터 변환(과목 위험 row)
	// dept(선택 학생) 테이블에서는 "내 과목만 상담요청 가능"하게 막기 옵션 추가
	const formatTableData = (list, showConsultButton = false, onlyMySubjectCanRequest = false) => {
		return (list ?? []).map((r) => {
			// DETECTED 상태이고
			// 아직 요청이 없거나(consultState null/undefined), 거절돼서 재요청 가능(CONSULT_REJECTED)이면 버튼 노출
			// 이미 요청대기/확정 상태면 버튼 막기
			// 취소(CONSULT_CANCELED)도 재요청 가능으로 처리

			// 버튼 활성화는 consultState 기준으로 판단
			const isAlreadyPending = r.consultState === 'CONSULT_REQ';
			const isAlreadyApproved = r.consultState === 'CONSULT_APPROVED';

			const isRejected = r.consultState === 'CONSULT_REJECTED';
			const isCanceled = r.consultState === 'CONSULT_CANCELED';

			// [MOD] "내 과목인지" 체크 (선택 학생 위험과목에서는 중요)
			const isMySubject = mySubjectIdSet.has(String(r.subjectId));

			// 재요청은 consultState가 CONSULT_REJECTED / CONSULT_CANCELED면 가능하게
			// [MOD] onlyMySubjectCanRequest=true면 내 과목일 때만 요청 가능
			const canRequestBase =
				showConsultButton && !isAlreadyPending && !isAlreadyApproved && (!r.consultState || isRejected || isCanceled);

			const canRequest = onlyMySubjectCanRequest ? canRequestBase && isMySubject : canRequestBase;

			const requestBtnLabel = isRejected || isCanceled ? '재요청' : '상담 요청';

			return {
				// rowClick에서 쓸 수 있게 숨김키 유지(헤더에는 안나옴)
				__studentId: r.studentId,
				__studentName: r.studentName,

				과목: <span className="cell-strong">{r.subjectName ?? '-'}</span>,
				학생정보: (
					<div className="student-cell">
						<div className="student-name">{r.studentName ?? '-'}</div>
						<div className="student-id">{r.studentId ?? ''}</div>
					</div>
				),
				위험타입: r.riskType ? <span className="chip">{r.riskType}</span> : <span className="muted">-</span>,
				위험레벨: (
					<span
						className={`badge ${
							r.riskLevel === 'DANGER' ? 'badge-danger' : r.riskLevel === 'WARNING' ? 'badge-warn' : 'badge-neutral'
						}`}
					>
						{levelLabel(r.riskLevel)}
					</span>
				),
				AI요약: <div className="clamp-2">{r.aiSummary ?? '-'}</div>,
				교수권장: <div className="clamp-2">{r.aiRecommendation ?? '-'}</div>,
				태그: renderTags(r.aiReasonTags),
				업데이트: <span className="muted">{fmtDateTime(r.updatedAt) ?? '-'}</span>,

				...(showConsultButton && {
					상담요청: canRequest ? (
						<button
							type="button"
							className="btn btn-primary"
							onClick={(ev) => {
								ev.stopPropagation();
								handleOpenModal(r);
							}}
						>
							{requestBtnLabel}
						</button>
					) : onlyMySubjectCanRequest && !isMySubject ? (
						// [MOD] 다른 과목이면 그냥 막아두기
						<span className="status-pill">내 과목 아님</span>
					) : r.consultState === 'CONSULT_REQ' ? (
						<span className="status-pill">요청 대기</span>
					) : r.consultState === 'CONSULT_APPROVED' ? (
						<span className="status-pill ok">상담 확정</span>
					) : assignedToOther ? (
						// 학과 교수 모두에게 "과목은 보이되", 버튼만 막기
						<button
							type="button"
							className="btn btn-disabled"
							disabled
							onClick={(ev) => ev.stopPropagation()}
							title="이미 다른 담당교수가 처리 중입니다."
						>
							담당교수 처리중
						</button>
					) : r.consultState === 'CONSULT_REJECTED' ? (
						<span className="status-pill warn">재요청 가능</span>
					) : r.consultState === 'CONSULT_CANCELED' ? (
						<span className="status-pill warn">취소됨(재요청 가능)</span>
					) : (
						<span className="muted">상태 확인</span>
					),
				}),
			};
		});
	};

	// 내 담당 과목 위험학생 테이블 데이터
	const pendingData = useMemo(() => formatTableData(pendingList, true, false), [pendingList]);
	const completedData = useMemo(() => formatTableData(completedList, false, false), [completedList]);

	// 선택 학생 위험과목 테이블 데이터
	const deptStudentRiskData = useMemo(() => formatTableData(deptRiskList, true, true), [deptRiskList]);

	// 학생 통합(탈락 위험) 테이블
	const overallLabel = (lvl) => {
		if (lvl === 'DANGER') return '탈락위험';
		if (lvl === 'WARNING') return '주의';
		return '정상';
	};
	const overallBadgeClass = (lvl) => {
		if (lvl === 'DANGER') return 'badge-danger';
		if (lvl === 'WARNING') return 'badge-warn';
		return 'badge-neutral';
	};

	const studentHeaders = ['학생정보', '통합위험', '위험과목수', '담당교수', '업데이트'];

	const studentData = useMemo(() => {
		return (studentList ?? []).map((s) => ({
			// 클릭에서 꺼내 쓸 수 있게 id를 "숨김키 + 일반키" 둘 다 유지
			__studentId: s.studentId,
			studentId: s.studentId, // (헤더에 없으니 화면에는 안 보임)
			__studentName: s.studentName,

			학생정보: (
				<div className="student-cell">
					<div className="student-name">{s.studentName ?? '-'}</div>
					<div className="student-id">{s.studentId ?? ''}</div>
				</div>
			),
			통합위험: <span className={`badge ${overallBadgeClass(s.overallLevel)}`}>{overallLabel(s.overallLevel)}</span>,
			위험과목수: (
				<div className="chip-row">
					<span className="chip">DANGER {s.dangerCount ?? 0}</span>
					<span className="chip">WARNING {s.warningCount ?? 0}</span>
				</div>
			),
			담당교수: s.assignedProfessorName ? (
				<div className="assign-cell">
					<span className="cell-strong">{s.assignedProfessorName}</span>
					{s.assignedAt ? <span className="muted"> · {fmtDateTime(s.assignedAt)}</span> : null}
				</div>
			) : (
				<span className="muted">미배정</span>
			),
			업데이트: <span className="muted">{fmtDateTime(s.updatedAt)}</span>,
		}));
	}, [studentList]);

	// 검색 옵션
	const riskLevelOptions = [
		{ value: '', label: '전체' },
		{ value: 'DANGER', label: '위험' },
		{ value: 'WARNING', label: '경고' },
	];

	// 헤더(과목 위험 row)
	const pendingHeaders = [
		'과목',
		'학생정보',
		'위험타입',
		'위험레벨',
		'AI요약',
		'교수권장',
		'태그',
		'업데이트',
		'상담요청',
	];
	const completedHeaders = ['과목', '학생정보', '위험타입', '위험레벨', 'AI요약', '태그', '업데이트'];

	// 선택된 학생 이름 표시용
	const selectedStudentName = useMemo(() => {
		if (!selectedStudentId) return '';
		const found = (studentList ?? []).find((s) => String(s.studentId) === String(selectedStudentId));
		return found?.studentName ?? '';
	}, [selectedStudentId, studentList]);

	return (
		<div className="risk-wrap">
			{/* 상단 헤더 */}
			<div className="risk-page-head">
				<div></div>

				<div className="risk-stat-row">
					<div className="risk-stat">
						<div className="risk-stat-label">미상담</div>
						<div className="risk-stat-value">{pendingList.length}</div>
					</div>
					<div className="risk-stat">
						<div className="risk-stat-label">상담완료</div>
						<div className="risk-stat-value">{completedList.length}</div>
					</div>
				</div>
			</div>

			{/* 탈락 위험 학생(통합) */}
			<RiskStudentOverall
				studentHeaders={studentHeaders}
				studentData={studentData}
				studentListLength={studentList.length}
				onRowClick={handleStudentRowClick}
				selectedStudentId={selectedStudentId}
				selectedStudentName={selectedStudentName}
			/>
			{selectedStudentId ? (
				<div className="risk-section">
					<DataTable headers={pendingHeaders} data={deptStudentRiskData} />
				</div>
			) : null}

			<hr />
			{/* 필터 */}
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

			{/* 미완료 섹션 */}
			<RiskPending
				pendingHeaders={pendingHeaders}
				pendingData={pendingData}
				filteredPendingLength={pendingList.length}
				selectedStudentId={selectedStudentId}
			/>

			<ProfessorCounselRequestModal
				open={openModal}
				target={target}
				onClose={() => setOpenModal(false)}
				onSuccess={() => {
					loadMyRiskStudents();
					// 선택 학생 열려있으면 그 학생 위험과목도 같이 갱신
					if (selectedStudentId) loadDeptStudentRisks(selectedStudentId);
					loadDeptStudents();
				}}
			/>
		</div>
	);
}
