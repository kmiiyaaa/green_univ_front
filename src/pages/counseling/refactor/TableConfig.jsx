import { reservationStatus } from '../ReservationStatus';

// 필요한 데이터 테이블 헤더의 형식, 출력할 데이터 형식 지정한 유틸
export const TABLE_CONFIG = {
	// 교수 조회

	// 학생 -> 교수 상담요청
	PROFESSOR_REQUESTED: {
		headers: ['교수', '과목', '상담 사유', '상담일', '상담 시간', '상태', '취소'],
		data: (r, handlers, reserveId) => ({
			교수: r.subject.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			'상담 사유': r?.reason,
			상담일: r.counselingSchedule.counselingDate ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.startTime ?? ''}:50`,
			상세: handlers.detail(r),
			처리: handlers.decision(r, reserveId),
		}),
	},

	// 교수 -> 학생 상담요청 확인
	PROFESSOR_SENT: {
		headers: ['학생', '과목', '상담사유', '상담 시간', '상세'],
		data: (r, handlers, reserveId) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.startTime ?? ''}:50`,
			'방 번호': r.roomCode,
			상세: handlers.detail,
		}),
	},

	// 확정된 상담 요청
	PROFESSOR_APPROVED: {
		headers: ['학생', '과목', '방 번호', '상담사유', '상세', '취소'],
		data: (r, handlers, reserveId) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			'방 번호': r.roomCode,
			상세: handlers.detail(r),
			취소: handlers.decision(r, reserveId),
		}),
	},

	// 완료된 상담 목록
	PROFESSOR_FINISHED: {
		headers: ['학생', '과목', '상담일', '상담사유', '상세'],
		data: (r, handlers) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.counselingSchedule.counselingDate ?? '',
			상담사유: r.reason ?? '',
			상세: handlers.detail(r),
		}),
	},

	// 학생 확인

	// 확정 상담 조회
	STUDENT_APPROVED: {
		headers: ['교수', '과목', '상담일', '상담 시간', '방 번호', '취소'],
		data: (r, handlers) => ({
			교수: r.subject.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.counselingSchedule.counselingDate ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.startTime ?? ''}:50`,
			'방 번호': r.roomCode,
			취소: handlers.cancel(r.id),
		}),
	},

	// 완료 상담 조회
	STUDENT_FINISHED: {
		headers: ['교수', '과목', '상담일', '상담 시간'],
		data: (r, handlers) => ({
			교수: r.subject.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일: r.reason ?? '',
			'상담 시간': r.approvalState,
		}),
	},

	// 학생 -> 교수 상담 신청 내역 조회
	STUDENT_SENT: {
		headers: ['교수', '과목', '상담 사유', '상담일', '상담 시간', '상태', '취소'],
		data: (r, handlers) => ({
			교수: r.subject.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			'상담 사유': r?.reason,
			상담일: r.counselingSchedule.counselingDate ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.startTime ?? ''}:50`,
			상태: reservationStatus(r.approvalState),
			취소: handlers.cancel(r.id),
		}),
	},

	// 교수 -> 학생 상담 신청 내역 조회
	STUDENT_REQUESTED: {
		headers: ['교수', '과목', '사유', '상담일', '상담 시간', '상태', '취소'],
		data: (r, handlers) => ({
			교수: r.subject.professor?.name ?? '',
			과목: r.subject?.name ?? '',
			사유: r?.reason,
			상담일: r.counselingSchedule.counselingDate ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.startTime ?? ''}:50`,
			상태: reservationStatus(r.approvalState),
			취소: handlers.cancel(r.id),
		}),
	},
};
