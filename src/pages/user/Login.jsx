import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';

export default function Login() {
	const navigate = useNavigate();
	const { setUser, setUserRole, setToken } = useContext(UserContext);

	const [loginId, setLoginId] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// 로그인
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(false);
		if (!loginId || !password) {
			setError('아이디와 비밀번호를 입력해주세요.');
			return;
		}
		try {
			setLoading(true);
			const res = await api.post('/auth/login', {
				id: loginId,
				password: password,
			});
			// console.log('로그인res.data', res.data); // id, userRole, accessToken
			const { id, userRole, accessToken } = res.data;
			// console.log('id', id); //
			// console.log('userRole', userRole);
			// console.log('accessToken', accessToken); // 모두 변수 저장됨
			if (accessToken) setToken(accessToken);
			localStorage.setItem('token', accessToken);
			if (id) setUser(id); // 유저 아이디 (기본키 저장)
			if (userRole) setUserRole(userRole);
			navigate('/portal', { replace: true });
		} catch (err) {
			setError(err.response.data.message);
			console.error(err.response.data.message);
			alert(err.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	// 아이디/비밀번호 찾기
	const AccountPop = (type) => {
		const url = `/findAccount/${type}`;
		window.open(url, '_blank', 'width=600,height=400,scrollbars=no');
	};

	return (
		<div className="public-login-card">
			<h2 className="public-login-title">포털 로그인</h2>

			<form onSubmit={handleSubmit} className="public-login-form">
				<div className="public-input-group">
					<label htmlFor="loginId" className="public-input-label">
						아이디
					</label>
					<input
						id="loginId"
						type="text"
						className="public-input"
						placeholder="아이디를 입력하세요"
						value={loginId}
						onChange={(e) => setLoginId(e.target.value)}
					/>
				</div>

				<div className="public-input-group">
					<label htmlFor="password" className="public-input-label">
						비밀번호
					</label>
					<input
						id="password"
						type="password"
						className="public-input"
						placeholder="비밀번호를 입력하세요"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className="public-login-options">
					<label className="public-checkbox-label">
						<input type="checkbox" className="public-checkbox" />
						<span>ID 저장</span>
					</label>
				</div>

				{error && <p style={{ marginTop: 8, fontSize: 12 }}>{error}</p>}

				<button type="submit" className="public-login-button" disabled={loading}>
					{loading ? 'LOGGING IN...' : 'LOGIN'}
				</button>

				<div className="public-login-links">
					<button type="button" onClick={() => AccountPop('아이디')} className="public-link-button">
						아이디 찾기
					</button>
					<span className="public-link-divider">·</span>
					<button type="button" onClick={() => AccountPop('비밀번호')} className="public-link-button">
						비밀번호 찾기
					</button>
					<span className="public-link-divider">·</span>
				</div>
			</form>
		</div>
	);
}
