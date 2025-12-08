import { useState } from 'react';
import api from '../../../api/httpClient';
import CommonUserFields from '../../user/create/CommonUserFields';
import InputForm from '../../../components/form/InputForm';

export default function CreateStudent() {
	const [formData, setFormData] = useState({
		name: '',
		birthDate: '',
		gender: '남성',
		address: '',
		tel: '',
		email: '',
		deptId: '',
		entranceDate: '',
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
				gender: '남성',
				address: '',
				tel: '',
				email: '',
				deptId: '',
				entranceDate: '',
			});
		} catch (err) {
			console.error(err);
			alert('학생 등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<>
			<div>
				<h1>학생 등록</h1>
			</div>
			<form>
				<table className="table--container">
					<tbody>
						{/* 공통 필드 */}
						<CommonUserFields formData={formData} onChange={handleChange} />

						{/* 학생 전용 필드 */}
						<InputForm label="과 ID" name="deptId" value={formData.deptId} onChange={handleChange} />
						<InputForm label="입학일" name="entranceDate" value={formData.entranceDate} onChange={handleChange} />
					</tbody>
				</table>
				<button onSubmit={handleSubmit}>등록</button>
			</form>
		</>
	);
}
