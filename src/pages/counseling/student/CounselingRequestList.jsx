// 학생 기준
// 내가 신청한 상담 목록 조회
// - 승인된 상담은 상단에 방 번호 포함해서 표시
// - 전체 신청 내역은 하단에 표시

import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import { toHHMM } from '../../../utils/DateTimeUtil';
import { reservationStatus } from '../ReservationStatus';

export default function CounselingRequestList() {
	const [list, setList] = useState([]);

	useEffect(() => {
		api.get('/reserve/list').then((res) => {
			setList(res.data ?? []);
		});
	}, []);

	// 승인된 상담만 필터링
	const approvedList = useMemo(
		() => list.filter((r) => r.approvalState === 'APPROVED'),
		[list]
	);

	// 전체 신청 내역
	const requestList = useMemo(() => list, [list]);

	// ===== 승인된 상담 (방 번호 테이블) =====
	const approvedHeaders = [
		'과목',
		'교수',
		'상담일',
		'상담 시간',
		'방 번호',
	];

	const approvedData = useMemo(() => {
		return approvedList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담일: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${toHHMM(
				r.counselingSchedule?.endTime
			)}`,
			'방 번호': r.roomCode ?? '',
		}));
	}, [approvedList]);

	// ===== 전체 신청 내역 =====
	const requestHeaders = [
		'과목',
		'교수',
		'상담사유',
		'상태',
		'신청일',
		'신청 시간',
	];

	const requestData = useMemo(() => {
		return requestList.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담사유: r.reason ?? '',
			상태: reservationStatus(r.approvalState),
			신청일: r.counselingSchedule?.counselingDate ?? '',
			'신청 시간': `${toHHMM(r.counselingSchedule?.startTime)} ~ ${toHHMM(
				r.counselingSchedule?.endTime
			)}`,
		}));
	}, [requestList]);

	return (
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
	);
}
