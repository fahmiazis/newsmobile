const authState = {
    isLogin: false,
    isRegister: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
};

export default (state=authState, action) => {
        switch(action.type){
            case 'AUTH_USER_PENDING': {
                return {
                    ...state,
                    isError: false,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'AUTH_USER_FULFILLED': {
                return {
                    ...state,
                    isLogin: true,
                    isError: false,
                    isRegister: false,
                    token: action.payload.data.Token,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'AUTH_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isLogin: false,
                    isError: true,
                    alertMsg: 'Login Failed'
                };
            }
            case 'REGISTER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'REGISTER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isLogin: false,
                    isRegister: true,
                    isError: false,
                    alertMsg: 'Register Succesfully'
                };
            }
            case 'REGISTER_REJECTED': {
                return {
                    ...state,
                    isRegister: false,
                    isError: true,
                    alertMsg: 'Register Failed'
                };
            }
            case 'LOGOUT': {
                return {
                    ...state,
                    isRegister: false,
                    isLogin: false,
                    alertMsg: 'Logout success',
                    token: ''
                };
            }
            default: {
                return state;
            }
        }
    }