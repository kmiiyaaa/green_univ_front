import { useState } from 'react';
import api from '../../../api/httpClient';
import UserFormLayout from '../../../components/admin/user/UserFormLayout';
import CommonUserFields from '../../../components/admin/user/CommonUserFields';

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
		<UserFormLayout active="student" title="학생 등록">
			<form onSubmit={handleSubmit}>
				<table className="table--container">
					<tbody>
						{/* 공통 필드 */}
						<CommonUserFields formData={formData} onChange={handleChange} />

						{/* 학생 전용 필드 */}
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
						<tr>
							<td>
								<label htmlFor="entranceDate">입학일</label>
							</td>
							<td>
								<input
									type="text"
									name="entranceDate"
									id="entranceDate"
									className="input--box"
									value={formData.entranceDate}
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
