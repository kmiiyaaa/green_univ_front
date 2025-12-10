import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

const TotalGrade = () => {
	const [myGradeList, setMyGradeList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTotal = async () => {
			try {
				const res = await api.get('/grade/total');
				const data = res.data;
				console.log(res.data);
				setMyGradeList(data.gradeList ?? []);
			} catch (e) {
				console.error('총 누계 성적 조회 실패', e);
				setMyGradeList([]);
			} finally {
				setLoading(false);
			}
		};

		fetchTotal();
	}, []);

	const headers = ['연도', '학기', '신청학점', '취득학점', '평점평균'];

	const totalGrade = useMemo(() => {
		return (myGradeList ?? []).map((g) => ({
			연도: `${g.subYear}년`,
			학기: `${g.semester}학기`,
			신청학점: g.sumGrades,
			취득학점: g.myGrades,
			평점평균: g.average ?? g.avg ?? '-',
		}));
	}, [myGradeList]);

	if (loading) {
		return <div>로딩중...</div>;
	}

	return (
		<div className="grade-page total-grade-page">
			<h1>총 누계 성적</h1>
			<div className="split--div"></div>

			<div>
				<h4>평점 평균</h4>

				{myGradeList.length === 0 ? (
					<p className="no--list--p">강의 신청 및 수강 이력 확인 바랍니다.</p>
				) : (
					<DataTable headers={headers} data={totalGrade} />
				)}
			</div>
		</div>
	);
};

export default TotalGrade;
