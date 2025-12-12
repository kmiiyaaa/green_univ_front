import React, { useContext } from 'react';
import '../../assets/css/Header.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { HEADER_MENUS, getActiveHeaderKey } from '../../utils/menuConfig';
import greenLogo from '../../assets/images/green-university-logo.png';

// 역할 정규화
const normalizeRole = (role) => {
	if (!role) return 'student';
	const r = String(role).toLowerCase().trim();
	if (r.includes('student')) return 'student';
	if (r.includes('staff') || r.includes('admin')) return 'staff';
	if (r.includes('professor')) return 'professor';
	return r;
};

// 유저 표시용 안전 텍스트
const getUserIdText = (user) => {
	if (!user) return '';
	// 필드명이 다를 수 있어서 넓게 대응
	return user.username || user.userId || user.id || user.email || '';
};

export default function Header({ handleLogout }) {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, userRole, name } = useContext(UserContext);

	const role = normalizeRole(userRole);
	const menus = HEADER_MENUS[role] || HEADER_MENUS.student;

	// 현재 경로 기반으로 상단 탭 활성 키 결정
	// - menuConfig에서 헤더 match를 "해당 헤더의 사이드 path 목록"으로 구성
	const currentTopKey = getActiveHeaderKey(role, location.pathname);

	const userIdText = getUserIdText(user);

	return (
		<>
			{/*  윗줄 사용자 바 */}
			<div className="top-userbar">
				<div className="top-userbar-inner">
					{user ? (
						<div className="top-userbar-right">
							<span className="top-userbar-text">
								{(name ? name : '사용자') + '님' + (userIdText ? `(${userIdText})` : '')}
							</span>
							<span className="top-userbar-divider">|</span>
							<button onClick={handleLogout} className="top-userbar-link" type="button">
								로그아웃
							</button>
						</div>
					) : (
						<div className="top-userbar-right">
							<p>로그인 후 이용 가능</p>
							<button onClick={() => navigate('/')} type="button">
								로그인
							</button>
						</div>
					)}
				</div>
			</div>

			{/* ===== 아래 헤더 (로고 + 탭 메뉴) ===== */}
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
				</div>
			</header>
		</>
	);
}
