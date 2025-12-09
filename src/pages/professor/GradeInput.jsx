import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/table/DataTable';
import InputForm from '../../components/form/InputForm';
import api from '../../api/httpClient';
import OptionForm from '../../components/form/OptionForm';
// 교수 - 성적 기입 컴포넌트
export default function GradeInput({ gradeitem }) {
	// 학생 기본 정보 props에서 뽑기
	const headers = ['번호', '이름'];
	const tableData = useMemo(() => {
		return gradeitem.map((s) => ({
			번호: s.studentId ?? '',
			이름: s.studentName ?? '',
		}));
	}, [gradeitem]);

	const subjectId = gradeitem[0]?.subjectId;
	const studentId = gradeitem[0]?.studentId;

	// 수정 시 변경되는 값들...
	const [value, setValue] = useState({
		absent: '',
		lateness: '',
		homework: '',
		midExam: '',
		finalExam: '',
		convertedMark: '',
		grade: '',
	});

	// 기존 성적 불러오기
	useEffect(() => {
		const loadGrade = async () => {
			try {
				const res = await api.get(`/professor/subject/${subjectId}/${studentId}`);
				const g = res.data.student; // DTO 구조에 맞게 수정
				setValue({
					absent: g.absent ?? '',
					lateness: g.lateness ?? '',
					homework: g.homework ?? '',
					midExam: g.midExam ?? '',
					finalExam: g.finalExam ?? '',
					convertedMark: g.convertedMark ?? '',
					grade: g.grade ?? '',
				});
			} catch (e) {
				console.log('성적 조회 오류 :', e);
			}
		};
		loadGrade();
	}, [subjectId, studentId]);

	// 성적 입력 및 수정 처리
	const handleChange = (e) => {
		const { name, value } = e.target;
		setValue((p) => ({ ...p, [name]: value }));
	};

	const updateStudentGrade = async () => {
		console.log(value);

		try {
			await api.patch(`/professor/subject/${subjectId}/${studentId}`, value);
		} catch (e) {
            alert(e.response.data.message)
			console.log('성적 입력 실패 : ' + e);
		}
	};

	// 성적 등급 선택 옵션들
	const gradeOptions = [
		{ value: 'A+', label: 'A+' },
		{ value: 'A0', label: 'A0' },
		{ value: 'B+', label: 'B+' },
		{ value: 'B0', label: 'B0' },
		{ value: 'C+', label: 'C+' },
		{ value: 'C0', label: 'C0' },
		{ value: 'D+', label: 'D+' },
		{ value: 'D0', label: 'D0' },
		{ value: 'F', label: 'F' },
	];

	return (
		<div>
			<DataTable headers={headers} data={tableData} />

			<form
				onSubmit={(e) => {
					e.preventDefault();
					updateStudentGrade();
				}}
			>
				<div>
					<InputForm label="결석" name="absent" value={value?.absent} onChange={handleChange} required={false} />
				</div>

				<div>
					<InputForm label="지각" name="lateness" value={value?.lateness} onChange={handleChange} required={false} />
				</div>

				<div>
					<InputForm
						label="과제점수"
						name="homework"
						value={value?.homework}
						onChange={handleChange}
						required={false}
					/>
				</div>

				<div>
					<InputForm label="중간시험" name="midExam" value={value?.midExam} onChange={handleChange} required={false} />
				</div>

				<div>
					<InputForm
						label="기말시험"
						name="finalExam"
						value={value?.finalExam}
						onChange={handleChange}
						required={false}
					/>
				</div>

				<div>
					<InputForm
						label="환산점수"
						name="convertedMark"
						value={value?.convertedMark}
						onChange={handleChange}
						required={false}
					/>
				</div>

				<div>
					<OptionForm
						label="등급"
						name="grade"
						value={value?.grade}
						onChange={handleChange}
						options={gradeOptions}
						placeholder="등급 선택"
					/>
				</div>

				<button type="submit">수정하기</button>
			</form>
		</div>
	);
}
