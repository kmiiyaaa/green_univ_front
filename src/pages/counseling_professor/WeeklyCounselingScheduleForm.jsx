import { useEffect, useState } from 'react';
import { getMonday, getWeekDates } from '../../utils/DateTimeUtil';

const TIMES = [15, 16, 17, 18, 19];

export default function WeeklyCounselingScheduleForm() {
	const [dates, setDates] = useState([]);
	const [slots, setSlots] = useState({});

	useEffect(() => {
		const monday = getMonday();
		setDates(getWeekDates(monday));
		setSlots({});
	}, []);

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

	const handleSubmit = () => {
		console.log({
			weekStartDate: dates[0],
			slots,
			subYear: 2025,
			semester: 1,
		});
	};

	if (!dates.length) return null;

	return (
		<div style={{ padding: 20 }}>
			<h2>주간 상담 일정 등록</h2>

			<p style={{ fontWeight: 'bold', marginBottom: 12 }}>
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
				상담 일정 등록
			</button>
		</div>
	);
}
