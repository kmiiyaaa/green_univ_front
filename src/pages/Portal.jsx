import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../api/httpClient';
import '../assets/css/Portal.css';

// 배너 이미지 데이터
const bannerImages = [
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
		text: '꿈을 향한 첫 걸음, 그린대학교',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
		text: '2024학년도 신입생 모집 요강',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1541339907198-e021fc9d13f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
		text: '글로벌 리더를 양성하는 교육의 산실',
	},
];

export default function Portal() {
	const { userRole, token, logout } = useContext(UserContext);
	const navigate = useNavigate();

	const [currentSlide, setCurrentSlide] = useState(0);
	const [miniUserInfo, setMiniUserInfo] = useState({});

	// 업무 알림용 상태 (Staff 전용)
	// 실제로는 API로 받아와야 하지만, 일단 1로 설정하여 UI 확인
	const [pendingCount, setPendingCount] = useState(1);

	// 공지사항 데이터
	const notices = [
		'[학사] 2024학년도 1학기 수강신청 안내',
		'[장학] 국가장학금 2차 신청 기간 안내',
		'[일반] 도서관 이용 시간 변경 안내',
		'[취업] 하반기 대기업 공채 대비 특강',
		'[행사] 개교 70주년 기념 행사 안내',
	];
	// 학사일정 데이터
	const calendars = [
		{ date: '05. 05', desc: '어린이날 (공휴일)' },
		{ date: '05. 15', desc: '개교기념일' },
		{ date: '05. 20', desc: '중간고사 성적 공시' },
		{ date: '05. 29', desc: '대동제 (축제) 시작' },
	];

	// 1. 배너 자동 슬라이드
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
		}, 4000);
		return () => clearInterval(timer);
	}, []);

	const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
	const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));

	// 2. 사용자 정보 불러오기
	useEffect(() => {
		if (!token) return;

		const loadMiniInfo = async () => {
			try {
				let url = '';
				if (userRole === 'student') url = '/personal/info/student';
				else if (userRole === 'staff') url = '/personal/info/staff';
				else if (userRole === 'professor') url = '/personal/info/professor';

				if (url) {
					const res = await api.get(url);
					// userRole 키값으로 데이터 추출 (예: res.data.student)
					setMiniUserInfo(res.data[userRole] || {});

					// (선택사항) 만약 Staff라면 처리할 업무 개수도 여기서 API로 가져오면 좋습니다.
					// if(userRole === 'staff') { const countRes = await api.get('/staff/work/count'); setPendingCount(countRes.data); }
				}
			} catch (e) {
				console.error('홈페이지 정보 로드 실패', e);
			}
		};
		loadMiniInfo();
	}, [userRole, token]);

	// 로그아웃 핸들러
	const handleLogout = () => {
		if (logout) logout();
		navigate('/');
	};

	return (
		<div className="home-container">
			{/* [Section 1] 상단 배너 */}
			<div className="banner-section">
				<button className="banner-btn prev" onClick={prevSlide}>
					&lt;
				</button>
				<div className="banner-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
					{bannerImages.map((banner) => (
						<div key={banner.id} className="banner-item">
							<img src={banner.src} alt="campus" />
							<h2 className="banner-text">{banner.text}</h2>
						</div>
					))}
				</div>
				<button className="banner-btn next" onClick={nextSlide}>
					&gt;
				</button>
			</div>

			{/* [Section 2] 하단 3분할 정보 */}
			<div className="bottom-section">
				{/* 2-1. 공지사항 */}
				<div className="section-card">
					<div className="section-title">공지사항</div>
					<ul className="notice-list">
						{notices.map((notice, idx) => (
							<li key={idx}>• {notice}</li>
						))}
					</ul>
				</div>

				{/* 2-2. 학사일정 */}
				<div className="section-card">
					<div className="section-title">5월 학사일정</div>
					<div className="calendar-list">
						{calendars.map((cal, idx) => (
							<div key={idx} className="cal-item">
								<span className="cal-date">{cal.date}</span>
								<span className="cal-desc">{cal.desc}</span>
							</div>
						))}
					</div>
				</div>

				{/* 2-3. 내 정보 (로그인 시) */}
				<div className="section-card">
					{token && miniUserInfo.name ? (
						<div className="my-info-card">
							{/* 상단: 환영 메시지 및 기본 정보 */}
							<div>
								<div className="welcome-msg">
									<span className="material-symbols-rounded user-icon"></span>
									👤{miniUserInfo.name}님, 환영합니다.
								</div>

								<div className="info-details">
									<div className="info-row">
										<span className="info-label">이메일</span>
										<span className="info-value">{miniUserInfo.email}</span>
									</div>
									<div className="info-row">
										<span className="info-label">소속</span>
										<span className="info-value">{miniUserInfo.deptName || miniUserInfo.major || '그린대학교'}</span>
									</div>

									{/* 학생일 경우 추가 정보 */}
									{userRole === 'student' && (
										<>
											<div className="info-row">
												<span className="info-label">학기</span>
												<span className="info-value">
													{miniUserInfo.grade}학년 {miniUserInfo.semester}학기
												</span>
											</div>
											<div className="info-row">
												<span className="info-label">학적</span>
												<span className="info-value">{miniUserInfo.status || '재학'}</span>
											</div>
										</>
									)}
								</div>

								{/* [Staff 전용] 업무 알림 영역 */}
								{userRole === 'staff' && (
									<>
										{pendingCount > 0 ? (
											<div className="main--page--info">
												<ul className="d-flex align-items-start">
													<li>
														<span className="material-symbols-rounded">notifications_active</span>
													</li>
													<li>업무 알림</li>
												</ul>
												<p>
													<a
														href="/break/list/staff"
														onClick={(e) => {
															e.preventDefault();
															navigate('/break/list/staff');
														}}
													>
														처리되지 않은 휴학 신청이 {pendingCount}건 존재합니다.
													</a>
												</p>
											</div>
										) : (
											<div className="main--page--info empty">
												<ul className="d-flex align-items-start">
													<li>
														<span className="material-symbols-rounded">notifications</span>
													</li>
													<li>업무 알림</li>
												</ul>
												<p>처리해야 할 업무가 없습니다.</p>
											</div>
										)}
									</>
								)}
							</div>

							{/* 하단: 버튼들 */}
							<div className="info-actions">
								<button className="action-btn" onClick={() => navigate('/user/info')}>
									마이페이지
								</button>
								<button className="action-btn logout" onClick={handleLogout}>
									로그아웃
								</button>
							</div>
						</div>
					) : (
						// 로그인 안 된 상태
						<div className="login-guide">
							<p style={{ marginBottom: '15px' }}>로그인이 필요한 서비스입니다.</p>
							<button
								className="action-btn"
								onClick={() => navigate('/login')}
								style={{ width: '100%', backgroundColor: 'var(--green-primary)' }}
							>
								로그인 하러가기
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
