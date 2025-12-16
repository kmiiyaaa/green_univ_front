import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import { toHHMM } from '../../utils/DateTimeUtil';
import DataTable from '../../components/table/DataTable';

export default function CounselingRequestList() {
	// 학생 기준 상담 신청 내역, 교수에게서 온 상담 요청 조회
	const [reservations, setReservations] = useState([]);

	const tableData = reservations.map((r, idx) => ({
		번호: idx + 1,
		'신청 과목': r.subject.name,
		'담당 교수': r.counselingSchedule.professor.name,
		'상담 사유': r.reason,
		'상담 일자': r.counselingSchedule.counselingDate,
		'상담 시간': `${toHHMM(r.counselingSchedule.startTime)} ~ ${toHHMM(r.counselingSchedule.endTime)}`,
		상태: r.approvalState === 'REQUESTED' ? '승인 대기' : r.approvalState === 'APPROVED' ? '승인 완료' : '반려',
	}));

	const headers = ['번호', '신청 과목', '담당 교수', '상담 사유', '상담 일자', '상담 시간', '상태'];

	useEffect(() => {
		// 학생이 신청한 예비 상담 내역 조회
		const loadReq = async () => {
			try {
				const res = await api.get('/preReserve');
				setReservations(res.data.preList);
				console.log(res.data.preList);
			} catch (e) {
				console.error(e);
			}
		};
		loadReq();
	}, []);

	return (
		<div>
			<DataTable headers={headers} data={tableData} />
		</div>
	);
}
