import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from './../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';

const College = () => {
	// 단과대 전용 상태 관리
	const [formData, setFormData] = useState({
		name: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/college', formData);
			console.log('단과대 등록 성공:', res.data);
			alert('단과대 등록 완료!');
		} catch (e) {
			console.error('단과대 등록 실패:', e);
		}
	};

	// 단과대 목록 가져오기
	const [collegeList, setCollegeList] = useState([]);

	useEffect(() => {
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
		loadCollege();
	}, []);

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['id', '단과대이름'];

	return (
		<div className="form-container">
			<h3>단과대 등록</h3>
			<div className="subject--form">
				<InputForm label="단과대" name="name" value={formData.name} onChange={handleChange} />

				<button onClick={handleSubmit} className="button">
					단과대 등록
				</button>
			</div>

			<h3>단과대 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={collegeList}
					onRowClick={(row) => {
						// row에는 위에서 가공한 한글 키들이 들어있음
						console.log('클릭한 단과대:', row.단과대이름);
						// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
					}}
				/>
			</div>
		</div>
	);
};
export default College;
