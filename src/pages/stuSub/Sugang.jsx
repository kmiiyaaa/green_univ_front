import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';
import OptionForm from '../../components/form/OptionForm';
import PaginationForm from '../../components/form/PaginationForm';
import { toHHMM } from '../../utils/DateTimeUtil';

export default function Sugang() {
	const { user, token, userRole } = useContext(UserContext);
	const [pendingList, setPendingList] = useState([]); // 미완료 (예비 남은 것)
	const [completedList, setCompletedList] = useState([]); // 완료 (실제 수강 신청)
	const [totalGrades, setTotalGrades] = useState(0); // 총 학점
	// const

	const navigate = useNavigate();

	// 예비 수강 신청 강의 목록 조회 (
	const loadMyList = async () => {
		try {
			const res = await api.get('/sugang/stusublist');
			console.log('예비 수강 신청 강의 목록 조회', res.data);
			const period = res.data.period;
			if (period === 0) {
				// 🍎 예비 수강 신청 기간 일 때는 일단 PreSugang으로 돌려놨음
				navigate('/sugang/pre');
				// 예비 수강 기간: 예비 목록만
				const preRaw = res.data.preStuSubList || [];
				setPendingList(preRaw.map(mapRow));
				setCompletedList([]);
				setTotalGrades(res.data.totalGrades || 0);
			} else if (period === 1) {
				// 수강 신청 기간: 미완료 + 완료
				const preRaw = res.data.preStuSubList || [];
				const stuRaw = res.data.stuSubList || [];
				setPendingList(preRaw.map(mapRow));
				setCompletedList(stuRaw.map(mapRow));
				setTotalGrades(res.data.totalGrades || 0);
			} else {
				// 종료: 완료만
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
		수강신청: sub.numOfStudent === 0 ? '신청' : '취소',
	});

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
						clickableHeaders={['수강신청']}
						onCellClick={async ({ row, header }) => {
							if (header === '수강신청') {
								const isEnrolled = row.isEnrolled; // 현재 신청 상태 확인
								const isOver = row.isOver; // 신청 인원이 정원보다 많은지
								try {
									if (isOver) {
										if (!window.confirm('해당 강의를 수강 신청 하시겠습니까?')) return;
										await api.post(`/sugang/regular/${row.id}`); // 수강 신청 클릭
									}
									await loadMyList();
								} catch (err) {
									const errorMessage = err.response?.data?.message || '처리 중 오류가 발생했습니다.';
									alert(errorMessage);
								}
							}
						}}
					/>
				</>
			)}

			<h3>수강 신청 완료 (총 {totalGrades}학점)</h3>
			<DataTable
				headers={headers}
				data={completedList}
				clickableHeaders={['수강신청']}
				onCellClick={async ({ row, header }) => {
					if (header === '수강신청') {
						const isEnrolled = row.isEnrolled; // 현재 신청 상태 확인
						const isOver = row.isOver; // 신청 인원이 정원보다 많은지
						try {
							if (isOver) {
								if (!window.confirm('수강 신청을 취소하시겠습니까?')) return;
								await api.delete(`/sugang/regular/${row.id}`); // 수강 취소 클릭
							}
							await loadMyList();
						} catch (err) {
							const errorMessage = err.response?.data?.message || '처리 중 오류가 발생했습니다.';
							alert(errorMessage);
						}
					}
				}}
			/>
		</>
	);
}
