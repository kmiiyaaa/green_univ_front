import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Chat.css';
import api from '../../api/httpClient';

import mascotFace from '../../assets/images/gu_mascot_face.png';
import mascotFull from '../../assets/images/mascot.png';

import ChatLauncher from './ChatLauncher';
import { QUICK_ACTIONS } from './ChatContent';
import ChatContentList from './ChatContentList';
import ChatPopup from './ChatPopup';

import { UserContext } from '../../context/UserContext'; // 권한 가져오기

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Chat({ variant = 'mono' }) {
	const { userRole } = useContext(UserContext); //  'student' | 'professor' | 'staff'
	const role = userRole ?? 'guest';

	const [open, setOpen] = useState(false);
	const [showNotice, setShowNotice] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	const listRef = useRef(null);
	const navigate = useNavigate();

	// 권한별 퀵액션만 노출
	const quickActions = useMemo(() => {
		return QUICK_ACTIONS.filter((a) => !a.roles || a.roles.includes(role));
	}, [role]);

	// ✅ 이동 가능한 경로 allowlist
	// - (기존) 프론트에서 allowlist로 막았는데, 중복/복잡해져서 제거
	// - (현재) 백엔드가 내려준 링크는 이동 시도하고, 최종 권한 체크는 ProtectedRoute가 담당

	/**
	 * ✅ [토큰/문구] -> (표시 라벨 + 이동 경로) 중앙 매핑
	 * - 백엔드에서 [USER_INFO] 같은 토큰을 내려도 프론트에서 "My > ..." 로 치환 + 링크 버튼 자동 생성
	 * - 여기만 늘려가면 됨 (백엔드/핸들러에 links 추가할 필요 없음)
	 *
	 * ⚠️ href는 너 프로젝트 실제 라우트에 맞게 한 번만 맞춰주면 끝!
	 */
	const AUTO_LINK_MAP = useMemo(
		() => ({
			// 토큰 기반
			'[USER_INFO]': { label: 'My > 내정보 조회', href: '/my/info' },
			'[USER_PW]': { label: 'My > 비밀번호 변경', href: '/my/password' },

			// 문구 기반(백엔드가 토큰 없이 문구를 바로 내려주는 경우 대비)
			'My > 내정보 조회': { label: 'My > 내정보 조회', href: '/my/info' },
			'My > 비밀번호 변경': { label: 'My > 비밀번호 변경', href: '/my/password' },
		}),
		[]
	);

	// ✅ 텍스트 안의 토큰을 "My > ..." 로 치환해서 화면에 토큰이 안 보이게
	const replaceTokensToLabels = (text) => {
		if (!text) return text;

		let out = String(text);
		Object.entries(AUTO_LINK_MAP).forEach(([k, v]) => {
			// 토큰([USER_INFO])은 라벨로 치환, 문구는 그대로라 영향 없음
			if (k.startsWith('[') && k.endsWith(']')) {
				out = out.split(k).join(v.label);
			}
		});
		return out;
	};

	// ✅ 텍스트에서 자동 링크 후보 추출 (중복 제거)
	const extractAutoLinks = (text) => {
		const t = String(text ?? '');
		const found = [];

		// 1) 키(토큰/문구)가 포함되면 링크 후보 추가
		Object.entries(AUTO_LINK_MAP).forEach(([k, v]) => {
			if (t.includes(k)) {
				found.push({ label: v.label, href: v.href });
			}
		});

		// 2) 중복 제거 (href 기준)
		const uniq = [];
		const seen = new Set();
		for (const l of found) {
			if (!l?.href) continue;
			if (seen.has(l.href)) continue;
			seen.add(l.href);
			uniq.push(l);
		}
		return uniq;
	};

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

	const toggleOpen = () => {
		setOpen((prev) => {
			const next = !prev;
			setShowNotice(next);
			return next;
		});
	};

	const acceptNotice = () => {
		localStorage.setItem('AI_GU_NOTICE_SEEN', '1');
		setShowNotice(false);
	};

	useEffect(() => {
		if (!open) return;
		if (messages.length === 0) setMessages([welcome]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages, loading, open]);

	const pushBot = (text) => setMessages((p) => [...p, { id: uid(), role: 'bot', type: 'text', text }]);
	const pushLinks = (links) => setMessages((p) => [...p, { id: uid(), role: 'bot', type: 'links', links }]);

	// 공통 normalize: source(quick/ai) 붙여서 나중에 클릭 정책 분기
	const normalizeLinks = (rawLinks, source) => {
		return (rawLinks ?? [])
			.map((l) => {
				const to = l?.path ?? l?.href ?? l?.url ?? l?.to ?? null;
				const label = l?.label ?? l?.title ?? l?.name ?? '바로가기';
				if (!to) return null;
				return { label, path: to, href: to, source };
			})
			.filter(Boolean);
	};

	const handleQuick = (a) => {
		pushBot(a.reply);
		const normalized = normalizeLinks(a.links, 'quick');
		if (normalized.length > 0) pushLinks(normalized);
	};

	// 내부 경로(/로 시작)만 취급
	// AI가 준 링크는 confirm(사용자 확인) 후 이동
	const openLink = (href, source = 'quick') => {
		if (!href || typeof href !== 'string') return;

		// 내부 라우트만 허용
		if (!href.startsWith('/')) {
			pushBot('외부 링크는 챗봇에서 바로 열 수 없어요.');
			return;
		}

		// AI가 준 링크는 확인 거치기
		if (source === 'ai') {
			const ok = window.confirm('해당 페이지로 이동할까요?');
			if (!ok) return;
		}

		// 권한 체크는 라우터(ProtectedRoute)가 담당
		navigate(href);
	};

	const send = async () => {
		const text = input.trim();
		if (!text || loading) return;

		setMessages((p) => [...p, { id: uid(), role: 'user', type: 'text', text }]);
		setInput('');
		setLoading(true);

		try {
			// role 같이 보내면 백엔드도 권한별 답변/링크 제한하기 좋음
			const res = await api.post('/ai/chat', { message: text, userRole: role });
			const data = res.data;

			const answer = data?.answer ?? '답변을 생성하지 못했어요. 다시 시도해 주세요.';
			const refs = Array.isArray(data?.references) ? data.references : [];
			const refText = refs.length ? `\n\n📌 참고 경로\n- ${refs.join('\n- ')}` : '';

			// 화면 텍스트에서 토큰을 "My > ..." 로 치환
			const displayText = replaceTokensToLabels(answer + refText);
			pushBot(displayText);

			// 백엔드 links가 있으면 그대로 버튼 렌더
			if (Array.isArray(data?.links) && data.links.length > 0) {
				const normalized = normalizeLinks(data.links, 'ai');
				if (normalized.length > 0) pushLinks(normalized);
			} else {
				// 백엔드 links가 없더라도, 텍스트에 토큰/문구가 포함되면 자동 버튼 생성
				const auto = extractAutoLinks(answer + refText);
				if (auto.length > 0) {
					const normalized = normalizeLinks(auto, 'ai');
					if (normalized.length > 0) pushLinks(normalized);
				}
			}
		} catch (e) {
			console.error(e);
			pushBot('지금은 응답이 어려워요 😥 잠시 후 다시 시도해 주세요.');
		} finally {
			setLoading(false);
		}
	};

	const onKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	};

	return (
		<div className={`gu-cb ${variant}`}>
			<ChatLauncher onClick={toggleOpen} faceSrc={mascotFace} />

			{open && (
				<div className="gu-cb__panelWrap">
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
								<button className="gu-cb__iconBtn" onClick={() => setMessages([welcome])} title="초기화">
									↺
								</button>
								<button className="gu-cb__iconBtn" onClick={() => setOpen(false)} title="닫기">
									✕
								</button>
							</div>
						</div>

						<div className="gu-cb__body" ref={listRef}>
							<div className="gu-cb__quickGrid">
								{quickActions.map((a) => (
									<button key={a.key} className="gu-cb__quick" onClick={() => handleQuick(a)}>
										<div className="q1">{a.label}</div>
										<div className="q2">{a.desc}</div>
									</button>
								))}
							</div>

							<ChatContentList messages={messages} loading={loading} onOpenLink={openLink} />
						</div>

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
