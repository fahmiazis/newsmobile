const settingDisposalState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataSettingDisposal: [],
    allSettingDisposal: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detSettingDisposal: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: null,
};

export default (state = settingDisposalState, action) => {
        switch (action.type){
            case 'GET_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'GET_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataSettingDisposal: action.payload.data.result.rows,
                    alertMsg: 'get coa Succesfully',
                    page: action.payload.data.pageInfo,
                };
            }
            case 'GET_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Unable connect to server',
                };
            }
            case 'GET_ALL_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'GET_ALL_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    allSettingDisposal: action.payload.data.result,
                    alertMsg: 'get coa Succesfully',
                    page: action.payload.data.pageInfo,
                };
            }
            case 'GET_ALL_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Unable connect to server',
                };
            }
            case 'DETAIL_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'DETAIL_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detSettingDisposal: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DETAIL_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Unable connect to server',
                };
            }
            case 'NEXT_DATA_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'NEXT_DATA_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo,
                };
            }
            case 'NEXT_DATA_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: 'Unable connect to server',
                };
            }
            case 'UPDATE_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting',
                };
            }
            case 'UPDATE_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully',
                };
            }
            case 'UPDATE_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error,
                };
            }
            case 'ADD_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'ADD_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully',
                };
            }
            case 'ADD_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error,
                };
            }
            case 'DELETE_SETTING-DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...',
                };
            }
            case 'DELETE_SETTING-DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: true,
                    isError: false,
                    alertMsg: 'add user Succesfully',
                };
            }
            case 'DELETE_SETTING-DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error,
                };
            }
            case 'RESET_SETTING-DISPOSAL': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: false,
                    isExport: false,
                    isLoading: false,
                    isUpload: null,
                };
            }
            default: {
                return state;
            }
        }
    };
