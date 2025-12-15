import React from 'react';
import '../../assets/css/VideoCounseling.css';

export default function VideoCounseling() {
	return (
		<div className="video-counsel-page">
			<div className="video-counsel-head">
				<div>
					<div className="video-counsel-title">그린 상담실</div>
					<div className="video-counsel-sub">교수 · 학생 화상상담</div>
				</div>

				<a className="video-counsel-open" href="/legacy-videoroom/videoroomtest.html" target="_blank" rel="noreferrer">
					새 창으로 열기
				</a>
			</div>

			<div className="video-counsel-frameWrap">
				<iframe
					src="/legacy-videoroom/videoroomtest.html"
					title="그린 상담실"
					className="video-counsel-iframe"
					allow="camera; microphone; fullscreen; display-capture"
				/>
			</div>
		</div>
	);
}
