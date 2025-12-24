import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

// 학생과 교수의 상담 관리를 위한 모든 내역 조회 컴포넌트
export default function CounselingList() {
	const [listByProfessor, setListByProfessor] = useState([]); // 교수가 요청한 상담 예약
	const [listByStudent, setListByStudent] = useState([]); // 학생이 요청한 상담 예약

	// 누가 보내든 동일한 헤더값을 가지니 mapRow를 통해서 돌려주기
	const mapRow = (c) => ({
		학생: c.student.name,
		과목: c.subject.name,
		상담사유: c.reason,
		상담일자: c.counselingSchedule.counselingDate,
		// TODO: 상담시간 다시 확인할 것
		상담시간: `${c.counselingSchedule.startTime}:00 ~ ${c.counselingSchedule.endTime}:00`,
		방코드: c.roomCode || '',
		//예약번호: c.counselingSchedule.id,
		//위험코드: c.dropoutRisk.id,
		상담상태: c.approvalState,
		//요청자: c.requester,
	});

	const loadCounselingList = async () => {
		try {
			const res = await api.get('/reserve/list/requester');
			const preRaw = res.data.RequestedByProfessor || []; // 교수가 요청한 상담 내역
			const stuRaw = res.data.RequestedByStudent || []; // 학생이 요청한 상담 내역
			setListByProfessor(preRaw.map(mapRow));
			setListByStudent(stuRaw.map(mapRow));
			console.log('preRaw', preRaw);
			console.log('stuRaw', stuRaw);
		} catch (error) {
			setListByProfessor([]);
			setListByStudent([]);
			console.error(error);
		}
	};

	useEffect(() => {
		loadCounselingList();
	}, []);

	const headers = ['학생', '과목', '상담사유', '상담일자', '상담시간', '방코드', '상담상태'];

	return (
		<>
			<div>
				<div>학생이 요청한 상담 예약</div>
				<DataTable data={listByStudent} headers={headers} />
				<div>교수가 요청한 상담 예약</div>
				<DataTable data={listByProfessor} headers={headers} />
			</div>
		</>
	);
}
