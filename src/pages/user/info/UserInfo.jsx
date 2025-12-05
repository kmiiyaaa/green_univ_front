import { useContext, useEffect, useState } from 'react';
// import { UserContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/httpClient';
import StudentInfoTable from '../../../components/infoTable/StudentInfoTable';
import ProfessorInfoTable from '../../../components/infoTable/ProfessorInfoTable';
import StaffInfoTable from '../../../components/infoTable/StaffInfotable';
import UpdateUserInfo from '../../../components/infoTable/UpdateUserInfo';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../../context/UserContext';

export default function UserInfo() {
	const { user, userRole } = useContext(UserContext);
	const [userInfo, setUserInfo] = useState({});
	const [stustatList, setStustatList] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const navigate = useNavigate();

	const token = localStorage?.getItem('token'); // 토큰 확인
	//const role = token ? jwtDecode(token)?.role : null;

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			// 권한 확인
			alert('권한이 없는 페이지입니다. 로그인 해 주세요');
			navigate('/', { replace: true });
			return;
		}

		const loadInfo = async () => {
			setUserInfo({});
			setStustatList({});
			try {
				// 권한에 따라 다른 api 호출
				if (userRole === 'student') {
					// 학생
					const res = await api.get('/personal/info/student');
					setUserInfo(res.data.student);
					setStustatList(res.data.stustatList); // 학적 변동 내역
				} else if (userRole === 'staff') {
					// 직원
					const res = await api.get('/personal/info/staff');
					setUserInfo(res.data.staff);
				} else {
					// 교수
					const res = await api.get('/personal/info/professor');
					setUserInfo(res.data.professor);
				}
			} catch (e) {
				console.error('내 정보 조회 실패' + e);
				setUserInfo({});
				setStustatList([]);
			}
		};
		loadInfo();
	}, []);

	return (
		<div>
			내 정보 조회
			{!isEdit && (
				<div>
					{userRole === 'student' && <StudentInfoTable userInfo={userInfo} stustatList={stustatList} />} {/* 학생 */}
					{userRole === 'professor' && <ProfessorInfoTable userInfo={userInfo} />} {/* 교수 */}
					{userRole === 'staff' && <StaffInfoTable userInfo={userInfo} />} {/* 직원 */}
					<button onClick={() => setIsEdit(true)}>수정하기</button>
				</div>
			)}
			{isEdit && <UpdateUserInfo userInfo={userInfo} setIsEdit={setIsEdit} />}
		</div>
	);
}
