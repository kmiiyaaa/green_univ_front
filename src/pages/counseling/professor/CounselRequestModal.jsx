import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import OptionForm from '../../../components/form/OptionForm';
import { getMonday, getWeekDates } from '../../../utils/DateTimeUtil';
import '../../../assets/css/ProfessorCounselRequestModal.css';

export default function ProfessorCounselRequestModal({ open, target, onClose, onSuccess }) {
	const [weekStartDate, setWeekStartDate] = useState(''); // ✅ 문자열(YYYY-MM-DD)
	const [slotList, setSlotList] = useState([]);
	const [selectedSlotId, setSelectedSlotId] = useState('');
	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	// 모달 열릴 때: 무조건 "YYYY-MM-DD"로 weekStartDate 세팅
	useEffect(() => {
		if (!open) return;

		const monday = getMonday();
		const wsd = getWeekDates(monday)[0]; //  weekDates[0] 방식으로 통일
		setWeekStartDate(wsd);

		setSelectedSlotId('');
		setReason('');
		loadSlots(wsd);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const loadSlots = async (wsd) => {
		try {
			setLoading(true);

			const res = await api.get('/counseling/professor', {
				params: { weekStartDate: wsd }, // 문자열
			});

			const list = res.data?.list ?? [];

			// 예약 안된 슬롯만
			const available = list.filter((s) => s.reserved === false);

			available.sort((a, b) => {
				const d = String(a.counselingDate).localeCompare(String(b.counselingDate));
				if (d !== 0) return d;
				return Number(a.startTime ?? 0) - Number(b.startTime ?? 0);
			});

			setSlotList(available);
		} catch (e) {
			console.error(e);
			alert(e?.response?.data?.message ?? '상담 슬롯을 불러오지 못했습니다.');
			setSlotList([]);
		} finally {
			setLoading(false);
		}
	};

	const slotOptions = useMemo(() => {
		const base = [{ value: '', label: loading ? '불러오는 중...' : '시간을 선택하세요' }];

		const opts = (slotList ?? []).map((s) => {
			const date = s.counselingDate ?? '';
			const start = s.startTime != null ? `${s.startTime}:00` : '';
			const end = s.endTime != null ? `${s.endTime}:50` : '';
			return {
				value: String(s.id),
				label: `${date}  ${start} ~ ${end}`,
			};
		});

		return [...base, ...opts];
	}, [slotList, loading]);

	const submit = async () => {
		if (!target) return;

		if (!selectedSlotId) {
			alert('상담 시간을 선택해 주세요.');
			return;
		}

		try {
			await api.post('/reserve/pre/professor', {
				studentId: target.studentId,
				subjectId: target.subjectId,
				counselingScheduleId: Number(selectedSlotId),
				reason: reason || '',
			});

			alert('상담 요청을 보냈습니다.');
			onSuccess?.();
			onClose?.();
		} catch (e) {
			console.error(e);
			alert(e?.response?.data?.message ?? '상담 요청 실패');
		}
	};

	if (!open) return null;

	return (
		<div className="pcm-backdrop" onClick={onClose}>
			<div className="pcm-modal" onClick={(e) => e.stopPropagation()}>
				<div className="pcm-head">
					<h3 className="pcm-title">상담 요청 보내기</h3>
					<button type="button" className="pcm-x" onClick={onClose} aria-label="닫기">
						×
					</button>
				</div>

				<div className="pcm-info">
					<div>
						<strong>학생</strong>: {target?.studentName} ({target?.studentId})
					</div>
					<div>
						<strong>과목</strong>: {target?.subjectName}
					</div>
				</div>

				<div className="pcm-row">
					<label className="pcm-label">상담 일자</label>
					<input
						className="pcm-date"
						type="date"
						value={weekStartDate}
						onChange={async (e) => {
							const v = e.target.value;
							setWeekStartDate(v);
							setSelectedSlotId('');
							await loadSlots(v);
						}}
					/>
					<button type="button" className="pcm-btn" onClick={() => loadSlots(weekStartDate)}>
						새로고침
					</button>
				</div>

				<div className="pcm-row">
					<OptionForm
						label="상담시간(이후 가능한시간도 나옴)"
						name="slot"
						value={selectedSlotId}
						onChange={(e) => setSelectedSlotId(e.target.value)}
						options={slotOptions}
					/>
				</div>

				<div className="pcm-row pcm-col">
					<label className="pcm-label">요청 메시지(선택)</label>
					<textarea
						className="pcm-textarea"
						rows={4}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="예) 이번 주 상담이 필요합니다."
					/>
				</div>

				<div className="pcm-actions">
					<button type="button" className="pcm-btn" onClick={onClose}>
						취소
					</button>
					<button type="button" className="pcm-btn pcm-btn-primary" onClick={submit} disabled={!selectedSlotId}>
						요청 보내기
					</button>
				</div>

				{!loading && slotList.length === 0 && (
					<div className="pcm-hint">가능한 상담 시간이 없습니다. (주간 상담 일정에서 체크 후 저장했는지 확인!)</div>
				)}
			</div>
		</div>
	);
}
