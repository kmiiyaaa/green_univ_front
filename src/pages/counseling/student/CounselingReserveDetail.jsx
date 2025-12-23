import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import '../../../assets/css/CounselingReserveDetail.css';
import { useNavigate } from 'react-router-dom';

const DAY_KR = {
	MONDAY: '월',
	TUESDAY: '화',
	WEDNESDAY: '수',
	THURSDAY: '목',
	FRIDAY: '금',
	SATURDAY: '토',
	SUNDAY: '일',
};

export default function CounselingReserveDetail({ counselingSchedule, subId, subName, onReserveSuccess }) {
	const [selected, setSelected] = useState(null);
	const [reason, setReason] = useState('');
	const navigate = useNavigate();

	const professor = counselingSchedule[0]?.professor;

	// 날짜별 그룹핑
	const groupedByDate = useMemo(() => {
		return counselingSchedule.reduce((acc, cur) => {
			const date = cur.counselingDate;
			if (!acc[date]) acc[date] = [];
			acc[date].push(cur);
			return acc;
		}, {});
	}, [counselingSchedule]);

	const submit = async () => {
		if (!selected || !reason) return;

		try {
			await api.post('/reserve', {
				counselingScheduleId: selected.id,
				subjectId: subId,
				reason,
			});
			alert('상담 신청 완료');
			onReserveSuccess?.(); // 예약 목록 새로고침
			setSelected(null);
			setReason('');
		} catch (e) {
			alert(e?.response?.data?.message ?? '상담 신청 실패');
			setSelected(null);
		}
	};

	if (!Array.isArray(counselingSchedule) || counselingSchedule.length === 0) {
		return <div className="crd-empty">상담 가능 일정이 없습니다.</div>;
	}

	return (
		<div className="crd-wrap">
			<h2 className="crd-title"> [{subName}] 상담 예약</h2>

			{professor && (
				<div className="crd-prof-card">
					<div className="crd-prof-name">{professor.name}</div>
					<div className="crd-prof-dept">{professor.deptName}</div>
				</div>
			)}

			<div className="crd-section">
				<h4 className="crd-section-title">상담 시간 선택</h4>

				<div className="crd-date-row">
					{Object.entries(groupedByDate).map(([date, slots]) => (
						<div key={date} className="crd-date-col">
							<div className="crd-date-title">
								{date} ({DAY_KR[slots[0]?.dayOfWeek]})
							</div>

							<div className="crd-time-col">
								{slots.map((s) => (
									<button
										key={s.id}
										className={`crd-time-btn ${selected?.id === s.id ? 'crd-active' : ''}`}
										onClick={() => setSelected(s)}
									>
										{s.startTime}:00 ~ {s.endTime}:00
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="crd-section">
				<h4 className="crd-section-title">상담 사유</h4>
				<textarea
					className="crd-reason"
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					placeholder="상담 사유를 입력하세요"
				/>
			</div>

			<button className="crd-submit-btn" disabled={!selected || !reason} onClick={submit}>
				상담 신청
			</button>
		</div>
	);
}
