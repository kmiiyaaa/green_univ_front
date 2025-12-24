import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';

import SentCounseling from './SentCounsling';
import RequestedCounseling from './RequestedCounseling';
import ApprovedCounseling from './ApporvedCounseling';
import CompletedCounseling from './CompletedCounseling';
import ReserveForm from './ReserveForm';

import { combinedListFilter, extractSubjects, listFilterBySubject } from './ListFilter';

import { CounselingRefreshContext } from './CounselingRefreshContext';

export default function CounselingManageMent() {
	const { userRole } = useContext(UserContext);
	const { refreshKey } = useContext(CounselingRefreshContext);

	// 원본 데이터
	const [listByProfessor, setListByProfessor] = useState([]);
	const [listByStudent, setListByStudent] = useState([]);

	// 과목 필터
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState('');

	// =================== 데이터 로드 ===================
	const loadCounselingList = async () => {
		try {
			const res = await api.get('/reserve/list/requester');

			const preRaw = res.data.RequestedByProfessor || [];
			const stuRaw = res.data.RequestedByStudent || [];

			setListByProfessor(preRaw);
			setListByStudent(stuRaw);
			setSubjectOptions(extractSubjects(preRaw, stuRaw));
		} catch (e) {
			console.error(e);
			setListByProfessor([]);
			setListByStudent([]);
			setSubjectOptions([]);
		}
	};

	useEffect(() => {
		loadCounselingList();
	}, [refreshKey]);

	// 과목 필터
	const filteredProfessorList = listFilterBySubject(listByProfessor, selectedSubject);

	const filteredStudentList = listFilterBySubject(listByStudent, selectedSubject);

	// 상태 필터
	const { approvedList, finishedList } = combinedListFilter(filteredProfessorList, filteredStudentList);

	return (
		<div>
			{/* 학생 전용 예약 */}
			{userRole === 'student' && (
				<>
					<div className="cm-header">
						<h2 className="cm-title">상담 예약</h2>
					</div>
					<ReserveForm />
				</>
			)}

			{/* 상담 관리 */}
			<div className="cm-header">
				<h2 className="cm-title">상담 관리</h2>

				<select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
					<option value="">전체 과목</option>
					{subjectOptions.map((s) => (
						<option key={s.name} value={s.name}>
							{s.name}
						</option>
					))}
				</select>
			</div>

			{/* 내가 요청한 상담 */}
			<SentCounseling sentList={userRole === 'professor' ? filteredProfessorList : filteredStudentList} />

			{/* 요청 받은 상담 */}
			<RequestedCounseling requestByList={userRole === 'professor' ? filteredStudentList : filteredProfessorList} />

			{/* 확정된 상담 */}
			<ApprovedCounseling approvedList={approvedList} />

			{/* 완료된 상담 */}
			<CompletedCounseling finishedList={finishedList} />
		</div>
	);
}
