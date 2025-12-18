import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/httpClient';
import { useNavigate } from 'react-router-dom';
import OptionForm from '../../../components/form/OptionForm';
import DataTable from '../../../components/table/DataTable';

export default function MyStatus() {
	const [riskList, setRiskList] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');
	const navigate = useNavigate();

	// 교수 -> 학생 상담요청(PreReserve: 수락/거절 대상)
	const [preReserveList, setPreReserveList] = useState([]);

	const loadMyRisk = async () => {
		try {
			const res = await api.get('/risk/me');

			// 서버가 list를 바로 주는 경우가 대부분이라 둘 다 대응
			const list = res.data?.riskList ?? res.data ?? [];
			setRiskList(list);
		} catch (e) {
			alert(e?.response?.data?.message ?? '조회 실패');
			console.error(e);
		}
	};

	// 내가 받은 교수 상담요청 목록
	const loadMyPreReserves = async () => {
		try {
			const res = await api.get('/reserve/pre/list/student');
			const list = res.data?.list ?? res.data ?? [];
			setPreReserveList(list);
		} catch (e) {
			alert(e?.response?.data?.message ?? '교수 상담요청 조회 실패');
			console.error(e);
		}
	};

	useEffect(() => {
		loadMyRisk();
		loadMyPreReserves();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const subjectOptions = useMemo(() => {
		const map = new Map();
		riskList.forEach((r) => {
			if (r.subjectId) map.set(String(r.subjectId), r.subjectName ?? '');
		});

		const options = [{ value: '', label: '전체' }];
		for (const [value, label] of map.entries()) {
			options.push({ value, label });
		}
		return options;
	}, [riskList]);

	const filteredRiskList = useMemo(() => {
		if (!selectedSubjectId) return riskList;
		return riskList.filter((r) => String(r.subjectId) === String(selectedSubjectId));
	}, [riskList, selectedSubjectId]);

	const headers = ['과목', '교수', '메시지', '상담요청'];

	const tableData = useMemo(() => {
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

	// 교수 상담요청 테이블
	const preHeaders = ['과목', '교수', '상담일자', '시간', '요청메시지', '처리'];

	const acceptPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/accept', null, { params: { preReserveId } });
			alert('상담 요청을 수락했습니다.');
			await loadMyPreReserves();
		} catch (e) {
			alert(e?.response?.data?.message ?? '수락 실패');
			console.error(e);
		}
	};

	const rejectPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/reject', null, { params: { preReserveId } });
			alert('상담 요청을 거절했습니다.');
			await loadMyPreReserves();
		} catch (e) {
			alert(e?.response?.data?.message ?? '거절 실패');
			console.error(e);
		}
	};

	const preTableData = useMemo(() => {
		return (preReserveList ?? []).map((p) => ({
			과목: p.subjectName ?? '',
			교수: p.professorName ?? '',
			상담일자: p.counselingDate ?? '',
			시간: p.startTime != null && p.endTime != null ? `${p.startTime}:00 ~ ${p.endTime}:50` : '',
			요청메시지: p.reason ?? '',
			처리: (
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						type="button"
						onClick={(ev) => {
							ev.stopPropagation();
							acceptPre(p.preReserveId);
						}}
					>
						수락
					</button>
					<button
						type="button"
						onClick={(ev) => {
							ev.stopPropagation();
							rejectPre(p.preReserveId);
						}}
					>
						거절
					</button>
				</div>
			),
		}));
	}, [preReserveList]);

	return (
		<div className="risk-wrap">
			<h1>내 학업 상태</h1>

			<div>
				<h3>내 위험 과목</h3>
				{/* 과목 선택 옵션 */}
				<div className="filter-bar">
					<OptionForm
						label="과목"
						name="subjectId"
						value={selectedSubjectId}
						onChange={(e) => setSelectedSubjectId(e.target.value)}
						options={subjectOptions}
					/>
				</div>
				<DataTable headers={headers} data={tableData} />
			</div>
			<hr />
			<div>
				<h3>교수의 상담 요청 내역</h3>
				<DataTable headers={preHeaders} data={preTableData} />
			</div>
		</div>
	);
}
