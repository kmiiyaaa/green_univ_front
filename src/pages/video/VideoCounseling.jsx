import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import '../../assets/css/VideoCounseling.css';

export default function VideoCounseling() {
	const { user, name, userRole } = useContext(UserContext);
	const [searchParams] = useSearchParams();

	// 상담 세션 키(추천: 예약 PK = sessionId)
	const sessionId = searchParams.get('sessionId'); // 예: /video?sessionId=1
	const room = searchParams.get('room'); // 예: /video?room=1234 (원하면 iframe에도 넘김)

	const displayName = useMemo(() => {
		return name || user?.name || '';
	}, [user, name]);

	// 레거시 페이지로 닉네임(및 방번호) 넘기기
	const iframeSrc = useMemo(() => {
		const params = new URLSearchParams();
		params.set('display', displayName);
		if (room) params.set('room', room);
		return `/legacy-videoroom/videoroomtest.html?${params.toString()}`;
	}, [displayName, room]);

	// 상담시 메모 상태
	const [loading, setLoading] = useState(false);
	const [professorNote, setProfessorNote] = useState('');
	const [studentNote, setStudentNote] = useState('');

	// 내가 편집할 메모(내 역할)
	const myRole = (userRole || '').toLowerCase(); // 'professor' | 'student'
	const myNote = myRole === 'professor' ? professorNote : studentNote;
	const setMyNote = myRole === 'professor' ? setProfessorNote : setStudentNote;

	// 초기 로드
	useEffect(() => {
		if (!sessionId) return; // sessionId 없으면 저장 기능 비활성화 가능
		loadNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionId]);

	const loadNotes = async () => {
		try {
			setLoading(true);
			const res = await api.get(`/counsel/session/${sessionId}/notes`);
			setProfessorNote(res.data.professorNote || '');
			setStudentNote(res.data.studentNote || '');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	// 내 메모 저장
	const saveMyNote = async () => {
		if (!sessionId) return;
		try {
			await api.put(`/counsel/session/${sessionId}/notes`, { content: myNote });
			// 저장 후 상대 메모/체크 최신화(선택)
			await loadNotes();
			alert('메모 저장 완료!');
		} catch (e) {
			console.error(e);
			alert('메모 저장 실패');
		}
	};

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

			{/* 상단: 영상 / 하단: 메모(또는 우측 패널) */}
			<div className="video-counsel-layout">
				<div className="video-counsel-frameWrap">
					<iframe
						src={iframeSrc}
						title="그린 화상 상담실"
						className="video-counsel-iframe"
						allow="camera; microphone; autoplay; fullscreen"
					/>
				</div>

				{/* 메모/체크리스트 패널 */}
				<aside className="counsel-note-panel">
					<div className="panel-head">
						<div className="panel-title">상담 메모</div>
						<div className="panel-sub">
							{loading ? '불러오는 중...' : sessionId ? `sessionId: ${sessionId}` : 'sessionId 없음(저장 비활성)'}
						</div>
					</div>

					<div className="panel-body">
						{/* 내 메모 */}
						<div className="note-card">
							<div className="note-card-head">
								<div className="note-card-title">내 메모 ({myRole || 'role 없음'})</div>
								<button className="note-btn" onClick={saveMyNote} disabled={!sessionId}>
									저장
								</button>
							</div>
							<textarea
								className="note-textarea"
								value={myNote}
								onChange={(e) => setMyNote(e.target.value)}
								placeholder="상담 중 핵심 내용을 적어두세요. (저장 버튼으로 저장)"
								disabled={!sessionId}
							/>
						</div>

						{/* 상대 메모(읽기 전용) */}
						<div className="note-card">
							<div className="note-card-head">
								<div className="note-card-title">상대 메모 ({myRole === 'professor' ? 'student' : 'professor'})</div>
								<button className="note-btn ghost" onClick={loadNotes} disabled={!sessionId}>
									새로고침
								</button>
							</div>

							<textarea
								className="note-textarea readOnly"
								value={myRole === 'professor' ? studentNote : professorNote}
								readOnly
								placeholder="상대가 저장한 메모가 여기에 표시됩니다."
							/>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
