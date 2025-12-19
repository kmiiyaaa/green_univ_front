import { useState } from 'react';
import api from '../../../api/httpClient';
import CommonUserFields from '../../user/create/CommonUserFields';
import InputForm from '../../../components/form/InputForm';
import '../../../assets/css/UserCreate.css';

export default function ProfessorCreatePage() {
	const [formData, setFormData] = useState({
		name: '',
		birthDate: '',
		gender: '여성',
		address: '',
		tel: '',
		email: '',
		deptId: '',
		hireDate: '',
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
			const res = await api.post('/user/professor', formData);
			alert(res.data || '교수 입력이 완료되었습니다.');
			setFormData({
				name: '',
				birthDate: '',
				gender: '여성',
				address: '',
				tel: '',
				email: '',
				deptId: '',
				hireDate: '',
			});
		} catch (err) {
			console.error(err);
			alert('교수 등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="user-create-page">
			<div className="user-create-card">
				<div className="user-create-header">
					<h1>교수 등록</h1>
				</div>

				<form className="user-create-form" onSubmit={handleSubmit}>
					<table className="user-form-table">
						<tbody>
							{/* 공통 필드 */}
							<CommonUserFields formData={formData} onChange={handleChange} />

							{/* 교수 전용 필드 */}
							<InputForm label="과 ID" name="deptId" value={formData.deptId} onChange={handleChange} />
							<InputForm
								label="고용날짜"
								name="hireDate"
								type="date"
								value={formData.hireDate}
								onKeyDown={(e) => e.preventDefault()}
								onChange={handleChange}
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
