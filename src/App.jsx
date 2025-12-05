import { Routes, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';
import Home from './pages/Home';
import Footer from './components/layout/mainLayout/Footer';
import Header from './components/layout/mainLayout/Header';
import TuiList from './pages/tuition/TuiList';
import AllsubList from './pages/subject/AllSubList';
import Subject from './pages/admin/Subject';
import AllsubList2 from './pages/subject/AllSubList2';
import AdminPage from './pages/admin/AdminPage';
import Room2 from './pages/admin/Room2';
import Subject2 from './pages/admin/Subject2';

function App() {
	return (
		<>
			<UserProvider>
				<div className="App"></div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/h" element={<Header />} />
					<Route path="/f" element={<Footer />} />
					<Route path="/tuilist" element={<TuiList />} />
					<Route path="/subjectlist" element={<AllsubList2 />} />
					{/* <Route path="/subject" element={<Subject />} /> */}
					<Route path="/adminform" element={<AdminPage />} />
					<Route path="/room" element={<Room2 />} />
					<Route path="/subject" element={<Subject2 />} />
				</Routes>
			</UserProvider>
		</>
	);
}

export default App;
