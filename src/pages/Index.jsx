function Index() {
	return (
		<body>
			<div class="d-flex justify-content-center align-items-start">
				<div>
					<img src="/images/main_photo.jpg" class="main--page--img" alt="학교 이미지" />
					<div class="d-flex justify-content-center align-items-start">
						<div class="main--page--div">
							<div class="d-flex">
								<div class="main--page--notice">
									<h3>
										<a href="/notice">공지사항</a>
									</h3>
									<div class="main--page--split"></div>
									{/* 공지사항 테이블 */}
									<table>
										<tr>
											<td>
												<a href="/notice/read?id=${notice.id}">제목</a>
											</td>
											<td>내용</td>
										</tr>
									</table>
								</div>
								<div class="main--page--calander">
									<h3>
										<a href="/schedule">학사일정</a>
									</h3>
									<div class="main--page--split"></div>
									{/* 학사일정 테이블 */}
									<table>
										<tr>
											<td>제목</td>
											<td>내용</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
						<div>
							{/* userRole에 따라 간단한 프로필 */}
							<div class="main--page--profile">
								<ul class="d-flex align-items-start">
									<li>
										<span class="material-symbols-rounded">person</span>
									</li>
									<li>사용자님, 환영합니다.</li>
								</ul>
								<hr />
								{/* 학생 */}
								<table>
									<tr>
										<td>이메일</td>
									</tr>
									<tr>
										<td>소속</td>
									</tr>
									<tr>
										<td>학기</td>
									</tr>
									<tr>
										<td>학적상태</td>
									</tr>
								</table>
								<div class="profile--button--div">
									<a href="/info/student">
										<button>마이페이지</button>
									</a>
									<a href="/logout">
										<button>로그아웃</button>
									</a>
								</div>
								{/* 직원 */}
								<table>
									<tr>
										<td>이메일</td>
									</tr>
									<tr>
										<td>소속</td>
										<td>교직원</td>
									</tr>
								</table>
								<div class="profile--button--div">
									<a href="/info/staff">
										<button>마이페이지</button>
									</a>
									<a href="/logout">
										<button>로그아웃</button>
									</a>
								</div>
								{/* 교수 */}
								<table>
									<tr>
										<td>이메일</td>
									</tr>
									<tr>
										<td>소속</td>
									</tr>
								</table>
								<div class="profile--button--div">
									<a href="/info/professor">
										<button>마이페이지</button>
									</a>
									<a href="/logout">
										<button>로그아웃</button>
									</a>
								</div>
							</div>
							<br />
							{/* 업무 알림 여부에 따른 메시지 */}
							<div class="main--page--info">
								<ul class="d-flex align-items-start">
									<li>
										<span class="material-symbols-rounded">notifications_active</span>
									</li>
									<li>업무 알림</li>
								</ul>
								<p>
									<a href="/break/list/staff">처리되지 않은 휴학 신청이 존재합니다.</a>
								</p>
							</div>
							<div class="main--page--info">
								<ul class="d-flex align-items-start">
									<li>
										<span class="material-symbols-rounded">notifications</span>
									</li>
									<li>업무 알림</li>
								</ul>
								<p>처리해야 할 업무가 없습니다.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</body>
	);
}
export default Index;
