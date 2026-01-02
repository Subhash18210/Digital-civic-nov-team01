import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

// This automatically adds the token to every request if it exists
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;