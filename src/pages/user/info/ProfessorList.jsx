import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import PaginationForm from '../../../components/form/PaginationForm';
import InputForm from '../../../components/form/InputForm';

export default function ProfessorList() {
	const [currentPage, setCurrentPage] = useState(0);
	const [lists, setLists] = useState([]);
	const [totalPages, setTotalPages] = useState(0);

	// 검색 필터
	const [formData, setFormData] = useState({
		professorId: '',
		deptName: '',
	});

	const headers = ['사번', '이름', '학과', '이메일', '전화번호'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// 리스트 + 검색 통합 함수
	const searchProfessors = async (page = currentPage) => {
		try {
			const params = {};

			if (formData.professorId.trim() !== '') {
				params.professorId = Number(formData.professorId);
			}
			if (formData.deptName.trim() !== '') {
				params.deptName = formData.deptName;
			}

			const res = await api.get(`/user/professorList/${page}`, { params });
			console.log(res.data);
			setLists(res.data.professorList);
			setCurrentPage(res.data.page);
			setTotalPages(res.data.totalPages);
		} catch (e) {
			console.error(e);
			alert('교수 목록을 불러오지 못했습니다.');
		}
	};

	// 페이지가 바뀌면 리스트 다시 로딩
	useEffect(() => {
		searchProfessors(currentPage);
	}, [currentPage]);

	// 검색 버튼 눌렀을 때
	const handleSearchSubmit = (e) => {
		e.preventDefault(); // 새로고침 방지
		setCurrentPage(0); // 검색 시 첫 페이지로 이동
		searchProfessors(0); // 즉시 검색
	};

	const tableData = useMemo(() => {
		return lists.map((p) => ({
			사번: p.id ?? '',
			이름: p.name ?? '',
			학과: p.department.name ?? '',
			이메일: p.email ?? '',
			전화번호: p.tel ?? '',
		}));
	}, [lists]);

	return (
		<div>
			<h2>교수 명단 조회</h2>

			{/* 검색 폼 */}
			<form onSubmit={handleSearchSubmit}>
				<InputForm label="사번" name="professorId" placeholder="검색어를 입력하세요" onChange={handleChange} />
				<InputForm label="학과 이름" name="deptName" placeholder="검색어를 입력하세요" onChange={handleChange} />
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
