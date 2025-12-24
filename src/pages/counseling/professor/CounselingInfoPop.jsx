import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import RiskInfoPanel from '../RiskInfoPanel';
import '../../../assets/css/CounselingInfoPop.css';

// 학생이 교수에게 보낸 상담 신청서를 교수가 확인하는 팝업창
export default function CounselingInfoPop() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const raw = sessionStorage.getItem('counselingDetail');
		if (!raw) {
			window.close();
			return;
		}
		setData(JSON.parse(raw));
	}, []);

	if (!data) return null;

	// const decide = async (decision) => {
	// 	if (!window.confirm(`정말 ${decision} 하시겠습니까?\n처리 후 철회는 불가능합니다.`)) return;

	// 	try {
	// 		setLoading(true);
	// 		await api.post('/reserve/decision', null, {
	// 			params: { reserveId: data.id, decision },
	// 		});
	// 		window.close();
	// 	} catch (e) {
	// 		alert(e?.response?.data?.message ?? '처리 실패');
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// 교수: 확정(APPROVED) 상담 취소
	// 백엔드: DELETE /api/reserve/cancel/professor?reserveId=...
	// const cancelApproved = async () => {
	// 	if (!window.confirm('확정된 상담을 취소하시겠습니까?\n취소 후 해당 시간은 다시 예약 가능해집니다.')) return;

	// 	try {
	// 		setLoading(true);
	// 		await api.delete('/reserve/cancel/professor', {
	// 			params: { reserveId: data.id },
	// 		});
	// 		window.close();
	// 	} catch (e) {
	// 		alert(e?.response?.data?.message ?? '취소 실패');
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	return (
		<div className="cdoc-wrap">
			<h2 className="cdoc-title">상담 신청서</h2>
			<div className="cdoc-box">
				<table className="cdoc-table">
					<tbody>
						<tr>
							<th>학생명</th>
							<td>{data.student.name}</td>
							<th>학번</th>
							<td>{data.student.id}</td>
						</tr>
						<tr>
							<th>학과</th>
							<td>{data.student.department?.name}</td>
							<th>과목</th>
							<td>{data.subject.name}</td>
						</tr>
						<tr>
							<th>상담 일정</th>
							<td colSpan={3}>
								{data.counselingSchedule.counselingDate} {data.counselingSchedule.startTime}:00 ~
								{data.counselingSchedule.endTime}:50
							</td>
						</tr>
						<tr>
							<th>상담 사유</th>
							<td colSpan={3} className="cdoc-reason">
								{data.reason}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<RiskInfoPanel risk={data.dropoutRisk} />

			{/* {data.approvalState === 'REQUESTED' && (
				<div className="cdoc-action">
					<button className="cdoc-btn cdoc-reject" disabled={loading} onClick={() => decide('반려')}>
						반려
					</button>
					<button className="cdoc-btn cdoc-approve" disabled={loading} onClick={() => decide('승인')}>
						승인
					</button>
				</div>
			)}

			{data.approvalState === 'APPROVED' && !data.past && (
				<div className="cdoc-action">
					<button className="cdoc-btn cdoc-reject" disabled={loading} onClick={cancelApproved}>
						상담 취소
					</button>
				</div>
			)} */}
		</div>
	);
}
