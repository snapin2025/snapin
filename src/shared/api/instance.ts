import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: 'https://inctagram.work/api/v1/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// Response interceptor
// apiInstance.interceptors.response.use(
// 	(response) => response,
// 	async (error: AxiosError) => {
// 		if (error.response?.status === 401) {
// 			try {
// 				const response = await axios.post(
// 					"https://inctagram.work/api/v1/auth/update-tokens",
// 					{},
// 					{ withCredentials: true },
// 				);
//
// 				const newToken = response.data.accessToken;
// 				localStorage.setItem("accessToken", newToken);
//
// 				// Повторяем оригинальный запрос с новым токеном
// 				if (error.config && error.config.headers) {
// 					error.config.headers.Authorization = `Bearer ${newToken}`;
// 					return apiInstance(error.config);
// 				}
// 			} catch (refreshError) {
// 				localStorage.removeItem("accessToken");
// 				window.location.href = "/login";
// 				return Promise.reject(refreshError);
// 			}
// 		}
// 		return Promise.reject(error);
// 	},
// );

// export const createInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
//   return api({
//     ...config,
//     ...options
//   }).then((r) => r.data)
// }

export type BodyType<Data> = Data

export type ErrorType<Error> = AxiosError<Error>
//
// export type SecondParameter<T extends (...args: any) => any> = T extends (
//     config: any,
//     args: infer P,
//   ) => any
//   ? P
//   : never;
