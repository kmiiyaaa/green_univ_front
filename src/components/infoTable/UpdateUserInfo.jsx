import { useState } from 'react';
import api from '../../api/httpClient';

export default function UpdateUserInfo({ userInfo, setIsEdit }) {
	const [value, setValue] = useState({
		address: userInfo.address,
		tel: userInfo.tel,
		email: userInfo.email,
		password: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValue((p) => ({ ...p, [name]: value }));
	};

	const updateUserInfo = async () => {
		try {
			await api.patch(`/personal/update?password=${value.password}`, {
				address: value.address,
				tel: value.tel,
				email: value.email,
			});
			
			alert('수정이 완료되었습니다!');
			setIsEdit(false);
		} catch (err) {
			const serverMsg = err.response?.data?.message || '';
			if (serverMsg.includes('비밀번호')) {
				alert('비밀번호가 올바르지 않습니다.');
			} else {
				alert(serverMsg || '오류가 발생했습니다.');
			}
		}
	};

	return (
		<div>
			<h2>개인 정보 수정</h2>

			<form onSubmit={() => updateUserInfo()}>
				<div>
					<label>주소</label>
					<input type="text" name="address" value={value.address} onChange={handleChange} required />
				</div>

				<div>
					<label>전화번호</label>
					<input type="text" name="tel" value={value.tel} onChange={handleChange} required />
				</div>

				<div>
					<label>이메일</label>
					<input type="email" name="email" value={value.email} onChange={handleChange} required />
				</div>

				<div>
					<label>비밀번호 확인</label>
					<input type="password" name="password" onChange={handleChange} />
				</div>

				<button type="submit">수정하기</button>
				<button onClick={() => setIsEdit(false)}>취소</button>
			</form>
		</div>
	);
}
