/* eslint-disable prettier/prettier */
import http from '../../helpers/http';
import qs from 'qs';
import { Platform } from 'react-native';

export default {
  // login: (data) => ({
  //   type: 'AUTH_USER',
  //   payload: http().post('/auth/login', qs.stringify(data)),
  // }),
  login: (data) => ({
      type: 'AUTH_USER',
      payload: http().post('/auth/login', qs.stringify({
      ...data,
      device_info: `${Platform.OS} ${Platform.Version}`,
      })),
  }),
  choosePlant: (token, data) => ({
    type: 'CH_PLANT',
    payload: http(token).patch('/user/chplant', qs.stringify(data)),
  }),
  getLogin: (token, id) => ({
    type: 'GET_LOGIN',
    payload: http(token).patch(`/user/data/${id}`),
  }),
  getToken: (token, id) => ({
    type: 'GET_TOKEN',
    payload: http(token).patch(`/user/token/${id}`),
  }),
  setToken: (token) => ({
    type: 'SET_TOKEN',
    payload: {token},
  }),
  logout: () => ({
    type: 'LOGOUT',
  }),
  resetError: () => ({
    type: 'RESET',
  }),
  setDataUser: (data) => ({
    type: 'SET_DATA_USER',
    payload: data,
  }),
  goRoute: () => ({
    type: 'ROUTE',
  }),
};
