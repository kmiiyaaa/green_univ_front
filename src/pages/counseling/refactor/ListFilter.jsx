export function combinedListFilter(listByProfessor = [], listByStudent = []) {
	// 통합 리스트를 다시 approvalState 값으로 필터링 한 리스트들

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

export function listFilter(list = []) {
	// 한 리스트 필터링
	return {
		requestedList: list.filter((r) => r.approvalState === 'REQUESTED'),
		approvedList: list.filter((r) => r.approvalState === 'APPROVED'),
		rejectedList: list.filter((r) => r.approvalState === 'REJECTED'),
		canceledList: list.filter((r) => r.approvalState === 'CANCELED'),
		finishedList: list.filter((r) => r.approvalState === 'FINISHED'),
	};
}
