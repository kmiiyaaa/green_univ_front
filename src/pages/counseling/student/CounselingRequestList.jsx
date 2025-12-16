// 학생 기준
// 내가 신청한 상담 목록 조회 (요청 / 승인 / 반려 전체)

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
			console.log(list)
		});
	}, []);

	const headers = [
		'과목',
		'교수',
		'상담사유',
		'상태',
		'신청일',
		'신청 시간'
	];

	const data = useMemo(() => {
		return list.map((r) => ({
			과목: r.subject?.name ?? '',
			교수: r.counselingSchedule?.professor?.name ?? '',
			상담사유: r.reason ?? '',
			상태: reservationStatus(r.approvalState) ?? '',
			신청일: r.counselingSchedule?.counselingDate ?? '',
			'신청 시간' : `${toHHMM(r.counselingSchedule.startTime)} ~ ${toHHMM(r.counselingSchedule.endTime)}`
		}));
	}, [list]);

	return (
		<div>
			<h2>내 상담 신청 내역</h2>
			<DataTable headers={headers} data={data} />
		</div>
	);
}
