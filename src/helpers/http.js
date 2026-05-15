// src/helpers/http.js
import {default as axios} from 'axios';
import store from '../redux/store';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from './navigation';
import {API_URL} from '@env';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL: API_URL,
});

// ── request: inject token ──────────────────────────────────────────────────
instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {config.headers.Authorization = `Bearer ${token}`;}
  return config;
});

// ── response: handle expired token ────────────────────────────────────────
instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isExpired = error.response?.status === 401 &&
                      error.response?.data?.expired === true;

    if (!isExpired || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      console.log('try get new access token');
      const res = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: store.getState().auth.refresh_token,
      });

      console.log(res);

      const { access_token, refresh_token } = res.data;
      console.log(res.data);

      // dispatch ke reducer biar setItem dan update state di satu tempat
      store.dispatch({
        type: 'REFRESH_TOKEN_FULFILLED',
        payload: { data: { access_token, refresh_token } },
      });

      processQueue(null, access_token);
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return instance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      store.dispatch({ type: 'LOGOUT' });

      if (navigationRef.current) {
        navigationRef.current.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
            })
        );
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

const http = (token = false) => instance;

export default http;
