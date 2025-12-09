// const navigate = useNavigate();

// const [user, setUser] = useState(null);
// const [userRole, setUserRole] = useState(null);
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState('');
// const [loginId, setLoginId] = useState('');
// const [password, setPassword] = useState('');

// 로그인
// useEffect(() => {
// 	const loginUser = async () => {
// 		try {
// 			setLoading(true);
// 			const res = await api.post('/auth/login', {
// 				id: loginId,
// 				password: password,
// 			});
// 			console.log('res.data', res.data);
// 			const { id, userRole, accessToken } = res.data;
// 			console.log('app-id', id);
// 			console.log('app-userRole', userRole);
// 			console.log('app-accessToken', accessToken);
// 			if (accessToken) localStorage.setItem('token', accessToken);
// 			if (id) setUser(id); // 유저 아이디 (기본키 저장)
// 			if (userRole) setUserRole(userRole);
// 			// navigate('/index', { replace: true });
// 		} catch (err) {
// 			console.error(err);
// 			setError('로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.');
// 			alert('로그인 실패');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};
// 	loginUser();
// }, []);

{
	/* 로그인: 헤더/푸터 없음 */
}
{
	/* <Route path="/" element={<Home />} />; */
}
{
	/* 그 외 페이지는 헤더+푸터 */
}
<Route element={<MainLayout />}>
	<Route path="/index" element={<Index />} />
	<Route path="/tuilist" element={<TuiList />} /> {/* 등록금 납부 내역 */}
	<Route path="/tuilist/payment" element={<Payment />} /> {/* 등록금 고지서 */}
	<Route path="/tuilist/bill" element={<CreatePayment />} /> {/* 등록금 고지서 생성 (관리자) */}
	<Route path="/userInfo" element={<UserInfo />} /> {/*내 정보 조회*/}
	<Route path="/createProfessor" element={<CreateProfessor />} />
	<Route path="/createStaff" element={<CreateStaff />} />
	<Route path="/createStudent" element={<CreateStudent />} />
	{/* 아래는 공통 컴포넌트인 inputForm, DataTable 사용한 거 테스트 */}
	<Route path="/subjectlist" element={<AllsubList2 />} />
	<Route path="/room" element={<Room />} /> {/* 강의실 등록 */}
	<Route path="/subject" element={<Subject />} /> {/* 강의 등록 */}
	<Route path="/college" element={<College />} /> {/* 단과대 등록 */}
	<Route path="/department" element={<Department />} /> {/* 학과 등록 */}
	<Route path="/colltuit" element={<CollTuit />} /> {/* 단대별 등록금 등록 */}
</Route>;
