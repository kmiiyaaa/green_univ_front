import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import OptionForm from '../../../components/form/OptionForm';
import { getMonday, getWeekDates } from '../../../utils/DateTimeUtil';
import '../../../assets/css/ProfessorCounselRequestModal.css';

// 교수가 학생에게 상담 요청 보낼 때 뜨는 모달
export default function ProfessorCounselRequestModal({ open, target, onClose, onSuccess }) {
	const [slotList, setSlotList] = useState([]);
	const [selectedSlotId, setSelectedSlotId] = useState('');
	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	// 이번 주 + 다음 주 weekStartDate 계산
	const getThisAndNextWeekStartDates = () => {
		const today = new Date();
		const thisMonday = getMonday(today);
		const nextMonday = getMonday(new Date(thisMonday.getTime() + 7 * 24 * 60 * 60 * 1000));

		const thisWsd = getWeekDates(thisMonday)[0];
		const nextWsd = getWeekDates(nextMonday)[0];

		return { thisWsd, nextWsd };
	};

	// 지난 날짜/시간 슬롯 제외
	const isPastSlot = (s) => {
		const date = s?.counselingDate; // "YYYY-MM-DD"
		const startTime = s?.startTime; // 15, 16
		if (!date || startTime == null) return true;

		const slotTime = new Date(`${date}T${String(startTime).padStart(2, '0')}:00:00`);
		return slotTime <= new Date(); // 지금 포함해서 이전은 제외
	};

	// 모달 열릴 때: weekly에서 저장한 가능한 슬롯만 불러오게 처리
	useEffect(() => {
		if (!open) return;

		setSelectedSlotId('');
		setReason('');

		const { thisWsd, nextWsd } = getThisAndNextWeekStartDates();
		loadSlots(thisWsd, nextWsd);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// 이번주 + 다음주 슬롯을 합쳐서 불러오기
	const loadSlots = async (thisWsd, nextWsd) => {
		try {
			setLoading(true);

			const [res1, res2] = await Promise.all([
				api.get('/counseling/professor', { params: { weekStartDate: thisWsd } }),
				api.get('/counseling/professor', { params: { weekStartDate: nextWsd } }),
			]);

			const list1 = res1.data?.list ?? [];
			const list2 = res2.data?.list ?? [];

			// 중복 제거 (다음주가 res1/res2에 동시에 포함될 수 있음)
			const merged = [...list1, ...list2];
			const unique = Array.from(new Map(merged.map((s) => [String(s.id), s])).values());

			// 예약 안된 슬롯만 + 지난 날짜 슬롯 안보여주기
			const available = unique.filter((s) => s.reserved === false).filter((s) => !isPastSlot(s));

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
			const h = s.startTime != null ? Number(s.startTime) : null;

			const start = h != null ? `${String(h).padStart(2, '0')}:00` : '';
			const end = h != null ? `${String(h).padStart(2, '0')}:50` : '';

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
						<button type="button" className="pcm-btn pcm-btn-primary" onClick={submit} disabled={!selectedSlotId}>
							요청 보내기
						</button>
					</div>

					{!loading && slotList.length === 0 && <div className="pcm-hint">가능한 상담 시간이 없습니다.</div>}
				</div>
			</div>
		</div>
	);
}
