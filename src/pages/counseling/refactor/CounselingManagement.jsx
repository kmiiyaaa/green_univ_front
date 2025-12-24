import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';
import SentCounseling from './SentCounsling';
import RequestedCounseling from './RequestedCounseling';
import ApprovedCounseling from './ApporvedCounseling';
import CompletedCounseling from './CompletedCounseling';
import ReserveForm from './ReserveForm';
import { combinedListFilter, listFilter } from './ListFilter';
import { CounselingRefreshContext } from './CounselingRefreshContext';
// 상담 관리 상위 헤더 컴포넌트, api 호출, 새로고침
export default function CounselingManageMent() {
	const [listByProfessor, setListByProfessor] = useState([]); // 교수가 요청한 상담 예약
	const [listByStudent, setListByStudent] = useState([]); // 학생이 요청한 상담 예약
	const { userRole } = useContext(UserContext);
	const { refreshKey } = useContext(CounselingRefreshContext);

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
	}, [refreshKey]);

	// ApprovalState 기준 함수 필터링
	const { approvedList, finishedList } = combinedListFilter(listByProfessor, listByStudent);

	return (
		<div>
			<div className="cm-header">
				<div>
					<h2 className="cm-title">내 상담 관리</h2>
				</div>
			</div>

			{userRole === 'student' && (
				<div>
					{/* 상담 예약 - 학생 전용 */}
					<ReserveForm />
				</div>
			)}

			<div>
				{/* 내가 요청한 상담 목록 - sent */}
				<SentCounseling sentList={userRole === 'professor' ? listByProfessor : listByStudent} />
			</div>

			<div>
				{/* 요청 받은 상담 목록 - request */}
				<RequestedCounseling requestByList={userRole === 'professor' ? listByStudent : listByProfessor} />
			</div>

			<div>
				{/* 확정된 상담 목록 - approve */}
				<ApprovedCounseling approvedList={approvedList} />
			</div>

			<div>
				{/* 완료된 상담 목록 - complete*/}
				<CompletedCounseling finishedList={finishedList} />
			</div>
		</div>
	);
}
