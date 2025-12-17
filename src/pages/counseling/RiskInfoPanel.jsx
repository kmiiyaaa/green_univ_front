export default function RiskInfoPanel({ risk }) { // 위험학생일 경우 뜨는 추가 상세
	if (!risk) return null;

	return (
		<div>
			<p>위험 등급: {risk.riskLevel}</p>
			<p>위험 유형: {risk.riskType}</p>
			<p>AI 요약: {risk.aiSummary}</p>
			<p>태그: {risk.aiReasonTags}</p>
			<p>AI 상담 가이드</p>
			<textarea readOnly rows={5} value={risk.aiRecommendation ?? ''} />
		</div>
	);
}
