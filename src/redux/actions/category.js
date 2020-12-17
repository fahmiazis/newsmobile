import http from '../../helpers/http'

export default {
    getCategory: (id) => ({
        type: 'GET_CATEGORY',
        payload: http().get(`/category/detail/${id}`),
    })
}