import { useState } from 'react';

// Provider 컴포넌트
export function UserProvider({ children }) {
	const [user, setUser] = useState(null); // 학번, 이름 등
	const [userRole, setUserRole] = useState(null); // 권한: student, admin 등
	const [token, setToken] = useState(null); // JWT

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
