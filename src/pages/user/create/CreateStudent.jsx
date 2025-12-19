import { useState } from 'react';
import api from '../../../api/httpClient';
import CommonUserFields from '../../user/create/CommonUserFields';
import InputForm from '../../../components/form/InputForm';
import '../../../assets/css/UserCreate.css';

export default function CreateStudent() {
	const [formData, setFormData] = useState({
		name: '',
		birthDate: '',
		gender: '여성',
		address: '',
		tel: '',
		email: '',
		deptId: '',
		entranceDate: '',
		grade: '',
		semester: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post('/user/student', formData);
			alert(res.data || '학생 입력이 완료되었습니다.');

			// 입력 후 초기화
			setFormData({
				name: '',
				birthDate: '',
				gender: '여성',
				address: '',
				tel: '',
				email: '',
				deptId: '',
				entranceDate: '',
				grade: '',
				semester: '',
			});
		} catch (err) {
			console.error(err);
			alert(err.response.data.message);
		}
	};

	return (
		<div className="user-create-page">
			<div className="user-create-card">
				<div className="user-create-header">
					<h1>학생 등록</h1>
				</div>

				{/* ✅ onSubmit으로 처리 (엔터 제출/접근성 OK) */}
				<form className="user-create-form" onSubmit={handleSubmit}>
					<table className="user-form-table">
						<tbody>
							{/* 공통 필드 */}
							<CommonUserFields formData={formData} onChange={handleChange} />

							{/* 학생 전용 필드 */}
							<InputForm label="과 ID" name="deptId" value={formData.deptId} onChange={handleChange} />
							<InputForm
								label="입학일"
								name="entranceDate"
								type="date"
								value={formData.entranceDate}
								onKeyDown={(e) => e.preventDefault()}
								onChange={handleChange}
							/>
							<InputForm
								label="학년"
								name="grade"
								value={formData.grade}
								onChange={handleChange}
								placeholder="1, 2, 3, 4로 기입해주세요"
							/>
							<InputForm
								label="학기"
								name="semester"
								value={formData.semester}
								onChange={handleChange}
								placeholder="1, 2로 기입해주세요"
							/>
						</tbody>
					</table>

					<div className="user-form-actions">
						<button className="user-submit-btn" type="submit">
							등록
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
