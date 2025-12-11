import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from '../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';

// 관리자 강의 등록 + 목록 (페이징 처리 안 됐음)
export default function Subject2() {
	const [formData, setFormData] = useState({
		name: '',
		professorId: '',
		roomId: '',
		deptId: '',
		type: '전공',
		subYear: '',
		semester: '',
		subDay: '월',
		startTime: '',
		endTime: '',
		grades: '',
		capacity: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/subject', formData);
			console.log('강의 등록 성공:', res.data);
			alert('강의 등록 완료!');
			// 필요하면 여기서 입력창 초기화 or 페이지 이동
		} catch (e) {
			console.error('강의 등록 실패:', e);
		}
	};

	// 강의 목록 가져오기
	const [subjectList, setSubjectList] = useState([]);

	useEffect(() => {
		const loadSubject = async () => {
			try {
				const res = await api.get('/admin/subject');
				//console.log(res.data);
				const rawData = res.data.subjectList;
				console.log(rawData);
				const formattedData = rawData.map((sub) => ({
					id: sub.id,
					강의명: sub.name,
					교수: sub.professor.name,
					강의실: sub.department.id,
					학과ID: sub.department.name,
					구분: sub.type,
					연도: sub.subYear,
					학기: sub.semester,
					시간: sub.startTime,
					이수학점: sub.grades,
					정원: sub.capacity,
					원본데이터: sub,
				}));

				setSubjectList(formattedData);
				console.log('가공된 데이터:', formattedData);
			} catch (e) {
				console.error('강의 목록 로드 실패:', e);
			}
		};
		loadSubject();
	}, []);

	const headers = ['id', '강의명', '교수', '강의실', '학과ID', '구분', '연도', '학기', '시간', '이수학점', '정원'];

	return (
		<div className="form-container">
			<h3>강의 등록</h3>
			<div className="subject--form">
				<InputForm label="강의명" name="name" value={formData.name} onChange={handleChange} />
				<InputForm label="교수ID" name="professorId" value={formData.professorId} onChange={handleChange} />
				<InputForm label="강의실ID" name="roomId" value={formData.roomId} onChange={handleChange} />
				<InputForm label="학과ID" name="deptId" value={formData.deptId} onChange={handleChange} />

				{/* 라디오/Select는 InputForm으로 만들기 애매해서 직접 작성 (나중에 이것도 분리 가능) */}
				<div className="input-group">
					<label>이수 구분 </label>
					<label>
						<input type="radio" name="type" value="전공" checked={formData.type === '전공'} onChange={handleChange} />{' '}
						전공
					</label>
					<label>
						<input type="radio" name="type" value="교양" checked={formData.type === '교양'} onChange={handleChange} />{' '}
						교양
					</label>
				</div>

				<InputForm label="연도" name="subYear" value={formData.subYear} onChange={handleChange} />
				<InputForm label="학기" name="semester" value={formData.semester} onChange={handleChange} />

				<button onClick={handleSubmit} className="button">
					강의 등록
				</button>
			</div>

			<h3>강의 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={subjectList}
					onRowClick={(row) => {
						// row에는 위에서 가공한 한글 키들이 들어있음
						console.log('클릭한 강의:', row.강의);
						// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
					}}
				/>
			</div>
		</div>
	);
}
