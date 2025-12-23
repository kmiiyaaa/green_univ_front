import { useEffect, useRef, useState } from 'react';
import api from '../../api/httpClient';

// 상담시간 타이머 컴포넌트 (미완성)

export default function EndTime({ roomCode }) {
	const [remainText, setRemainText] = useState('');
	const timerRef = useRef(null);

	useEffect(() => {
		if (!roomCode) return;

		const fetchEndTime = async () => {
			try {
				const res = await api.get('/reserve/timeCheck', {
					params: { roomCode },
				});
				const endAt = res.data.endAt;
				startTimer(endAt);
			} catch (e) {
				console.error(e.response.data.message);
			}
		};

		const startTimer = (endAt) => {
			if (timerRef.current) clearInterval(timerRef.current);

			timerRef.current = setInterval(() => {
				const now = Date.now();
				let remainSec = Math.floor((endAt - now) / 1000);
				if (remainSec < 0) remainSec = 0;

				const min = Math.floor(remainSec / 60);
				const sec = remainSec % 60;

				setRemainText(`${min}분 ${sec}초`);

				if (remainSec === 0) {
					clearInterval(timerRef.current);
				}
			}, 1000);
		};

		fetchEndTime();

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [roomCode]);

	return <div>{remainText}</div>;
}
