import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from './../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';

const Department = () => {
	// 학과 전용 상태 관리
	const [formData, setFormData] = useState({
		name: '',
		collegeId: '',
		collegeName: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/department', formData);
			console.log('학과 등록 성공:', res.data);
			alert('학과 등록 완료!');
			// 필요하면 여기서 입력창 초기화 or 페이지 이동
		} catch (e) {
			console.error('학과 등록 실패:', e);
		}
	};

	// 학과 목록 가져오기
	const [dept, setDept] = useState([]);

	useEffect(() => {
		const loadCollTuit = async () => {
			try {
				const res = await api.get('/admin/department');
				// console.log(res.data);
				const rawData = res.data.departmentList;
				console.log(rawData);
				const formattedData = rawData.map((dept) => ({
					id: dept.id,
					학과명: dept.name,
					단과대: dept.college.name,
					원본데이터: dept,
				}));

				setDept(formattedData);
				console.log('가공된 데이터:', formattedData);
			} catch (e) {
				console.error('학과 목록 로드 실패:', e);
			}
		};
		loadCollTuit();
	}, []);

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['학과명', '단과대'];

	return (
		<div className="form-container">
			<h3>학과 등록</h3>
			<div className="subject--form">
				<InputForm label="학과명" name="name" value={formData.name} onChange={handleChange} />
				{/* 기존 버전은 select 형식이었음 */}
				<InputForm label="단과대 아이디" name="collegeId" value={formData.collegeId} onChange={handleChange} />
				<InputForm label="단과대명" name="collegeName" value={formData.collegeName} onChange={handleChange} />

				<button onClick={handleSubmit} className="button">
					학과 등록
				</button>
			</div>

			<h3>학과 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={dept}
					onRowClick={(row) => {
						// row에는 위에서 가공한 한글 키들이 들어있음
						console.log('클릭한 학과:', row.학과);
						// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
					}}
				/>
			</div>
		</div>
	);
};
export default Department;
