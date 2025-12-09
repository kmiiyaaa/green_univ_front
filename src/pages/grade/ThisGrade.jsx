import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/table/DataTable';
import api from '../../api/httpClient';

const ThisGrade = () => {
	const [gradeList, setGradeList] = useState([]); // 과목별 성적
	const [myGrade, setMyGrade] = useState(null); // 누계 성적

	useEffect(() => {
		const fetchThisSemester = async () => {
			try {
				await api.get('/grade/thisSemester');
			} catch (e) {
				console.error(e);
			}
		};
		fetchThisSemester();
	}, []);

	// 강의 평가
	const openEvaluation = (subjectId) => {
		window.open(`/evaluation?subjectId=${subjectId}`);
	};

	const subjectRows = useMemo(() => {
		return gradeList.map((g) => [
			`${g.subYear}년`,
			`${g.semester}학기`,
			g.subjectId,
			g.name,
			g.type,
			g.grades,
			g.grade,
			g.evaluationId == null ? (
				<button type="button" className="table-link-btn" onClick={() => openEvaluation(g.subjectId)}>
					Click
				</button>
			) : (
				<span>완료</span>
			),
		]);
	}, [gradeList]);

	const myGradeRows = useMemo(() => {
		if (!myGrade) return [];
		return [
			[
				`${myGrade.subYear}년`,
				`${myGrade.semester}학기`,
				myGrade.sumGrades,
				myGrade.myGrades,
				// 보통은 average 필드로 내려주는 걸 추천
				myGrade.average ?? myGrade.avg ?? '-',
			],
		];
	}, [myGrade]);

	const headers1 = ['연도', '학기', '과목번호', '과목명', '강의 구분', '이수학점', '성적', '강의평가'];
	const headers2 = ['연도', '학기', '신청학점', '취득학점', '평점평균'];

	const hasNoGrade = gradeList.length === 0 && !myGrade;

	return (
		<div className="grade-page">
			<div>
				<h1>금학기 성적 조회</h1>
				<div className="split--div"></div>

				{hasNoGrade ? (
					<p className="no--list--p">강의 신청 및 수강 이력 확인 바랍니다.</p>
				) : (
					<>
						<div>
							<h4>과목별 성적</h4>
							<DataTable headers={headers1} data={subjectRows} />
							<p>※ 강의 평가 후 성적 조회 가능</p>
						</div>

						<hr />

						<div>
							<h4>누계 성적</h4>
							<DataTable headers={headers2} data={myGradeRows} />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ThisGrade;
