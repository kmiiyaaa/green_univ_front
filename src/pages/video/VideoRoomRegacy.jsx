export default function VideoRoomLegacy() {
	return (
		<div style={{ padding: 16 }}>
			<button id="start">Start</button>

			<div id="details"></div>

			<div id="videojoin" className="hide">
				<div id="registernow" className="hide">
					<input id="roomname" placeholder="room id (숫자)" />
					<input id="username" placeholder="nickname (영문/숫자)" />
					<button id="register">Register</button>

					<div>
						<span id="room"></span>
					</div>
					<div>
						<span id="you"></span>
					</div>
				</div>
			</div>

			<div id="videos" className="hide">
				<div id="publisher" className="hide"></div>

				<div id="videolocal" style={{ width: 480, height: 360, background: '#111' }} />

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i}>
							<div id={`remote${i}`} className="hide"></div>
							<div id={`videoremote${i}`} style={{ width: 480, height: 360, background: '#111' }}></div>
						</div>
					))}
				</div>

				<div id="bitrate" className="hide">
					<button id="bitrateset">Bitrate</button>
				</div>
			</div>
		</div>
	);
}
