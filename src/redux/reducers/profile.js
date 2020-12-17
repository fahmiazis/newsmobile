const authState = {
    isLoading: false,
    isError: false,
    alertMsg: '',
    data: {}
};

export default (state=authState, action) => {
        switch(action.type){
            case 'GET_PROFILE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_PROFILE_FULFILLED': {
                return {
                    ...state,
                    data: action.payload.data.data,
                    alertMsg: 'get data succesfully',
                    isError: false,
                    isLogin: false
                };
            }
            case 'GET_PROFILE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data failed'
                };
            }
            case 'UPDATE_PROFILE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'UPDATE_PROFILE_FULFILLED': {
                return {
                    ...state,
                    alertMsg: 'update profile succesfully',
                    isError: false,
                    isLogin: false
                };
            }
            case 'UPDATE_PROFILE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data failed'
                };
            }
            case 'UPDATE_IMAGE_PROFILE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'UPDATE_IMAGE_PROFILE_FULFILLED': {
                return {
                    ...state,
                    alertMsg: 'update image succesfully',
                    isError: false,
                    isLogin: false
                };
            }
            case 'UPDATE_IMAGE_PROFILE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data failed'
                };
            }
            default: {
                return state;
            }
        }
    }