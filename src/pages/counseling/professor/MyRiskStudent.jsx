import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import OptionForm from '../../../components/form/OptionForm';
import ProfessorCounselRequestModal from './CounselRequestModal';
import '../../../assets/css/MyRiskStudent.css';

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

	// 테이블 데이터 변환
	const formatTableData = (list, showConsultButton = false) => {
		return list.map((r) => {
			// DETECTED 상태이고
			// 아직 요청이 없거나(consultState null/undefined), 거절돼서 재요청 가능(CONSULT_REJECTED)이면 버튼 노출
			// 이미 요청대기/확정 상태면 버튼 막기
			// 취소(CONSULT_CANCELED)도 재요청 가능으로 처리

			// 버튼 활성화는 consultState 기준으로 판단
			const isAlreadyPending = r.consultState === 'CONSULT_REQ';
			const isAlreadyApproved = r.consultState === 'CONSULT_APPROVED';

			const isRejected = r.consultState === 'CONSULT_REJECTED';
			const isCanceled = r.consultState === 'CONSULT_CANCELED';

			// 재요청은 consultState가 CONSULT_REJECTED / CONSULT_CANCELED면 가능하게
			const canRequest =
				showConsultButton && !isAlreadyPending && !isAlreadyApproved && (!r.consultState || isRejected || isCanceled);

			const requestBtnLabel = isRejected || isCanceled ? '재요청' : '상담 요청';

			return {
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
				업데이트: <span className="muted">{r.updatedAt ?? '-'}</span>,
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
					) : r.consultState === 'CONSULT_REQ' ? (
						<span className="status-pill">요청 대기</span>
					) : r.consultState === 'CONSULT_APPROVED' ? (
						<span className="status-pill ok">상담 확정</span>
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
		'AI요약',
		'교수권장',
		'태그',
		'업데이트',
		'상담요청',
	];
	const completedHeaders = ['과목', '학생정보', '위험타입', '위험레벨', 'AI요약', '태그', '업데이트'];

	return (
		<div className="risk-wrap">
			{/* 상단 헤더 */}
			<div className="risk-page-head">
				<div>
					<h2 className="risk-page-title">(이번 학기) 내 담당 위험학생</h2>
				</div>

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
			<div className="risk-section">
				<div className="risk-section-head">
					<h3>상담이 필요한 학생</h3>
					{/* <span className="pill pill-dark">총 {pendingList.length}명</span> */}
				</div>
				<div className="risk-card">
					<DataTable headers={pendingHeaders} data={pendingData} />
					{pendingList.length === 0 && <div className="empty-hint">현재 상담이 필요한 학생이 없습니다.</div>}
				</div>
			</div>

			<hr />

			{/* 완료 섹션 */}
			<div className="risk-section">
				<div className="risk-section-head">
					<h3>상담완료된 학생 목록</h3>
					{/* <span className="pill">총 {completedList.length}명</span> */}
				</div>
				<div className="risk-card">
					<DataTable headers={completedHeaders} data={completedData} />
					{completedList.length === 0 && <div className="empty-hint">상담 완료 기록이 없습니다.</div>}
				</div>
			</div>

			<ProfessorCounselRequestModal
				open={openModal}
				target={target}
				onClose={() => setOpenModal(false)}
				onSuccess={() => loadRiskStudents()}
			/>
		</div>
	);
}
