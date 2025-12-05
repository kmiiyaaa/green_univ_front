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

// 현재 URL 기준으로 어떤 상단 메뉴인지 찾기
function getCurrentTopMenuKey(topMenus, pathname) {
	const candidates = topMenus.filter((m) => m.path !== '/').sort((a, b) => b.path.length - a.path.length);

	const found = candidates.find((m) => pathname.startsWith(m.path));
	return found ? found.key : 'HOME';
}

export default function Header() {
	const location = useLocation();
	const { user, userRole } = useContext(UserContext); // userRole: 'student' | 'staff' | 'professor'

	const role = userRole || 'student';
	const menus = HEADER_CONFIG[role] || HEADER_CONFIG.student;
	const currentTopKey = getCurrentTopMenuKey(menus, location.pathname);

	return (
		<>
			{/* ===== 위쪽 로그인 정보 바 ===== */}
			<div className="top-userbar">
				<div className="top-userbar-inner">
					{user && (
						<ul className="top-userbar-list">
							<li className="material--li">
								<span className="material-symbols-outlined">account_circle</span>
							</li>
							<li>
								{user.name}님 ({user.id})
							</li>
							<li className="divider">|</li>
							<li className="material--li">
								<span className="material-symbols-outlined">logout</span>
							</li>
							<li>
								<a href="/logout" className="logout-link">
									로그아웃
								</a>
							</li>
						</ul>
					)}
				</div>
			</div>

			{/* ===== 아래 흰색 헤더 영역 ===== */}
			<header className="header-wrapper">
				<div className="header-inner">
					{/* 로고 */}
					<NavLink to="/" className="logo-area">
						<img src={greenLogo} className="logo-image" />
					</NavLink>
					{/* 상단 메뉴 */}
					<nav className="top-nav">
						{menus.map((menu) => (
							<NavLink
								key={menu.key}
								to={menu.path}
								className={({ isActive }) =>
									['top-nav-item', currentTopKey === menu.key || isActive ? 'active' : ''].join(' ')
								}
							>
								{menu.label}
							</NavLink>
						))}
					</nav>
				</div>
			</header>
		</>
	);
}
