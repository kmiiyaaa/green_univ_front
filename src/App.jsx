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
import AllsubList from './pages/AllSubList';
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
import SubList from './pages/stuSub/SubList';
import PreSugang from './pages/stuSub/PreSugang';
import Sugang from './pages/stuSub/Sugang';
import UpdatePeriod from './pages/stuSub/UpdatePeriod';
import UpdatePassword from './pages/user/update/UpdatePassword';
import ProfessorList from './pages/user/info/ProfessorList';
import StudentList from './pages/user/info/StudentList';
import ScheduleDetail from './pages/schedule/ScheduleDetail';
import ScheduleList from './pages/schedule/ScheduleList';
import ScheduleWrite from './pages/schedule/ScheduleWrite';
import ScheduleUpdate from './pages/schedule/ScheduleUpdate';
import BreakApplication from './pages/break/BreakApplication';
import BreakAppDetail from './pages/break/BreakAppDetail';
import BreakAppListStaff from './pages/break/BreakAppListStaff';
import BreakAppListStudent from './pages/break/BreakAppListStudent';
import ProfessorSubjectList from './pages/professor/ProfessorSubjectList';
import ReadSyllabusPopup from './pages/professor/ReadSyllabusPopup';
import ThisGrade from './pages/grade/ThisGrade';
import Semester from './pages/grade/Semester';
import TotalGrade from './pages/grade/TotalGrade';
import SubApp from './pages/stuSub/SubApp';
import Evaluation from './pages/evaluation/Evaluation';
import MyEvaluation from './pages/evaluation/MyEvaluation';
import Timetable from './pages/stuSub/Timetable';

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
						{/* 교수 직원 학생 등록 */}
						<Route path="/user/create/professor" element={<CreateProfessor />} /> {/* 교수 등록 */}
						<Route path="/user/create/staff" element={<CreateStaff />} /> {/* 교직원 등록 */}
						<Route path="/user/create/student" element={<CreateStudent />} /> {/* 학생 등록 */}
						<Route path="/index" element={<Index />} />
						{/* 수강신청 */}
						<Route path="/sugang/list" element={<SubList />} /> {/* 학생이 확인하는 강의 시간표 목록 */}
						<Route path="/sugang/pre" element={<PreSugang />} /> {/* 예비 수강 신청 */}
						<Route path="/sugang" element={<Sugang />} /> {/* 수강 신청 */}
						<Route path="/sugang/timetable" element={<Timetable />} /> {/* 학생의 최종 강의 시간표 */}
						<Route path="/sugang/period" element={<UpdatePeriod />} /> {/* 수강 신청 변경 (관리자) */}
						{/* 관리자 */}
						<Route path="/admin/room" element={<Room />} /> {/* 강의실 등록 */}
						<Route path="/admin/subject" element={<Subject />} /> {/* 강의 등록 */}
						<Route path="/admin/college" element={<College />} /> {/* 단과대 등록 */}
						<Route path="/admin/department" element={<Department />} /> {/* 학과 등록 */}
						<Route path="/admin/colltuit" element={<CollTuit />} /> {/* 단대별 등록금 등록 */}
						<Route path="/professor/list" element={<ProfessorList />} /> {/* 교수 리스트 */}
						<Route path="/student/list" element={<StudentList />} /> {/* 학생 리스트 */}
						{/* 공지사항 */}
						<Route path="/notice" element={<NoticeList />} /> {/* 공지 목록*/}
						<Route path="/notice/write" element={<NoticeWrite />} /> {/* 공지 등록*/}
						<Route path="/notice/read/:id" element={<NoticeDetail />} /> {/* 공지 상세보기*/}
						<Route path="/notice/update/:id" element={<NoticeUpdate />} /> {/* 공지 수정*/}
						{/* 학사 일정 */}
						<Route path="/schedule" element={<ScheduleList />} /> {/* 학사일정 - 안에서 staff/public 나눔 */}
						<Route path="/schedule/detail/:id" element={<ScheduleDetail />} /> {/* 교직원용 학사 일정 상세 */}
						<Route path="/schedule/write" element={<ScheduleWrite />} /> {/* 교직원용 학사 일정 등록 */}
						<Route path="/schedule/update/:id" element={<ScheduleUpdate />} /> {/* 교직원용 학사일정 수정 */}
						{/* 휴학 */}
						<Route path="/break/application" element={<BreakApplication />} /> {/* 휴학 신청폼*/}
						<Route path="/break/detail" element={<BreakAppDetail />} /> {/* 휴학 신청 상세*/}
						<Route path="/break/list/staff" element={<BreakAppListStaff />} /> {/* 교직원 -휴학 신청리스트*/}
						<Route path="/break/list" element={<BreakAppListStudent />} /> {/* 학생 - 휴학 신청내역*/}
						{/* 교수 */}
						<Route path="/professor/subject" element={<ProfessorSubjectList />} /> {/* 내 강의 목록 */}
						<Route path="/subject/list" element={<AllsubList />} /> {/* 수업 - 전체 강의 조회 */}
						<Route path="/professor/evaluation" element={<MyEvaluation />} />
						{/* 내 강의 평가 */}
						{/* 학생 - 성적 */}
						<Route path="/grade/current" element={<ThisGrade />} /> {/* 이번 학기 성적*/}
						<Route path="/grade/semester" element={<Semester />} /> {/* 학기별 성적 조회*/}
						<Route path="/grade/total" element={<TotalGrade />} /> {/* 누계 성적 조회*/}
					</Route>
					{/* 팝업들 */}
					<Route path="/professor/syllabus/:subjectId" element={<ReadSyllabusPopup />} />
					{/* 강의계획서 조회 팝업 */}
					<Route path="/evaluation" element={<Evaluation />} /> {/* 학생 강의 평가 팝업 */}
					{/* 잘못된 경로 → 로그인 페이지로 */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</UserProvider>
		</>
	);
}

export default App;
