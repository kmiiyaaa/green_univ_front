import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';
import OptionForm from '../../components/form/OptionForm';
import PaginationForm from '../../components/form/PaginationForm';

export default function SubList() {
	const { user, token, userRole } = useContext(UserContext);
	const [subTimetable, SetSubTimeTable] = useState([]);

	// 페이징 (기본값은 10으로 설정)
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	// url에 입력된 값 받기 (쿼리 스트링)
	const [searchParams, setSearchParams] = useSearchParams();

	// 검색 폼
	const [searchForm, setSearchForm] = useState({
		type: '', // 전공 or 교양
		deptName: '', // 학과명
		name: '', // 강의명
	});

	// 강의 목록 조회 (페이징 page + 검색 filters)
	const loadSubjectList = async (page = 0, filters = null) => {
		try {
			const params = { page, size: 10 }; // 쿼리 파라미터 구성
			const currentFilters = filters || searchForm;

			if (currentFilters.type) params.type = currentFilters.type;
			if (currentFilters.deptName) params.deptName = currentFilters.deptName;
			if (currentFilters.name) params.name = currentFilters.name;

			console.log('🔍 API 요청 파라미터:', params); // 디버깅용

			const res = await api.get('/sugang/subjectList', { params });
			console.log('학생이 확인하는 강의 목록', res.data);
			// currentpage현재페이지:0, listCount:총개수, lists:데이터들, totalPages총페이지수:2
			const rawData = res.data.lists; // 데이터만 추출
			const formattedData = rawData.map((sub) => ({
				id: sub.id,
				단과대학: sub.collName,
				개설학과: sub.deptName,
				학수번호: sub.id,
				강의구분: sub.type,
				강의명: sub.name,
				담당교수: sub.professorName,
				학점: sub.grades,
				'요일시간 (강의실)': `${sub.subDay}, ${sub.startTime}-${sub.endTime} (${sub.roomId})`,
				현재인원: sub.numOfStudent,
				정원: sub.capacity,
				강의계획서: sub.id, // 강의 계획서 이 부분 수정해야함
			}));
			SetSubTimeTable(formattedData);
			setCurrentPage(res.data.currentPage);
			setTotalPages(res.data.totalPages);
			setTotalCount(res.data.listCount);
			console.log('가공된 데이터:', formattedData);
		} catch (e) {
			console.error('강의 목록 조회 실패: ', e);
		}
	};

	// URL 파라미터 변경 감지 (초기 로드 + URL 변경 시)
	useEffect(() => {
		const page = parseInt(searchParams.get('page') || '0', 10);
		const type = searchParams.get('type') || '';
		const deptName = searchParams.get('deptName') || '';
		const name = searchParams.get('name') || '';
		console.log('🔗 URL에서 읽은 값:', { page, type, deptName, name });
		// URL에서 검색 조건 복원
		setSearchForm({ type, deptName, name });
		// URL에서 읽은 값을 직접 전달
		loadSubjectList(page, { type, deptName, name });
	}, [searchParams]);

	// 검색 폼 입력 핸들러
	const handleChange = (e) => {
		const { name, value } = e.target;
		setSearchForm({ ...searchForm, [name]: value });
	};

	// 검색 버튼 클릭 (URL 업데이트 + 0페이지부터)
	const handleSearch = () => {
		const params = { page: '0' };
		if (searchForm.type) params.type = searchForm.type;
		if (searchForm.deptName) params.deptName = searchForm.deptName;
		if (searchForm.name) params.name = searchForm.name;
		setSearchParams(params); // URL 업데이트 → useEffect 자동 실행
	};

	// 페이지 변경 (URL 업데이트)
	const handlePageChange = (newPage) => {
		if (newPage >= 0 && newPage < totalPages) {
			const params = { page: newPage.toString() };
			if (searchForm.type) params.type = searchForm.type;
			if (searchForm.deptName) params.deptName = searchForm.deptName;
			if (searchForm.name) params.name = searchForm.name;
			setSearchParams(params); // URL 업데이트 → useEffect 자동 실행
		}
	};

	// 테이블 헤더 정의
	const headers = [
		'단과대학',
		'개설학과',
		'학수번호',
		'강의구분',
		'강의명',
		'담당교수',
		'학점',
		'요일시간 (강의실)',
		'현재인원',
		'정원',
		'강의계획서',
	];

	// 검색 폼 카테고리
	const SUBJECT_CATEGORY_OPTIONS = [
		{ value: '', label: '전체' },
		{ value: '전공', label: '전공' },
		{ value: '교양', label: '교양' },
	];

	return (
		<>
			<h2>강의 시간표 조회</h2>
			{/* 검색 폼 */}
			<div>
				<OptionForm
					label="강의 구분"
					name="type"
					value={searchForm.type}
					onChange={handleChange}
					options={SUBJECT_CATEGORY_OPTIONS}
				/>

				<InputForm
					label="개설학과"
					name="deptName"
					type="text"
					value={searchForm.deptName}
					onChange={handleChange}
					placeholder="학과 입력"
				/>

				<InputForm
					label="강의명"
					name="name"
					value={searchForm.name}
					onChange={handleChange}
					placeholder="강의명 검색"
				/>

				<button onClick={handleSearch} className="button">
					검색
				</button>
			</div>

			{/* 페이징 정보 */}
			<h3>강의 목록</h3>
			<div>
				<p>
					전체 {totalCount}개 | {currentPage + 1} / {totalPages} 페이지
				</p>
			</div>

			<DataTable
				headers={headers}
				data={subTimetable}
				onRowClick={(row) => {
					console.log('클릭한 강의:', row.강의명);
				}}
			/>

			<PaginationForm
				currentPage={currentPage}
				totalPages={totalPages}
				blockSize={20}
				onPageChange={handlePageChange}
			/>
		</>
	);
}
