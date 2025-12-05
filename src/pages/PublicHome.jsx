// PublicHome 로그인 + 공지사항
import React from 'react';
import '../assets/css/Home.css';
// import '../assets/css/PortalLayout.css';
import Login from './user/Login';

function PublicHome() {
	return (
		<div className="public-shell">
			<div className="public-layout">
				{/* ================= 왼쪽 - 로그인 영역 ================= */}
				<section className="public-left">
					<div className="public-left-inner">
						<div className="public-left-main">
							{/* 로고/타이틀 */}
							<header className="public-logo-area">
								<div className="public-logo-image-wrap">
									<img src="/green-university-logo.png" alt="GREEN UNIVERSITY" className="public-logo-image" />
								</div>

								<div className="public-logo-text">
									<span className="public-logo-en">GREEN UNIVERSITY</span>
									<span className="public-logo-ko">그린대학교 포털</span>
								</div>
							</header>

							{/* 로그인 컴포넌트 */}
							<main className="public-login-wrapper">
								<Login />
							</main>
						</div>

						{/* 왼쪽 푸터 */}
						<footer className="public-left-footer">
							<p>서울시 마포구 신촌로 176 그린대학교</p>
							<p>Copyright © GREEN UNIVERSITY. All Rights Reserved.</p>
						</footer>
					</div>
				</section>

				{/* ================= 오른쪽 - 포털 안내/공지 영역 ================= */}
				<section className="public-right">
					<div className="public-right-inner">
						<div className="public-right-main">
							<header className="public-right-header">
								<h1 className="public-right-title">GREEN PORTAL</h1>
								<p className="public-right-subtitle">진리와 자유를 향한 그린의 도전</p>
							</header>

							<div className="public-right-panels">
								{/* 공지사항 */}
								<section className="public-panel">
									<div className="public-panel-header">
										<h2>공지사항</h2>
										<button className="panel-more-btn" type="button">
											더보기 +
										</button>
									</div>

									<ul className="public-notice-list">
										<li>
											<span className="public-notice-category">학사</span>
											<span className="public-notice-title">2025-1학기 수강신청 안내</span>
											<span className="public-notice-date">2025-02-01</span>
										</li>
										<li>
											<span className="public-notice-category">전체</span>
											<span className="public-notice-title">포털 시스템 점검 안내</span>
											<span className="public-notice-date">2025-01-25</span>
										</li>
										<li>
											<span className="public-notice-category">장학</span>
											<span className="public-notice-title">2025-1학기 국가장학금 신청</span>
											<span className="public-notice-date">2025-01-10</span>
										</li>
									</ul>
								</section>

								{/* 학사 일정 */}
								<section className="public-panel">
									<div className="public-panel-header">
										<h2>학사 일정</h2>
										<button className="panel-more-btn" type="button">
											더보기 +
										</button>
									</div>

									<ul className="public-schedule-list">
										<li>
											<span className="public-schedule-date">03.02 ~ 03.08</span>
											<span className="public-schedule-title">2025-1학기 수강정정 기간</span>
										</li>
										<li>
											<span className="public-schedule-date">03.10</span>
											<span className="public-schedule-title">2025-1학기 개강</span>
										</li>
										<li>
											<span className="public-schedule-date">04.22 ~ 04.26</span>
											<span className="public-schedule-title">중간고사 기간</span>
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

export default PublicHome;
