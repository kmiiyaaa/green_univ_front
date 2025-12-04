import '../assets/css/Home.css';

function Home() {
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('로그인 시도');
	};

	return (
		<div className="portal-shell">
			<div className="portal-layout">
				{/* 왼쪽 - 로그인 영역 */}
				<section className="portal-left">
					<div className="portal-left-inner">
						{/* 로고 + 로그인 묶음 */}
						<div className="portal-left-main">
							{/* 로고 / 타이틀 */}
							<header className="portal-logo-area">
								{/* 로고 이미지 */}
								<div className="portal-logo-image-wrap">
									<img src="/green-university-logo.png" className="portal-logo-image" />
								</div>
								<div className="portal-logo-text">
									<span className="portal-logo-en">GREEN UNIVERSITY</span>
									<span className="portal-logo-ko">그린대학교 포털</span>
								</div>
							</header>

							{/* 로그인 카드 */}
							<main className="portal-login-wrapper">
								<div className="portal-login-card">
									<h2 className="portal-login-title">포털 로그인</h2>
									<form onSubmit={handleSubmit} className="portal-login-form">
										<div className="portal-input-group">
											<label htmlFor="loginId" className="portal-input-label">
												아이디
											</label>
											<input id="loginId" type="text" className="portal-input" placeholder="아이디를 입력하세요" />
										</div>

										<div className="portal-input-group">
											<label htmlFor="password" className="portal-input-label">
												비밀번호
											</label>
											<input
												id="password"
												type="password"
												className="portal-input"
												placeholder="비밀번호를 입력하세요"
											/>
										</div>

										<div className="portal-login-options">
											<label className="portal-checkbox-label">
												<input type="checkbox" className="portal-checkbox" />
												<span>ID 저장</span>
											</label>
										</div>

										<button type="submit" className="portal-login-button">
											LOGIN
										</button>

										<div className="portal-login-links">
											<button type="button" className="portal-link-button">
												ID 신청
											</button>
											<span className="portal-link-divider">·</span>
											<button type="button" className="portal-link-button">
												비밀번호 찾기
											</button>
											<span className="portal-link-divider">·</span>
											<button type="button" className="portal-link-button">
												OTP 인증메뉴얼
											</button>
										</div>
									</form>
								</div>
							</main>
						</div>

						{/* 왼쪽 푸터 */}
						<footer className="portal-left-footer">
							<p>서울시 OO구 OO로 120 그린대학교</p>
							<p>Copyright © GREEN UNIVERSITY. All Rights Reserved.</p>
						</footer>
					</div>
				</section>

				{/* 오른쪽 - GREEN PORTAL + 공지/학사일정 */}
				<section className="portal-right">
					<div className="portal-right-inner">
						{/* 헤더 + 패널 전체 묶음 */}
						<div className="portal-right-main">
							<header className="portal-right-header">
								<h1 className="portal-right-title">GREEN PORTAL</h1>
								<p className="portal-right-subtitle">진리와 자유를 향한 그린의 도전</p>
							</header>

							<div className="portal-right-panels">
								{/* 공지사항 */}
								<section className="portal-panel">
									<div className="portal-panel-header">
										<h2>공지사항</h2>
										<button className="panel-more-btn">더보기 +</button>
									</div>
									<ul className="portal-notice-list">
										<li>
											<span className="portal-notice-category">학사</span>
											<span className="portal-notice-title">2025-1학기 수강신청 안내</span>
											<span className="portal-notice-date">2025-02-01</span>
										</li>
										<li>
											<span className="portal-notice-category">전체</span>
											<span className="portal-notice-title">포털 시스템 점검 안내</span>
											<span className="portal-notice-date">2025-01-25</span>
										</li>
										<li>
											<span className="portal-notice-category">장학</span>
											<span className="portal-notice-title">2025-1학기 국가장학금 신청</span>
											<span className="portal-notice-date">2025-01-10</span>
										</li>
									</ul>
								</section>

								{/* 학사 일정 */}
								<section className="portal-panel">
									<div className="portal-panel-header">
										<h2>학사 일정</h2>
										<button className="panel-more-btn">더보기 +</button>
									</div>
									<ul className="portal-schedule-list">
										<li>
											<span className="portal-schedule-date">03.02 ~ 03.08</span>
											<span className="portal-schedule-title">2025-1학기 수강정정 기간</span>
										</li>
										<li>
											<span className="portal-schedule-date">03.10</span>
											<span className="portal-schedule-title">2025-1학기 개강</span>
										</li>
										<li>
											<span className="portal-schedule-date">04.22 ~ 04.26</span>
											<span className="portal-schedule-title">중간고사 기간</span>
										</li>
									</ul>
								</section>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Home;
