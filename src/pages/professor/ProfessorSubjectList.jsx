import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import { toHHMM } from '../../utils/DateTimeUtil';
import OptionForm from '../../components/form/OptionForm';
import { refineList } from '../../utils/DeDuple';
import SubjectStudentList from './SubjectStudentList';

export default function ProfessorSubjectList() {
	const [subjectList, setSubjectList] = useState([]);
	const [category, setCategory] = useState(''); // select 선택창 용
	const [categoryOptions, setCategoryOptions] = useState([]); // select 선택창 용

	const [subjectId, setSubjectId] = useState(); // 학생 목록 조회 용
	const [subName, setSubName] = useState(); // 과목 이름 표시 용
	const [listOpen, setListOpen] = useState(false); // 학생 목록 조회 컴포넌트 열기? 여부

	useEffect(() => {
		// 기본 : 지금 학기 강의 목록 불러오기
		const loadProfessorSubjectList = async () => {
			try {
				const res = await api.get('/professor/subject');
				setSubjectList(res.data.subjectList);

				// semesterList를 그대로 refineList에 넘겨야 함
				const refined = refineList(res.data.semesterList);
				setCategoryOptions(refined);

				// 기본값 설정 (옵션 중 첫 번째 값)
				// 학기 선택은 최신순으로 되어있지만,
				// 백에서 현재 날짜 상수처리 되어있어서 거기 수정해야 함
				if (refined.length > 0) {
					setCategory(refined[0].value);
				}
			} catch (e) {
				console.log('교수 - 내 강의 조회 실패! : ', e);
			}
		};

		loadProfessorSubjectList();
	}, []);
	// 년도, 학기 별 강의 검색하기
	const searchProfessorSubject = async () => {
		try {
			const res = await api.post(`/professor/subject`, null, {
				params: {
					period: category,
				},
			});
			setSubjectList(res.data.subjectList);
			console.log('검색 결과 :', subjectList);
		} catch (e) {
			console.log('교수 - 내 강의 검색 실패 : ', e);
		}
	};

	const handleSubDetail = (subjectId) => {
		const url = `/professor/syllabus/${subjectId}`;
		window.open(url, '_blank', 'width=900,height=800,scrollbars=yes');
	};

	const handleStudentList = (subjectId, subName) => {
		setSubjectId(subjectId);
		setSubName(subName);
		setListOpen(true);
	};

	// 테이블 데이터
	const headers = ['학수번호', '강의명', '강의시간', '강의계획서', '학생목록'];

	const subjectTable = useMemo(() => {
		return subjectList.map((s) => ({
			학수번호: s.id ?? '',
			강의명: s.name ?? '',
			강의시간: s.subDay + ' ' + toHHMM(s.startTime) + '-' + toHHMM(s.endTime) + ' (' + s.roomId + ')',
			강의계획서: <button onClick={() => handleSubDetail(s.id)}>강의계획서</button>,
			학생목록: <button onClick={() => handleStudentList(s.id, s.name)}>학생 목록</button>,
		}));
	}, [subjectList]);

	return (
		<div>
			{subjectId && listOpen ? (
				// 학생 목록 컴포넌트
				<SubjectStudentList subjectId={subjectId} subName={subName} setListOpen={setListOpen} />
			) : (
				<div>
					<OptionForm
						name="category"
						label="학기 선택"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						options={categoryOptions}
					/>
					<button onClick={() => searchProfessorSubject()} className="button">
						검색
					</button>
					<DataTable headers={headers} data={subjectTable} />
				</div>
			)}
		</div>
	);
}
