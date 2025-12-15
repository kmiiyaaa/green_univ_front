// 헤더 + 네비 + 푸터 보이는 레이아웃
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/PortalLayout.css';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Chat from '../../pages/chatbot/Chat';

function PortalLayout() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { setUser, setUserRole } = useContext(UserContext);

	const handleLogout = () => {
		const ok = window.confirm('정말 로그아웃 하시겠습니까?');
		if (!ok) return;
		localStorage.removeItem('token');
		setUser(null);
		setUserRole(null);
		navigate('/', { replace: true });
	};

	// 포탈 홈(대문)에서는 사이드바 숨김
	const hideSidebar = pathname === '/portal'; // 필요하면 '/'도 추가

	return (
		<div className="portal-layout">
			<Header handleLogout={handleLogout} />
			<div className={`main-container ${hideSidebar ? 'no-sidebar' : ''}`}>
				{!hideSidebar && <Navigation />}
				<main className="content">
					<Outlet />
					<Chat />
				</main>
			</div>
			<Footer />
		</div>
	);
}

export default PortalLayout;
