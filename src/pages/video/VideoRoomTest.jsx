import '../../assets/css/VideoRoom.css';

export default function VideoRoom() {
	return (
		<div className="video-room">
			{/* 상단 */}
			<header className="top-bar">
				<span>상담 중</span>
				<span>김교수 · 홍길동</span>
				<span className="timer">42:10</span>
			</header>

			{/* 영상 영역 */}
			<div className="video-area">
				<div className="video-box">
					<div className="label">교수</div>
					<div id="videoremote1" className="video"></div>
				</div>

				<div className="video-box">
					<div className="label">학생</div>
					<div id="videolocal" className="video"></div>
				</div>
			</div>

			{/* 하단 컨트롤 */}
			<footer className="control-bar">
				<button>🎤</button>
				<button>🎥</button>
				<button>💬</button>
				<button className="end">상담 종료</button>
			</footer>
		</div>
	);
}
