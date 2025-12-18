import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import OptionForm from '../../components/form/OptionForm';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/MyStatus.css';

export default function MyStatus() {
	const navigate = useNavigate();

	// 위험과목
	const [riskList, setRiskList] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');

	// 교수 -> 학생 상담요청(PreReserve: 수락/거절 대상)
	const [preReserveList, setPreReserveList] = useState([]);

	// 내 상담 신청/예약 내역(Reserve: 승인/방코드 확인)
	const [reserveList, setReserveList] = useState([]);

	// -----------------------------
	// API
	// -----------------------------

	// 내 위험과목
	const loadMyRisk = async () => {
		try {
			const res = await api.get('/risk/me');
			const list = res.data?.riskList ?? res.data ?? [];
			setRiskList(list);
		} catch (e) {
			alert(e?.response?.data?.message ?? '조회 실패');
			console.error(e);
		}
	};

	// 교수 -> 학생 상담요청 목록(PreReserve)
	const loadMyPreReserves = async () => {
		try {
			const res = await api.get('/reserve/pre/list/student');
			const list = res.data?.list ?? res.data ?? [];
			setPreReserveList(Array.isArray(list) ? list : []);
		} catch (e) {
			console.error(e);
			alert(e?.response?.data?.message ?? `교수 상담요청 목록 로드 실패(${e?.response?.status ?? 'no-status'})`);
			setPreReserveList([]);
		}
	};

	// 내 상담 신청/예약 내역(Reserve)
	const loadMyReserves = async () => {
		try {
			const res = await api.get('/reserve/list');
			setReserveList(res.data ?? []);
		} catch (e) {
			console.error('내 상담 예약 목록 로드 실패:', e);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadMyRisk();
		loadMyPreReserves();
		loadMyReserves();
	}, []);

	// -----------------------------
	// 위험과목 필터 옵션
	// -----------------------------
	const subjectOptions = useMemo(() => {
		const map = new Map();
		riskList.forEach((r) => {
			if (r.subjectId) map.set(String(r.subjectId), r.subjectName ?? '');
		});

		const options = [{ value: '', label: '전체' }];
		for (const [value, label] of map.entries()) options.push({ value, label });
		return options;
	}, [riskList]);

	const filteredRiskList = useMemo(() => {
		if (!selectedSubjectId) return riskList;
		return riskList.filter((r) => String(r.subjectId) === String(selectedSubjectId));
	}, [riskList, selectedSubjectId]);

	// -----------------------------
	// 테이블 1) 내 위험 과목
	// -----------------------------
	const riskHeaders = ['과목', '교수', '메시지', '상담요청'];

	const riskTableData = useMemo(() => {
		return filteredRiskList.map((r) => ({
			과목: r.subjectName ?? '',
			교수: r.professorName ?? '',
			메시지: r.aiStudentMessage ?? '',
			상담요청: (
				<button
					type="button"
					onClick={(ev) => {
						ev.stopPropagation();
						navigate(`/counseling/reserve?subjectId=${r.subjectId}`);
					}}
				>
					상담 요청
				</button>
			),
		}));
	}, [filteredRiskList, navigate]);

	// -----------------------------
	// 테이블 2) 교수 상담요청(PreReserve) - 수락/거절
	// 백엔드: CounselPreReserveDto 기준
	// -----------------------------
	const preHeaders = ['과목', '교수', '일정', '요청메시지', '처리'];

	const preTableData = useMemo(() => {
		return (preReserveList ?? []).map((p) => {
			const date = p.counselingDate ?? '';
			const time = p.startTime != null ? `${p.startTime}:00 ~ ${p.endTime}:50` : '';

			return {
				과목: p.subjectName ?? '',
				교수: p.professorName ?? '',
				일정: `${date} ${time}`,
				요청메시지: p.reason ?? '',
				처리: (
					<div style={{ display: 'flex', gap: 8 }}>
						<button
							type="button"
							onClick={async (ev) => {
								ev.stopPropagation();
								try {
									await api.post('/reserve/pre/accept', null, { params: { preReserveId: p.preReserveId } });
									alert('수락 완료!');
									await loadMyPreReserves();
									await loadMyReserves();
								} catch (e) {
									console.error(e);
									alert(e?.response?.data?.message ?? '수락 실패');
								}
							}}
						>
							수락
						</button>
						<button
							type="button"
							onClick={async (ev) => {
								ev.stopPropagation();
								try {
									await api.post('/reserve/pre/reject', null, { params: { preReserveId: p.preReserveId } });
									alert('거절 완료!');
									await loadMyPreReserves();
								} catch (e) {
									console.error(e);
									alert(e?.response?.data?.message ?? '거절 실패');
								}
							}}
						>
							거절
						</button>
					</div>
				),
			};
		});
	}, [preReserveList]);

	return (
		<div className="risk-wrap">
			<h1>내 학업 상태</h1>

			{/* 1) 내 위험 과목 */}
			<div>
				<h3>내 위험 과목</h3>
				<div className="filter-bar">
					<OptionForm
						label="과목"
						name="subjectId"
						value={selectedSubjectId}
						onChange={(e) => setSelectedSubjectId(e.target.value)}
						options={subjectOptions}
					/>
				</div>
				<DataTable headers={riskHeaders} data={riskTableData} />
			</div>

			<hr />

			{/* 2) 교수의 상담 요청(수락/거절) */}
			<div>
				<h3>교수의 상담 요청 내역(수락/거절)</h3>
				<div style={{ fontSize: 20, fontWeight: 800, color: 'red', border: '3px solid red', padding: 10 }}>
					DEBUG: preReserveList length = {preReserveList?.length} / type ={' '}
					{Array.isArray(preReserveList) ? 'array' : typeof preReserveList}
				</div>
				<div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
					preReserveList length: {preReserveList?.length}
				</div>
				{preReserveList.length === 0 ? (
					<div
						style={{
							padding: 12,
							marginTop: 12,
							border: '1px solid #e5e7eb',
							background: '#fff',
							color: '#111827',
							borderRadius: 8,
						}}
					>
						받은 상담 요청이 없습니다.
					</div>
				) : (
					<DataTable headers={preHeaders} data={preTableData} />
				)}
			</div>
		</div>
	);
}
