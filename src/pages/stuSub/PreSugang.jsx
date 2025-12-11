import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';
import OptionForm from '../../components/form/OptionForm';
import PaginationForm from '../../components/form/PaginationForm';

export default function PreSugang() {
	const { user, token, userRole } = useContext(UserContext);
	const [error, setError] = useState(null);
	const [subTimetable, SetSubTimeTable] = useState([]);
	const [myPreList, setMyPreList] = useState([]); // 내가 신청한 예비 목록
	const [totalGrades, setTotalGrades] = useState(0); // 총 학점

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

	// 🔥 내가 신청한 예비 목록 조회
	const loadMyPreList = async () => {
		try {
			const res = await api.get('/sugang/stusublist');
			// period, preStuSubList, totalGrades
			if (res.data.period === 0) {
				const preRaw = res.data.preStuSubList || [];
				setMyPreList(
					preRaw.map((sub) => ({
						id: sub.id,
						학수번호: sub.subjectId,
						강의명: sub.subjectName,
						담당교수: sub.professorName,
						학점: sub.grades,
						'요일시간 (강의실)': `${sub.subDay}, ${sub.startTime}-${sub.endTime} (${sub.roomId})`,
						현재인원: sub.numOfStudent,
						정원: sub.capacity,
					}))
				);
				setTotalGrades(res.data.totalGrades || 0);
			}
		} catch (e) {
			setError(e.response?.data?.message);
			console.error('예비 목록 조회 실패:', e);
		}
	};

	// 강의 목록 조회 (페이징 page + 검색 filters)
	const loadSubjectList = async (page = 0, filters = null) => {
		try {
			const params = { page, size: 10 };
			const currentFilters = filters || searchForm;

			if (currentFilters.type) params.type = currentFilters.type;
			if (currentFilters.deptName) params.deptName = currentFilters.deptName;
			if (currentFilters.name) params.name = currentFilters.name;

			const res = await api.get('/sugang/presubjectlist', { params });
			console.log('강의 목록', res.data);

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
				isEnrolled: sub.status,
				예비신청: sub.status ? '취소' : '신청',
			}));
			SetSubTimeTable(formattedData);
			setCurrentPage(res.data.currentPage);
			setTotalPages(res.data.totalPages);
			setTotalCount(res.data.listCount);
		} catch (e) {
			setError(e.response?.data?.message);
			console.error('예비 목록 조회 실패: ', e);
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
		loadMyPreList(); // 내 예비 목록도 로드
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
		'예비신청',
	];

	const myListHeaders = ['학수번호', '강의명', '담당교수', '학점', '요일시간 (강의실)', '현재인원', '정원'];

	// 검색 폼 카테고리
	const SUBJECT_CATEGORY_OPTIONS = [
		{ value: '', label: '전체' },
		{ value: '전공', label: '전공' },
		{ value: '교양', label: '교양' },
	];

	return (
		<>
			{error && <div className="error-message">{error}</div>}

			<h2>예비 수강 신청 (장바구니)</h2>
			{/* 🔥 내가 신청한 예비 목록 */}
			{myPreList.length > 0 && (
				<>
					<h3>내 예비 수강 신청 목록 (총 {totalGrades}학점)</h3>
					<DataTable headers={myListHeaders} data={myPreList} />
					<hr style={{ margin: '30px 0' }} />
				</>
			)}
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
				clickableHeaders={['예비신청']}
				onCellClick={async ({ row, header }) => {
					if (header === '예비신청') {
						const isEnrolled = row.isEnrolled; // 현재 신청 상태 확인
						try {
							if (isEnrolled) {
								if (!window.confirm('예비 수강 신청을 취소하시겠습니까?')) return;
								await api.delete(`/sugang/pre/${row.id}`); // 수강 취소 클릭
							} else {
								if (!window.confirm('해당 강의를 예비 수강 신청 하시겠습니까?')) return;
								await api.post(`/sugang/pre/${row.id}`); // 수강 신청 클릭
							}
							await loadSubjectList(currentPage, searchForm); // 현재 인원 렌더링 하기 위해
							await loadMyPreList(); // 내 목록도 새로고침
						} catch (err) {
							const errorMessage = err.response?.data?.message || '처리 중 오류가 발생했습니다.';
							alert(errorMessage);
						}
					}
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
