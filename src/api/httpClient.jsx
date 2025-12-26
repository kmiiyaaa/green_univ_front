import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:8888/api',
	withCredentials: true,
});

// 전역 플래그 (HMR/중복 인터셉터에도 1번만 뜨게)
globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__ ??= false;

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(res) => res,
	(error) => {
		const status = error?.response?.status;
		const msg = error?.response?.data?.message;

		if (status === 401 && msg === '로그인 토큰만료' && !globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__) {
			globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__ = true;

			alert('로그인 토큰만료');
			window.location.href = '/login';
		}

		return Promise.reject(error);
	}
);

export default api;
