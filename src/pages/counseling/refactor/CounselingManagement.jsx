import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';
import SentCounseling from './SentCounsling';
import RequsetedCounseling from './RequestedCounseling';
import ApprovedCounseling from './ApporvedCounseling';
import CompletedCounseling from './CompletedCounseling';
import ReserveForm from './ReserveForm';
import { listFilter } from './ListFilter';

export default function CounselingManageMent() {
	const [listByProfessor, setListByProfessor] = useState([]); // 교수가 요청한 상담 예약
	const [listByStudent, setListByStudent] = useState([]); // 학생이 요청한 상담 예약
	const { userRole } = useContext(UserContext);

	// 사용자 역할에 따라 다른 호출
	// api 호출, 새로고침, 값 내려주기 용도
	// 내 상담관리 (학생, 교수 공통)
	// 상담 요청, 내가 보낸 상담 요청, 확정된 상담, 상담완료 목록 필요

	const loadCounselingList = async () => {
		try {
			const res = await api.get('/reserve/list/requester');
			const preRaw = res.data.RequestedByProfessor || []; // 교수가 요청한 상담 내역
			const stuRaw = res.data.RequestedByStudent || []; // 학생이 요청한 상담 내역
			setListByProfessor(preRaw);
			setListByStudent(stuRaw);
		} catch (error) {
			setListByProfessor([]);
			setListByStudent([]);
			console.error(error);
		}
	};
	useEffect(() => {
		loadCounselingList();
	}, []);

	// ApprovalState 기준 함수 필터링
	const { requestedList, approvedList, rejectedList, canceledList, finishedList } = listFilter(
		listByProfessor,
		listByStudent
	);

	return (
		<div>
			<div className="cm-header">
				<div>
					<h2 className="cm-title">내 상담 관리</h2>
				</div>
				<button onClick={loadCounselingList}>새로고침</button>
			</div>

			{userRole === 'student' && (
				<div>
					{/* 상담 예약 - 학생 전용 */}
					<ReserveForm />
				</div>
			)}

			<div>
				{/* 보낸 상담 요청 */}
				<SentCounseling sentList={userRole === 'professor' ? listByProfessor : listByStudent} />
			</div>

			<div>
				{/* 받은 상담 요청 */}
				<RequsetedCounseling requestList={userRole === 'professor' ? listByStudent : listByProfessor} />
			</div>

			<div>
				{/* 상담 확정 목록 */}
				<ApprovedCounseling approvedList={approvedList} />
			</div>

			<div>
				{/* 상담 완료 목록 */}
				<CompletedCounseling finishedList={finishedList} />
			</div>
		</div>
	);
}
