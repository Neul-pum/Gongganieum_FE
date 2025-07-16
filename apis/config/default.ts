import axios from 'axios';
import Cookies from 'js-cookie';

export const instance = axios.create({
  //baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  baseURL: 'http://gongganieum.site/api/',
  timeout: 20000,
});

instance.interceptors.request.use(function (config) {
  const access_token = Cookies.get('access_token') ?? '';

  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});
