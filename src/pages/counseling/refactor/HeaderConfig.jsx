// tableConfig.js
export const TABLE_CONFIG = {
	// 교수 조회

	// 학생 -> 교수 상담요청
	PROFESSOR_REQUESTED: {
		headers: ['학생', '과목', '상담사유', '상세', '처리'],
		data: (r, handlers, reserveId) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: handlers.detail(r),
			처리: handlers.decision(r, reserveId),
		}),
	},

	// 교수 -> 학생 상담요청 확인
	PROFESSOR_SEND: {
		headers: ['학생', '과목', '상담사유', '상세', '처리'],
		data: (r, handlers, reserveId) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: handlers.detail(r),
			처리: handlers.decision(r, reserveId),
		}),
	},

	// 승인된 상담 요청
	PROFESSOR_APPROVED: {
		headers: ['학생', '과목', '상담사유', '상세', '취소'],
		data: (r, handlers, reserveId) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: handlers.detail(r),
			취소: handlers.decision(r, reserveId),
		}),
	},

	// 완료된 상담 요청
	PROFESSOR_DONE: {
		headers: ['학생', '과목', '상담사유', '상세'],
		data: (r, handlers) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: handlers.detail(r),
		}),
	},

	// 학생 확인

	// 확정 상담 조회
	STUDENT_APPROVED: {
		headers: ['교수', '과목', '상담일', '상담 시간', '방 번호', '취소'],
		data: (r, handlers) => ({
			교수: r.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.reason ?? '',
			'상담 시간': r.approvalState,
			'방 번호': r.approvalState,
			취소: handlers.cancel(r.id),
		}),
	},

	// 완료 상담 조회
	STUDENT_APPROVED: {
		headers: ['교수', '과목', '상담일', '상담 시간', '방 번호', '취소'],
		data: (r, handlers) => ({
			교수: r.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.reason ?? '',
			'상담 시간': r.approvalState,
			'방 번호': r.approvalState,
			취소: handlers.cancel(r.id),
		}),
	},

	// 학생 -> 교수 상담 신청 내역 조회
	STUDENT_SEND: {
		headers: ['교수', '과목', '상담일', '상담 시간', '방 번호', '취소'],
		data: (r, handlers) => ({
			교수: r.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.reason ?? '',
			'상담 시간': r.approvalState,
			'방 번호': r.approvalState,
			취소: handlers.cancel(r.id),
		}),
	},

	// 교수 -> 학생 상담 신청 내역 조회
	STUDENT_REQUESTED: {
		headers: ['교수', '과목', '상담일', '상담 시간', '방 번호', '취소'],
		data: (r, handlers) => ({
			교수: r.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.reason ?? '',
			'상담 시간': r.approvalState,
			'방 번호': r.approvalState,
			취소: handlers.cancel(r.id),
		}),
	},
};
