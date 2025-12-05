// 로그인 후 메인 포탈(대시보드)
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
// import StudentDashboard from '../components/dashboard/StudentDashboard';
// import ProfessorDashboard from '../components/dashboard/ProfessorDashboard';
// import AdminDashboard from '../components/dashboard/AdminDashboard';

function Portal() {
	const { user } = useContext(UserContext);

	// if (user.role === 'STUDENT') return <StudentDashboard />;
	// if (user.role === 'PROFESSOR') return <ProfessorDashboard />;
	// if (user.role === 'ADMIN') return <AdminDashboard />;

	return <div>권한 없음</div>;
}

export default Portal;
