import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import DataTable from '../../../components/table/DataTable';

export default function MyCounselingManage() {
	const [allList, setAllList] = useState([]);
	const [loadingId, setLoadingId] = useState(null);

	// 상담 일정(approved) 과목 필터
	const [subjectId, setSubjectId] = useState('');

	// ✅ 전체 목록 로드 (한 번만)
	const loadAll = async () => {
		const res = await api.get('/reserve/list/professor');
		setAllList(res.data ?? []);
	};

	useEffect(() => {
		loadAll();
	}, []);

	// ✅ REQUESTED / APPROVED 분리
	const requestedList = useMemo(() => allList.filter((r) => r.approvalState === 'REQUESTED'), [allList]);

	const approvedList = useMemo(() => allList.filter((r) => r.approvalState === 'APPROVED'), [allList]);

	// ✅ 승인/반려 처리 → 처리 후 재조회하면
	// 요청에서 사라지고(REQUESTED 아님) 상담일정에 자동 등장(APPROVED)
	const handleDecision = async (reserveId, decision) => {
		try {
			setLoadingId(reserveId);

			await api.post('/reserve/decision', null, {
				params: { reserveId, decision },
			});

			// ✅ 동기화 핵심!
			await loadAll();
		} catch (e) {
			alert('처리 실패! 잠시 후 다시 시도해주세요.');
		} finally {
			setLoadingId(null);
		}
	};

	// ----------------------
	// 1) 상담 요청 테이블
	// ----------------------
	const headers1 = ['학생', '과목', '상담사유', '상세', '처리'];

	const data1 = useMemo(() => {
		return requestedList.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담사유: r.reason ?? '',
			상세: (
				<button
					type="button"
					onClick={() => {
						sessionStorage.setItem('counselingDetail', JSON.stringify(r));
						window.open('/counseling/info', '_blank');
					}}
				>
					보기
				</button>
			),
			처리: (
				<div style={{ display: 'flex', gap: 8 }}>
					<button type="button" disabled={loadingId === r.id} onClick={() => handleDecision(r.id, '승인')}>
						승인
					</button>
					<button type="button" disabled={loadingId === r.id} onClick={() => handleDecision(r.id, '반려')}>
						반려
					</button>
				</div>
			),
		}));
	}, [requestedList, loadingId]);

	// ----------------------
	// 2) 상담 일정 테이블
	// ----------------------

	// 과목 목록 (APPROVED 기준 중복 제거)
	const subjects = useMemo(() => {
		const map = new Map();
		approvedList.forEach((r) => {
			if (r.subject) map.set(r.subject.id, r.subject.name);
		});
		return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
	}, [approvedList]);

	// 과목 필터 적용
	const filteredApproved = useMemo(() => {
		if (!subjectId) return approvedList;
		return approvedList.filter((r) => r.subject?.id === Number(subjectId));
	}, [approvedList, subjectId]);

	const headers2 = ['학생', '과목', '상담일자', '방코드', '상세'];

	const data2 = useMemo(() => {
		return filteredApproved.map((r) => ({
			학생: r.student?.name ?? '',
			과목: r.subject?.name ?? '',
			상담일자: r.counselingSchedule?.counselingDate ?? '',
			방코드: r.roomCode ?? '',
			상세: (
				<button
					type="button"
					onClick={() => {
						sessionStorage.setItem('counselingDetail', JSON.stringify(r));
						window.open('/counseling/info', '_blank');
					}}
				>
					보기
				</button>
			),
		}));
	}, [filteredApproved]);

	return (
		<div>
			<h2>내 상담 관리</h2>

			<div>
				<h3>상담 요청</h3>
				{requestedList.length === 0 ? (
					<p>처리할 상담 요청이 없습니다.</p>
				) : (
					<DataTable headers={headers1} data={data1} />
				)}
			</div>

			<h3>상담 일정</h3>
			{/* 과목 선택 필터 */}
			<div style={{ marginBottom: '10px' }}>
				<select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
					<option value="">전체 과목</option>
					{subjects.map((s) => (
						<option key={s.id} value={s.id}>
							{s.name}
						</option>
					))}
				</select>
			</div>

			{approvedList.length === 0 ? <p>확정된 상담 일정이 없습니다.</p> : <DataTable headers={headers2} data={data2} />}
		</div>
	);
}
