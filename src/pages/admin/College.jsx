import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from './../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';
import '../../assets/css/College.css';

const College = () => {
	// 단과대 전용 상태 관리
	const [formData, setFormData] = useState({
		name: '',
	});

	// 단과대 목록 가져오기
	const [collegeList, setCollegeList] = useState([]);

	// 선택된 단과대 저장 - 삭제
	const [selectedCollege, setSelectedCollege] = useState(null);

	const loadCollege = async () => {
		try {
			// 1. 백엔드 호출
			const res = await api.get('/admin/college');

			// 2. 데이터 구조 확인 (백엔드가 Map으로 줬으므로 .subjectList로 접근)
			const rawData = res.data.collegeList;

			// 3. 데이터 가공 (핵심!: DB 필드 -> 테이블 헤더 이름으로 변환)
			const formattedData = rawData.map((col) => ({
				id: col.id, // 클릭 이벤트 등을 위해 ID는 보통 숨겨서라도 가지고 있음
				단과대이름: col.name,
				원본데이터: col, // 필요하면 원본도 통째로 넣어둠 (선택사항)
			}));

			setCollegeList(formattedData);
			console.log('가공된 데이터:', formattedData);
		} catch (e) {
			console.error('단과대 목록 로드 실패:', e);
		}
	};

	// 처음 마운트 될때 호출
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadCollege();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/college', formData);
			console.log('단과대 등록 성공:', res.data);
			alert('단과대 등록 완료!');

			// 등록 후 입력값 비우기
			setFormData({ name: '' });
			// 등록 끝난 다음, 최신 목록 다시 가져오기
			await loadCollege();
		} catch (e) {
			console.error('단과대 등록 실패:', e);
		}
	};

	// 단과대 수정
	// const handleUpdate = async () => {
	// 	try {
	// 		await api.post();
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };

	// 단과대 삭제
	const handleDelete = async () => {
		if (!selectedCollege) {
			alert('삭제할 단과대를 먼저 선택해주세요.');
			return;
		}

		if (!window.confirm(`'${selectedCollege.단과대이름}' 단과대를 삭제하시겠습니까?`)) {
			return;
		}

		try {
			await api.delete(`/admin/college/delete/${selectedCollege.id}`);

			alert('단과대 삭제가 완료되었습니다.');

			setSelectedCollege(null); // 선택 해제
			await loadCollege(); // 목록 새로고침
		} catch (e) {
			console.error('단과대 삭제 실패:', e);
			alert('단과대 삭제 중 오류가 발생했습니다.');
		}
	};

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['id', '단과대이름'];

	return (
		<div className="form-container">
			<h3>단과대 등록</h3>

			{/* ✅ 입력창 + 등록 버튼 한 줄 */}
			<div className="subject--form college-form-row">
				<InputForm label="단과대" name="name" value={formData.name} onChange={handleChange} />

				<button onClick={handleSubmit} className="button college-add-btn">
					단과대 등록
				</button>
			</div>

			{/* ✅ 선택 안내 + 삭제 버튼 영역 */}
			<div className="college-selected-panel">
				{selectedCollege ? (
					<>
						<p>
							🧡 선택된 단과대: <strong>{selectedCollege.단과대이름}</strong> (ID: {selectedCollege.id})
						</p>
						<button onClick={handleDelete} className="button college-delete-btn">
							선택 단과대 삭제
						</button>
					</>
				) : (
					<p>삭제하려면 단과대 목록에서 하나를 클릭해주세요.</p>
				)}
			</div>

			<h3>단과대 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={collegeList}
					onRowClick={(row) => {
						console.log('클릭한 단과대:', row.단과대이름);
						setSelectedCollege(row);
					}}
				/>
			</div>
		</div>
	);
};
export default College;
