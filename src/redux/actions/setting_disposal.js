import http from '../../helpers/http';
import qs from 'qs';

export default {
    getSettingDisposal: (token, search, limit) => ({
        type: 'GET_SETTING-DISPOSAL',
        payload: http(token).get(`/setting-disposal/get?search=${search}&limit=${limit}`),
    }),
    getAllSettingDisposal: (token, search, limit) => ({
        type: 'GET_ALL_SETTING-DISPOSAL',
        payload: http(token).get('/setting-disposal/all'),
    }),
    addSettingDisposal: (token, data) => ({
        type: 'ADD_SETTING-DISPOSAL',
        payload: http(token).post('/setting-disposal/add', qs.stringify(data)),
    }),
    updateSettingDisposal: (token, id, data) => ({
        type: 'UPDATE_SETTING-DISPOSAL',
        payload: http(token).patch(`/setting-disposal/update/${id}`, qs.stringify(data)),
    }),
    deleteSettingDisposal: (token, id, data) => ({
        type: 'DELETE_SETTING-DISPOSAL',
        payload: http(token).delete(`/setting-disposal/delete/${id}`, qs.stringify(data)),
    }),
    getDetailSettingDisposal: (token, id) => ({
        type: 'GET_DETAIL_SETTING-DISPOSAL',
        payload: http(token).get(`/setting-disposal/detail/${id}`),
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_SETTING-DISPOSAL',
        payload: http(token).get(`${link}`),
    }),
    resetError: () => ({
        type: 'RESET_SETTING-DISPOSAL',
    }),
};
