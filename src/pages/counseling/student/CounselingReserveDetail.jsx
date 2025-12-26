import { useContext, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import '../../../assets/css/CounselingReserveDetail.css';
import { CounselingRefreshContext } from '../counselingManage/util/CounselingRefreshContext';
import { endMinus10, formatDayOfWeek, toHHMM } from '../../../utils/DateTimeUtil';
import { isPastSlot } from '../../../utils/counselingUtil';

// 학생이 과목 선택해서 교수에게 상담 요청 보낼 때 뜨는 컴포넌트
export default function CounselingReserveDetail({ counselingSchedule, subId, subName, onReserveSuccess }) {
	const [selected, setSelected] = useState(null);
	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	// Provider 밖에서도 안 터지게 안전 처리
	const ctx = useContext(CounselingRefreshContext);
	const refresh = ctx?.refresh;

	// 예약된 슬롯/지난 슬롯 제외
	const visibleSchedule = useMemo(() => {
		const arr = Array.isArray(counselingSchedule) ? counselingSchedule : [];
		return arr.filter((s) => s?.reserved !== true).filter((s) => !isPastSlot(s?.counselingDate, s?.startTime));
	}, [counselingSchedule]);

	const professor = visibleSchedule[0]?.professor;

	// 날짜별 그룹핑
	const groupedByDate = useMemo(() => {
		return visibleSchedule.reduce((acc, cur) => {
			const date = cur.counselingDate;
			if (!acc[date]) acc[date] = [];
			acc[date].push(cur);
			return acc;
		}, {});
	}, [visibleSchedule]);

	const submit = async () => {
		if (!selected || !reason || loading) return;

		try {
			setLoading(true);

			await api.post('/reserve', {
				counselingScheduleId: selected.id,
				subjectId: subId,
				reason,
			});

			alert('상담 신청 완료');
			onReserveSuccess?.(); // 예약 목록 새로고침
			setSelected(null);
			setReason('');
			refresh?.(); // Provider 없어도 안전
		} catch (e) {
			alert(e?.response?.data?.message ?? '상담 신청 실패');
			setSelected(null);
		} finally {
			setLoading(false);
		}
	};

	if (!Array.isArray(counselingSchedule) || visibleSchedule.length === 0) {
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
							<div className="crd-date-title">{formatDayOfWeek(date, slots[0]?.dayOfWeek)}</div>

							<div className="crd-time-col">
								{slots
									.slice()
									.sort((a, b) => Number(a?.startTime ?? 0) - Number(b?.startTime ?? 0))
									.map((s) => {
										const start = toHHMM(Number(s?.startTime));
										const end =
											s?.endTime != null ? endMinus10(Number(s.endTime)) : endMinus10(Number(s?.startTime ?? 0) + 1);

										return (
											<button
												key={s.id}
												type="button"
												className={`crd-time-btn ${selected?.id === s.id ? 'crd-active' : ''}`}
												onClick={() => setSelected(s)}
											>
												{start} ~ {end}
											</button>
										);
									})}
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

			<button className="crd-submit-btn" disabled={!selected || !reason || loading} onClick={submit}>
				상담 신청
			</button>
		</div>
	);
}
