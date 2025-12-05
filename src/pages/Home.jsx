import React from 'react';
import '../assets/css/Home.css';
import Login from './user/Login';

function Home() {
	return (
		<div className="portal-shell">
			<div className="portal-layout">
				{/* ================= 왼쪽 - 로그인 영역 ================= */}
				<section className="portal-left">
					<div className="portal-left-inner">
						<div className="portal-left-main">
							{/* 로고/타이틀 */}
							<header className="portal-logo-area">
								<div className="portal-logo-image-wrap">
									<img src="/green-university-logo.png" alt="GREEN UNIVERSITY" className="portal-logo-image" />
								</div>

								<div className="portal-logo-text">
									<span className="portal-logo-en">GREEN UNIVERSITY</span>
									<span className="portal-logo-ko">그린대학교 포털</span>
								</div>
							</header>

							{/* 로그인 컴포넌트 */}
							<main className="portal-login-wrapper">
								<Login />
							</main>
						</div>

						{/* 왼쪽 푸터 */}
						<footer className="portal-left-footer">
							<p>서울시 마포구 신촌로 176 그린대학교</p>
							<p>Copyright © GREEN UNIVERSITY. All Rights Reserved.</p>
						</footer>
					</div>
				</section>

				{/* ================= 오른쪽 - 포털 안내/공지 영역 ================= */}
				<section className="portal-right">
					<div className="portal-right-inner">
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
										<button className="panel-more-btn" type="button">
											더보기 +
										</button>
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
										<button className="panel-more-btn" type="button">
											더보기 +
										</button>
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
