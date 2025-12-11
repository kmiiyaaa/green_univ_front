import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import GradeInput from './GradeInput';

export default function SubjectStudentList({ subjectId, subName, setListOpen }) {
	// 과목 별 수강 학생 조회
	const [studentList, setStudentList] = useState([]);
	const [stuNum, setStuNum] = useState(0); // 수강 학생 수
	const [gradeitem, setGradeItem] = useState([]); // 점수기입용 데이터
	const [openGrade, setOpenGrade] = useState(false); // 점수기입 화면 열기 여부

	const loadStudentList = async () => {
		try {
			const res = await api.get(`/professor/subject/${subjectId}`);
			console.log(res.data);
			setStudentList(res.data.studentList);
			setStuNum(res.data.stuNum);
		} catch (e) {
			console.error('수강 학생 조회 에러 : ', e);
		}
	};
	useEffect(() => {
		loadStudentList();
	}, [openGrade]);

	// 점수 기입 컴포넌트 열기 (넘겨줄 props들)
	const handleOpenGrade = useCallback(
		(s) => {
			setGradeItem([
				{
					...s, // 기존 학생 정보
					subjectId: subjectId, // 과목 ID 추가
				},
			]);
			setOpenGrade(true);
		},
		[subjectId]
	);

	// 상대평가 과목 : 성적을 모두 기입한 경우, 전체 학생 등급 산출
	const getRelativeGrade = async () => {
		try {
			await api.patch(`/professor/relativeGrade/${subjectId}`);
		} catch (e) {
			alert(e.response.data.message);
			console.error('전체 학생 등급 산출 에러 : ', e);
		}
		loadStudentList();
	};

	// 테이블 데이터
	const headers = [
		'번호',
		'이름',
		'소속',
		'결석',
		'지각',
		'과제점수',
		'중간시험',
		'기말시험',
		'환산점수',
		'등급',
		'점수기입',
	];

	const tableData = useMemo(() => {
		return studentList.map((s) => ({
			번호: s.studentId ?? '',
			이름: s.studentName ?? '',
			소속: s.deptName ?? ' ',
			결석: s.absent ?? ' ',
			지각: s.lateness ?? ' ',
			과제점수: s.homework ?? ' ',
			중간시험: s.midExam ?? ' ',
			기말시험: s.finalExam ?? ' ',
			환산점수: s.convertedMark ?? ' ',
			등급: s.grade ?? '',
			점수기입: <button onClick={() => handleOpenGrade(s)}>점수기입</button>,
		}));
	}, [studentList, handleOpenGrade]);

	return (
		<div>
			{!openGrade && (
				// 학생 리스트 조회
				<div>
					<h2>[{subName}] 학생 리스트 조회</h2>
					<hr />

					{studentList.length > 0 ? (
						<div>
							{' '}
							<h4>
								수강 인원 : {stuNum}명 ({stuNum < 20 ? '절대평가' : '상대평가'})
							</h4>
							{/* 상대평가 과목일 때, 전체 학생 등급 산출 */}
							{stuNum >= 20 && <button onClick={() => getRelativeGrade()}>전체 학생 등급 산출</button>}
							<button onClick={() => setListOpen()}>내 강의 목록</button>
							<DataTable headers={headers} data={tableData} />
						</div>
					) : (
						<h4>해당 강의를 수강하는 학생이 존재하지 않습니다.</h4>
					)}
				</div>
			)}

			{/* 학생 점수 기입 */}
			{openGrade && <GradeInput gradeitem={gradeitem} setOpenGrade={setOpenGrade} stuNum={stuNum} />}
		</div>
	);
}
