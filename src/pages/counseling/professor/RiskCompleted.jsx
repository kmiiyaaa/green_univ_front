import DataTable from '../../../components/table/DataTable';

export default function RiskCompleted({ completedHeaders, completedData, completedLength }) {
	return (
		<div className="risk-section">
			<div className="risk-section-head">
				<h3>상담완료된 학생 목록</h3>
			</div>

			<div className="risk-card">
				<DataTable headers={completedHeaders} data={completedData} />
				{completedLength === 0 && <div className="empty-hint">상담 완료 기록이 없습니다.</div>}
			</div>
		</div>
	);
}
