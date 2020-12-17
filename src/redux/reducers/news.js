const newsState = {
    data: {},
    nextData: {},
    isLoading: false,
    isError: false,
    alertMsg: '',
    detail: {},
    same: {},
    sorotan: {},
    isProccess: false
};

export default (state=newsState, action) => {
        switch(action.type){
            case 'GET_NEWS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_NEWS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    data: action.payload.data,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'GET_NEWS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'NEXT_GET_NEWS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....',
                    isProccess: true,
                };
            }
            case 'NEXT_GET_NEWS_FULFILLED': {
                return {
                    ...state,
                    detail: {},
                    isLoading: false,
                    isError: false,
                    isProccess: false,
                    nextData: action.payload.data,
                    data: {
                        ...state.data,
                        data: {
                            rows: [...state.data.data.rows, ...action.payload.data.data.rows]
                        },
                        pageInfo: action.payload.data.pageInfo
                    },
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'NEXT_GET_NEWS_REJECTED': {
                return {
                    ...state,
                    isProccess: false,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'GET_SAME_NEWS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_SAME_NEWS_FULFILLED': {
                return {
                    ...state,
                    detail: {},
                    isLoading: false,
                    isError: false,
                    same: action.payload.data,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'GET_SAME_NEWS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'SOROTAN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'SOROTAN_FULFILLED': {
                return {
                    ...state,
                    detail: {},
                    isLoading: false,
                    isError: false,
                    sorotan: action.payload.data,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'SOROTAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'GET_DETAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'GET_DETAIL_FULFILLED': {
                return {
                    ...state,
                    isError: false,
                    alertMsg: 'Get data success',
                    detail: action.payload.data.data
                };
            }
            case 'GET_DETAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Get data Failed'
                };
            }
            default: {
                return state;
            }
        }
    }