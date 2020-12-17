import http from '../../helpers/http'
import qs from 'qs'

export default {
    procSearch: (data) => ({
        type: 'SEARCH',
        payload: http().get(`/news?search=${data}`),
    }),
    getSort: (search, sort) => ({
        type: 'SORT',
        payload: http().get(`/news?search=${search}&sort=${sort}&limit=20`)
    })
}