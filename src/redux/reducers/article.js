const articleState = {
    isLoading: false,
    isError: false,
    alertMsg: '',
    article: {},
    post: {},
};

export default (state=articleState, action) => {
        switch(action.type){
            case 'GET_MY_ARTICLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_MY_ARTICLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    article: action.payload.data,
                    alertMsg: 'Get article Succesfully'
                };
            }
            case 'GET_MY_ARTICLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get article Failed'
                };
            }
            case 'ADD_ARTICLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'ADD_ARTICLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'add article succesfully',
                    post: action.payload.data.data
                };
            }
            case 'ADD_ARTICLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'add article Failed'
                };
            }
            case 'DELETE_NEWS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'DELETE_NEWS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'delete news Succesfully'
                };
            }
            case 'DELETE_NEWS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'delete news Failed'
                };
            }
            case 'EDIT_ARTICLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'EDIT_ARTICLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'edit article succesfully'
                };
            }
            case 'EDIT_ARTICLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'PICTURE_NEWS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'PICTURE_NEWS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'upload picture succesfully',
                };
            }
            case 'PICTURE_NEWS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            default: {
                return state;
            }
        }
    }