import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import GradeInput from './GradeInput';

export default function SubjectStudentList({ subjectId, subName }) {
	// 과목 별 수강 학생 조회
	const [studentList, setStudentList] = useState([]);
	const [gradeitem, setGradeItem] = useState([]);
	const [openGrade, setOpenGrade] = useState(false);

	useEffect(() => {
		const loadStudentList = async () => {
			try {
				const res = await api.get(`/professor/subject/${subjectId}`);
				console.log(res.data);
				setStudentList(res.data.studentList);
			} catch (e) {
				console.error('수강 학생 조회 에러 : ', e);
			}
		};
		loadStudentList();
	}, []);

	// 점수 기입 컴포넌트 열기
	const handleOpenGrade = useCallback(
		(s) => {
			setGradeItem([
				{
					studentId: s.studentId,
					studentName: s.studentName,
					subjectId: subjectId,
				},
			]); // 길이 1 배열로 필요한 props 주기
			setOpenGrade(true);
		},
		[subjectId]
	);

	// 테이블 데이터
	const headers = ['번호', '이름', '소속', '결석', '지각', '과제점수', '중간시험', '기말시험', '환산점수', '점수기입'];

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
			점수기입: <button onClick={() => handleOpenGrade(s)}>점수기입</button>,
		}));
	}, [studentList, handleOpenGrade]);

	return (
		<div>
			{!openGrade && ( // 학생 리스트 조회
				<div>
					<h2>[{subName}] 학생 리스트 조회</h2>
					<hr></hr>

					{studentList.length > 0 ? (
						<DataTable headers={headers} data={tableData} />
					) : (
						<h4>해당 강의를 수강하는 학생이 존재하지 않습니다.</h4>
					)}
				</div>
			)}
			{/* 학생 점수 기입 */}
			{openGrade && <GradeInput gradeitem={gradeitem} setOpenGrade={setOpenGrade} />}
		</div>
	);
}
