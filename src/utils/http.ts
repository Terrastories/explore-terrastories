import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['Axios'] = 'application/json';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
)

export default axios;
