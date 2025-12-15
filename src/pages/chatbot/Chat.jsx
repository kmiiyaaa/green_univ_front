import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Chat.css';
import api from '../../api/httpClient';

import mascotFace from '../../assets/images/gu_mascot_face.png';
import mascotFull from '../../assets/images/mascot.png';

// 컴포넌트 분리
import ChatLauncher from './ChatLauncher';
import { QUICK_ACTIONS } from './ChatContent';
import ChatContentList from './ChatContentList';
import ChatPopup from './ChatPopup';

// 메시지 id 만들기용(간단 버전)
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Chat({ variant = 'mono' }) {
	const [open, setOpen] = useState(false); // 챗봇 패널 열림/닫힘
	const [showNotice, setShowNotice] = useState(false); // 유의사항 팝업(overlay) 표시 여부
	const [messages, setMessages] = useState([]); // 채팅 메시지 목록(봇/사용자)
	const [input, setInput] = useState(''); // 입력창 값
	const [loading, setLoading] = useState(false); // 답변 생성 중 표시

	const listRef = useRef(null); // 채팅 스크롤 영역 ref
	const navigate = useNavigate(); // 내부 라우팅 이동용

	// 웰컴 메세지
	const welcome = useMemo(
		() => ({
			id: uid(),
			role: 'bot',
			type: 'text',
			text:
				'안녕하세요! 그린대학교 AI 도우미예요 😊\n' +
				'아래 자주 찾는 메뉴를 누르면 바로 안내해드릴게요.\n' +
				'그 외 문의는 채팅으로 입력해 주세요!',
		}),
		[]
	);

	// 화면에서 런처 클릭
	// 채팅창 열기 + 동시에 팝업 overlay로 띄우기
	const handleLauncherClick = () => {
		const next = !open;
		setOpen(next);

		if (next) {
			// 개발용 항상 뜨게
			setShowNotice(true);

			// 한번만 뜨게(배포용)
			// const seen = localStorage.getItem('AI_GU_NOTICE_SEEN');
			// if (!seen) setShowNotice(true);
		} else {
			setShowNotice(false);
		}
	};

	// 팝업 확인 클릭
	const acceptNotice = () => {
		// 한번만 뜨게
		localStorage.setItem('AI_GU_NOTICE_SEEN', '1');

		// 팝업 닫기
		setShowNotice(false);
	};

	// 채팅 입장시 웰컴 메세지 세팅
	useEffect(() => {
		if (!open) return;
		if (messages.length === 0) setMessages([welcome]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// 메세지 변경시 자동 스크롤 아래로
	useEffect(() => {
		if (!open) return;
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages, loading, open]);

	// 메세지 추가 헬퍼들
	const pushBot = (text) => setMessages((p) => [...p, { id: uid(), role: 'bot', type: 'text', text }]);
	const pushLinks = (links) => setMessages((p) => [...p, { id: uid(), role: 'bot', type: 'links', links }]);

	// 퀵버튼 클릭
	// reply(안내 문구) + links(바로가기 버튼들) 메시지로 채팅에 쌓음
	const handleQuick = (a) => {
		pushBot(a.reply);

		// ✅ QUICK_ACTIONS도 path/href 키가 섞여있을 수 있어서 통일
		const normalized = (a.links ?? [])
			.map((l) => {
				const to = l?.path ?? l?.href ?? l?.url ?? l?.to ?? null;
				const label = l?.label ?? l?.title ?? l?.name ?? '바로가기';
				if (!to) return null;

				// ChatContentList가 path로 읽든 href로 읽든 안전하게 둘 다 제공
				return { label, path: to, href: to };
			})
			.filter(Boolean);

		if (normalized.length > 0) pushLinks(normalized);
	};

	// 링크 버튼 클릭시 이동
	const openLink = (href) => {
		if (!href) return;
		navigate(href);
	};

	// 메세지 전송 - 백엔드 ai 호출
	const send = async () => {
		const text = input.trim();
		if (!text || loading) return;

		// 사용자 메시지 추가
		setMessages((p) => [...p, { id: uid(), role: 'user', type: 'text', text }]);
		setInput('');
		setLoading(true);

		try {
			const res = await api.post('/ai/chat', { message: text });
			const data = res.data;

			// 봇 답변
			const answer = data?.answer ?? '답변을 생성하지 못했어요. 다시 시도해 주세요.';

			// ✅ references가 안 뜨는 이유: messages에 추가를 안 해서였음 → 답변 텍스트에 붙여서 무조건 표시
			const refs = Array.isArray(data?.references) ? data.references : [];
			const refText = refs.length ? `\n\n📌 참고 경로\n- ${refs.join('\n- ')}` : '';

			pushBot(answer + refText);

			// 링크 이동
			if (Array.isArray(data?.links) && data.links.length > 0) {
				// ✅ 백엔드가 {label, path}로 주든, 프론트가 href를 기대하든 둘 다 맞춰서 내려보냄
				const normalized = data.links
					.map((l) => {
						const to = l?.path ?? l?.href ?? l?.url ?? l?.to ?? null;
						const label = l?.label ?? l?.title ?? l?.name ?? '바로가기';
						if (!to) return null;

						return { label, path: to, href: to };
					})
					.filter(Boolean);

				if (normalized.length > 0) pushLinks(normalized);
			}
		} catch (e) {
			console.error(e);
			pushBot('지금은 응답이 어려워요 😥 잠시 후 다시 시도해 주세요.');
		} finally {
			setLoading(false);
		}
	};

	// enter 전송
	const onKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	};

	return (
		<div className={`gu-cb ${variant}`}>
			{/* 오른쪽 아래 런처(얼굴 + GU BOT 라벨) */}
			<ChatLauncher onClick={handleLauncherClick} faceSrc={mascotFace} />

			{/* 패널(챗봇) */}
			{open && (
				<div className="gu-cb__panelWrap">
					{/* overlay 팝업: 패널을 덮어쓰기 */}
					<ChatPopup open={showNotice} onClose={() => setShowNotice(false)} onAccept={acceptNotice} />

					<div className="gu-cb__panel" role="dialog" aria-label="chatbot panel">
						<div className="gu-cb__header">
							<div className="gu-cb__headerLeft">
								<img className="gu-cb__avatar" src={mascotFull} alt="mascot" />
								<div>
									<div className="gu-cb__title">Green University</div>
									<div className="gu-cb__subtitle">AI 도우미</div>
								</div>
							</div>

							<div className="gu-cb__headerRight">
								{/* 채팅 초기화(웰컴으로 리셋) */}
								<button className="gu-cb__iconBtn" onClick={() => setMessages([welcome])} title="초기화">
									↺
								</button>

								{/* 패널 닫기 */}
								<button className="gu-cb__iconBtn" onClick={() => setOpen(false)} title="닫기">
									✕
								</button>
							</div>
						</div>

						<div className="gu-cb__body" ref={listRef}>
							{/* 퀵버튼 영역 */}
							<div className="gu-cb__quickGrid">
								{QUICK_ACTIONS.map((a) => (
									<button key={a.key} className="gu-cb__quick" onClick={() => handleQuick(a)}>
										<div className="q1">{a.label}</div>
										<div className="q2">{a.desc}</div>
									</button>
								))}
							</div>

							{/* 메시지 출력(봇/유저 말풍선 + 링크 버튼들) */}
							<ChatContentList messages={messages} loading={loading} onOpenLink={openLink} />
						</div>

						{/* 입력창 */}
						<div className="gu-cb__inputBar">
							<textarea
								className="gu-cb__input"
								placeholder="질문을 입력하세요."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={onKeyDown}
								rows={1}
							/>
							<button className="gu-cb__send" onClick={send} disabled={loading || !input.trim()}>
								➤
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
