import DataTable from '../components/table/DataTable';

function Index() {
	const headers1 = ['공지사항', '글쓴이'];
	const notice = [
		{ 공지사항: '공지사항1', 글쓴이: '김공지' },
		{ 공지사항: '공지사항2', 글쓴이: '김공지' },
	];

	const headers2 = ['학사일정', '글쓴이'];
	const schedule = [
		{ 학사일정: '학사일정1', 글쓴이: '김학사' },
		{ 학사일정: '학사일정2', 글쓴이: '김공지' },
	];

	const headers3 = ['학기', '소속', '이메일'];
	const info = [
		{ 학기: '1-1', 소속: '공과대학', 이메일: 'aaa@aaa.com' },
		{ 학기: '2-2', 소속: '사범대학', 이메일: 'bbb@aaa.com' },
	];

	return (
		<div className="d-flex justify-content-center align-items-start">
			<div>
				<img src="/images/main_photo.jpg" className="main--page--img" alt="학교 이미지" />
				<div className="d-flex justify-content-center align-items-start">
					<div className="main--page--div">
						<div className="d-flex">
							<div className="main--page--notice">
								<h3>
									<a href="/notice">공지사항</a>
								</h3>
								<div className="main--page--split"></div>
								{/* 공지사항 테이블 */}
								<DataTable
									headers={headers1}
									data={notice}
									onRowClick={(row) => {
										// row에는 위에서 가공한 한글 키들이 들어있음
										console.log('클릭한 강의실:', row.강의실);
										// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
									}}
								/>
							</div>
							<div className="main--page--calander">
								<h3>
									<a href="/schedule">학사일정</a>
								</h3>
								<div className="main--page--split"></div>
								{/* 학사일정 테이블 */}
								<DataTable
									headers={headers2}
									data={schedule}
									onRowClick={(row) => {
										// row에는 위에서 가공한 한글 키들이 들어있음
										console.log('클릭한 강의실:', row.강의실);
										// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
									}}
								/>
							</div>
						</div>
					</div>
					<div>
						{/* userRole에 따라 간단한 프로필 */}
						<div className="main--page--profile">
							<ul className="d-flex align-items-start">
								<li>
									<span className="material-symbols-rounded">person</span>
								</li>
								<li>사용자님, 환영합니다.</li>
							</ul>
							<hr />
							{/* 학생 테이블 */}
							<DataTable
								headers={headers3}
								data={info}
								onRowClick={(row) => {
									// row에는 위에서 가공한 한글 키들이 들어있음
									console.log('클릭한 강의실:', row.강의실);
									// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
								}}
							/>
							<div className="profile--button--div">
								<a href="/info/student">
									<button>마이페이지</button>
								</a>
								<a href="/logout">
									<button>로그아웃</button>
								</a>
							</div>

							<div className="profile--button--div">
								<a href="/info/staff">
									<button>마이페이지</button>
								</a>
								<a href="/logout">
									<button>로그아웃</button>
								</a>
							</div>

							<div className="profile--button--div">
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
						<div className="main--page--info">
							<ul className="d-flex align-items-start">
								<li>
									<span className="material-symbols-rounded">notifications_active</span>
								</li>
								<li>업무 알림</li>
							</ul>
							<p>
								<a href="/break/list/staff">처리되지 않은 휴학 신청이 존재합니다.</a>
							</p>
						</div>
						<div className="main--page--info">
							<ul className="d-flex align-items-start">
								<li>
									<span className="material-symbols-rounded">notifications</span>
								</li>
								<li>업무 알림</li>
							</ul>
							<p>처리해야 할 업무가 없습니다.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Index;
