import http from '../../helpers/http'
import qs from 'qs'

export default {
    getProfile: (token) => ({
        type: 'GET_PROFILE',
        payload: http(token).get(`/profile`),
    }),
    updateProfile: (token, data) => ({
        type: 'UPDATE_PROFILE',
        payload: http(token).patch(`/profile/update`, qs.stringify(data)),
    }),
    uploadImage: (token, data) => ({
        type: 'UPDATE_IMAGE_PROFILE',
        payload: http(token).patch(`/profile/image`, data),
    })
}