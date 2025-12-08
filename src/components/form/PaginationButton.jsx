function pagenationUtil({ page, totalPages, blockSize }) {
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

function PaginationButton({ currentPage, onPageChange, totalPages, blockSize }) {
	const { hasPrev, hasNext, pageList } = pagenationUtil({
		page: currentPage,
		totalPages,
		blockSize,
	});

	// 페이지 이동 함수
	const goPage = (p) => {
		if (p < 0 || p >= totalPages) return; // 전체 페이지 기준
		onPageChange(p);
	};

	return (
		<div>
			<div>
				<button disabled={!hasPrev} onClick={() => goPage(currentPage - 1)}>
					이전
				</button>

				{pageList.map((p) => (
					<button key={p} className={`page-number ${p === currentPage ? 'active' : ''}`} onClick={() => goPage(p)}>
						{p + 1}
					</button>
				))}

				<button disabled={!hasNext} onClick={() => goPage(currentPage + 1)}>
					다음
				</button>
			</div>
		</div>
	);
}

export default PaginationButton;
