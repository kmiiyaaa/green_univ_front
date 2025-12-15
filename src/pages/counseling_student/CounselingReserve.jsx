import { useEffect, useState } from 'react';
import '../../assets/css/CounselingReserve.css';
import api from '../../api/httpClient';
import OptionForm from '../../components/form/OptionForm';
import { getMonday, getWeekDates } from '../../utils/DateTimeUtil';
import LoadCounselingSchedule from './LoadCounselingSchedule';
import { useSearchParams } from 'react-router-dom';

export default function CounselingReserve() {
	const [searchParams] = useSearchParams(); // 내 성적 조회에서 넘어왔는지
	const [subList, setSubList] = useState([]); // 이번 학기에 내가 듣는 과목
	const [subId, setSubId] = useState(null); // 선택한 과목의 아이디
	const [subName, setSubName] = useState('');
	const [counselingSchedule, setCounselingSchedule] = useState([]);

	useEffect(() => {
		const loadSubjectList = async () => {
			const res = await api.get('/subject/semester'); // 학생 기준 수강 과목
			setSubList(res.data.subjectList);
		};
		loadSubjectList();
	}, []);

	const subjectOptions = subList.map((s) => ({
		value: s.id,
		label: s.name,
	}));

	// 과목 검색 후, 가능한 교수의 예약 목록 조회
	const loadSchedules = async () => {
		const monday = getMonday(); // 이번 주 월요일 기준
		const weekDates = getWeekDates(monday);
		console.log(subId);
		try {
			const res = await api.get('/preReserve/byProfessorId', {
				params: {
					subId: subId,
					weekStartDate: weekDates[0],
				},
			});
			setCounselingSchedule(res.data.counselingScheduleList);
			setSubName(res.data.subName);
			console.log(res.data.counselingScheduleList);
		} catch (e) {
			console.log(e);
		}
	};

	// 내 성적 창에서 넘어옴 (파라미터로)
	useEffect(() => {
		const param = searchParams.get('subjectId');

		if (param) {
			setSubId(Number(param)); // 파라미터 있으면 세팅
		}
	}, [searchParams]);

	useEffect(() => {
		loadSchedules();
	}, [subId]);

	return (
		<div className="reserve-wrap">
			<h2>상담 예약</h2>

			{/* 과목 선택 */}
			<div className="section">
				<OptionForm
					label="수강 과목"
					name="subject"
					value={subId ?? ''}
					onChange={(e) => setSubId(Number(e.target.value))}
					options={subjectOptions}
				/>
			</div>

			{subId ? (
				<div>
					<LoadCounselingSchedule counselingSchedule={counselingSchedule} subName={subName} />
				</div>
			) : (
				'아직 선택된 과목이 없습니다.'
			)}
		</div>
	);
}
