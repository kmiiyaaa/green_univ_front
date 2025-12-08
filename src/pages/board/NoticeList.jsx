import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';
import { UserContext } from '../../context/UserContext';
import '../../assets/css/NoticeList.css';

const NoticeList = () => {
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	// URL query로 상태 유지 (검색/페이지 새로고침 대비)
	const [searchParams, setSearchParams] = useSearchParams();

	const initialPage = Number(searchParams.get('page') || 1);
	const initialKeyword = searchParams.get('keyword') || '';
	const initialType = searchParams.get('type') || 'title';

	const [page, setPage] = useState(initialPage);
	const [keyword, setKeyword] = useState(initialKeyword);
	const [type, setType] = useState(initialType);

	const [noticeList, setNoticeList] = useState([]);
	const [totalPages, setTotalPages] = useState(1);

	const headers = ['번호', '말머리', '제목', '작성일', '조회수'];

	const formatDateTime = (ts) => {
		if (!ts) return '';
		// 백엔드 Timestamp 직렬화 형태에 따라 Date 파싱
		const d = new Date(ts);
		if (Number.isNaN(d.getTime())) return String(ts);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		const hh = String(d.getHours()).padStart(2, '0');
		const mi = String(d.getMinutes()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
	};

	const loadList = async (targetPage = page, targetKeyword = keyword, targetType = type) => {
		try {
			// 검색어 있으면 search/{page}, 없으면 list/{page}
			const hasKeyword = targetKeyword && targetKeyword.trim().length > 0;

			const url = hasKeyword
				? `/notice/search/${targetPage}?keyword=${encodeURIComponent(targetKeyword)}&type=${encodeURIComponent(
						targetType
				  )}`
				: `/notice/list/${targetPage}`;

			const res = await api.get(url);

			const raw = res.data.noticeList || [];

			const formatted = raw.map((n) => ({
				id: n.id,
				번호: n.id,
				말머리: n.category,
				제목: n.title,
				작성일: formatDateTime(n.createdTime),
				조회수: n.views ?? 0,
				원본데이터: n,
			}));

			setNoticeList(formatted);
			setTotalPages(res.data.listCount || 1);

			// URL sync
			const next = {};
			next.page = String(targetPage);
			if (hasKeyword) {
				next.keyword = targetKeyword;
				next.type = targetType;
			}
			setSearchParams(next);
		} catch (e) {
			console.error('공지 목록 로드 실패:', e);
		}
	};

	useEffect(() => {
		loadList(page, keyword, type);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const nextPage = 1;
		setPage(nextPage);
		loadList(nextPage, keyword, type);
	};

	const handleResetSearch = () => {
		setKeyword('');
		setType('title');
		const nextPage = 1;
		setPage(nextPage);
		loadList(nextPage, '', 'title');
	};

	return (
		<div className="form-container">
			<h3>공지사항</h3>
			<div className="split--div"></div>

			{/* 검색 폼 */}
			<form onSubmit={handleSearchSubmit} className="notice-search-bar">
				<select
					className="input--box notice-search-type"
					name="type"
					value={type}
					onChange={(e) => setType(e.target.value)}
				>
					<option value="title">제목</option>
					<option value="keyword">제목+내용</option>
				</select>

				<div className="notice-search-input">
					<InputForm
						label=""
						name="keyword"
						placeholder="검색어를 입력하세요"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
				</div>

				<div className="notice-search-actions">
					<button type="submit" className="button">
						검색
					</button>
					<button type="button" className="button" onClick={handleResetSearch}>
						초기화
					</button>
				</div>
			</form>

			{/* 목록 테이블 */}
			<div>
				<DataTable
					headers={headers}
					data={noticeList}
					onRowClick={(row) => {
						// 상세 페이지 이동
						const id = row?.id || row?.원본데이터?.id;
						if (id) navigate(`/notice/read/${id}`);
					}}
				/>
			</div>

			{/* 페이징 */}
			<div className="paging--container">
				<div className="paging-pages">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
						<button key={p} className={`button page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
							{p}
						</button>
					))}
				</div>

				{userRole === 'staff' && (
					<button className="button register-btn" onClick={() => navigate('/notice/write')}>
						등록
					</button>
				)}
			</div>
		</div>
	);
};

export default NoticeList;
