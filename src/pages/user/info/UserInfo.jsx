import { useContext, useEffect, useState } from 'react';
import InfoTable from '../../../components/infoTable/infoTable';
import { UserContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/httpClient';
import StudentInfoTable from '../../../components/infoTable/StudentInfoTable';

export default function UserInfo() {
	const { user, userRole } = useContext(UserContext);
	const [userInfo, setUserInfo] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!user || !userRole) {
			// 권한 확인
			alert('권한이 없는 페이지입니다. 로그인 해 주세요');
			navigate('/login', { replace: true });
			return;
		}

		const loadInfo = async () => {
			try {
				// 권한에 따라 다른 api 호출
				if (userRole === 'student') {
					// 학생
					const res = await api.get('/api/personal/student');
					setUserInfo(res.data);
				} else if (userRole === 'staff') {
					// 직원
					const res = await api.get('/api/personal/staff');
					setUserInfo(res.data);
				} else {
					// 교수
					const res = await api.get('/api/personal/professor');
					setUserInfo(res.data);
				}
			} catch (e) {
				console.error('내 정보 조회 실패' + e);
			}
		};
		loadInfo();
	}, [user, userRole, navigate]);

	// 권한 별 볼 수 있는 정보가 달라서, 필요한 테이블 별로 분리했습니다.
	return (
		<div>
			{userRole === 'student' && <StudentInfoTable userInfo={userInfo} />} {/* 학생 */}
			{userRole === 'professor' && <StudentInfoTable userInfo={userInfo} />} {/* 교수 */}
			{userRole === 'staff' && <StudentInfoTable userInfo={userInfo} />} {/* 직원 */}
			{/* 공통 인적사항 테이블 컴포넌트 */}
			<InfoTable userInfo={userInfo} />
			<button>수정하기</button>
		</div>
	);
}
