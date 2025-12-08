import React, { useContext } from 'react';
import '../../../assets/css/Header.css';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import greenLogo from '../../../assets/green-university-logo.png';

// 역할별 헤더 메뉴 설정
const HEADER_CONFIG = {
	student: [
		{ key: 'HOME', label: '홈', path: '/' },
		{ key: 'MY', label: 'MY', path: '/student/my' },
		{ key: 'COURSE', label: '수업', path: '/student/course' },
		{ key: 'ENROLL', label: '수강신청', path: '/student/enroll' },
		{ key: 'GRADE', label: '성적', path: '/student/grade' },
		{ key: 'INFO', label: '학사정보', path: '/student/info' },
	],
	staff: [
		{ key: 'HOME', label: '홈', path: '/' },
		{ key: 'MY', label: 'MY', path: '/staff/my' },
		{ key: 'MANAGE', label: '학사관리', path: '/staff/manage' },
		{ key: 'REGISTER', label: '등록', path: '/staff/register' },
		{ key: 'INFO', label: '학사정보', path: '/staff/info' },
	],
	professor: [
		{ key: 'HOME', label: '홈', path: '/' },
		{ key: 'MY', label: 'MY', path: '/prof/my' },
		{ key: 'SUBJECT', label: '수업', path: '/subject/list/1' },
		{ key: 'NOTICE', label: '학사정보', path: '/notice' },
	],
};

function getCurrentTopMenuKey(topMenus, pathname) {
	const candidates = topMenus.filter((m) => m.path !== '/').sort((a, b) => b.path.length - a.path.length);
	const found = candidates.find((m) => pathname.startsWith(m.path));
	return found ? found.key : 'HOME';
}

export default function Header() {
	const location = useLocation();
	const { user, userRole } = useContext(UserContext);

	const role = userRole || 'student';
	const menus = HEADER_CONFIG[role] || HEADER_CONFIG.student;
	const currentTopKey = getCurrentTopMenuKey(menus, location.pathname);

	return (
		<>
			{/* ===== 1) 맨윗줄 진한 사용자 바 ===== */}
			<div className="top-userbar">
				<div className="top-userbar-inner">
					{user ? (
						<div className="top-userbar-right">
							<span className="top-userbar-text">
								{user.name}님 ({user.id})
							</span>
							<span className="top-userbar-divider">|</span>
							<a href="/logout" className="top-userbar-link">
								로그아웃
							</a>
						</div>
					) : (
						<div className="top-userbar-right">
							<p>로그인 후 이용 가능</p>
						</div>
					)}
				</div>
			</div>

			{/* ===== 2) 아래 흰색 헤더 (현재 3영역 유지) ===== */}
			<header className="gu-header">
				<div className="gu-header-inner">
					{/* LEFT */}
					<NavLink to="/" className="gu-brand">
						<img src={greenLogo} alt="Green University" className="gu-brand-logo" />
						<div className="gu-brand-text">
							<span className="gu-brand-en">GREEN UNIVERSITY</span>
							<span className="gu-brand-ko">그린대학교 포털</span>
						</div>
					</NavLink>

					{/* CENTER */}
					<nav className="gu-nav">
						{menus.map((menu) => (
							<NavLink
								key={menu.key}
								to={menu.path}
								className={({ isActive }) =>
									['gu-nav-item', currentTopKey === menu.key || isActive ? 'active' : ''].join(' ')
								}
							>
								{menu.label}
							</NavLink>
						))}
					</nav>

					{/* RIGHT (아래쪽엔 간단 표시만 두고 싶으면 비워도 됨) */}
					<div className="gu-user-mini">{user && <span className="gu-user-mini-text">{user.name}님</span>}</div>
				</div>
			</header>
		</>
	);
}
