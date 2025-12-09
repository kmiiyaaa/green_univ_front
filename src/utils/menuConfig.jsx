// 역할별 상단 탭 메뉴 (Header에서 사용)
export const HEADER_MENUS = {
	student: [
		{ key: 'HOME', label: '홈', path: '/portal' },
		{ key: 'MY', label: 'MY', path: '/user/info' },
		{ key: 'COURSE', label: '수업', path: '/student/course' },
		{ key: 'ENROLL', label: '수강신청', path: '/student/enroll' },
		{ key: 'GRADE', label: '성적', path: '/student/grade' },
		{ key: 'INFO', label: '학사정보', path: '/notice' },
	],
	staff: [
		{ key: 'HOME', label: '홈', path: '/portal' },
		{ key: 'MY', label: 'MY', path: '/user/info' },
		{ key: 'MANAGE', label: '학사관리', path: '/staff/manage' },
		{ key: 'REGISTER', label: '등록', path: '/staff/register' },
		{ key: 'INFO', label: '학사정보', path: '/notice' },
	],
	professor: [
		{ key: 'HOME', label: '홈', path: '/portal' },
		{ key: 'MY', label: 'MY', path: '/user/info' },
		{ key: 'SUBJECT', label: '수업', path: '/subject/list' },
		{ key: 'NOTICE', label: '학사정보', path: '/notice' },
	],
};

// 역할별 사이드바 메뉴 (Navigation에서 사용)
// 필요하면 여기에 사이드바 메뉴도 추가 가능
export const SIDEBAR_MENUS = {
	student: [
		{ key: 'TUITION', label: '등록금', path: '/tuition', icon: 'tuition' },
		{ key: 'TUITIONPAYMENT', label: '등록금 고지서 확인', path: '/tuition/payment', icon: 'Payment' },
		{ key: 'USERINFO', label: '내 정보', path: '/user/info', icon: 'person' },
		{ key: 'UPDATEPASSWORD', label: '비밀번호 변경', path: '/user/update/password', icon: 'Password' },

		{ key: 'SUBJECTTIMETABLE', label: '강의 시간표 조회', path: '/user/info', icon: 'TIMETABLE' },
		{ key: 'PRESUBJECT', label: '예비 수강 신청', path: '/user/info', icon: 'PREAPP' },
		{ key: 'APPSUBJECT', label: '수강 신청', path: '/user/info', icon: 'APP' },
		{ key: 'SUGANGLIST', label: '수강 신청 내역 조회', path: '/user/info', icon: 'SUGANGLIST' },
	],
	staff: [
		{ key: 'ADMIN', label: '관리자', path: '/admin', icon: 'admin_panel_settings' },
		{ key: 'USERS', label: '사용자 관리', path: '/user/create/student', icon: 'group' },
		{ key: 'UPDATEPASSWORD', label: '비밀번호 변경', path: '/user/update/password', icon: 'Password' },
		{ key: 'CREATETUITION', label: '등록금 고지서 발송', path: '/tuition/bill', icon: 'CreateTuition' },
	],
	professor: [
		{ key: 'SUBJECTS', label: '강의 관리', path: '/subject/list', icon: 'menu_book' },
		{ key: 'ROOM', label: '강의실', path: '/admin/room', icon: 'meeting_room' },
		{ key: 'MYSUBJECT', label: '내 강의 조회', path: '/professor/subject', icon: 'my_subject' },
	],
};
