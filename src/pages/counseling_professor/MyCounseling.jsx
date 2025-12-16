import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import { toHHMM } from '../../utils/DateTimeUtil';
import DataTable from '../../components/table/DataTable';

export default function MyCounseling() {
	const [reservationList, setReservationList] = useState([]);

	useEffect(() => {
		const loadReservations = async () => {
			try {
				const res = await api.get('/reserve/list/professor');
				setReservationList(res.data.reservationList);
			} catch (e) {
				console.error(e);
			}
		};
		loadReservations();
	}, []);

	const tableData = reservationList.map((r, idx) => ({
		번호: idx + 1,
		'신청 과목': r.subject.name,
		'담당 교수': r.counselingSchedule.professor.name,
		'상담 사유': r.reason,
		'방 번호': r.roomCode,
		'상담 일자': r.counselingSchedule.counselingDate,
		'상담 시간': `${toHHMM(r.counselingSchedule.startTime)} ~ ${toHHMM(r.counselingSchedule.endTime)}`,
	}));

	const headers = ['번호', '신청 과목', '담당 교수', '상담 사유', '방 번호', '상담 일자', '상담 시간'];

	return (
		<div>
			<h3>확정된 상담 일정</h3>
			<hr></hr>

			{reservationList?.length > 0 ? (
				<div>
					<DataTable headers={headers} data={tableData} />
				</div>
			) : (
				'아직 확정된 상담 일정이 없습니다.'
			)}
		</div>
	);
}
