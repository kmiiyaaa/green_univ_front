import { useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import RiskInfoPanel from '../RiskInfoPanel';
import '../../../assets/css/CounselingInfoPop.css';

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

	const decide = async (decision) => {
		if (!window.confirm(`정말 ${decision} 하시겠습니까?\n처리 후 철회는 불가능합니다.`)) return;

		try {
			setLoading(true);
			await api.post('/reserve/decision', null, {
				params: { reserveId: data.id, decision },
			});
			window.close();
		} catch (e) {
			alert(e?.response?.data?.message ?? '처리 실패');
		} finally {
			setLoading(false);
		}
	};

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
							<td>{data.student.studentNo}</td>
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

			{data.approvalState === 'REQUESTED' && (
				<div className="cdoc-action">
					<button className="cdoc-btn cdoc-reject" disabled={loading} onClick={() => decide('반려')}>
						반려
					</button>
					<button className="cdoc-btn cdoc-approve" disabled={loading} onClick={() => decide('승인')}>
						승인
					</button>
				</div>
			)}
		</div>
	);
}
