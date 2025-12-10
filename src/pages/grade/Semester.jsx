import { useEffect, useMemo, useState } from 'react';
import OptionForm from '../../components/form/OptionForm';
import DataTable from '../../components/table/DataTable';
import api from '../../api/httpClient';

// 학기별 성적 조회

const SUBJECT_TYPE_OPTIONS = [
	{ value: '전체', label: '전체' },
	{ value: '전공', label: '전공' },
	{ value: '교양', label: '교양' },
];

const Semester = () => {
	const [yearList, setYearList] = useState([]); // 학생이 수강한 년도
	const [semesterList, setSemesterList] = useState([]); // 학생이 수강한 학기
	const [gradeList, setGradeList] = useState([]); // 위 기간에 맞는 성적

	const [subYear, setSubYear] = useState('');
	const [semester, setSemester] = useState('');
	const [type, setType] = useState('전체');

	const [loading, setLoading] = useState(true);

	//옵션
	const yearOptions = useMemo(
		() => yearList.map((g) => ({ value: String(g.subYear), label: `${g.subYear}년` })),
		[yearList]
	);

	const semesterOptions = useMemo(
		() => semesterList.map((g) => ({ value: String(g.semester), label: `${g.semester}학기` })),
		[semesterList]
	);

	// 초기 화면
	useEffect(() => {
		const fetchInit = async () => {
			try {
				const res = await api.get('/grade/semester');
				const data = res.data;
				console.log(data);
				setYearList(data.yearList ?? []);
				setSemesterList(data.semesterList ?? []);
				setGradeList(data.gradeList ?? []);

				// 기본 선택값
				const firstYear = data.yearList?.[0]?.subYear;
				const firstSem = data.semesterList?.[0]?.semester;

				if (firstYear != null) setSubYear(String(firstYear));
				if (firstSem != null) setSemester(String(firstSem));
				setType('전체');
			} catch (e) {
				console.error(e);
				setYearList([]);
				setSemesterList([]);
				setGradeList([]);
			} finally {
				setLoading(false);
			}
		};

		fetchInit();
	}, []);

	// 옵션 선택 + 조회
	const handleSearch = async () => {
		console.log('조회');
		try {
			const params = {};

			// 서버:Long 받지만 query는 문자열이어도 자동 변환됨
			if (subYear) params.subyear = subYear;
			if (semester) params.semester = semester;
			if (type) params.type = type;

			const res = await api.get('/grade/semester', { params });
			const data = res.data;
			// 통합 엔드포인트라 year/semesterList도 같이 내려올 수 있음
			setYearList(data.yearList ?? yearList);
			setSemesterList(data.semesterList ?? semesterList);
			setGradeList(data.gradeList ?? []);
		} catch (e) {
			console.error(e);
		}
	};

	// DataTable용 rows 변환 -> 헤더 적용이 안되서 기존 방식으로 변경했습니다
	// const rows = useMemo(() => {
	// 	return (gradeList ?? []).map((g) => [`${g.subYear}년`, `${g.semester}학기`, g.subjectId, g.name, g.type, g.grade]);
	// }, [gradeList]);

	const rows = useMemo(() => {
		return gradeList.map((g) => ({
			연도: g.subYear ? `${g.subYear}년` : '',
			학기: g.semester ? `${g.semester}학기` : '',
			과목번호: g.subjectId ?? '',
			과목명: g.name ?? '',
			강의구분: g.type ?? '',
			학점: g.grade ?? '',
		}));
	}, [gradeList]);

	console.log(rows);

	const headers = ['연도', '학기', '과목번호', '과목명', '강의구분', '학점'];

	if (loading) return <div>로딩중...</div>;

	return (
		<div className="grade-page semester-page">
			<h1>학기별 성적 조회</h1>
			<div className="split--div"></div>

			{yearList.length > 0 ? (
				<div className="sub--filter">
					<div>
						<OptionForm
							name="subYear"
							value={subYear}
							options={yearOptions}
							onChange={(e) => setSubYear(e.target.value)}
						/>

						<OptionForm
							name="semester"
							value={semester}
							options={semesterOptions}
							onChange={(e) => setSemester(e.target.value)}
						/>

						<OptionForm
							name="type"
							value={type}
							options={SUBJECT_TYPE_OPTIONS}
							onChange={(e) => setType(e.target.value)}
						/>

						<button type="button" onClick={handleSearch}>
							조회
						</button>
					</div>
				</div>
			) : null}

			{gradeList.length === 0 ? (
				<p className="no--list--p">강의 신청 및 수강 이력 확인 바랍니다.</p>
			) : (
				<div>
					<h4>과목별 성적</h4>
					<DataTable headers={headers} data={rows} />
				</div>
			)}
		</div>
	);
};

export default Semester;
