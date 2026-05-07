import http from '../../helpers/http';
import qs from 'qs';

export default {
    getAllStatusStock: (token, tipe) => ({
        type: 'GET_STATUS_STOCK',
        payload: http(token).get(`/status-stock/all/${tipe}`),
    }),
    getStatusStock: (token, limit, search, page) => ({
        type: 'GET_ALLSTATUS_STOCK',
        payload: http(token).get(`/status-stock/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`),
    }),
    getDetailStatusStock: (token, id) => ({
        type: 'DETAIL_STATUS_STOCK',
        payload: http(token).get(`/status-stock/detail/${id}`),
    }),
    addStatusStock: (token, data) => ({
        type: 'ADD_STATUS_STOCK',
        payload: http(token).post('/status-stock/add', qs.stringify(data)),
    }),
    updateStatusStock: (token, id, data) => ({
        type: 'UPDATE_STATUS_STOCK',
        payload: http(token).patch(`/status-stock/update/${id}`, qs.stringify(data)),
    }),
    deleteStatusStock: (token, id) => ({
        type: 'DELETE_STATUS_STOCK',
        payload: http(token).delete(`/status-stock/del/${id}`),
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_STATUS_STOCK',
        payload: http(token).post('/status-stock/master', data),
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_STATUS_STOCK',
        payload: http(token).get('/status-stock/export'),
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_STATUS_STOCK',
        payload: http(token).get(`${link}`),
    }),
    // Dropdown status
    getDropdown: (token) => ({
        type: 'GET_DROPDOWN',
        payload: http(token).get('/status-stock/dropdown'),
    }),
    getDropdownByStatusId: (token, id) => ({
        type: 'GET_DROPDOWN_BY_STATUSID',
        payload: http(token).get(`/status-stock/dropdown/${id}`),
    }),
    addDropdown: (token, data) => ({
        type: 'ADD_DROPDOWN',
        payload: http(token).post('/status-stock/dropdown/add', data),
    }),
    updateDropdown: (token, data) => ({
        type: 'UPDATE_DROPDOWN',
        payload: http(token).patch('/status-stock/dropdown/update', data),
    }),
    deleteDropdown: (token, id) => ({
        type: 'DELETE_DROPDOWN',
        payload: http(token).delete(`/status-stock/dropdown/delete/${id}`),
    }),
    resetError: () => ({
        type: 'RESET_STATUS_STOCK',
    }),
};
