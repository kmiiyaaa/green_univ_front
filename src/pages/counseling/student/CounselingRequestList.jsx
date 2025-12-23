// 학생 기준
// 내가 신청한 상담 목록 조회
// - 승인된 상담은 상단에 방 번호 포함해서 표시
// - 전체 신청 내역은 하단에 표시

import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import { endMinus10, toHHMM } from '../../../utils/DateTimeUtil';
import { reservationStatus } from '../ReservationStatus';

export default function CounselingRequestList() {
	const [list, setList] = useState([]);

	useEffect(() => {
		api.get('/reserve/list').then((res) => {
			setList(res.data ?? []);
		});
	}, []);

	// 승인된 상담을 상담확정/상담완료로 분리
	const approvedUpcomingList = useMemo(() => list.filter((r) => r.approvalState === 'APPROVED' && !r.past), [list]);
	const approvedPastList = useMemo(() => list.filter((r) => r.approvalState === 'APPROVED' && r.past), [list]);

	// 전체 신청 내역
	const requestList = useMemo(() => list, [list]);

	// 유틸이 CANCELED를 모를 수 있어서 보정
	const statusLabel = (state) => {
		if (state === 'CANCELED') return '취소';
		return reservationStatus(state);
	};

	// ===== 상담확정 (방 번호 테이블) =====
	const approvedHeaders = ['과목', '교수', '상담일', '상담 시간', '방 번호'];

	const approvedUpcomingData = useMemo(() => {
		return approvedUpcomingList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
			'방 번호': r.roomCode ?? '',
		}));
	}, [approvedUpcomingList]);

	// 상담완료 테이블
	const approvedPastData = useMemo(() => {
		return approvedPastList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
			'방 번호': r.roomCode ?? '',
		}));
	}, [approvedPastList]);

	// ===== 전체 신청 내역 =====
	const requestHeaders = ['과목', '교수', '상담사유', '상태', '신청일', '신청 시간', '요청자'];

	const requestData = useMemo(() => {
		return requestList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담사유: r.reason ?? '',
			상태: statusLabel(r.approvalState),
			신청일: r.counselingSchedule?.counselingDate ?? '',
			'신청 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${endMinus10(r.counselingSchedule?.endTime)}`,
			요청자: r.requester === 'PROFESSOR' ? '교수' : '학생',
		}));
	}, [requestList]);

	return (
		<div>
			<h2>내 상담 신청 내역</h2>

			{approvedUpcomingList.length > 0 && (
				<>
					<h4>상담확정</h4>
					<DataTable headers={approvedHeaders} data={approvedUpcomingData} />
				</>
			)}

			{approvedPastList.length > 0 && (
				<>
					<h4>상담완료</h4>
					<DataTable headers={approvedHeaders} data={approvedPastData} />
				</>
			)}

			<h4>전체 신청 내역</h4>
			<DataTable headers={requestHeaders} data={requestData} />
		</div>
	);
}
