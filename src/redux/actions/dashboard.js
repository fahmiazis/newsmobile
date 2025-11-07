/* eslint-disable prettier/prettier */
import http from '../../helpers/http';
import qs from 'qs';
import moment from 'moment'

export default {
  getDashboard: (token, year) => ({
    type: 'GET_DASHBOARD',
    payload: http(token).get(`/dashboard/get?year=${year === undefined ? moment().format('YYYY') : year}`),
  }),
};
