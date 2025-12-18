import { useEffect, useMemo, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import { toHHMM } from '../../utils/DateTimeUtil';
import OptionForm from '../../components/form/OptionForm';
import { refineList } from '../../utils/DeDuple';
import SubjectStudentList from './SubjectStudentList';
import '../../assets/css/SyllabusButton.css';

export default function ProfessorSubjectList() {
	const [subjectList, setSubjectList] = useState([]);
	const [category, setCategory] = useState('');
	const [categoryOptions, setCategoryOptions] = useState([]);

	const [subjectId, setSubjectId] = useState();
	const [subName, setSubName] = useState();
	const [listOpen, setListOpen] = useState(false);

	// 검색 로직 (초기 진입 + 버튼 공용)
	const searchProfessorSubject = async (period) => {
		try {
			// 조회
			const res = await api.post('/professor/subject', null, {
				params: { period },
			});
			setSubjectList(res.data.subjectList);
		} catch (e) {
			console.log('교수 - 내 강의 검색 실패 : ', e);
		}
	};

	// 최신 학기 자동 검색
	useEffect(() => {
		const init = async () => {
			try {
				const res = await api.get('/professor/subject');

				const refined = refineList(res.data.semesterList);
				if (refined.length === 0) return;

				// 전체 조회 옵션 포함
				const optionsWithAll = [
					{ value: 'ALL', label: '전체' },
					...refined,
				];
				setCategoryOptions(optionsWithAll);

				// 최신 학기
				const latestPeriod = refined[0].value;
				setCategory(latestPeriod);

				// 검색 버튼이 눌린 상태로 시작
				await searchProfessorSubject(latestPeriod);
			} catch (e) {
				console.log('교수 - 내 강의 조회 실패! : ', e);
			}
		};

		init();
	}, []);

	const handleSubDetail = (subjectId) => {
		const url = `/professor/syllabus/${subjectId}`;
		window.open(url, '_blank', 'width=900,height=800,scrollbars=yes');
	};

	const handleStudentList = (subjectId, subName) => {
		setSubjectId(subjectId);
		setSubName(subName);
		setListOpen(true);
	};

	const headers = ['학수번호', '강의명', '강의시간', '강의계획서', '학생목록'];

	const subjectTable = useMemo(() => {
		return subjectList.map((s) => ({
			학수번호: s.id ?? '',
			강의명: s.name ?? '',
			강의시간:
				s.subDay +
				' ' +
				toHHMM(s.startTime) +
				'-' +
				toHHMM(s.endTime) +
				' (' +
				s.roomId +
				')',
			강의계획서: (
				<button className="syllabus-btn" onClick={() => handleSubDetail(s.id)}>
					강의계획서
				</button>
			),
			학생목록: (
				<button  className="syllabus-btn" onClick={() => handleStudentList(s.id, s.name)}>
					학생 목록
				</button>
			),
		}));
	}, [subjectList]);

	return (
		<div>

			<h2>내 강의 조회</h2>
			<br>
			</br>
			{subjectId && listOpen ? (
				<SubjectStudentList
					subjectId={subjectId}
					subName={subName}
					setListOpen={setListOpen}
				/>
			) : (
				<div>
					<OptionForm
						name="category"
						label="학기 선택"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						options={categoryOptions}
					/>

					<button
						onClick={() => searchProfessorSubject(category)}
						className="button"
					>
						검색
					</button>

					<DataTable headers={headers} data={subjectTable} />
				</div>
			)}
		</div>
	);
}
