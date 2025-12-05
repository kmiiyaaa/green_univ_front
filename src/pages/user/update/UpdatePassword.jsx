import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';

export default function UpdatePassword() {
	const { user, userRole } = useContext(UserContext);
	const navigate = useNavigate();
	const [value, setValue] = useState({
		beforePassword: '',
		afterPassword: '',
		passwordCheck: '',
	});

	if (!user || !userRole) {
		// 권한 확인
		alert('권한이 없는 페이지입니다. 로그인 해 주세요');
		navigate('/login', { replace: true });
		return;
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValue((p) => ({ ...p, [name]: value }));
	};

	const updatePassword = async () => {
		try {
			await api.patch('/user/updatepassword', {
				beforePassword: value.beforePassword,
				afterPassword: value.afterPassword,
				passwordCheck: value.passwordCheck,
			});
			alert('비밀번호 변경이 완료되었습니다');
		} catch (e) {
			console.error('비밀번호 변경 실패' + e);
		}
	};

	return (
		<div>
			<div>
				<h2>비밀번호 변경</h2>

				<hr />

				<form onClick={updatePassword}>
					<div>
						<label>현재 비밀번호</label>
						<input
							type="text"
							name="beforePassword"
							value={value.beforePassword}
							placeholder="비밀번호는 6~20자 사이로 입력해주세요."
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label>변경할 비밀번호</label>
						<input
							type="text"
							name="afterPassword"
							value={value.afterPassword}
							placeholder="비밀번호는 6~20자 사이로 입력해주세요."
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label>변경할 비밀번호 확인</label>
						<input
							type="email"
							name="passwordCheck"
							value={value.passwordCheck}
							placeholder="비밀번호는 6~20자 사이로 입력해주세요."
							onChange={handleChange}
							required
						/>
					</div>

					<button type="submit">수정하기</button>
				</form>
			</div>
		</div>
	);
}
