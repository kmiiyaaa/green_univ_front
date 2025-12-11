import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import { toHHMM } from '../../utils/DateTimeUtil';
import SugangApplication from './SugangApplication';

export default function Sugang() {
	const { user, token, userRole } = useContext(UserContext);
	const [pendingList, setPendingList] = useState([]); // 미완료 (예비 남은 것)
	const [completedList, setCompletedList] = useState([]); // 완료 (실제 수강 신청)
	const [totalGrades, setTotalGrades] = useState(0); // 총 학점

	// 학생이 신청한 예비 강의 목록 조회 -> 수강 신청 기간에 따라 나누기
	const loadMyList = async () => {
		try {
			const res = await api.get('/sugang/stusublist');
			console.log('[수강신청] 강의 목록 조회', res.data);
			const period = res.data.period;
			if (period === 1) {
				// 수강 신청 기간: 미완료 + 완료
				const preRaw = res.data.preStuSubList || [];
				const stuRaw = res.data.stuSubList || [];
				setPendingList(preRaw.map(mapRow));
				setCompletedList(stuRaw.map(mapRow));
				setTotalGrades(res.data.totalGrades || 0);
			} else {
				const stuRaw = res.data.stuSubList || [];
				setPendingList([]);
				setCompletedList(stuRaw.map(mapRow));
				setTotalGrades(res.data.totalGrades || 0);
			}
		} catch (e) {
			console.error('목록 조회 실패: ', e);
		}
	};

	const mapRow = (sub) => ({
		id: sub.id,
		학수번호: sub.subjectId,
		강의명: sub.subjectName,
		담당교수: sub.professorName,
		학점: sub.grades,
		'요일시간 (강의실)': `${sub.subDay}, ${toHHMM(sub.startTime)}-${toHHMM(sub.endTime)} (${sub.roomId})`,
		현재인원: sub.numOfStudent,
		정원: sub.capacity,
		isOver: sub.numOfStudent > sub.capacity,
		isEnrolled: sub.status,
		수강신청: sub.status ? '취소' : '신청',
	});

	// 수강 신청 데이터 포맷팅 (마감 처리 포함)
	const formatRegularRowData = (sub, actionLabel) => {
		const isFull = sub.numOfStudent === sub.capacity;
		let actionText = '신청';
		if (isFull) {
			actionText = '마감';
			// TODO: 버튼 못 누르게 막아야 함
		} else if (sub.status) {
			actionText = '취소';
		}
		return {
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
			isEnrolled: sub.status, // 학생의 신청 여부
			isFull: isFull, // 정원이 다 찼는지 여부
			[actionLabel]: actionText,
		};
	};

	// 수강 신청/취소 핸들러
	const handleRegularAction = async (row, reloadList, currentPage, searchForm) => {
		if (
			row.isFull
			// && !row.isEnrolled
		) {
			alert('정원이 마감되었습니다.');
			return;
		}
		try {
			if (row.isEnrolled) {
				if (!window.confirm('수강 신청을 취소하시겠습니까?')) return;
				await api.delete(`/sugang/regular/${row.학수번호}`);
			} else {
				if (!window.confirm('해당 강의를 수강 신청 하시겠습니까?')) return;
				await api.post(`/sugang/regular/${row.학수번호}`);
			}
			await loadMyList();
		} catch (err) {
			alert(err.response?.data?.message || '처리 중 오류가 발생했습니다.');
		}
	};

	useEffect(() => {
		loadMyList();
	}, []);

	const headers = ['학수번호', '강의명', '담당교수', '학점', '요일시간 (강의실)', '현재인원', '정원', '수강신청'];
	return (
		<>
			<h2>나의 수강 신청 내역</h2>

			{pendingList.length > 0 && (
				<>
					<h3>신청 미완료 강의 (다시 신청 필요)</h3>
					<DataTable
						headers={headers}
						data={pendingList}
						clickableHeaders="수강신청"
						onCellClick={async ({ row, header }) => {
							if (header === '수강신청') {
								await handleRegularAction(row);
							}
						}}
					/>
				</>
			)}

			<h3>수강 신청 완료 (총 {totalGrades}학점)</h3>
			<DataTable
				headers={headers}
				data={completedList}
				clickableHeaders="수강신청"
				onCellClick={async ({ row, header }) => {
					if (header === '수강신청') {
						await handleRegularAction(row);
					}
				}}
			/>

			<hr style={{ margin: '30px 0' }} />
			<h3>강의 검색 및 신청</h3>

			<SugangApplication
				apiEndpoint="/sugang/regularsubjectlist"
				actionHeaderLabel="수강신청"
				onAction={handleRegularAction}
				formatRowData={formatRegularRowData}
			/>
		</>
	);
}
