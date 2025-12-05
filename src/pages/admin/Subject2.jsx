// components/feature/SubjectForm.jsx
import { useState } from 'react';
import api from '../../api/httpClient'; // 경로 확인
import InputForm from './../../components/form/InputForm';

const Subject2 = () => {
	// 강의 전용 상태 관리
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
		</div>
	);
};
export default Subject2;
