import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import CounselingScheduleDetailPage from './CounselingReserveDetail';
import DataTable from '../../../components/table/DataTable';
import { endMinus10, toHHMM } from '../../../utils/DateTimeUtil';
import '../../../assets/css/CounselingReserve.css';

export default function CounselingReserve() {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');
	const [schedules, setSchedules] = useState([]);
	const [subName, setSubName] = useState('');
	const [searchParams] = useSearchParams();

	// 내 상담 신청 내역(Reserve)
	const [list, setList] = useState([]);

	// 위험과목(필요 시 사용)
	const [riskList, setRiskList] = useState([]);

	// 교수 -> 학생 상담요청(PreReserve: 수락/거절 대상)
	const [preReserveList, setPreReserveList] = useState([]);

	// -----------------------------
	// 공통 메서드
	// -----------------------------

	// 상태 표시 변환 (유틸 대신 로컬 함수)
	const reservationStatus = useCallback((state) => {
		switch (state) {
			case 'REQUESTED':
				return '승인 대기';
			case 'APPROVED':
				return '승인 완료';
			case 'REJECTED':
				return '반려';
			case 'CANCELED':
				return '취소';
			default:
				return state ?? '';
		}
	}, []);

	const fetchSubjectsThisSemester = useCallback(async () => {
		const res = await api.get('/subject/semester');
		setSubjects(res.data?.subjectList ?? []);
	}, []);

	const fetchCounselingSchedules = useCallback(async (subjectId) => {
		const res = await api.get('/counseling/schedule', { params: { subjectId } });
		setSchedules(res.data?.scheduleList ?? []);
		setSubName(res.data?.subjectName ?? '');
	}, []);

	const fetchMyReserveList = useCallback(async () => {
		const res = await api.get('/reserve/list');
		setList(res.data ?? []);
	}, []);

	// -----------------------------
	// 교수 상담요청 테이블
	// -----------------------------

	const loadMyRisk = useCallback(async () => {
		try {
			const res = await api.get('/risk/me');

			// 서버가 list를 바로 주는 경우가 대부분이라 둘 다 대응
			const list = res.data?.riskList ?? res.data ?? [];
			setRiskList(list);
		} catch (e) {
			// 개발 중엔 alert 줄이고 싶으면 여기만 console로 바꿔도 됨
			alert(e?.response?.data?.message ?? '조회 실패');
			console.error(e);
		}
	}, []);

	// 내가 받은 교수 상담요청 목록
	const loadMyPreReserves = useCallback(async () => {
		try {
			const res = await api.get('/reserve/pre/list/student');
			const list = res.data?.list ?? res.data ?? [];
			setPreReserveList(list);
		} catch (e) {
			alert(e?.response?.data?.message ?? '교수 상담요청 조회 실패');
			console.error(e);
		}
	}, []);

	// 학생: 확정(APPROVED) 상담 취소
	const cancelMyApproved = useCallback(
		async (reserveId) => {
			if (!window.confirm('확정된 상담을 취소하시겠습니까?\n취소 후 해당 시간은 다시 예약 가능해집니다.')) return;

			try {
				await api.delete('/reserve/cancel/student', { params: { reserveId } });

				// 내 예약 목록 갱신
				await fetchMyReserveList();

				// 취소되면 schedule.reserved=false 이므로, 현재 선택한 과목 일정도 다시 불러오기
				if (selectedSubjectId) {
					await fetchCounselingSchedules(selectedSubjectId);
				}
			} catch (e) {
				alert(e?.response?.data?.message ?? '취소 실패');
				console.error(e);
			}
		},
		[fetchCounselingSchedules, fetchMyReserveList, selectedSubjectId]
	);

	// -----------------------------
	// Effects
	// -----------------------------

	// 수강 과목 조회
	useEffect(() => {
		fetchSubjectsThisSemester();
	}, [fetchSubjectsThisSemester]);

	// 위험 학생 페이지에서 넘어온 subjectId
	useEffect(() => {
		const sid = searchParams.get('subjectId');
		if (sid) setSelectedSubjectId(sid);
	}, [searchParams]);

	// 과목 선택 시 상담 일정 조회
	useEffect(() => {
		if (!selectedSubjectId) return;
		fetchCounselingSchedules(selectedSubjectId);
	}, [selectedSubjectId, fetchCounselingSchedules]);

	// 내 상담 신청 내역 조회
	useEffect(() => {
		fetchMyReserveList();
	}, [fetchMyReserveList]);

	useEffect(() => {
		loadMyRisk();
		loadMyPreReserves();
	}, [loadMyRisk, loadMyPreReserves]);

	// -----------------------------
	// Derived
	// -----------------------------

	// 승인된 상담만 필터링 + past로 상담확정/상담완료 분리
	const approvedUpcomingList = useMemo(() => list.filter((r) => r.approvalState === 'APPROVED' && !r.past), [list]);
	const approvedPastList = useMemo(() => list.filter((r) => r.approvalState === 'APPROVED' && r.past), [list]);

	// 내가 보낸 신청(requester=STUDENT)
	const myRequestList = useMemo(() => list.filter((r) => r.requester === 'STUDENT'), [list]);

	// ===== 상담확정 (방 번호 테이블) =====
	// 취소 컬럼 추가
	const approvedHeaders = ['과목', '교수', '상담일', '상담 시간', '방 번호', '취소'];

	const approvedUpcomingData = useMemo(() => {
		return approvedUpcomingList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
			'방 번호': r.roomCode ?? '',
			취소: (
				<button type="button" onClick={() => cancelMyApproved(r.id)}>
					취소
				</button>
			),
		}));
	}, [approvedUpcomingList, cancelMyApproved]);

	//상담완료(날짜 지난 확정) 테이블 (과거는 취소 없음)
	const approvedPastHeaders = ['과목', '교수', '상담일', '상담 시간', '방 번호'];

	const approvedPastData = useMemo(() => {
		return approvedPastList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
			'방 번호': r.roomCode ?? '',
		}));
	}, [approvedPastList]);

	// ===== 내가 보낸 신청 내역(학생 신청만) =====
	const requestHeaders = ['과목', '교수', '상담사유', '상태', '신청일', '신청 시간'];

	const requestData = useMemo(() => {
		return myRequestList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담사유: r.reason ?? '',
			상태: reservationStatus(r.approvalState),
			신청일: r.counselingSchedule?.counselingDate ?? '',
			'신청 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
		}));
	}, [myRequestList, reservationStatus]); //

	// 교수의 상담요청(PreReserve)
	const preHeaders = ['과목', '교수', '상담일자', '시간', '요청메시지', '처리'];

	const acceptPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/accept', null, { params: { preReserveId } });
			alert('상담 요청을 수락했습니다.');
			await loadMyPreReserves();
			await fetchMyReserveList(); // 수락하면 reserve가 APPROVED로 바뀌니까 목록 갱신

			// 수락으로 schedule.reserved=true 됐을 수 있으니 일정도 갱신
			if (selectedSubjectId) await fetchCounselingSchedules(selectedSubjectId);
		} catch (e) {
			alert(e?.response?.data?.message ?? '수락 실패');
			console.error(e);
		}
	};

	// 교수의 상담요청 거절
	const rejectPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/reject', null, { params: { preReserveId } });
			alert('상담 요청을 거절했습니다.');
			await loadMyPreReserves();
			await fetchMyReserveList(); // 거절 후에도 상태 반영
		} catch (e) {
			alert(e?.response?.data?.message ?? '거절 실패');
			console.error(e);
		}
	};

	const preTableData = useMemo(() => {
		return (preReserveList ?? []).map((p) => ({
			과목: p.subjectName ?? '',
			교수: p.professorName ?? '',
			상담일자: p.counselingDate ?? '',
			시간: p.startTime != null && p.endTime != null ? `${p.startTime}:00 ~ ${p.startTime}:50` : '',
			요청메시지: p.reason ?? '',
			처리: (
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						type="button"
						onClick={(ev) => {
							ev.stopPropagation();
							acceptPre(p.preReserveId);
						}}
					>
						수락
					</button>
					<button
						type="button"
						onClick={(ev) => {
							ev.stopPropagation();
							rejectPre(p.preReserveId);
						}}
					>
						거절
					</button>
				</div>
			),
		}));
	}, [preReserveList]);

	return (
		<div className="reserve-page">
			{/* ===== 위쪽: 상담 예약 ===== */}
			<section className="reserve-top">
				<h2>상담 예약</h2>

				{/* 과목 선택 */}
				<SubjectSelect
					subjects={subjects}
					value={selectedSubjectId}
					onChange={(e) => setSelectedSubjectId(e.target.value)}
				/>

				{/* 과목 선택 시 상담 일정 표시 */}
				{selectedSubjectId && (
					<div className="reserve-schedule">
						<CounselingScheduleDetailPage
							counselingSchedule={schedules}
							subId={selectedSubjectId}
							subName={subName}
							onReserveSuccess={async () => {
								await fetchMyReserveList(); // 기존: 목록 갱신
								setSelectedSubjectId(''); // 🔄 추가: 과목 선택 초기화 → UI 닫힘
							}}
						/>
					</div>
				)}
			</section>

			{/* 상담확정(날짜 안 지난 승인) */}
			<section className="reserve-panel">
				<h3>상담확정</h3>

				{approvedUpcomingList.length > 0 ? (
					<DataTable headers={approvedHeaders} data={approvedUpcomingData} />
				) : (
					<div className="reserve-empty">상담확정 내역이 없습니다.</div>
				)}
			</section>

			{/* 상담완료(날짜 지난 승인) */}
			<section className="reserve-panel">
				<h3>상담완료</h3>

				{approvedPastList.length > 0 ? (
					<DataTable headers={approvedPastHeaders} data={approvedPastData} />
				) : (
					<div className="reserve-empty">상담완료 내역이 없습니다.</div>
				)}
			</section>

			<section className="reserve-bottom">
				{/* 왼쪽: 내가 상담 신청한 내역 */}
				<div className="reserve-panel">
					<h3>나의 상담 신청 내역</h3>
					<DataTable headers={requestHeaders} data={requestData} />
				</div>

				{/* 오른쪽: 교수에게 온 상담 신청내역 */}
				<div className="reserve-panel">
					<h3>교수의 상담 요청 내역</h3>
					<DataTable headers={preHeaders} data={preTableData} />
				</div>
			</section>
		</div>
	);
}
