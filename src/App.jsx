import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';

import Home from './pages/Home';
import TuiList from './pages/tuition/TuiList';

import Footer from './components/layout/mainLayout/Footer';
import Header from './components/layout/mainLayout/Header';
import Payment from './pages/tuition/Payment';
import CreatePayment from './pages/tuition/CreatePayment';
import UserInfo from './pages/user/info/UserInfo';

function MainLayout() {
	const navigate = useNavigate();

	const handleLogout = () => {
		const ok = window.confirm('정말 로그아웃 하시겠습니까?');
		if (!ok) return;

		localStorage.removeItem('token');
		navigate('/', { replace: true });
	};

	return (
		<>
			<Header onLogout={handleLogout} />
			<Outlet />
			<Footer />
		</>
	);
}

function App() {
	return (
		<UserProvider>
			<Routes>
				{/* 로그인: 헤더/푸터 없음 */}
				<Route path="/" element={<Home />} />

				{/* 그 외 페이지는 헤더+푸터 */}
				<Route element={<MainLayout />}>
					<Route path="/tuilist" element={<TuiList />} /> {/* 등록금 납부 내역 */}
					<Route path="/tuilist/payment" element={<Payment />} /> {/* 등록금 고지서 */}
					<Route path="/tuilist/bill" element={<CreatePayment />} /> {/* 등록금 고지서 생성 (관리자) */}
					<Route path="/info/student" element={<UserInfo  />} /> {/* 학생 내 정보 조회*/}
				</Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
