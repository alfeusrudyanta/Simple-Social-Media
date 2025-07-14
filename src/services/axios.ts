import axios from 'axios';

const createAxiosInstance = (baseURL: string, timeout: number = 10000) => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor
  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const AxiosInstanceLocal = createAxiosInstance(
  process.env.NEXT_PUBLIC_BASE_API_URL
    ? process.env.NEXT_PUBLIC_BASE_API_URL
    : ''
);

const AxiosInstancePublic = createAxiosInstance(
  process.env.NEXT_PUBLIC_LOCAL_API_URL
    ? process.env.NEXT_PUBLIC_LOCAL_API_URL
    : ''
);

export { AxiosInstanceLocal, AxiosInstancePublic };
