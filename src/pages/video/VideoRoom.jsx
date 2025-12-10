import React, { useEffect, useRef, useState } from 'react';
//import Janus from './janus'; // janus.js 라이브러리 파일 import 필요

const VideoRoom = () => {
	const [janus, setJanus] = useState(null);
	const [pluginHandle, setPluginHandle] = useState(null);
	const videoRef = useRef(null); // 내 비디오 태그

	useEffect(() => {
		// 1. Janus 초기화
		Janus.init({
			debug: 'all',
			callback: () => {
				// 2. Janus 서버 연결
				const janusInstance = new Janus({
					server: 'https://janus.jsflux.co.kr/janus', // 파일에 있던 서버 주소 [file:5]
					success: () => {
						// 3. VideoRoom 플러그인 연결 (Attach)
						janusInstance.attach({
							plugin: 'janus.plugin.videoroom',
							success: (handle) => {
								setPluginHandle(handle);
								// 4. 방 입장 (Join)
								const register = {
									request: 'join',
									room: 1234, // 방 번호 (조별로 다르게 설정 [file:4])
									ptype: 'publisher',
									display: '내닉네임',
								};
								handle.send({ message: register });
							},
							onmessage: (msg, jsep) => {
								const event = msg['videoroom'];
								if (event === 'joined') {
									// 방 입장 성공 시 내 영상 송출 시작
									publishOwnFeed(handle);
								}
								if (jsep) {
									// 서버 응답(SDP) 처리
									handle.handleRemoteJsep({ jsep: jsep });
								}
							},
							onlocalstream: (stream) => {
								// 내 화면 띄우기
								if (videoRef.current) videoRef.current.srcObject = stream;
							},
						});
					},
					error: (err) => console.error('Janus Error', err),
				});
				setJanus(janusInstance);
			},
		});
	}, []);

	const publishOwnFeed = (handle) => {
		handle.createOffer({
			media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },
			success: (jsep) => {
				const publish = { request: 'configure', audio: true, video: true };
				handle.send({ message: publish, jsep: jsep });
			},
			error: (err) => console.error('WebRTC Error', err),
		});
	};

	return (
		<div>
			<h2>화상 회의실</h2>
			<video ref={videoRef} autoPlay playsInline muted style={{ width: '400px' }} />
		</div>
	);
};

export default VideoRoom;
