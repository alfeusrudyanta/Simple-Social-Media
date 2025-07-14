import api from '@/services/api';
import apiLocal from '@/services/api-local';

const useApi = (useLocal = false) => {
  return useLocal ? apiLocal : api;
};

export default useApi;
