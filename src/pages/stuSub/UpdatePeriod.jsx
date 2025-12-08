import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function UpdatePeriod() {
	const { user, token, userRole } = useContext(UserContext);
	const [subjectList, setSubjectList] = useState([]);

	useEffect(() => {
		const loadSubjectList = async () => {
			try {
				const res = await api.post('/sugang/updatePeriod1');
				console.log('업데이트수강신청', res.data);

				// // 3. 데이터 가공 (핵심!: DB 필드 -> 테이블 헤더 이름으로 변환)
				// const formattedData = rawData.map((sub) => ({
				// 	id: sub.id, // 클릭 이벤트 등을 위해 ID는 보통 숨겨서라도 가지고 있음
				// 	강의명: sub.name,
				// 	교수: sub.professor ? sub.professor.name : '미배정', // null 체크 필수
				// 	시간: `${sub.subDay} ${sub.startTime}:00~${sub.endTime}:00`, // 시간 예쁘게 합치기
				// 	강의실: sub.room ? sub.room.id : '미정',
				// 	원본데이터: sub, // 필요하면 원본도 통째로 넣어둠 (선택사항)
				// }));

				// setSubjectList(formattedData);
				// console.log('가공된 데이터:', formattedData);
			} catch (e) {
				console.error('강의 목록 로드 실패:', e);
			}
		};
		loadSubjectList();
	}, []);

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['강의명', '교수', '시간', '강의실'];

	return (
		<>
			<h3>수강 신청 기간</h3>
			<DataTable
				headers={headers}
				data={subjectList}
				onRowClick={(row) => {
					// row에는 위에서 가공한 한글 키들이 들어있음
					console.log('클릭한 강의:', row.강의명);
					// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
				}}
			/>
		</>
	);
}
