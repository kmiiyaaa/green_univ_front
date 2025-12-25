import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import OptionForm from '../../../components/form/OptionForm';
import { getThisAndNextWeekStartDates, isPastSlot } from '../../../utils/counselingUtil';
import { endMinus10, formatDayOfWeek, toHHMM } from '../../../utils/DateTimeUtil';
import '../../../assets/css/ProfessorCounselRequestModal.css';

// 교수가 학생에게 상담 요청 보낼 때 뜨는 모달
export default function ProfessorCounselRequestModal({ open, target, onClose, onSuccess }) {
	const [slotList, setSlotList] = useState([]);
	const [selectedSlotId, setSelectedSlotId] = useState('');
	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	// 모달 열릴 때: weekly에서 저장한 가능한 슬롯만 불러오게 처리
	useEffect(() => {
		if (!open) return;

		setSelectedSlotId('');
		setReason('');

		const weekStartDate = getThisAndNextWeekStartDates();
		loadSlots(weekStartDate);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// 이번주 + 다음주 슬롯을 합쳐서 불러오기
	const loadSlots = async (weekStartDate) => {
		try {
			setLoading(true);
			const res = await api.get('/counseling/professor', { params: { weekStartDate } });
			const list = res.data ?? [];

			// 예약 안된 슬롯만 + 지난 날짜 슬롯 안보여주기
			const available = list
				.filter((s) => s?.reserved === false)
				.filter((s) => !isPastSlot(s?.counselingDate, s?.startTime))
				.sort((a, b) => {
					const d = String(a?.counselingDate ?? '').localeCompare(String(b?.counselingDate ?? ''));
					if (d !== 0) return d;
					return Number(a?.startTime ?? 0) - Number(b?.startTime ?? 0);
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
			const date = s?.counselingDate ?? '';
			const dateLabel = formatDayOfWeek(date, s?.dayOfWeek);

			const start = toHHMM(Number(s?.startTime));
			const end = s?.endTime != null ? endMinus10(Number(s.endTime)) : endMinus10(Number(s?.startTime ?? 0) + 1);

			return {
				value: String(s.id),
				label: `${dateLabel}  ${start} ~ ${end}`,
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
			<div className="pcm-content">
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
						<OptionForm
							label="상담 시간"
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
							placeholder="예) 성적 관련 상담이 필요합니다."
						/>
					</div>

					<div className="pcm-actions">
						<button type="button" className="pcm-btn" onClick={onClose}>
							취소
						</button>
						<button type="button" className="pcm-btn pcm-btn-primary" onClick={submit} disabled={!selectedSlotId || loading}>
							요청 보내기
						</button>
					</div>

					{!loading && slotList.length === 0 && <div className="pcm-hint">가능한 상담 시간이 없습니다.</div>}
				</div>
			</div>
		</div>
	);
}
