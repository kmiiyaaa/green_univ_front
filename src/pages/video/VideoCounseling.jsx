import React, { useContext, useMemo } from 'react';
import { UserContext } from '../../context/UserContext';
import '../../assets/css/VideoCounseling.css';

export default function VideoCounseling() {
	// 헤더 , 푸터 통일로 넣기위한 jsx 파일
	// 안붙이려면 이 파일은 없어도 됨

	const { user, name } = useContext(UserContext);

	const displayName = useMemo(() => {
		return name || user.name || '';
	}, [user, name]);

	// 레거시 페이지로 닉네임 넘기기
	const iframeSrc = useMemo(() => {
		const params = new URLSearchParams();
		params.set('display', displayName);
		return `/legacy-videoroom/videoroomtest.html?${params.toString()}`;
	}, [displayName]);

	return (
		<div className="video-counsel-page">
			<div className="video-counsel-head">
				<div>
					<div className="video-counsel-title">그린 대학교 화상 상담 서비스</div>
					<div className="video-counsel-sub">교수 · 학생 화상상담</div>
				</div>

				<a className="video-counsel-open" href={iframeSrc} target="_blank" rel="noreferrer">
					새 창으로 열기
				</a>
			</div>

			<div className="video-counsel-frameWrap">
				<iframe
					src={iframeSrc}
					title="그린 화상 상담실"
					className="video-counsel-iframe"
					allow="camera; microphone; autoplay; fullscreen"
				/>
			</div>
		</div>
	);
}
