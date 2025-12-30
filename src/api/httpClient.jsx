import axios from 'axios';

const api = axios.create({
	//baseURL: 'http://localhost:8888/api',
	baseURL: '/api',
	withCredentials: true,
});

// 전역 플래그 (HMR/중복 인터셉터에도 1번만 뜨게) - 알림창 중복 방지용 플래그
globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__ ??= false;

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');

		// FormData 요청에서도 Authorization이 빠지지 않도록 AxiosHeaders 대응
		if (token) {
			if (config.headers && typeof config.headers.set === 'function') {
				// AxiosHeaders 인스턴스인 경우(axios v1+)
				config.headers.set('Authorization', `Bearer ${token}`);
			} else {
				// 일반 객체인 경우
				config.headers = {
					...(config.headers || {}),
					Authorization: `Bearer ${token}`,
				};
			}
		}

		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(res) => res,
	(error) => {
		const status = error?.response?.status;

		if (status === 401 && !globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__) {
			globalThis.__TOKEN_EXPIRED_ALERT_SHOWN__ = true;

			// alert('로그인 토큰만료'); // 이미 백엔드에서 alert 창 보내줌

			localStorage.removeItem('token');
			window.location.href = '/';
		}

		return Promise.reject(error);
	}
);

export default api;
