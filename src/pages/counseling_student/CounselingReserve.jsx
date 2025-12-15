import { useEffect, useState } from 'react';
import '../../assets/css/CounselingReserve.css';
import api from '../../api/httpClient';

export default function CounselingReserve() {
	const [selectedSlot, setSelectedSlot] = useState(null);

	const schedules = {
		'2025-12-15': [15, 17],
		'2025-12-16': [16],
		'2025-12-17': [],
	};

		// 초기 화면
	useEffect(() => {
		const fetchInit = async () => {
			try {
				const res = await api.get('/grade/semester');
				const data = res.data;
				setYearList(data.yearList ?? []);
				setType('전체');
			} catch (e) {
				console.error(e);
				setYearList([]);
			} finally {
				setLoading(false);
			}
		};

		fetchInit();
	}, []);


	return (
		<div className="reserve-wrap">
			<h2>상담 예약</h2>

			{/* 과목 선택 */}
			<div className="section">
				<label>수강 과목</label>
				<select>
					<option>과목 선택</option>
					<option>자료구조 (김교수)</option>
					<option>운영체제 (이교수)</option>
				</select>
			</div>

			{/* 교수 정보 */}
			<div className="section professor-card">
				<p>
					<strong>교수명</strong> 김OO
				</p>
				<p>
					<strong>학과</strong> 컴퓨터공학과
				</p>
				<p>
					<strong>이메일</strong> kim@univ.ac.kr
				</p>
			</div>

			{/* 상담 가능 시간 */}
			<div className="section">
				<label>상담 가능 시간</label>

				{Object.keys(schedules).map((date) => (
					<div key={date} className="date-block">
						<p className="date">{date}</p>

						{schedules[date].length === 0 ? (
							<span className="no-slot">예약 불가</span>
						) : (
							<div className="slot-group">
								{schedules[date].map((t) => (
									<button
										key={t}
										className={selectedSlot?.date === date && selectedSlot?.time === t ? 'slot selected' : 'slot'}
										onClick={() => setSelectedSlot({ date, time: t })}
									>
										{t}:00 ~ {t}:50
									</button>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* 상담 사유 */}
			<div className="section">
				<label>상담 사유 (선택)</label>
				<textarea placeholder="상담 사유를 입력하세요 (최대 200자)" />
			</div>

			{/* 예약 버튼 */}
			<button className="submit-btn" disabled={!selectedSlot}>
				상담 예약
			</button>
		</div>
	);
}
