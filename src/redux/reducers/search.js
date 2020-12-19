const searchState = {
    isLoading: false,
    isError: false,
    alertMsg: '',
    search: {},
    sort: {}
};

export default (state=searchState, action) => {
        switch(action.type){
            case 'SEARCH_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'SEARCH_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    alertMsg: 'search successfully',
                    search: action.payload.data
                };
            }
            case 'SEARCH_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: 'fail get profile'
                };
            }
            case 'SORT_PENDING': {
                return {
                    ...state,
                    sort: {},
                    isLoading: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'SORT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    sort: action.payload.data,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'SORT_REJECTED': {
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