import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import api from '../api/httpClient';

// Provider 컴포넌트
export function UserProvider({ children }) {
	const [user, setUser] = useState(null); // 학번, 이름 등
	const [userRole, setUserRole] = useState(null); // 권한: student, admin 등
	const [token, setToken] = useState(localStorage.getItem('token')); // JWT
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			if (token) {
				try {
					const res = await api.get('/auth/me');
					console.log('provider: ', res.data);
					// 백엔드에서 id, username, role 이렇게 보내줬는데 id = username임 (이름 통일 시킬 것)
					setUser(res.data.id);
					setUserRole(res.data.role);
				} catch (err) {
					console.error('토큰 만료됨', err);
					localStorage.removeItem('token');
				}
			}
			setLoading(false);
		};
		checkUser();
	}, []);

	const value = {
		user,
		setUser,
		userRole,
		setUserRole,
		token,
		setToken,
	};

	if (loading) return <div>Loading...</div>;

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
