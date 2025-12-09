import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import PaginationButton from '../../../components/form/PaginationButton';
import InputForm from '../../../components/form/InputForm';
import PaginationForm from '../../../components/form/PaginationForm';

export default function StudentList() {
	const [currentPage, setCurrentPage] = useState(0);
	const [lists, setLists] = useState([]);
	const [totalPages, setTotalPages] = useState(0);

	// 검색 필터
	const [formData, setFormData] = useState({
		studentId: '',
		deptId: '',
	});

	const headers = [
		'학번',
		'이름',
		'생년월일',
		'주소',
		'전화번호',
		'이메일',
		'학과번호',
		'학년',
		'입학일',
		'졸업일(졸업예정일)',
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// 리스트 + 검색 통합 함수
	const searchStudent = async (page = currentPage) => {
		try {
			const params = {};

			if (formData.studentId.trim() !== '') {
				params.studentId = Number(formData.studentId);
			}
			if (formData.deptId.trim() !== '') {
				params.deptId = Number(formData.deptId);
			}
			const res = await api.get(`/user/studentList/${page}`, { params });
			const data = res.data; // pagingResponse
			setLists(data.studentList);
			setCurrentPage(data.currentPage);
			setTotalPages(data.totalPages);
		} catch (e) {
			console.error(e);
			// alert('학생 목록을 불러오지 못했습니다.');
		}
	};

	// 페이지가 바뀌면 리스트 다시 로딩
	useEffect(() => {
		searchStudent(currentPage);
	}, [currentPage]);

	// 검색 버튼 눌렀을 때
	const handleSearchSubmit = (e) => {
		e.preventDefault(); // 새로고침 방지
		setCurrentPage(0); // 검색 시 첫 페이지로 이동
		searchStudent(0); // 즉시 검색
	};

	console.log(lists);

	const tableData = useMemo(() => {
		return lists.map((s) => ({
			학번: s.id ?? '',
			이름: s.name ?? '',
			생년월일: s.birthDate ?? '',
			주소: s.address ?? '',
			전화번호: s.tel ?? '',
			이메일: s.email ?? '',
			학과번호: s.department.id ?? '',
			학년: s.grade ?? '',
			입학일: s.entranceDate ?? '',
			졸업일_졸업예정일: s.graduationDate ?? '',
		}));
	}, [lists]);

	return (
		<div>
			<h2>학생 명단 조회</h2>
			<hr></hr>

			{/* 검색 폼 */}
			<form onSubmit={handleSearchSubmit}>
				<InputForm label="학번" name="studentId" placeholder="검색어를 입력하세요" onChange={handleChange} />
				<InputForm label="학과 번호" name="deptId" placeholder="검색어를 입력하세요" onChange={handleChange} />
				<button type="submit">검색</button>
			</form>

			<hr />

			{/* 테이블 */}
			<DataTable headers={headers} data={tableData} />

			{/* 페이징 */}
			<PaginationForm
				currentPage={currentPage}
				blockSize={10}
				totalPages={totalPages}
				onPageChange={(p) => setCurrentPage(p)}
			/>
		</div>
	);
}
