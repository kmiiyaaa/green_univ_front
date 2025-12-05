// pages/AdminPage.jsx
import Subject2 from './Subject';
import Room2 from './Room';

function AdminPage() {
	return (
		<main>
			<h1>통합 관리 페이지</h1>

			<div className="admin-grid" style={{ display: 'flex', gap: '20px' }}>
				{/* 왼쪽엔 강의 등록 */}
				<section style={{ flex: 1, border: '1px solid #ddd', padding: '20px' }}>
					<Subject2 />
				</section>

				{/* 오른쪽엔 강의실 등록 */}
				<section style={{ flex: 1, border: '1px solid #ddd', padding: '20px' }}>
					<Room2 />
				</section>
			</div>
		</main>
	);
}
export default AdminPage;
