import { useEffect, useState } from 'react';
import { getMonday, getWeekDates } from '../../utils/DateTimeUtil';
import api from '../../api/httpClient';

const TIMES = [15, 16, 17, 18, 19]; // 가능한 시간 15시 ~ 19시까지만 (고정)

export default function WeeklyCounselingScheduleForm() {
	const [dates, setDates] = useState([]);
	const [initialSlots, setInitialSlots] = useState({}); // 최초 상태
	const [slots, setSlots] = useState({}); // 현재 상태

	/* 초기 로드 */
	useEffect(() => {
		const init = async () => {
			const monday = getMonday();
			const weekDates = getWeekDates(monday);
			setDates(weekDates);

			const res = await api.get('/counseling/professor', {
				params: { weekStartDate: weekDates[0] },
			});

			const initSlots = {};
			res.data.list.forEach(({ counselingDate, startTime }) => {
				if (!initSlots[counselingDate]) initSlots[counselingDate] = [];
				initSlots[counselingDate].push(startTime);
			});

			setInitialSlots(initSlots);
			setSlots(initSlots);
		};

		init();
	}, []);

	/* 체크 토글 */
	const toggleSlot = (date, time) => {
		setSlots((prev) => {
			const daySlots = prev[date] || [];
			const exists = daySlots.includes(time);

			return {
				...prev,
				[date]: exists ? daySlots.filter((t) => t !== time) : [...daySlots, time],
			};
		});
	};

	/* 삭제 대상 계산 */
	const getDeletedSlots = () => {
		const deleted = [];

		for (const date in initialSlots) {
			for (const time of initialSlots[date]) {
				if (!slots[date]?.includes(time)) {
					deleted.push({ date, time });
				}
			}
		}
		return deleted;
	};

	/* 저장 */
	const handleSubmit = async () => {
		try {
			// 삭제 (체크 해제)
			const deletedSlots = getDeletedSlots();
			for (const item of deletedSlots) {
				await api.delete('/counseling/professor', {
					data: {
						counselingDate: item.date,
						startTime: item.time,
					},
				});
			}

			// 현재 상태 재등록
			await api.post('/counseling/professor', {
				weekStartDate: dates[0],
				slots,
				subYear: 2025,
				semester: 1,
			});

			alert('상담 일정이 저장되었습니다.');
			setInitialSlots(slots); // 기준 갱신
		} catch (e) {
			console.error(e);
			alert('상담 일정 저장 실패');
		}
	};

	if (!dates.length) return null;

	return (
		<div style={{ padding: 20 }}>
			<h2>주간 상담 일정 등록 / 수정</h2>

			<p style={{ fontWeight: 'bold' }}>
				{dates[0]} ~ {dates[4]}
			</p>

			<table border="1" cellPadding="8">
				<thead>
					<tr>
						<th>날짜</th>
						{TIMES.map((t) => (
							<th key={t}>
								{t}:00 ~ {t}:50
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dates.map((date) => (
						<tr key={date}>
							<td>{date}</td>
							{TIMES.map((t) => (
								<td key={t} style={{ textAlign: 'center' }}>
									<input
										type="checkbox"
										checked={slots[date]?.includes(t) || false}
										onChange={() => toggleSlot(date, t)}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<button style={{ marginTop: 20 }} onClick={handleSubmit}>
				상담 일정 저장
			</button>
		</div>
	);
}
