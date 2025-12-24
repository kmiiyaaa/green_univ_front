export function listFilter(listByProfessor = [], listByStudent = []) {
	if (!Array.isArray(listByProfessor)) listByProfessor = [];
	if (!Array.isArray(listByStudent)) listByStudent = [];

	const combined = [...listByProfessor, ...listByStudent];

	return {
		requestedList: combined.filter((r) => r.approvalState === 'REQUESTED'),
		approvedList: combined.filter((r) => r.approvalState === 'APPROVED'),
		rejectedList: combined.filter((r) => r.approvalState === 'REJECTED'),
		canceledList: combined.filter((r) => r.approvalState === 'CANCELED'),
		finishedList: combined.filter((r) => r.approvalState === 'FINISHED'),
	};
}
