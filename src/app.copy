import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserProvider';

import TuiList from './pages/tuition/TuiList';
import Payment from './pages/tuition/Payment';
import CreatePayment from './pages/tuition/CreatePayment';
import UserInfo from './pages/user/info/UserInfo';
import Index from './pages/';

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
import Evaluation from './pages/evaluation/Evaluation';
import MyEvaluation from './pages/evaluation/MyEvaluation';
import Timetable from './pages/stuSub/Timetable';
// import VideoRoomTest from './pages/video/VideoRoomTest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FindAccountPop from './pages/user/find/FindAccountPop';
import MyStatus from './pages/counseling_student/MyStatus';
import CounselingReserve from './pages/counseling_student/Counselingreserve';
import MyCounseling from './pages/counseling_professor/MyCounseling';
import MyRiskStudent from './pages/counseling_professor/MyRiskStudent';
import CounselingEntry from './pages/CounselingEntry';
import MyCounselingSchedule from './pages/counseling_student/MyCounselingSchedule';
import WeeklyCounselingScheduleForm from './pages/counseling_professor/WeeklyCounselingScheduleForm';
import VideoCounseling from './pages/video/VideoCounseling';
import CounselingRequestList from './pages/counseling_student/CounselingRequestList';
import PreCounselingRequest from './pages/counseling_professor/PreCounselingRequest';
import CounselingInfo from './pages/counseling_professor/CounselingInfo';

function App() {
	// React Query 라이브러리
	const queryClient = new QueryClient();

	return (
		<>
			<QueryClientProvider client={queryClient}>
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
							<Route path="/index" element={<Index />} />
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
							<Route path="/break/detail/:id" element={<BreakAppDetail />} /> {/* 휴학 신청 상세*/}
							<Route path="/break/list/staff" element={<BreakAppListStaff />} /> {/* 교직원 -휴학 신청리스트*/}
							<Route path="/break/list" element={<BreakAppListStudent />} /> {/* 학생 - 휴학 신청내역*/}
							{/* 교수 */}
							<Route path="/professor/subject" element={<ProfessorSubjectList />} /> {/* 내 강의 목록 */}
							<Route path="/subject/list" element={<AllsubList />} /> {/* 수업 - 전체 강의 조회 */}
							<Route path="/professor/evaluation" element={<MyEvaluation />} /> {/* 내 강의 평가 */}
							{/* 교수 - 학생 관리 */}
							<Route path="/professor/counseling/reserve" element={<MyCounseling />} /> {/* 내 상담 일정 보기 */}
							<Route path="/professor/counseling/pre" element={<PreCounselingRequest />} />{' '}
							{/* 내 예비 상담 일정 요청 보기 */}
							<Route path="/professor/counseling/schedule" element={<WeeklyCounselingScheduleForm />} />
							{/* 상담 일정 열어주기 */}
							<Route path="/professor/risk" element={<MyRiskStudent />} /> {/* 내 담당 과목 위험학생 보기 */}
							{/* 학생 - 성적 */}
							<Route path="/grade/current" element={<ThisGrade />} /> {/* 이번 학기 성적*/}
							<Route path="/grade/semester" element={<Semester />} /> {/* 학기별 성적 조회*/}
							<Route path="/grade/total" element={<TotalGrade />} /> {/* 누계 성적 조회*/}
							{/* 학생 - 학생 지원 (상담)*/}
							<Route path="/status" element={<MyStatus />} /> {/* 내 학업 상태 조회 (위험여부) */}
							<Route path="/counseling/schedule" element={<MyCounselingSchedule />} /> {/* 내 상담 일정 조회 */}
							<Route path="/counseling/reserve" element={<CounselingReserve />} />
							{/* 상담 신청, 들어온 요청 조회 */}
							<Route path="/counseling/reqAndRes" element={<CounselingRequestList />} />{' '}
							{/* 상담 예약 (교수가 열어둔 상담만 가능) */}
							{/* 상담 폼 (임시)*/}
							<Route path="/counseling" element={<CounselingEntry />} /> {/* 상담 폼 */}
							<Route path="/videotest" element={<VideoCounseling />} /> {/* 화상 상담 페이지 */}
						</Route>
						{/* 화상 비디오 */}
						{/* <Route path="/videotest" element={<VideoRoomTest />} /> */}
						{/* 팝업들 */}
						<Route path="/professor/syllabus/:subjectId" element={<ReadSyllabusPopup />} /> {/* 강의계획서 조회 팝업 */}
						<Route path="/counseling/info" element={<CounselingInfo />} />
						<Route path="/evaluation" element={<Evaluation />} /> {/* 학생 강의 평가 팝업 */}
						<Route path="/findAccount/:type" element={<FindAccountPop />} /> {/* 아이디/ 비밀번호 찾기 (비로그인) */}
						{/* 잘못된 경로 → 로그인 페이지로 */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</UserProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
