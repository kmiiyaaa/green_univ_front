import { useState } from 'react';
import api from '../../../api/httpClient';
import CommonUserFields from '../../user/create/CommonUserFields';

export default function ProfessorCreatePage() {
	const [formData, setFormData] = useState({
		name: '',
		birthDate: '',
		gender: '남성',
		address: '',
		tel: '',
		email: '',
		deptId: '',
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
				gender: '남성',
				address: '',
				tel: '',
				email: '',
				deptId: '',
			});
		} catch (err) {
			console.error(err);
			alert('교수 등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<>
			<div>
				<h1> 교수 등록</h1>
			</div>
			<form>
				<table className="table--container">
					<tbody>
						{/* 공통 필드 */}
						<CommonUserFields formData={formData} onChange={handleChange} />

						{/* 교수 전용 필드 */}
						<tr>
							<td>
								<label htmlFor="deptId">과 ID</label>
							</td>
							<td>
								<input
									label="과 ID"
									type="text"
									name="deptId"
									id="deptId"
									className="input--box"
									value={formData.deptId}
									onChange={handleChange}
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<button onSubmit={handleSubmit}>등록</button>
			</form>
		</>
	);
}
