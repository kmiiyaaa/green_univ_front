import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../api/httpClient';
import DataTable from '../components/table/DataTable';
import SugangApplication from '../pages/stuSub/SugangApplication';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // import 추가

// 고치고 싶어서 변경해놨는데 에러 나서 그냥 둠
export default function PreSugang() {
	const { user, token, userRole } = useContext(UserContext);
	const navigate = useNavigate();
	const queryClient = useQueryClient(); // 데이터 갱신(새로고침)용

	// 1. 내 예비 신청 목록 조회 (useQuery 사용)
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['myPreList'], // 이 데이터의 고유 이름표 (캐싱용)
		queryFn: async () => {
			const res = await api.get('/sugang/stusublist');

			// 기간 체크 로직: 여기서 에러를 던지면 isError 상태로 넘어감
			if (res.data.period !== 0) {
				alert('현재 예비 수강 신청 기간이 아닙니다.');
				throw new Error('Pre-registration period closed'); // 강제로 에러 발생시킴
			}
			return res.data; // 성공하면 이 데이터가 'data' 변수에 들어감
		},
		retry: 0, // 실패했을 때 재시도 안 함 (기간 에러인데 자꾸 요청하면 안되니까)
		refetchOnWindowFocus: false, // 다른 탭 갔다 왔을 때 자동 갱신 끄기 (선택사항)
	});

	// 2. 신청/취소 (useMutation 사용 - 데이터를 변경할 때 씀)
	const mutation = useMutation({
		// mutationFn: 실제로 서버에 요청 보내는 함수
		// variables 객체 안에 { row, reloadList, ... } 다 들어옴
		mutationFn: async (variables) => {
			const { row, isEnrolled } = variables;
			// 내 목록(상단)에서 클릭했다면 무조건 취소임 (status가 없을 수도 있어서 안전장치)
			// 아래 목록(하단)에서 클릭했다면 isEnrolled 값에 따라 갈림
			const shouldDelete = isEnrolled || row.status === true;

			if (shouldDelete) {
				if (!window.confirm('예비 수강 신청을 취소하시겠습니까?')) throw new Error('Canceled');
				return api.delete(`/sugang/pre/${row.id}`);
			} else {
				if (!window.confirm('해당 강의를 예비 수강 신청 하시겠습니까?')) throw new Error('Canceled');
				return api.post(`/sugang/pre/${row.id}`);
			}
		},
		onSuccess: (data, variables) => {
			// (1) 위쪽 테이블 갱신: 키 값을 무효화시켜서 React Query가 알아서 다시 가져옴
			queryClient.invalidateQueries(['myPreList']);

			// (2) 아래쪽 테이블 갱신: SugangApplication에서 넘겨준 reloadList 함수 실행
			// variables 안에 reloadList 함수가 들어있으면 실행
			if (variables.reloadList) {
				variables.reloadList(variables.currentPage, variables.searchForm);
			}
			alert('처리되었습니다.');
		},
		onError: (err) => {
			if (err.message !== 'Canceled') {
				// 사용자가 취소한 거 아니면 에러 메시지 띄움
				alert(err.response?.data?.message || '처리 중 오류 발생');
			}
		},
	});

	// 3. 핸들러 함수 (SugangApplication과 DataTable 둘 다 사용)
	// 이 함수가 중간 다리 역할을 함
	const handlePreAction = (row, reloadList, currentPage, searchForm) => {
		// row에 isEnrolled 정보가 명확하지 않을 수 있어서, row.isEnrolled가 없으면
		// '내 목록'에 있는 것인지 확인해서 boolean 값 생성 (안전장치)
		const isAlreadyEnrolled = row.isEnrolled ?? row.status === true;

		mutation.mutate({
			row,
			isEnrolled: isAlreadyEnrolled,
			reloadList, // ⭐️ 중요: 하단 목록 갱신용 함수 전달
			currentPage, // ⭐️ 중요: 현재 페이지 유지용
			searchForm, // ⭐️ 중요: 검색 조건 유지용
		});
	};

	// 데이터 가공 (isLoading 아닐 때만 계산)
	// useQuery가 데이터를 가져오면 data 안에 다 들어있음
	const myPreListRaw = data?.preStuSubList || [];
	const totalGrades = data?.totalGrades || 0;

	// 테이블용 데이터 변환 함수 (기존과 동일)
	const mapRow = (sub) => ({
		id: sub.id,
		학수번호: sub.subjectId,
		강의명: sub.subjectName,
		담당교수: sub.professorName,
		학점: sub.grades,
		'요일시간 (강의실)': `${sub.subDay}, ${sub.startTime}-${sub.endTime} (${sub.roomId})`,
		현재인원: sub.numOfStudent,
		정원: sub.capacity,
		예비신청: '취소',
		isEnrolled: true, // 클릭 핸들러에서 쓰일 원본 데이터용 플래그
	});

	// 예비 신청 데이터 포맷팅
	const formatPreRowData = (sub, actionLabel) => ({
		id: sub.id,
		단과대학: sub.collName,
		개설학과: sub.deptName,
		학수번호: sub.id,
		강의구분: sub.type,
		강의명: sub.name,
		담당교수: sub.professorName,
		학점: sub.grades,
		'요일시간 (강의실)': `${sub.subDay}, ${sub.startTime}-${sub.endTime} (${sub.roomId})`,
		현재인원: sub.numOfStudent,
		정원: sub.capacity,
		isEnrolled: sub.status,
		[actionLabel]: sub.status ? '취소' : '신청',
	});

	const formattedMyList = myPreListRaw.map(mapRow);

	// 로딩 & 에러 처리 (Early Return)
	if (isLoading) return null;
	if (isError) {
		return (
			<div style={{ padding: '50px', textAlign: 'center' }}>
				<h2 style={{ color: 'red' }}>🚫 알림</h2>
				<p>
					{error.message === 'Pre-registration period closed'
						? '현재 예비 수강 신청 기간이 아닙니다.'
						: '데이터 조회 실패'}
				</p>
				<button onClick={() => navigate(-1)}>뒤로 가기</button>
			</div>
		);
	}

	const headers = ['학수번호', '강의명', '담당교수', '학점', '요일시간 (강의실)', '현재인원', '정원', '예비신청'];

	return (
		<>
			<h2>예비 수강 신청 (장바구니)</h2>

			{formattedMyList.length > 0 ? (
				<>
					<h3>내 예비 수강 신청 목록 (총 {totalGrades}학점)</h3>
					<DataTable
						headers={headers}
						data={formattedMyList}
						clickableHeaders="예비신청"
						onCellClick={({ row, header }) => {
							if (header === '예비신청') {
								handlePreAction(row, null, null, null);
							}
						}}
					/>
					<hr style={{ margin: '30px 0' }} />
				</>
			) : (
				<div style={{ marginBottom: '20px' }}>신청 내역 없음</div>
			)}

			<SugangApplication
				apiEndpoint="/sugang/presubjectlist"
				actionHeaderLabel="예비신청"
				// 여기서 하위 컴포넌트가 주는 reloadList, currentPage 등을 받아서 그대로 handlePreAction에 넘김
				onAction={handlePreAction}
				formatRowData={formatPreRowData}
			/>
		</>
	);
}
