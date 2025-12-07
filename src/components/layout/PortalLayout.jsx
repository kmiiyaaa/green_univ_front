// 헤더 + 네비 + 푸터 보이는 레이아웃
import { Outlet, useNavigate } from 'react-router-dom';
import '../../assets/css/PortalLayout.css';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function PortalLayout() {
	const navigate = useNavigate();
	const { setUser, setUserRole } = useContext(UserContext);

	const handleLogout = () => {
		const ok = window.confirm('정말 로그아웃 하시겠습니까?');
		if (!ok) return;
		localStorage.removeItem('token');
		setUser(null);
		setUserRole(null);
		navigate('/', { replace: true });
	};

	return (
		<div className="portal-layout">
			<Header handleLogout={handleLogout} />
			<div className="main-container">
				<Navigation /> {/* 역할별 사이드바 */}
				<main className="content">
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
}

export default PortalLayout;
