import http from '../../helpers/http'
import qs from 'qs'

export default {
    getMyArticle: (token) => ({
        type: 'GET_MY_ARTICLE',
        payload: http(token).get(`/private/news/user`),
    }),
    addArticle: (token, data) => ({
        type: 'ADD_ARTICLE',
        payload: http(token).post(`/private/news/post`, qs.stringify(data)),
    }),
    uploadPictureNews: (token, id, data) => ({
        type: 'PICTURE_NEWS',
        payload: http(token).patch(`/private/news/post/images/${id}`, data)
    }),
    deleteArticle: (token, id) => ({
        type: 'DELETE_NEWS',
        payload: http(token).delete(`/private/news/delete/${id}`)
    }),
    editArticle: (token, id, data) => ({
        type: 'EDIT_ARTICLE',
        payload: http(token).patch(`/private/news/edit/${id}`, qs.stringify(data))
    })
}