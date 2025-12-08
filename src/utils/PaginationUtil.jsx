export function pagenationUtil({ page, totalPages, blockSize }) {
	// 필수로 내려줄 props
	// page (currentPage) 

	const total = totalPages;

	const startPage = Math.floor(page / blockSize) * blockSize + 1;
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
