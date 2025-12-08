export default function PaginationButton({ currentPage, pagination, onPageChange, totalPages }) {
	
    const hasPrev = pagination.hasPrev; // 이전 페이지 존재 여부 
	const hasNext = pagination.hasNext; // 다음 페이지 존재 여부
	const pageList = pagination.pageList; // 페이지 블럭 1, 2, 3 ... / 11, 12 ...

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
						{p}
					</button>
				))}

				<button disabled={!hasNext} onClick={() => goPage(currentPage + 1)}>
					다음
				</button>
			</div>
		</div>
	);
}
