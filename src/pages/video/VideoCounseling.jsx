import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import '../../assets/css/VideoCounseling.css';

export default function VideoCounseling() {
	// 헤더 , 푸터 통일로 넣기위한 jsx 파일
	// 안붙이려면 이 파일은 없어도 됨

	const { user, name, userRole } = useContext(UserContext);
	const [searchParams] = useSearchParams();

	// ✅ sessionId 없어도 됨: roomCode로 메모 묶기
	const room = searchParams.get('room'); // 예: /videotest?room=1234

	const displayName = useMemo(() => {
		return name || user?.name || '';
	}, [user, name]);

	// 레거시 페이지로 닉네임 + room 넘기기
	const iframeSrc = useMemo(() => {
		const params = new URLSearchParams();
		params.set('display', displayName);
		if (room) params.set('room', room);
		return `/legacy-videoroom/videoroomtest.html?${params.toString()}`;
	}, [displayName, room]);

	// ============================================================
	// 공유 메모
	const [loading, setLoading] = useState(false);

	// 서버에 저장된 메모(교수/학생)
	const [professorNote, setProfessorNote] = useState('');
	const [studentNote, setStudentNote] = useState('');

	// 내가 지금 편집 중인 “임시 메모(draft)”는 서버 갱신으로 덮지 않기
	const [myDraft, setMyDraft] = useState('');
	const isEditingRef = useRef(false);

	// 내가 편집할 메모(내 역할)
	const myRole = (userRole || '').toLowerCase(); // 'professor' | 'student'
	const otherRole = myRole === 'professor' ? 'student' : 'professor';

	// 내/상대 메모 계산(표시용)
	const myServerNote = myRole === 'professor' ? professorNote : studentNote;
	const otherServerNote = myRole === 'professor' ? studentNote : professorNote;

	useEffect(() => {
		if (!room) return;

		// 최초 1회 로드
		loadNotes(true);

		// 10마다 자동 새로고침(폴링)
		const t = setInterval(() => {
			loadNotes(false); // 편집 중이면 내 draft는 안 덮고, 상대 메모만 최신화 느낌으로
		}, 10000);

		return () => clearInterval(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room, myRole]);

	const loadNotes = async (isFirstLoad) => {
		try {
			setLoading(true);

			// 컨트롤러가 roomCode로 받으니까 params 이름도 roomCode로!
			const res = await api.get(`/counsel/note`, { params: { roomCode: room } });

			const p = res.data?.professorNote ?? '';
			const s = res.data?.studentNote ?? '';

			setProfessorNote(p);
			setStudentNote(s);

			// - 첫 로드 때는 서버값으로 채우기
			// - 폴링 중에는 "내가 편집 중이면" 덮지 않기
			if (isFirstLoad) {
				setMyDraft(myRole === 'professor' ? p : s);
			} else {
				// 편집 중 아니면 서버값으로 동기화
				if (!isEditingRef.current) {
					setMyDraft(myRole === 'professor' ? p : s);
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const saveMyNote = async () => {
		if (!room) return;

		try {
			// 컨트롤러가 PostMapping("/note") 이니까 POST로!
			// DTO가 content 받는 구조면 { content: myDraft } 로 보내면 됨
			await api.post(
				`/counsel/note`,
				{ content: myDraft },
				{ params: { roomCode: room } } // roomCode로 보내기
			);

			// 저장 후 최신화
			await loadNotes(true);

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

			<div className="video-counsel-layout">
				<div className="video-counsel-frameWrap">
					<iframe
						src={iframeSrc}
						title="그린 화상 상담실"
						className="video-counsel-iframe"
						allow="camera; microphone; autoplay; fullscreen"
					/>
				</div>

				<aside className="counsel-note-panel">
					<div className="panel-head">
						<div className="panel-title">상담 메모</div>
						<div className="panel-sub">
							{loading ? '불러오는 중...' : room ? `room: ${room}` : 'room 없음(저장 비활성)'}
						</div>
					</div>

					<div className="panel-body">
						<div className="note-card">
							<div className="note-card-head">
								<div className="note-card-title">내 메모 ({myRole || 'role 없음'})</div>
								<button className="note-btn" onClick={saveMyNote} disabled={!room}>
									저장
								</button>
							</div>

							<textarea
								className="note-textarea"
								value={myDraft}
								onChange={(e) => setMyDraft(e.target.value)}
								onFocus={() => {
									isEditingRef.current = true;
								}}
								onBlur={() => {
									isEditingRef.current = false;
								}}
								placeholder="상담 중 핵심 내용을 적어두세요. (저장 버튼으로 저장)"
								disabled={!room}
							/>
						</div>

						<div className="note-card">
							<div className="note-card-head">
								<div className="note-card-title">상대 메모 ({otherRole})</div>
								<button className="note-btn ghost" onClick={() => loadNotes(false)} disabled={!room}>
									새로고침
								</button>
							</div>

							<textarea
								className="note-textarea readOnly"
								value={otherServerNote}
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
