import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import OptionForm from '../../../components/form/OptionForm';
import '../../../assets/css/ProfessorCounselRequestModal.css';
import SelectDateForCounseling from '../SelectDateForCounseling';

/**
 * 교수가 학생에게 상담 요청 보내는 모달
 * @param {boolean} open - 모달 열림 상태
 * @param {object} target - { studentId, studentName, subjectId, subjectName }
 * @param {function} onClose - 모달 닫기
 * @param {function} onSuccess - 요청 성공 시 콜백
 */
export default function ProfessorCounselRequestModal({ open, target, onClose, onSuccess }) {
	const [selectedSlotId, setSelectedSlotId] = useState(null);
	const [reason, setReason] = useState('');

	// 모달 열릴 때: weekly에서 저장한 가능한 슬롯만 불러오게 처리
	useEffect(() => {
		if (!open) return;
		setSelectedSlotId(null);
		setReason('');
	}, [open]);

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
				counselingScheduleId: selectedSlotId.id,
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

					<SelectDateForCounseling userRole="professor" onSelectSlot={setSelectedSlotId} />

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
				</div>
			</div>
		</div>
	);
}
