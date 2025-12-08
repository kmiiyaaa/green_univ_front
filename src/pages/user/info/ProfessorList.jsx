import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import PaginationButton from '../../../components/form/PaginationButton';
import { pagenationUtil } from '../../../utils/PaginationUtil';
import InputForm from '../../../components/form/InputForm';

export default function ProfessorList() {
	const [currentPage, setCurrentPage] = useState(0);
	const [lists, setLists] = useState([]);
	const [totalPages, setTotalPages] = useState(0);

	// 검색용 formData
	const [formData, setFormData] = useState({
		professorId: '',
		deptName: '',
	});

	const headers = ['사번', '이름', '학과', '이메일', '전화번호'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// 리스트 페이징  + 검색 기능
	const searchProfessors = async (page = currentPage) => {
		try {
			const params = {};
			if (formData.professorId?.toString().trim() !== '') {
				params.professorId = Number(formData.professorId);
			}
			if (formData.deptName?.toString().trim() !== '') {
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

	// 페이지 바뀌면
	useEffect(() => {
		searchProfessors(currentPage);
	}, [currentPage]);

	// useEffect(() => {
	// 	searchProfessors(0);
	// }, []);

	const tableData = useMemo(() => {
		return lists?.map((p) => ({
			사번: p.id ?? p.professorId ?? '',
			이름: p.name ?? '',
			학과: p.departmentName ?? p.deptName ?? p.department?.name ?? '',
			이메일: p.email ?? '',
			전화번호: p.tel ?? p.phone ?? '',
		}));
	}, [lists]);

	const pagination = pagenationUtil({
		page: currentPage,
		totalPages,
		blockSize: 1,
	});

	return (
		<div>
			<h2>교수 명단 조회</h2>
			<form onSubmit={() => searchProfessors()}>
				<InputForm label="사번" name="professorId" placeholder="검색어를 입력하세요" onChange={handleChange} />
				<InputForm label="학과 이름" name="deptName" placeholder="검색어를 입력하세요" onChange={handleChange} />
				<button>검색</button>
			</form>
			<hr></hr>

			<DataTable headers={headers} data={tableData} />
			<PaginationButton
				currentPage={currentPage}
				pagination={pagination}
				totalPages={totalPages}
				onPageChange={(p) => searchProfessors(p)}
			/>
		</div>
	);
}
