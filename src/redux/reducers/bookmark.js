const bookmarkState = {
    isLoading: false,
    isError: false,
    alertMsg: '',
    bookmark: {}
};

export default (state=bookmarkState, action) => {
        switch(action.type){
            case 'GET_BOOKMARK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_BOOKMARK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    bookmark: action.payload.data,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'GET_BOOKMARK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'ADD_BOOKMARK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'ADD_BOOKMARK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'add bookmark Succesfully'
                };
            }
            case 'ADD_BOOKMARK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'DELETE_BOOKMARK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'DELETE_BOOKMARK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    bookmark: {},
                    alertMsg: 'delete all bookmark Succesfully'
                };
            }
            case 'DELETE_BOOKMARK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'get data Failed'
                };
            }
            case 'DELETE_ITEM_BOOKMARK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'DELETE_ITEM_BOOKMARK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'delete item bookmark Succesfully'
                };
            }
            case 'DELETE_ITEM_BOOKMARK_REJECTED': {
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