const catState = {
    dataCat: [],
    isLoadingCat: false,
    isErrorCat: false,
    alertMsgCat: '',
    detail: []
};

export default (state=catState, action) => {
        switch(action.type){
            case 'GET_CATEGORY_PENDING': {
                return {
                    ...state,
                    isLoadingCat: true,
                    alertMsg: 'waiting ....'
                };
            }
            case 'GET_CATEGORY_FULFILLED': {
                return {
                    ...state,
                    isLoadingCat: false,
                    isErrorCat: false,
                    dataCat: action.payload.data.data.rows,
                    alertMsg: 'Get data Succesfully'
                };
            }
            case 'GET_CATEGORY_REJECTED': {
                return {
                    ...state,
                    isLoadingCat: false,
                    isErrorCat: true,
                    alertMsgCat: 'get data Failed'
                };
            }
            // case 'GET_DETAIL_PENDING': {
            //     return {
            //         isLoading: true,
            //         alertMsg: 'Waiting....'
            //     };
            // }
            // case 'GET_DETAIL_FULFILLED': {
            //     return {
            //         ...state,
            //         isError: false,
            //         alertMsg: 'Get data success',
            //         detail: action.payload.data.data
            //     };
            // }
            // case 'GET_DETAIL_REJECTED': {
            //     return {
            //         ...state,
            //         isLoading: false,
            //         isError: true,
            //         alertMsg: 'Get data Failed'
            //     };
            // }
            default: {
                return state;
            }
        }
    }