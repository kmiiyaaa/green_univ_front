import { Routes, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';
import Home from './pages/Home';
import Footer from './components/layout/mainLayout/Footer';
import Header from './components/layout/mainLayout/Header';

function App() {
	return (
		<>
			<UserProvider>
				<div className="App"></div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/h" element={<Header />} />
					<Route path="/f" element={<Footer />} />
				</Routes>
			</UserProvider>
		</>
	);
}

export default App;
