import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

export default function SubjectStudentList({ subjectId, subName }) {
	// 과목 별 수강 학생 조회
	const [studentList, setStudentList] = useState([]);

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
			점수기입: <button>점수기입</button>,
		}));
	}, [studentList]);

	return (
		<div>
			<h2>[{subName}] 학생 리스트 조회</h2>
			<hr></hr>

			{studentList.length > 0 ? (
				<DataTable headers={headers} data={tableData} />
			) : (
				<h4>해당 강의를 수강하는 학생이 존재하지 않습니다.</h4>
			)}
		</div>
	);
}
