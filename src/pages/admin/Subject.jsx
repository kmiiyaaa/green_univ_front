import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from '../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';
import { toHHMM } from '../../utils/DateTimeUtil';
import OptionForm from '../../components/form/OptionForm';

// 관리자 강의 등록 + 목록 (페이징 처리 안 됐음)
export default function Subject() {
	const [formData, setFormData] = useState({
		name: '',
		professorName: '',
		roomId: '',
		type: '전공',
		subYear: '',
		semester: '',
		subDay: '월',
		startTime: '',
		endTime: '',
		grades: '',
		capacity: '',
	});

	// 어떤 강의를 수정 중인지 (null이면 "새 등록" 모드)
	const [editingId, setEditingId] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const resetForm = () => {
		setFormData({
			name: '',
			professorName: '',
			roomId: '',
			deptName: '',
			type: '전공',
			subYear: '',
			semester: '',
			subDay: '월',
			startTime: '',
			endTime: '',
			grades: '',
			capacity: '',
		});
		setEditingId(null);
	};

	// 백엔드 SubjectFormDto가 Long을 많이 쓰기 때문에
	// 전송 직전에 숫자 필드는 Number로 변환해서 보냄
	const buildPayload = () => {
		return {
			...formData,
			// 🔹 이제 professorId / deptId는 안 쓰고 이름만 보냄
			// professorId: undefined,
			// deptId: undefined,
			subYear: formData.subYear ? Number(formData.subYear) : null,
			semester: formData.semester ? Number(formData.semester) : null,
			startTime: formData.startTime ? Number(formData.startTime) : null,
			endTime: formData.endTime ? Number(formData.endTime) : null,
			grades: formData.grades ? Number(formData.grades) : null,
			capacity: formData.capacity ? Number(formData.capacity) : null,
			// professorName, deptName, roomId, name, type, subDay 는 문자열 그대로
		};
	};

	const handleSubmit = async () => {
		try {
			const payload = buildPayload();

			let res;
			if (editingId === null) {
				// 새 강의 등록
				res = await api.post('/admin/subject', payload);
				console.log('강의 등록 성공:', res.data);
				alert('강의 등록 완료!');
			} else {
				// 기존 강의 수정
				res = await api.patch(`/admin/subject/${editingId}`, payload);
				console.log('강의 수정 성공:', res.data);
				alert('강의 수정 완료!');
			}

			await loadSubject();
			resetForm();
		} catch (e) {
			console.error('강의 등록/수정 실패:', e);
			if (e.response) {
				console.error('📛 상태코드:', e.response.status);
				console.error('📛 응답 데이터:', e.response.data);
				alert(e.response.data.message || e.response.data || '강의 등록/수정 실패');
			} else {
				alert('강의 등록/수정 실패(네트워크 오류)');
			}
		}
	};

	// 강의 삭제 (이 부분은 그대로 사용)
	const handleDelete = async () => {
		if (editingId === null) {
			alert('삭제할 강의를 먼저 선택해주세요.');
			return;
		}
		if (!window.confirm('정말 이 강의를 삭제하시겠습니까?')) return;

		try {
			const res = await api.delete(`/admin/subject/${editingId}`);
			console.log('강의 삭제 성공:', res.data);
			alert('강의 삭제 완료!');
			await loadSubject();
			resetForm();
		} catch (e) {
			console.error('강의 삭제 실패:', e);
			if (e.response) {
				console.error('📛 상태코드:', e.response.status);
				console.error('📛 응답 데이터:', e.response.data);
				alert(e.response.data.message || e.response.data || '강의 삭제 실패');
			} else {
				alert('강의 삭제 실패(네트워크 오류)');
			}
		}
	};

	// 강의 목록 가져오기
	const [subjectList, setSubjectList] = useState([]);

	const loadSubject = async () => {
		try {
			const res = await api.get('/admin/subject');
			const rawData = res.data.subjectList;
			console.log('강의 원본', rawData);

			const formattedData = rawData.map((sub) => ({
				id: sub.id,
				강의명: sub.name,
				교수: sub.professor ? sub.professor.name : '',
				강의실: sub.room ? sub.room.id : '',
				학과: sub.department ? sub.department.name : '',
				구분: sub.type,
				연도: sub.subYear,
				학기: sub.semester,
				요일: sub.subDay,
				시간: `${sub.subDay}, ${toHHMM(sub.startTime)}-${toHHMM(sub.endTime)}`,
				이수학점: sub.grades,
				정원: sub.capacity,
				원본데이터: sub,
			}));

			setSubjectList(formattedData);
			console.log('가공된 데이터:', formattedData);
		} catch (e) {
			console.error('강의 목록 로드 실패:', e);
		}
	};

	useEffect(() => {
		loadSubject();
	}, []);

	const headers = [
		'id',
		'강의명',
		'교수',
		'강의실',
		'학과',
		'구분',
		'연도',
		'학기',
		'요일',
		'시간',
		'이수학점',
		'정원',
	];

	const SUBJECT_DAY_OPTIONS = [
		{ value: '월', label: '월' },
		{ value: '화', label: '화' },
		{ value: '수', label: '수' },
		{ value: '목', label: '목' },
		{ value: '금', label: '금' },
	];

	// 행 클릭 시 수정 모드로 진입 (이름으로 폼 채우기)
	const handleRowClick = (row) => {
		const sub = row.원본데이터;

		setFormData({
			name: sub.name || '',
			professorName: sub.professor ? sub.professor.name : '',
			roomId: sub.room ? sub.room.id : '',
			deptName: sub.department ? sub.department.name : '',
			type: sub.type || '전공',
			subYear: sub.subYear != null ? String(sub.subYear) : '',
			semester: sub.semester != null ? String(sub.semester) : '',
			subDay: sub.subDay || '월',
			startTime: sub.startTime != null ? String(sub.startTime) : '',
			endTime: sub.endTime != null ? String(sub.endTime) : '',
			grades: sub.grades != null ? String(sub.grades) : '',
			capacity: sub.capacity != null ? String(sub.capacity) : '',
		});
		setEditingId(sub.id);
	};

	return (
		<div className="form-container">
			<h3>강의 등록</h3>
			<div className="subject--form">
				<InputForm
					label="강의명"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="예: 컴퓨터의 이해"
				/>

				<InputForm
					label="담당교수"
					name="professorName"
					value={formData.professorName}
					onChange={handleChange}
					placeholder="예: 홍길동"
				/>

				<InputForm
					label="강의실"
					name="roomId"
					value={formData.roomId}
					onChange={handleChange}
					placeholder="예: A101"
				/>

				<InputForm
					label="학과"
					name="deptName"
					value={formData.deptName}
					onChange={handleChange}
					placeholder="예: 컴퓨터공학과"
				/>

				{/* 라디오/Select는 InputForm으로 만들기 애매해서 직접 작성 (나중에 이것도 분리 가능) */}
				<div className="input-group">
					<label>이수 구분 </label>
					<label>
						<input type="radio" name="type" value="전공" checked={formData.type === '전공'} onChange={handleChange} />{' '}
						전공
					</label>
					<label>
						<input type="radio" name="type" value="교양" checked={formData.type === '교양'} onChange={handleChange} />{' '}
						교양
					</label>
				</div>

				<InputForm
					label="연도"
					name="subYear"
					value={formData.subYear}
					onChange={handleChange}
					placeholder="예: 2025"
				/>
				<InputForm label="학기" name="semester" value={formData.semester} onChange={handleChange} placeholder="예: 1" />

				<OptionForm
					label="요일"
					name="subDay"
					value={formData.subDay}
					onChange={handleChange}
					options={SUBJECT_DAY_OPTIONS}
				/>

				<InputForm
					label="시작 시간"
					name="startTime"
					value={formData.startTime}
					onChange={handleChange}
					placeholder="예 : 900 (09:00)"
				/>
				<InputForm
					label="종료 시간"
					name="endTime"
					value={formData.endTime}
					onChange={handleChange}
					placeholder="예 : 1030 (10:30)"
				/>

				<InputForm label="이수학점" name="grades" value={formData.grades} onChange={handleChange} placeholder="예: 3" />
				<InputForm
					label="정원"
					name="capacity"
					value={formData.capacity}
					onChange={handleChange}
					placeholder="예: 20"
				/>

				<div className="button-row">
					<button onClick={handleSubmit} className="button">
						{editingId === null ? '강의 등록' : '강의 수정'}
					</button>
					<button onClick={handleDelete} className="button button-danger">
						강의 삭제
					</button>
					<button onClick={resetForm} className="button button-secondary">
						새로 입력
					</button>
				</div>
			</div>

			<h3>강의 목록</h3>
			<div>
				<DataTable headers={headers} data={subjectList} onRowClick={handleRowClick} />
			</div>
		</div>
	);
}
