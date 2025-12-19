import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';
import '../../../assets/css/MyCounselingManage.css';

export default function MyApprovedCounseling() {
	const [allList, setAllList] = useState([]);
	const [loadingId, setLoadingId] = useState(null);

	// 상담 일정(approved) 과목 필터
	const [subjectId, setSubjectId] = useState('');

	// 전체 목록 로드
	const loadAll = async () => {
		const res = await api.get('/reserve/list/professor');
		setAllList(res.data ?? []);
	};

	useEffect(() => {
		loadAll();
	}, []);

	// REQUESTED / APPROVED 분리 + "상담요청에는 학생 신청만"
	const requestedList = useMemo(
		() => allList.filter((r) => r.approvalState === 'REQUESTED' && r.requester === 'STUDENT'),
		[allList]
	);

	// 교수발 요청(내가 보낸 요청) 별도 분리 (원하면 섹션 삭제 가능)
	const requestedByProfessor = useMemo(
		() => allList.filter((r) => r.approvalState === 'REQUESTED' && r.requester === 'PROFESSOR'),
		[allList]
	);

	//  승인된 상담을 상담확정/상담완료로 분리
	const approvedUpcomingList = useMemo(
		() => allList.filter((r) => r.approvalState === 'APPROVED' && !r.past),
		[allList]
	);
	const approvedPastList = useMemo(() => allList.filter((r) => r.approvalState === 'APPROVED' && r.past), [allList]);

	// 승인/반려 처리
	const handleDecision = async (reserveId, decision) => {
		try {
			setLoadingId(reserveId);

			await api.post('/reserve/decision', null, {
				params: { reserveId, decision },
			});
			await loadAll();
		} catch (e) {
			console.error(e);
			alert('처리 실패! 잠시 후 다시 시도해주세요.');
		} finally {
			setLoadingId(null);
		}
	};

	// 상담요청
	const headers1 = ['학생', '과목', '상담사유', '상세', '처리'];

	const data1 = useMemo(() => {
		return requestedList.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: (
				<button
					type="button"
					className="cm-btn cm-btn--ghost"
					onClick={() => {
						sessionStorage.setItem('counselingDetail', JSON.stringify(r));
						window.open('/counseling/info', '_blank');
					}}
				>
					보기
				</button>
			),
			처리: (
				<div className="cm-actions">
					<button
						type="button"
						className="cm-btn cm-btn--primary"
						disabled={loadingId === r.id}
						onClick={() => handleDecision(r.id, '승인')}
					>
						승인
					</button>
					<button
						type="button"
						className="cm-btn cm-btn--danger"
						disabled={loadingId === r.id}
						onClick={() => handleDecision(r.id, '반려')}
					>
						반려
					</button>
				</div>
			),
		}));
	}, [requestedList, loadingId]);

	// 내가 보낸 요청 섹션(교수발 요청)
	const headersSent = ['학생', '과목', '상담사유', '상담일자', '상담 시간'];
	const dataSent = useMemo(() => {
		return requestedByProfessor.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			'상담 시간': `${r.counselingSchedule?.startTime ?? ''}:00 ~ ${r.counselingSchedule?.endTime ?? ''}:50`,
		}));
	}, [requestedByProfessor]);

	// 상담 일정
	// 과목 목록 (APPROVED 기준 중복 제거)
	// 상담확정/상담완료 모두에서 과목 옵션 뽑기
	const subjects = useMemo(() => {
		const map = new Map();
		[...approvedUpcomingList, ...approvedPastList].forEach((r) => {
			if (r.subject) map.set(r.subject.id, r.subject.name);
		});
		return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
	}, [approvedUpcomingList, approvedPastList]);

	// 과목 필터 적용(상담확정 / 상담완료 각각)
	const filteredUpcoming = useMemo(() => {
		if (!subjectId) return approvedUpcomingList;
		return approvedUpcomingList.filter((r) => r.subject?.id === Number(subjectId));
	}, [approvedUpcomingList, subjectId]);

	const filteredPast = useMemo(() => {
		if (!subjectId) return approvedPastList;
		return approvedPastList.filter((r) => r.subject?.id === Number(subjectId));
	}, [approvedPastList, subjectId]);

	const headers2 = ['학생', '과목', '상담일자', '방코드', '상세'];

	const dataUpcoming = useMemo(() => {
		return filteredUpcoming.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			방코드: r.roomCode ?? '',
			상세: (
				<button
					type="button"
					className="cm-btn cm-btn--ghost"
					onClick={() => {
						sessionStorage.setItem('counselingDetail', JSON.stringify(r));
						window.open('/counseling/info', '_blank', 'width=900,height=800,scrollbars=yes');
					}}
				>
					보기
				</button>
			),
		}));
	}, [filteredUpcoming]);

	// 상담완료 테이블
	const dataPast = useMemo(() => {
		return filteredPast.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			방코드: r.roomCode ?? '',
			상세: (
				<button
					type="button"
					className="cm-btn cm-btn--ghost"
					onClick={() => {
						sessionStorage.setItem('counselingDetail', JSON.stringify(r));
						window.open('/counseling/info', '_blank', 'width=900,height=800,scrollbars=yes');
					}}
				>
					보기
				</button>
			),
		}));
	}, [filteredPast]);

	return (
		<div className="cm-page">
			<div className="cm-header">
				<div>
					<h2 className="cm-title">내 상담 관리</h2>
				</div>
				<button type="button" className="cm-btn cm-btn--ghost" onClick={loadAll}>
					새로고침
				</button>
			</div>

			{/* 상담 요청 */}
			<section className="cm-card">
				<div className="cm-card-head">
					<h3 className="cm-card-title">상담 요청</h3>
					<span className="cm-badge">{requestedList.length}건</span>
				</div>

				{requestedList.length === 0 ? (
					<div className="cm-empty">처리할 상담 요청이 없습니다.</div>
				) : (
					<div className="cm-table">
						<DataTable headers={headers1} data={data1} />
					</div>
				)}
			</section>

			{/* 내가 보낸 상담 요청(교수발) */}
			<section className="cm-card">
				<div className="cm-card-head">
					<h3 className="cm-card-title">내가 보낸 상담 요청</h3>
					<span className="cm-badge">{requestedByProfessor.length}건</span>
				</div>

				{requestedByProfessor.length === 0 ? (
					<div className="cm-empty">내가 보낸 상담 요청이 없습니다.</div>
				) : (
					<div className="cm-table">
						<DataTable headers={headersSent} data={dataSent} />
					</div>
				)}
			</section>

			{/* 상담확정 */}
			<section className="cm-card">
				<div className="cm-card-head">
					<h3 className="cm-card-title">상담확정</h3>
					<div className="cm-filter">
						<label className="cm-filter-label">과목</label>
						<select className="cm-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
							<option value="">전체 과목</option>
							{subjects.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</select>
						<span className="cm-badge">{filteredUpcoming.length}건</span>
					</div>
				</div>

				{approvedUpcomingList.length === 0 ? (
					<div className="cm-empty">상담확정 일정이 없습니다.</div>
				) : (
					<div className="cm-table">
						<DataTable headers={headers2} data={dataUpcoming} />
					</div>
				)}
			</section>

			{/* 상담완료 */}
			<section className="cm-card">
				<div className="cm-card-head">
					<h3 className="cm-card-title">상담완료</h3>
					<div className="cm-filter">
						<label className="cm-filter-label">과목</label>
						<select className="cm-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
							<option value="">전체 과목</option>
							{subjects.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</select>
						<span className="cm-badge">{filteredPast.length}건</span>
					</div>
				</div>

				{approvedPastList.length === 0 ? (
					<div className="cm-empty">상담완료 일정이 없습니다.</div>
				) : (
					<div className="cm-table">
						<DataTable headers={headers2} data={dataPast} />
					</div>
				)}
			</section>
		</div>
	);
}
