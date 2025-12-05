import { Routes, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';
import Home from './pages/Home';
import Footer from './components/layout/mainLayout/Footer';
import Header from './components/layout/mainLayout/Header';
import TuiList from './pages/tuition/TuiList';
import Payment from './pages/tuition/Payment';
import CreatePayment from './pages/tuition/CreatePayment';

function App() {
	return (
		<>
			<UserProvider>
				<div className="App"></div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/h" element={<Header />} />
					<Route path="/f" element={<Footer />} />
					<Route path="/tuilist" element={<TuiList />} />  {/* 등록금 납부 내역 */}
					<Route path="/tuilist/payment" element={<Payment />} /> {/* 등록금 고지서 */}
					<Route path="/tuilist/bill" element={<CreatePayment />} /> {/* 등록금 고지서 생성 (관리자) */}
				</Routes>
			</UserProvider>
		</>
	);
}

export default App;
