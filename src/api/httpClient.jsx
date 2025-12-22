import axios from 'axios';

const api = axios.create({
	baseURL: '/api',
	withCredentials: true,
});

// 요청 인터셉터 추가
api.interceptors.request.use(
	(config) => {
		// localStorage에서 토큰 가져오기 (로그인 시 저장했다고 가정)
		const token = localStorage.getItem('token');
		if (token) {
			// 토큰이 있으면 헤더에 추가
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
