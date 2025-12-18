import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import CounselingScheduleDetailPage from './CounselingReserveDetail';
import DataTable from '../../../components/table/DataTable';
import { toHHMM } from '../../../utils/DateTimeUtil';

export default function CounselingReserve() {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);
	const [schedules, setSchedules] = useState([]);
	const [subName, setSubName] = useState('');
	const [searchParams] = useSearchParams();

	const [list, setList] = useState([]);

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
		const res = await api.get('/counseling/schedule', {
			params: { subjectId },
		});
		setSchedules(res.data?.scheduleList ?? []);
		setSubName(res.data?.subjectName ?? '');
	}, []);

	const fetchMyReserveList = useCallback(async () => {
		const res = await api.get('/reserve/list');
		setList(res.data ?? []);
	}, []);

	// -----------------------------
	// Effects
	// -----------------------------

	// 로그인 학생의 수강 과목 조회
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

	// -----------------------------
	// Derived
	// -----------------------------

	// 승인된 상담만 필터링
	const approvedList = useMemo(() => list.filter((r) => r.approvalState === 'APPROVED'), [list]);

	// 전체 신청 내역
	const requestList = useMemo(() => list, [list]);

	// ===== 승인된 상담 (방 번호 테이블) =====
	const approvedHeaders = ['과목', '교수', '상담일', '상담 시간', '방 번호'];

	const approvedData = useMemo(() => {
		return approvedList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${toHHMM(r.counselingSchedule?.endTime)}`,
			'방 번호': r.roomCode ?? '',
		}));
	}, [approvedList]);

	// ===== 전체 신청 내역 =====
	const requestHeaders = ['과목', '교수', '상담사유', '상태', '신청일', '신청 시간'];

	const requestData = useMemo(() => {
		return requestList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담사유: r.reason ?? '',
			상태: reservationStatus(r.approvalState),
			신청일: r.counselingSchedule?.counselingDate ?? '',
			'신청 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${toHHMM(r.counselingSchedule?.endTime)}`,
		}));
	}, [requestList, reservationStatus]);

	return (
		<>
			<div>
				<h2>상담 예약</h2>

				{/* 과목 선택 */}
				<SubjectSelect
					subjects={subjects}
					value={selectedSubjectId}
					onChange={(e) => setSelectedSubjectId(e.target.value)}
				/>

				{/* 과목 선택 시 상담 일정 표시 */}
				{selectedSubjectId && (
					<CounselingScheduleDetailPage counselingSchedule={schedules} subId={selectedSubjectId} subName={subName} />
				)}
			</div>

			<div>
				<h2>내 상담 신청 내역</h2>

				{/* 승인된 상담 */}
				{approvedList.length > 0 && (
					<>
						<h4>확정된 상담</h4>
						<DataTable headers={approvedHeaders} data={approvedData} />
					</>
				)}

				{/* 전체 신청 내역 */}
				<h4>전체 신청 내역</h4>
				<DataTable headers={requestHeaders} data={requestData} />
			</div>
		</>
	);
}
