import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';

export default function Login() {
	const navigate = useNavigate();
	const { setUser, setUserRole } = useContext(UserContext);
	const [loginId, setLoginId] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!loginId || !password) {
			setError('아이디와 비밀번호를 입력해주세요.');
			return;
		}

		try {
			setLoading(true);

			const res = await api.post('/auth/login', {
				id: loginId,
				password,
			});

			const { token, user, role } = res.data;

			if (token) localStorage.setItem('token', token);

			if (setUser) setUser(user);
			if (setUserRole) setUserRole(role);

			navigate('/', { replace: true });
		} catch (err) {
			console.error(err);
			setError('로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.');
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="portal-login-card">
			<h2 className="portal-login-title">포털 로그인</h2>

			<form onSubmit={handleSubmit} className="portal-login-form">
				<div className="portal-input-group">
					<label htmlFor="loginId" className="portal-input-label">
						아이디
					</label>
					<input
						id="loginId"
						type="text"
						className="portal-input"
						placeholder="아이디를 입력하세요"
						value={loginId}
						onChange={(e) => setLoginId(e.target.value)}
					/>
				</div>

				<div className="portal-input-group">
					<label htmlFor="password" className="portal-input-label">
						비밀번호
					</label>
					<input
						id="password"
						type="password"
						className="portal-input"
						placeholder="비밀번호를 입력하세요"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className="portal-login-options">
					<label className="portal-checkbox-label">
						<input type="checkbox" className="portal-checkbox" />
						<span>ID 저장</span>
					</label>
				</div>

				{error && <p style={{ marginTop: 8, fontSize: 12 }}>{error}</p>}

				<button type="submit" className="portal-login-button" disabled={loading}>
					{loading ? 'LOGGING IN...' : 'LOGIN'}
				</button>

				<div className="portal-login-links">
					<button type="button" className="portal-link-button">
						ID 신청
					</button>
					<span className="portal-link-divider">·</span>
					<button type="button" className="portal-link-button">
						비밀번호 찾기
					</button>
					<span className="portal-link-divider">·</span>
				</div>
			</form>
		</div>
	);
}
