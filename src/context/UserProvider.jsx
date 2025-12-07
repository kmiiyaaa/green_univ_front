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


	// // Jwtdecode 라이브러리
	// // 백에서 JWT build 하면서 넣은 값들 뽑아 쓰는 방법

	// // 기존 로그인 성공 시 /me 호출해서 set 하던 방법에서, 
	// // 로컬스토리지에 저장된 값들을 리랜더 될 때마다 다시 세팅하는 방식으로 변경

	// // 1. 백(jwtUtil)에서 유저 id, UserRole 이 토큰에 넣어져 빌드됨
	// // 2. 로그인 시 로컬스토리지에 토큰 저장
	// // 3. 리랜더 될 때마다 로컬스토리지의 토큰에서 필요한 정보 꺼내 세팅
	// useEffect(() => {
	// 	if (localStorage.getItem('token')) {
	// 		const token = localStorage?.getItem('token');
	// 		const decoded = jwtDecode(token);

	// 		setUser(decoded.sub); // sub : 유저 아이디 값 
	// 		// 표준 키라 setSubject()로 저장해도 sub로 저장된다고 합니다
	// 		setUserRole(decoded.role); 
	// 	}
	// }, []);

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
