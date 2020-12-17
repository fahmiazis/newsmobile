import http from '../../helpers/http'
import qs from 'qs'

export default {
    addBookmark: (token, data) => ({
        type: 'ADD_BOOKMARK',
        payload: http(token).post(`/bookmark/post`, qs.stringify(data))
    }),
    getBookmark: (token) => ({
        type: 'GET_BOOKMARK',
        payload: http(token).get(`/bookmark`)
    }),
    deleteBookmark: (token) => ({
        type: 'DELETE_BOOKMARK',
        payload: http(token).delete(`/bookmark/delete`)
    }),
    deleteItemBookmark: (token, id) => ({
        type: 'DELETE_ITEM_BOOKMARK',
        payload: http(token).delete(`/bookmark/delete/${id}`)
    })
}
