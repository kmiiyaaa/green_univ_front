import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';

import TuiList from './pages/tuition/TuiList';
import Payment from './pages/tuition/Payment';
import CreatePayment from './pages/tuition/CreatePayment';
import UserInfo from './pages/user/info/UserInfo';
import Index from './pages/Index';

import NoticeList from './pages/board/NoticeList';
import NoticeUpdate from './pages/board/NoticeUpdate';
import NoticeDetail from './pages/board/NoticeDetail';
import NoticeWrite from './pages/board/NoticeWrite';
import Subject from './pages/admin/Subject';
import AllsubList2 from './pages/subject/AllSubList2';
import AdminPage from './pages/admin/AdminPage';
import College from './pages/admin/College';
import Department from './pages/admin/Department';
import CollTuit from './pages/admin/CollTuit';
import Room from './pages/admin/Room';
import CreateStudent from './pages/user/create/CreateStudent';
import CreateStaff from './pages/user/create/CreateStaff';
import CreateProfessor from './pages/user/create/CreateProfessor';
import PublicLayout from './components/layout/PublicLayout';
import PublicHome from './pages/PublicHome';
import PortalLayout from './components/layout/PortalLayout';
import Portal from './pages/Portal';
import UpdatePassword from './pages/user/update/UpdatePassword';
import ScheduleList from './pages/schedule/ScheduleList';
import ScheduleDetail from './pages/schedule/ScheduleDetail';

function App() {
	return (
		<>
			<UserProvider>
				<Routes>
					{/* ========== 로그인 전 (Public) ========== */}
					<Route element={<PublicLayout />}>
						<Route path="/" element={<PublicHome />} />
					</Route>
					{/* ========== 로그인 후 (Private) ========== */}
					{/* <Route element={<PrivateRoute />}> */}
					<Route element={<PortalLayout />}>
						{/* 로그인 후 메인 대시보드 */}
						<Route path="/portal" element={<Portal />} />
						{/* 등록금 */}
						<Route path="/tuition" element={<TuiList />} /> {/* 등록금 납부 내역 */}
						<Route path="/tuition/payment" element={<Payment />} /> {/* 등록금 고지서 */}
						<Route path="/tuition/bill" element={<CreatePayment />} /> {/* 등록금 고지서 생성 (관리자) */}
						{/* 사용자 */}
						<Route path="/user/info" element={<UserInfo />} /> {/* 내 정보 조회, 수정 */}
						<Route path="/user/update/password" element={<UpdatePassword />} /> {/* 비밀번호 변경 */}
						<Route path="/user/create/professor" element={<CreateProfessor />} /> {/* 교수 등록 */}
						<Route path="/user/create/staff" element={<CreateStaff />} /> {/* 직원 등록 */} {/* 교직원 등록*/}
						<Route path="/user/create/student" element={<CreateStudent />} /> {/* 학생 등록 */} {/* 학생 등록*/}
						<Route path="/index" element={<Index />} />
						{/* 강의/과목 */}
						<Route path="/subject/list" element={<AllsubList2 />} /> {/* 수정 해야 함 */}
						{/* 관리자 */}
						<Route path="/admin" element={<AdminPage />} /> {/* 관리자 통합 페이지 - 삭제 할 수도 */}
						<Route path="/admin/room" element={<Room />} /> {/* 강의실 등록 */}
						<Route path="/admin/subject" element={<Subject />} /> {/* 강의 등록 */}
						<Route path="/admin/college" element={<College />} /> {/* 단과대 등록 */}
						<Route path="/admin/department" element={<Department />} /> {/* 학과 등록 */}
						<Route path="/admin/colltuit" element={<CollTuit />} /> {/* 단대별 등록금 등록 */}
						{/* 공지사항 */}
						<Route path="/notice" element={<NoticeList />} /> {/* 공지 목록*/}
						<Route path="/notice/write" element={<NoticeWrite />} /> {/* 공지 등록*/}
						<Route path="/notice/read/:id" element={<NoticeDetail />} /> {/* 공지 상세보기*/}
						<Route path="/notice/update/:id" element={<NoticeUpdate />} /> {/* 공지 수정*/}
						{/* 학사 일정 */}
						<Route path="/schedule/list" element={<ScheduleList />} /> {/* 학사일정 */}
						<Route path="/schedule/detail/:id" element={<ScheduleDetail />} /> {/* 학사일정 상세 */}
					</Route>
					{/* </Route> */}
					{/* 잘못된 경로 → 로그인 페이지로 */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</UserProvider>
		</>
	);
}

export default App;
