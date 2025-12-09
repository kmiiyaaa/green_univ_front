export function toHHMM(hour) {
	// 14 -> 14:00 형식으로 변환
	const h = String(hour).padStart(2, '0');
	return `${h}:00`;
}
