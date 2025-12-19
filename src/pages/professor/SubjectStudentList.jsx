import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubjectGrade from '../../hooks/useSubjectGrade';
import DataTable from '../../components/table/DataTable';
import GradeInput from './GradeInput';

export default function SubjectStudentList({ subjectId, subName, setListOpen }) {
	const navigate = useNavigate();
	const [openGrade, setOpenGrade] = useState(false);
	const [gradeItem, setGradeItem] = useState([]);

	const {
		studentList,
		stuNum,
		subNumOfStudent,
		relative,
		aiStatus,
		aiMessage,
		loading,
		calculateGrade,
		finalizeGrade,
		refetch,
	} = useSubjectGrade(subjectId);

	const handleOpenGrade = (student) => {
		setGradeItem([{ ...student, subjectId }]);
		setOpenGrade(true);
	};

	// 테이블 헤더 (동적 생성)
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
		...(subNumOfStudent < 20 || relative ? ['등급'] : []),
		'경고여부',
		'점수기입',
	];

	// 테이블 데이터
	const tableData = studentList.map((s) => ({
		번호: s.studentId,
		이름: s.studentName,
		소속: s.deptName,
		결석: s.absent || '-',
		지각: s.lateness || '-',
		과제점수: s.homework || '-',
		중간시험: s.midExam || '-',
		기말시험: s.finalExam || '-',
		환산점수: s.convertedMark || '-',
		...(subNumOfStudent < 20 || relative ? { 등급: s.letterGrade || '-' } : {}),
		경고여부: s.status || '-',
		점수기입: (
			<button onClick={() => handleOpenGrade(s)} disabled={s.finalized || aiStatus === 'SUCCESS'}>
				{s.finalized || aiStatus === 'SUCCESS' ? '확정완료' : '점수기입'}
			</button>
		),
	}));

	if (openGrade) {
		return <GradeInput gradeItem={gradeItem} setOpenGrade={setOpenGrade} stuNum={stuNum} onSuccess={refetch} />;
	}

	return (
		<div>
			<h2>[{subName}] 학생 리스트 조회</h2>
			<hr />

			{/* AI 분석 완료 */}
			{aiStatus === 'SUCCESS' && (
				<div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
					<h3 style={{ color: '#2563eb' }}>✅ AI 분석 완료</h3>
					<p style={{ color: '#666', marginBottom: '12px' }}>{aiMessage}</p>
					<button
						onClick={() => navigate('/professor/counseling/risk')}
						style={{
							backgroundColor: '#2563eb',
							color: 'white',
							padding: '12px 24px',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
						}}
					>
						위험 학생 관리 보러가기 →
					</button>
				</div>
			)}

			{/* 성적 확정 */}
			{aiStatus !== 'SUCCESS' && (
				<div style={{ marginBottom: '12px' }}>
					<h3>최종 성적 확정</h3>
					<button onClick={finalizeGrade} disabled={loading || aiStatus === 'RUNNING'}>
						{loading ? '성적 확정 및 AI 분석 중...' : '확정하고 AI 돌리기'}
					</button>
					<span style={{ marginLeft: '10px' }}>
						{aiStatus === 'RUNNING' && '분석중'}
						{aiStatus === 'FAIL' && '실패'}
					</span>
					{aiMessage && <div style={{ marginTop: '6px' }}>{aiMessage}</div>}
				</div>
			)}

			{/* 학생 리스트 */}
			{studentList.length > 0 ? (
				<>
					<h4>
						수강 인원: {stuNum}명 ({stuNum < 20 ? '절대평가' : '상대평가'})
					</h4>
					{stuNum >= 20 && <button onClick={calculateGrade}>전체 학생 등급 산출</button>}
					<p>* 직접 수정한 등급도 전체 등급 재산출 시 자동 등급으로 변경됩니다.</p>
					<button onClick={() => setListOpen(false)}>내 강의 목록</button>
					<DataTable headers={headers} data={tableData} />
				</>
			) : (
				<h4>해당 강의를 수강하는 학생이 존재하지 않습니다.</h4>
			)}
		</div>
	);
}
