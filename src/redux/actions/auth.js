import http from '../../helpers/http'
import qs from 'qs'

export default {
    login: (data) => ({
        type: 'AUTH_USER',
        payload: http().post(`/auth/login`, qs.stringify(data)),
    }),
    register: (data) => ({
        type: 'REGISTER',
        payload: http().post(`/auth/register`, qs.stringify(data))
    }),
    logout: () => ({
        type: 'LOGOUT'
    })
}
