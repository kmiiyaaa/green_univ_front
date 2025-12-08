import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
// 없으면 studentList.css 재사용해도 됨

export default function ProfessorListPage() {
	// 검색 폼(최소)
	const [formData, setFormData] = useState({
		professorId: '',
		deptId: '',
	});

	// 페이징/데이터 (교수는 1-based)
	const [currentPage, setCurrentPage] = useState(1);
	const [lists, setLists] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [listCount, setListCount] = useState(0);

	const headers = ['사번', '이름', '학과', '이메일', '전화번호'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const buildUrl = (page) => {
		// 1페이지는 path 없이도 동작
		return page <= 1 ? '/user/professorList' : `/user/professorList/${page}`;
	};

	const fetchProfessors = async (page = currentPage) => {
		try {
			const params = {};

			if (formData.professorId?.toString().trim() !== '') {
				params.professorId = Number(formData.professorId);
			}
			if (formData.deptId?.toString().trim() !== '') {
				params.deptId = Number(formData.deptId);
			}

			const res = await api.get(buildUrl(page), { params });
			console.log('res.data', res.data);
			const pageObj = res.data.professorList;

			const content = pageObj?.content ?? [];
			setLists(content);

			setTotalPages(pageObj?.totalPages ?? 0);
			setListCount(pageObj?.totalElements ?? content.length ?? 0);
		} catch (e) {
			console.error(e);
			alert('교수 목록을 불러오지 못했습니다.');
		}
	};

	useEffect(() => {
		fetchProfessors(currentPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const handleSearch = (e) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchProfessors(1);
	};

	const handleReset = () => {
		setFormData({ professorId: '', deptId: '' });
		setCurrentPage(1);
		// 초기화 후 전체 조회
		setTimeout(() => fetchProfessors(1), 0);
	};

	const tableData = useMemo(() => {
		return lists.map((p) => ({
			사번: p.id ?? p.professorId ?? '',
			이름: p.name ?? '',
			학과: p.departmentName ?? p.deptName ?? p.department?.name ?? '',
			이메일: p.email ?? '',
			전화번호: p.tel ?? p.phone ?? '',
		}));
	}, [lists]);

	const onRowClick = (row) => {
		const professorId = row['사번'];
		console.log('교수 클릭:', professorId);
		// navigate(`/user/professor/${professorId}`);
	};

	const canPrev = currentPage > 1;
	const canNext = currentPage < totalPages;

	const goPage = (p) => {
		if (p < 1 || p > totalPages) return;
		setCurrentPage(p);
	};

	// 페이지 버튼 5개 정도
	const pageNumbers = useMemo(() => {
		const maxButtons = 5;

		if (totalPages <= maxButtons) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const half = Math.floor(maxButtons / 2);
		let start = Math.max(1, currentPage - half);
		let end = start + maxButtons - 1;

		if (end > totalPages) {
			end = totalPages;
			start = end - (maxButtons - 1);
		}

		return Array.from({ length: maxButtons }, (_, i) => start + i);
	}, [totalPages, currentPage]);

	return (
		<div className="professor-list-page">
			<div className="page-card">
				<div className="page-header">
					<h1>교수 조회</h1>
				</div>

				<form className="search-bar" onSubmit={handleSearch}>
					<label>학과 번호</label>
					<input type="number" name="deptId" value={formData.deptId} onChange={handleChange} placeholder="예) 3" />

					<label>사번</label>
					<input
						type="number"
						name="professorId"
						value={formData.professorId}
						onChange={handleChange}
						placeholder="예) 1001"
					/>

					<button type="submit">조회 🔍</button>
					<button type="button" onClick={handleReset}>
						초기화
					</button>
				</form>

				<div className="list-meta">
					<span>총 {listCount}명</span>
					<span>
						페이지 {totalPages === 0 ? 0 : currentPage} / {totalPages}
					</span>
				</div>

				<DataTable headers={headers} data={tableData} onRowClick={onRowClick} />

				<div className="pagination">
					<button className="page-btn" disabled={!canPrev} onClick={() => goPage(currentPage - 1)}>
						이전
					</button>

					{pageNumbers.map((p) => (
						<button key={p} className={`page-number ${p === currentPage ? 'active' : ''}`} onClick={() => goPage(p)}>
							{p}
						</button>
					))}

					<button className="page-btn" disabled={!canNext} onClick={() => goPage(currentPage + 1)}>
						다음
					</button>
				</div>
			</div>
		</div>
	);
}
