export default function ReservationStatus({ status }) { // 삼항연산자용
	if (status === 'REQUESTED') return '승인 대기';
	if (status === 'APPROVED') return '승인 완료';
	if (status === 'REJECTED') return '반려';
	return '';
}
