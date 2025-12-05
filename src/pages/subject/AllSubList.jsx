import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import DataTable from '../../components/table/DataTable';

function AllsubList() {
	const { user, userRole, token } = useContext(UserContext);
	const [subjectList, setSubjectList] = useState([]);

	// 강의 목록 조회
	useEffect(() => {
		const loadSubject = async () => {
			try {
				const res = await api.get('/admin/subject');
				setSubjectList(res.data);
				console.log(res.data);
			} catch (e) {
				console.error(e);
			}
		};
		loadSubject();
	}, []);

	// useEffect(() => {
	// 	const loadAllSubject = async () => {
	// 		try {
	// 			const res = api.get('/subject/list/search');
	// 			setSubjectList(res.data);
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	};
	// 	loadAllSubject();
	// }, []);

	return (
		<>
			<h3>모든 강의</h3>
			<DataTable
				headers={['강의명', '교수', '시간']}
				data={subjectList}
				onRowClick={(row) => console.log(row.강의명)}
			/>
		</>
	);
}

export default AllsubList;
