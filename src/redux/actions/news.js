import http from '../../helpers/http'

export default {
    getNews: () => ({
        type: 'GET_NEWS',
        payload: http().get(`/news`),
    }),
    nextGetNews: (link) => ({
        type: 'NEXT_GET_NEWS',
        payload: http().get(`${link}`),
    }),
    getSameNews: () => ({
        type: 'GET_SAME_NEWS',
        payload: http().get(`/news`),
    }),
    getDetailNews: (id) => ({
        type: 'GET_DETAIL',
        payload: http().get(`/news/detail/${id}`)
    }),
    sorotan: () => ({
        type: 'SOROTAN',
        payload: http().get('/news?sort=view&limit=4')
    }),
}