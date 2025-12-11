import React, { useContext } from 'react';
import '../../assets/css/Navigation.css';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { SIDEBAR_MENUS } from '../../utils/menuConfig';
import greenLogo from '../../assets/images/green-university-logo.png';
import { getActiveHeaderKey, getSidebarMenus } from '../../utils/menuConfig';

const normalizeRole = (role) => {
	if (!role) return 'student';
	const r = String(role).toLowerCase().trim();
	if (r.includes('student')) return 'student';
	if (r.includes('staff') || r.includes('admin')) return 'staff';
	if (r.includes('professor')) return 'professor';
	return r;
};

export default function Navigation() {
	const { userRole } = useContext(UserContext);
	const { pathname } = useLocation();

	const role = normalizeRole(userRole);

	const activeHeaderKey = getActiveHeaderKey(role, pathname);
	const sidebarItems = getSidebarMenus(role, activeHeaderKey);

	return (
		<aside className="sidebar">
			<nav className="sidebar-nav">
				{sidebarItems.map((item) => (
					<NavLink
						key={item.key}
						to={item.path}
						className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
					>
						{item.icon && <span className="material-symbols-rounded">{item.icon}</span>}
						<span className="sidebar-label">{item.label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
