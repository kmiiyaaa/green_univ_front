import React, { useContext } from 'react';
import '../../assets/css/Header.css';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { HEADER_MENUS } from '../../utils/menuConfig';
import greenLogo from '../../assets/green-university-logo.png';

// 현재 경로에 맞는 메뉴 찾기
function getCurrentTopMenuKey(menus, pathname) {
	const candidates = menus.filter((m) => m.path !== '/portal').sort((a, b) => b.path.length - a.path.length);
	const found = candidates.find((m) => pathname.startsWith(m.path));
	return found ? found.key : 'HOME';
}

export default function Header() {
	const location = useLocation();
	const { user, userRole } = useContext(UserContext);

	const role = userRole || 'student';
	const menus = HEADER_MENUS[role] || HEADER_MENUS.student;
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

			{/* ===== 2) 아래 흰색 헤더 (로고 + 탭 메뉴) ===== */}
			<header className="gu-header">
				<div className="gu-header-inner">
					{/* LEFT 로고 */}
					<NavLink to="/portal" className="gu-brand">
						<img src={greenLogo} alt="Green University" className="gu-brand-logo" />
						<div className="gu-brand-text">
							<span className="gu-brand-en">GREEN UNIVERSITY</span>
							<span className="gu-brand-ko">그린대학교 포털</span>
						</div>
					</NavLink>

					{/* CENTER 탭 메뉴 */}
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

					{/* RIGHT 우측 간단 표시 */}
					<div className="gu-user-mini">{user && <span className="gu-user-mini-text">{user.name}님</span>}</div>
				</div>
			</header>
		</>
	);
}
