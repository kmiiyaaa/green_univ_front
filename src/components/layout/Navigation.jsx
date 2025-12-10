import React, { useContext } from 'react';
import '../../assets/css/Navigation.css';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { SIDEBAR_MENUS } from '../../utils/menuConfig';
import greenLogo from '../../assets/images/green-university-logo.png';

export default function Navigation() {
	const { user, userRole } = useContext(UserContext);

	const role = userRole || 'student';
	const sidebarItems = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.student;

	return (
		<aside className="sidebar">
			<nav className="sidebar-nav">
				{sidebarItems.map((item) => (
					<NavLink
						key={item.key}
						to={item.path}
						className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
					>
						{/* Material Icon 사용 예시 */}
						{item.icon && <span className="material-symbols-rounded">{item.icon}</span>}
						<span className="sidebar-label">{item.label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
