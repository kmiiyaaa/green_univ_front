import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import GradeInput from './GradeInput';

export default function SubjectStudentList({ subjectId, subName, setListOpen }) {
	// 과목 별 수강 학생 조회
	const [studentList, setStudentList] = useState([]);
	const [stuNum, setStuNum] = useState(0); // 수강 학생 수
	const [gradeitem, setGradeItem] = useState([]); // 점수기입용 데이터
	const [openGrade, setOpenGrade] = useState(false); // 점수기입 화면 열기 여부

	const loadStudentList = async () => {
		try {
			const res = await api.get(`/professor/subject/${subjectId}`);
			console.log(res.data);
			setStudentList(res.data.studentList);
			setStuNum(res.data.stuNum);
		} catch (e) {
			console.error('수강 학생 조회 에러 : ', e);
		}
	};
	useEffect(() => {
		loadStudentList();
	}, [openGrade]);

	// 점수 기입 컴포넌트 열기 (넘겨줄 props들)
	const handleOpenGrade = useCallback(
		(s) => {
			setGradeItem([
				{
					...s, // 기존 학생 정보
					subjectId: subjectId, // 과목 ID 추가
				},
			]);
			setOpenGrade(true);
		},
		[subjectId]
	);

	// 상대평가 과목 : 성적을 모두 기입한 경우, 전체 학생 등급 산출
	const getRelativeGrade = async () => {
		if (window.confirm('전체 학생 등급을 산출하시겠습니까?'))
			try {
				await api.patch(`/professor/relativeGrade/${subjectId}`);
				alert('등급 산출이 완료되었습니다!');
				await loadStudentList(); // 추가
			} catch (e) {
				alert(e.response.data.message);
				console.error('전체 학생 등급 산출 에러 : ', e);
			}
		loadStudentList();
	};

	// 테이블 데이터
	const headers = [
		'번호',
		'이름',
		'소속',
		'결석',
		'지각',
		'과제점수',
		'중간시험',
		'기말시험',
		'환산점수',
		'등급',
		'경고여부',
		'점수기입',
	];

	const tableData = useMemo(() => {
		return studentList.map((s) => ({
			번호: s.studentId ?? '',
			이름: s.studentName ?? '',
			소속: s.deptName ?? ' ',
			결석: s.absent ?? ' ',
			지각: s.lateness ?? ' ',
			과제점수: s.homework ?? ' ',
			중간시험: s.midExam ?? ' ',
			기말시험: s.finalExam ?? ' ',
			환산점수: s.convertedMark ?? ' ',
			등급: s.grade ?? '',
			경고여부: s.status ?? '',
			점수기입: <button onClick={() => handleOpenGrade(s)}>점수기입</button>,
		}));
	}, [studentList, handleOpenGrade]);

	// 최종 확정/AI 상태
	const [finalizeLoading, setFinalizeLoading] = useState(false);
	const [analysisStatus, setAnalysisStatus] = useState('IDLE');
	// IDLE | RUNNING | SUCCESS | FAIL
	const [analysisMessage, setAnalysisMessage] = useState('');

	// 1) 확정 버튼 클릭
	const finalizeGradeAndAi = async () => {
		if (!window.confirm('최종 성적을 확정할까요? 확정 후에는 수정이 제한될 수 있어요.')) return;

		setFinalizeLoading(true);
		try {
			await api.post(`/professor/subjects/${subjectId}/finalize`);
			setAnalysisStatus('RUNNING');
			setAnalysisMessage('AI 분석중...');
			await loadStudentList(); // 확정 후 화면 갱신(최종확정 컬럼 보여줄 거면)
		} catch (e) {
			console.error('성적 확정 실패 : ', e);
			setAnalysisStatus('FAIL');
			setAnalysisMessage(e.response?.data?.message ?? '성적 확정 실패');
		} finally {
			setFinalizeLoading(false);
		}
	};

	// 2) 분석 상태 폴링 (RUNNING일 때만)
	useEffect(() => {
		if (analysisStatus !== 'RUNNING') return;

		const intervalId = setInterval(async () => {
			try {
				// 백엔드 필요: AI 배치 상태 조회 API
				const res = await api.get(`/professor/subjects/${subjectId}/ai-status`);
				// 예: { status: "RUNNING"|"SUCCESS"|"FAIL", message: "...", done: 12, total: 40 }
				const { status, message } = res.data;

				if (status === 'RUNNING') {
					setAnalysisMessage(message ?? 'AI 분석중...');
					return;
				}

				if (status === 'SUCCESS') {
					setAnalysisStatus('SUCCESS');
					setAnalysisMessage(message ?? 'AI 분석 완료');
					clearInterval(intervalId);
					await loadDropoutRisks(); // 결과 테이블 추가
					return;
				}

				if (status === 'FAIL') {
					setAnalysisStatus('FAIL');
					setAnalysisMessage(message ?? 'AI 분석 실패');
					clearInterval(intervalId);
					await loadDropoutRisks(); // 결과 테이블 추가 (부분 성공 표시용)
				}
			} catch (e) {
				// 폴링은 잠깐 네트워크 흔들려도 계속 돌게 두는 게 보통 좋아
				console.warn('AI 상태 조회 실패(폴링): ', e?.message);
			}
		}, 3000);

		// cleanup 중요 (컴포넌트 닫히거나 subjectId 바뀌면 interval 중지) [web:92]
		return () => clearInterval(intervalId);
	}, [analysisStatus, subjectId]);

	const [riskList, setRiskList] = useState([]);

	const loadDropoutRisks = async () => {
		try {
			const res = await api.get(`/risk/${subjectId}/dropout-risks`);
			setRiskList(res.data);
		} catch (e) {
			console.error('DropoutRisk 조회 실패: ', e);
		}
	};

	useEffect(() => {
		loadDropoutRisks();
	}, [subjectId]);

	const riskHeaders = [
		'학번',
		'이름',
		'위험타입',
		'위험레벨',
		'상태',
		'AI요약',
		'교수권장',
		// '학생메시지',
		'태그',
		'업데이트',
	];

	const riskTableData = useMemo(() => {
		return riskList.map((r) => ({
			학번: r.studentId ?? '',
			이름: r.studentName ?? '',
			위험타입: r.riskType ?? '',
			위험레벨: r.riskLevel ?? '',
			상태: r.status ?? '',
			AI요약: r.aiSummary ?? '',
			교수권장: r.aiRecommendation ?? '',
			// 학생메시지: r.aiStudentMessage ?? '',
			태그: r.aiReasonTags ?? '',
			업데이트: r.updatedAt ?? '',
		}));
	}, [riskList]);

	return (
		<div>
			{!openGrade && (
				// 학생 리스트 조회
				<div>
					<h2>[{subName}] 학생 리스트 조회</h2>
					<hr />

					<div style={{ marginBottom: '12px' }}>
						<h3>최종 성적 확정</h3>
						<button onClick={finalizeGradeAndAi} disabled={finalizeLoading || analysisStatus === 'RUNNING'}>
							{finalizeLoading ? '확정 중...' : '확정하고 AI 돌리기'}
						</button>

						<span style={{ marginLeft: '10px' }}>
							{analysisStatus === 'RUNNING' && '분석중'}
							{analysisStatus === 'SUCCESS' && '완료'}
							{analysisStatus === 'FAIL' && '실패'}
						</span>

						{analysisMessage && <div style={{ marginTop: '6px' }}>{analysisMessage}</div>}
					</div>

					<h3 style={{ marginTop: '24px' }}>AI 위험 분석 결과</h3>
					{riskList.length > 0 ? (
						<DataTable headers={riskHeaders} data={riskTableData} />
					) : (
						<div>아직 AI 분석 결과가 없습니다.</div>
					)}

					{studentList.length > 0 ? (
						<div>
							{' '}
							<h4>
								수강 인원 : {stuNum}명 ({stuNum < 20 ? '절대평가' : '상대평가'})
							</h4>
							{/* 상대평가 과목일 때, 전체 학생 등급 산출 */}
							{stuNum >= 20 && <button onClick={() => getRelativeGrade()}>전체 학생 등급 산출</button>}
							* 직접 수정한 등급도 전체 등급 재산출 시 자동 등급으로 다시 변경됩니다.
							<br />
							<button onClick={() => setListOpen()}>내 강의 목록</button>
							<DataTable headers={headers} data={tableData} />
						</div>
					) : (
						<h4>해당 강의를 수강하는 학생이 존재하지 않습니다.</h4>
					)}
				</div>
			)}

			{/* 학생 점수 기입 */}
			{openGrade && <GradeInput gradeitem={gradeitem} setOpenGrade={setOpenGrade} stuNum={stuNum} />}
		</div>
	);
}
