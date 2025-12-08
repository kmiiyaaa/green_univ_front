import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';

export default function StudentListPage() {
	// 페이징/데이터
	const [page, setPage] = useState(0);
	const [lists, setLists] = useState([]);
	const [listCount, setListCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	const headers = useMemo(() => ['학번', '이름', '학과', '학년', '이메일', '전화번호'], []);

	const fetchStudents = async (targetPage = page) => {
		try {
			const res = await api.get('/user/studentList', {
				params: { page: targetPage },
			});
			console.log('res.data', res.data);
			setListCount(res.data.listCount ?? 0);
			setTotalPages(res.data.totalPages ?? 0);
			setCurrentPage(res.data.currentPage ?? 0);
			setLists(res.data.lists ?? []);
		} catch (e) {
			console.error(e);
			alert('학생 목록을 불러오지 못했습니다.');
		}
	};

	useEffect(() => {
		fetchStudents(page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	// DataTable용 변환
	const tableData = useMemo(() => {
		return lists.map((s) => ({
			학번: s.id ?? s.studentId ?? '',
			이름: s.name ?? '',
			학과: s.departmentName ?? s.deptName ?? s.department?.name ?? '',
			학년: s.grade ?? '',
			이메일: s.email ?? '',
			전화번호: s.tel ?? s.phone ?? '',
		}));
	}, [lists]);

	const onRowClick = (row) => {
		const studentId = row['학번'];
		console.log('학생 클릭:', studentId);
	};

	const canPrev = currentPage > 0;
	const canNext = currentPage < totalPages - 1;

	const goPage = (p) => {
		if (p < 0 || p >= totalPages) return;
		setPage(p);
	};

	const pageNumbers = useMemo(() => {
		const maxButtons = 5;
		if (totalPages <= maxButtons) {
			return Array.from({ length: totalPages }, (_, i) => i);
		}

		const half = Math.floor(maxButtons / 2);
		let start = Math.max(0, currentPage - half);
		let end = start + maxButtons - 1;

		if (end >= totalPages) {
			end = totalPages - 1;
			start = end - (maxButtons - 1);
		}

		return Array.from({ length: maxButtons }, (_, i) => start + i);
	}, [totalPages, currentPage]);

	return (
		<div className="student-list-page">
			<div className="page-card">
				<div className="page-header">
					<h1>학생 전체 목록</h1>
				</div>

				<div className="list-meta">
					<span>총 {listCount}명</span>
					<span>
						페이지 {totalPages === 0 ? 0 : currentPage + 1} / {totalPages}
					</span>
				</div>

				<DataTable headers={headers} data={tableData} onRowClick={onRowClick} />

				<div className="pagination">
					<button className="page-btn" disabled={!canPrev} onClick={() => goPage(currentPage - 1)}>
						이전
					</button>

					{pageNumbers.map((p) => (
						<button key={p} className={`page-number ${p === currentPage ? 'active' : ''}`} onClick={() => goPage(p)}>
							{p + 1}
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
