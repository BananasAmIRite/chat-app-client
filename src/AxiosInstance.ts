import axios from 'axios';

const AxiosInstance = axios.create({
  withCredentials: true,
});

export default AxiosInstance;
