import { useEffect, useState } from 'react';
import { getMonday, getWeekDates } from '../../../utils/DateTimeUtil';
import api from '../../../api/httpClient';
import '../../../assets/css/WeeklyCounselingScheduleForm.css';

const TIMES = [15, 16, 17, 18, 19];

export default function WeeklyCounselingScheduleForm() {
	const [dates, setDates] = useState([]);
	const [initialSlots, setInitialSlots] = useState({});
	const [slots, setSlots] = useState({});

	// 지난 날짜 비활성
	const isDisabled = (date, time) => {
		const now = new Date();
		const slotTime = new Date(`${date}T${String(time).padStart(2, '0')}:00:00`);
		return slotTime <= now;
	};

	/* 초기 로드 : 이번 주 + 다음 주 */
	useEffect(() => {
		const init = async () => {
			const today = new Date();

			const thisMonday = getMonday(today);
			const nextMonday = getMonday(new Date(thisMonday.getTime() + 7 * 24 * 60 * 60 * 1000));

			const thisWeek = getWeekDates(thisMonday);
			const nextWeek = getWeekDates(nextMonday);

			const allDates = [...thisWeek, ...nextWeek];
			setDates(allDates);

			const res = await api.get('/counseling/professor', {
				params: { weekStartDate: thisWeek[0] },
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
		if (isDisabled(date, time)) return;

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
			const deletedSlots = getDeletedSlots();

			for (const item of deletedSlots) {
				await api.delete('/counseling/professor', {
					data: {
						counselingDate: item.date,
						startTime: item.time,
					},
				});
			}

			await api.post('/counseling/professor', {
				weekStartDate: dates[0], // 이번 주 월요일
				slots,
				subYear: 2025,
				semester: 1,
			});

			alert('상담 일정이 저장되었습니다.');
			setInitialSlots(slots);
		} catch (e) {
			console.error(e);
			alert(e.response?.data?.message ?? '상담 일정 저장 실패');
		}
	};

	if (!dates.length) return null;

	return (
		<div className="form-container">
			<h2 className="weekly-title">주간 상담 일정 관리</h2>

			<p className="weekly-range">
				{dates[0]} ~ {dates[dates.length - 1]}
			</p>

			<table className="weekly-table">
				<thead>
					<tr>
						<th>날짜</th>
						{TIMES.map((t) => (
							<th key={t}>{t}:00</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dates.map((date) => (
						<tr key={date}>
							<td className="weekly-date">{date}</td>
							{TIMES.map((t) => (
								<td key={t} className="weekly-slot">
									<input
										type="checkbox"
										className="weekly-checkbox"
										checked={slots[date]?.includes(t) || false}
										disabled={isDisabled(date, t)}
										onChange={() => toggleSlot(date, t)}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<button className="weekly-save-btn" onClick={handleSubmit}>
				상담 일정 저장
			</button>
		</div>
	);
}
