import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';

export default function SubList() {
	const { user, token, userRole } = useContext(UserContext);
	const [subTimetable, SetSubTimeTable] = useState([]);

	// 검색 폼
	const [formData, setFormData] = useState({
		type: '', // 전공 교양
		deptId: '', // 학과
		name: '', // 강의명
	});

	// 페이징 상태
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	// 검색 폼 입력 핸들러
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// 강의 목록 조회 (검색 + 페이징)
	const loadSubjectList = async (page = 0) => {
		try {
			const params = { page: page, size: 20 };
			if (formData.type) params.type = formData.type;
			if (formData.deptId) params.deptId = formData.deptId;
			if (formData.name) params.name = formData.name;

			const res = await api.get('/sugang/subjectList', { params });
			console.log('학생이 확인하는 강의 목록', res.data);
			// currentpage:0, listCount:10, lists:데이터들, totalPages:1
			const rawData = res.data.lists;
			console.log('raw', res.data.lists);

			const formattedData = rawData.map((sub) => ({
				id: sub.id,
				단과대학: sub.collName,
				개설학과: sub.deptName,
				학수번호: sub.id,
				강의구분: sub.type,
				강의명: sub.name,
				담당교수: sub.professorName,
				학점: sub.grades,
				// 요일시간강의실
				요일시간: `${sub.subDay}, ${sub.startTime}-${sub.endTime} (${sub.roomId})`,
				현재인원: sub.numOfStudent,
				정원: sub.capacity,
				강의계획서: sub.id,
			}));
			SetSubTimeTable(formattedData);
			setCurrentPage(res.data.currentPage);
			setTotalPages(res.data.totalPages);
			setTotalCount(res.data.listCount);
			console.log('가공된 데이터:', formattedData);
		} catch (e) {
			console.error('에러: ', e);
		}
	};

	useEffect(() => {
		loadSubjectList();
	}, []);

	// 🔥 검색 버튼 클릭
	const handleSearch = () => {
		loadSubjectList(0); // 검색 시 첫 페이지부터
	};

	// 🔥 페이지 이동
	const handlePageChange = (newPage) => {
		if (newPage >= 0 && newPage < totalPages) {
			loadSubjectList(newPage);
		}
	};

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = [
		'단과대학',
		'개설학과',
		'학수번호',
		'강의구분',
		'강의명',
		'담당교수',
		'학점',
		'요일시간',
		'현재인원',
		'정원',
		'강의계획서',
	];

	return (
		<>
			<h3>강의 시간표 조회</h3>
			{/* 🔥 검색 폼 */}
			<div style={{ marginBottom: '20px' }}>
				<select name="type" value={formData.type} onChange={handleChange}>
					<option value="">강의구분 (전체)</option>
					<option value="전공">전공</option>
					<option value="교양">교양</option>
				</select>

				<InputForm
					label="개설학과 ID"
					name="deptId"
					type="number"
					value={formData.deptId}
					onChange={handleChange}
					placeholder="학과 ID 입력"
				/>

				<InputForm label="강의명" name="name" value={formData.name} onChange={handleChange} placeholder="강의명 검색" />

				<button onClick={handleSearch} className="button">
					검색
				</button>
			</div>

			{/* 🔥 페이징 정보 */}
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

			{/* 🔥 페이징 버튼 */}
			<div style={{ marginTop: '20px' }}>
				<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
					이전
				</button>
				<span style={{ margin: '0 10px' }}>
					{currentPage + 1} / {totalPages}
				</span>
				<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
					다음
				</button>
			</div>
		</>
	);
}
