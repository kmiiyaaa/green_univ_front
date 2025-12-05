import { useState } from 'react';
import api from '../../../api/httpClient';
import UserFormLayout from '../../../components/admin/user/UserFormLayout';
import CommonUserFields from '../../../components/admin/user/CommonUserFields';

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
		<UserFormLayout active="professor" title="교수 등록">
			<form onSubmit={handleSubmit}>
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
				<div className="button--container">
					<input type="submit" value="입력" />
				</div>
			</form>
		</UserFormLayout>
	);
}
