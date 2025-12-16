import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import { toHHMM } from '../../utils/DateTimeUtil';

export default function CounselingInfo() {
	const [data, setData] = useState(null);

	useEffect(() => {
		// 데이터 목록 불러오기
		const raw = sessionStorage.getItem('counselingDetail');
		if (!raw) {
			alert('잘못된 접근입니다.');
			window.close();
			return;
		}

		setData(JSON.parse(raw));
	}, []);

	if (!data) return null;

	const handleDecision = async (decision) => {
		if (!window.confirm(`처리 후 변경할 수 없습니다. ${decision}하시겠습니까?`)) return;

		try {
			await api.post(`/reserve`, {
				preReserveId: data.id, // 예비 예약 ID
				decision: decision, // '승인' | '반려'
				studentId: data.student.id, // 학생 아이디
				subjectId: data.subject.id, // 요청한 과목 아이디
			});
			alert(decision === '승인' ? '승인 완료' : '반려 완료');
			localStorage.removeItem('counselingDetail');
			window.close();
		} catch (e) {
			alert('처리 중 오류 발생  :', e);
			console.error(e);
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>학생 상담 정보</h2>

			<p>
				<strong>학생:</strong> {data.student.name}
			</p>
			<p>
				<strong>과목:</strong> {data.subject.name}
			</p>
			<p>
				<strong>상담 일자:</strong> {data.counselingSchedule.counselingDate}
			</p>
			<p>
				<strong>상담 시간:</strong> {toHHMM(data.counselingSchedule.startTime)} ~
				{toHHMM(data.counselingSchedule.endTime)}
			</p>

			<hr />

			<p>
				<strong>상담 사유</strong>
			</p>
			<textarea value={data.reason} readOnly rows={4} style={{ width: '100%' }} />

			{/* 위험 학생일 때만 */}
			{data.dropoutRisk && (
				<>
					<hr />{' '}
					<p>
						{' '}
						<strong>위험 등급:</strong> {data.dropoutRisk.riskLevel}{' '}
					</p>{' '}
					<p>
						{' '}
						<strong>위험 유형:</strong> {data.dropoutRisk.riskType}{' '}
					</p>{' '}
					<p>
						{' '}
						<strong>요약 :</strong> {data.dropoutRisk.aiSummary}{' '}
					</p>{' '}
					<p>
						{' '}
						<strong>태그 :</strong> {data.dropoutRisk.aiReasonTags}{' '}
					</p>
					<p>
						<strong>AI 상담 가이드</strong>
					</p>
					<textarea value={data.dropoutRisk.aiRecommendation} readOnly rows={5} style={{ width: '100%' }} />
				</>
			)}

			<div style={{ marginTop: 20 }}>
				<button onClick={() => window.close()}>닫기</button>
				{data.approvalState === 'REQUESTED' && (
					<>
						<button onClick={() => handleDecision('승인')}>승인</button>
						<button onClick={() => handleDecision('반려')}>반려</button>
					</>
				)}
			</div>
		</div>
	);
}
