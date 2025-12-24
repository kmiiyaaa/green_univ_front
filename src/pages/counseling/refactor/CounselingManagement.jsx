import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';
import SentCounseling from './SentCounsling';
import RequsetedCounseling from './RequestedCounseling';
import ApprovedCounseling from './ApporvedCounseling';
import CompletedCounseling from './CompletedCounseling';
import ReserveForm from './ReserveForm';

export default function CounselingManageMent() {
	// 내가 보낸 상담 요청 목록
	const [sentCounselingRequests, setSentCounselingRequests] = useState([]);

	// 내가 받은 상담 요청 목록
	const [receivedCounselingRequests, setReceivedCounselingRequests] = useState([]);
	const { userRole } = useContext(UserContext);

	// 사용자 역할에 따라 다른 호출
	// api 호출, 새로고침, 값 내려주기 용도
	// 내 상담관리 (학생, 교수 공통)
	// 상담 요청, 내가 보낸 상담 요청, 확정된 상담, 상담완료 목록 필요
	// useEffect(() => {
	// 	try {
	// 		const res = api.get('/reserve/list');
	// 		if (userRole === 'professor') {
	// 			// 사용자 역할에 따라 useState 값 다르게 저장
	// 			setSentCounselingRequests(res.data.professor);
	// 			setReceivedCounselingRequests(res.data.student);
	// 		} else {
	// 			// 학생인 경우
	// 			setSentCounselingRequests(res.data.student);
	// 			setReceivedCounselingRequests(res.data.professor);
	// 		}
	// 	} catch (e) {
	// 		console.error(e.response.data.message);
	// 		alert(e.response.data.message);
	// 	}
	// }, []);

	// 새로고침 함수

	// 완료,
	return (
		<div>
			<div className="cm-header">
				<div>
					<h2 className="cm-title">내 상담 관리</h2>
				</div>
				<button>새로고침</button>
			</div>

			{userRole === 'student' && (
				<div>
					{/* 상담 예약 - 학생 전용 */}
					<ReserveForm />
				</div>
			)}

			<div>
				<SentCounseling />
			</div>

			<div>
				<RequsetedCounseling />
			</div>

			<div>
				<ApprovedCounseling />
			</div>

			<div>
				<CompletedCounseling />
			</div>
		</div>
	);
}
