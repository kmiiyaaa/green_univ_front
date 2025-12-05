import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { jwtDecode } from 'jwt-decode';

// Provider 컴포넌트
export function UserProvider({ children }) {
	const [user, setUser] = useState(null); // 학번, 이름 등
	const [userRole, setUserRole] = useState(null); // 권한: student, admin 등
	const [token, setToken] = useState(null); // JWT

	// Jwtdecode 라이브러리
	// 백에서 JWT build 하면서 넣은 값들 뽑아 쓰는 방법
	useEffect(() => {
		if (localStorage.getItem('token')) {
			const token = localStorage?.getItem('token');
			const decoded = jwtDecode(token);

			setUser(decoded.sub);
			setUserRole(decoded.role);
		}
	}, []);

	const value = {
		user,
		setUser,
		userRole,
		setUserRole,
		token,
		setToken,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
