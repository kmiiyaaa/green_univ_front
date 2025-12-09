import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

const TotalGrade = () => {
	const [myGradeList, setMyGradeList] = useState([]);

	useEffect(() => {});

	const headers = ['연도', '학기', '신청학점', '취득 학점', '평점 평균'];

	return (
		<div>
			<h1>총 누계 성적</h1>
			<div>
				<h4>평점 평균</h4>
				{myGradeList.length === 0 && (
					<li>
						<sapn>강의 신청 및 수강 이력 확인 바랍니다.</sapn>
					</li>
				)}
				<DataTable headers={headers} data={myGradeList} />
			</div>
		</div>
	);
};

export default TotalGrade;
