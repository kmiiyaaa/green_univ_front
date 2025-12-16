import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import api from '../api/httpClient';

// Provider 컴포넌트
export function UserProvider({ children }) {
	const [user, setUser] = useState(null); // 학번, 이름 등
	const [userRole, setUserRole] = useState(null); // 권한: student, admin 등
	const [name, SetName] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token')); // JWT
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			if (token) {
				try {
					const res = await api.get('/auth/me');
					console.log('provider me: ', res.data);
					setUser(res.data.id);
					setUserRole(res.data.role);
					SetName(res?.data.name);
				} catch (err) {
					console.error('토큰 만료됨', err);
					localStorage.removeItem('token');
					setToken(null);
				}
			}
			setLoading(false);
		};
		checkUser();
	}, [token]);

	const value = {
		user,
		setUser,
		userRole,
		setUserRole,
		token,
		setToken,
		name,
		loading,
	};

	if (loading) return <div>Loading...</div>;

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
