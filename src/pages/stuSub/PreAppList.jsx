import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function PreAppList() {
	const { user, token, userRole } = useContext(UserContext);
	const [subjectList, setSubjectList] = useState([]);

	useEffect(() => {
		const loadPreSub = async () => {
			try {
				const res = await api.get('/sugang/period');
				console.log('현재 수강신청 기간 (0 예비 1 신청 2 종료)', res.data);
			} catch (e) {
				console.error('에러: ', e);
			}
		};
		loadPreSub();
	}, []);

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['강의명', '교수', '시간', '강의실'];

	return (
		<>
			<h3>예비 수강 신청 기간</h3>
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
