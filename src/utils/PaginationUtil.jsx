export function pagenationUtil({ page, totalPages, blockSize }) {
	const currentPage = page + 1; // 1 부터 시작하도록 보정함
	const total = totalPages;

	const startPage = Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
	let endPage = startPage + blockSize - 1;

	if (endPage > total) endPage = total;

	// 이전 버튼, 다음 버튼
	const hasPrev = startPage > 1;
	const hasNext = endPage < total;

	// 페이지 번호 목록 생성
	const pageList = [];
	for (let p = startPage; p <= endPage; p++) {
		pageList.push(p - 1); // 프론트 번호는 1-based, 백은 0-based라서 p-1 사용
	}

	return { startPage, endPage, hasPrev, hasNext, pageList };
}
