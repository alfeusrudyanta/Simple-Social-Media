import axios from 'axios';

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const createAxiosInstance = (baseURL: string, timeout: number = 10000) => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Response interceptor
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = getCookie('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const AxiosInstanceLocal = createAxiosInstance(
  process.env.NEXT_PUBLIC_BASE_API_URL || ''
);

const AxiosInstancePublic = createAxiosInstance(
  process.env.NEXT_PUBLIC_LOCAL_API_URL || ''
);

export { AxiosInstanceLocal, AxiosInstancePublic };
