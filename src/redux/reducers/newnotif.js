/* eslint-disable prettier/prettier */
const notifState = {
  isAdd: false,
  isAddDetail: false,
  isUpdate: false,
  isGet: false,
  isDelete: false,
  isLoading: false,
  isError: false,
  alertMsg: '',
  dataNotif: [],
  dataName: [],
  alertM: '',
  alertUpload: [],
  page: {},
  isExport: false,
  detEmail: {},
  link: '',
  dataAllNotif: [],
  isAll: false,
  isUpload: false,
  draftEmail: {},
  isDraft: null,
  isRead: null,
  draftAjuan: null,
  dataRoutes: [
    { web: 'login', mobile: '', sub: '' },
    { web: 'side', mobile: '', sub: '' },
    { web: 'tes', mobile: '', sub: '' },
    { web: 'transaksi', mobile: '', sub: '' },
    { web: 'tablepdf', mobile: '', sub: '' },
    { web: '', mobile: '', sub: '' },
    { web: 'pengadaan', mobile: 'PengadaanTab', sub: 'Pengadaan' },
    { web: 'formio', mobile: '', sub: '' },
    { web: 'depo', mobile: '', sub: '' },
    { web: 'user', mobile: '', sub: '' },
    { web: 'role', mobile: '', sub: '' },
    { web: 'email', mobile: '', sub: '' },
    { web: 'menu', mobile: '', sub: '' },
    { web: 'tempmail', mobile: '', sub: '' },
    { web: 'dokumen', mobile: '', sub: '' },
    { web: 'disposal', mobile: 'DisposalTab', sub: 'Disposal' },
    { web: 'asset', mobile: '', sub: '' },
    { web: 'stock', mobile: 'StockTab', sub: 'Stock' },
    { web: 'cartstock', mobile: 'CartStock', sub: 'CartStock' },
    { web: 'report-disposal', mobile: '', sub: '' },
    { web: 'cart', mobile: '', sub: '' },
    { web: 'rev-disposal', mobile: 'DisposalTab', sub: 'RevisiDisposal' },
    { web: 'approval', mobile: '', sub: '' },
    { web: 'formset', mobile: '', sub: '' },
    { web: 'persetujuan-disposal', mobile: 'DisposalTab', sub: 'PersetujuanDisposal' },
    { web: 'eksdis', mobile: 'DisposalTab', sub: 'EksekusiDisposal' },
    { web: 'taxfin-disposal', mobile: 'DisposalTab', sub: 'TaxFinDisposal' },
    { web: 'mondis', mobile: '', sub: '' },
    { web: 'purchdis', mobile: 'DisposalTab', sub: 'PurchDisposal' },
    { web: 'nav-mutasi', mobile: '', sub: '' },
    { web: 'mutasi', mobile: 'MutasiTab', sub: 'Mutasi' },
    { web: 'ter-mutasi', mobile: '', sub: '' },
    { web: 'track-mutasi', mobile: '', sub: '' },
    { web: 'cart-mutasi', mobile: 'CartMutasi', sub: 'CartMutasi' },
    { web: 'navstock', mobile: '', sub: '' },
    { web: 'navdis', mobile: '', sub: '' },
    { web: 'repstock', mobile: '', sub: '' },
    { web: 'edittax', mobile: '', sub: '' },
    { web: 'editeks', mobile: '', sub: '' },
    { web: 'eks-mutasi', mobile: 'MutasiTab', sub: 'EksekusiMutasi' },
    { web: 'budget-mutasi', mobile: 'MutasiTab', sub: 'BudgetMutasi' },
    { web: 'report-mutasi', mobile: '', sub: '' },
    { web: 'rev-mutasi', mobile: 'MutasiTab', sub: 'RevisiMutasi' },
    { web: 'editstock', mobile: 'StockTab', sub: 'RevisiStock' },
    { web: 'navbar', mobile: '', sub: '' },
    { web: 'editpurch', mobile: '', sub: '' },
    { web: 'monstock', mobile: '', sub: '' },
    { web: 'tespeng', mobile: '', sub: '' },
    { web: 'ekstick', mobile: 'PengadaanTab', sub: 'EksekusiPengadaan' },
    { web: 'navtick', mobile: '', sub: '' },
    { web: 'carttick', mobile: 'CartPengadaan', sub: 'CartPengadaan' },
    { web: 'tracktick', mobile: '', sub: '' },
    { web: 'revtick', mobile: 'PengadaanTab', sub: 'RevisiPengadaan' },
    { web: 'reportio', mobile: '', sub: '' },
    { web: 'notif', mobile: '', sub: '' },
    ],
};

export default (state = notifState, action) => {
  switch (action.type) {
    case 'GET_ALL_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'GET_ALL_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isAll: true,
        dataAllNotif: action.payload.data.result,
        alertMsg: 'get notif Succesfully',
      };
    }
    case 'GET_ALL_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        alertMsg: 'Failed get data notif',
      };
    }
    case 'GET_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'GET_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isGet: true,
        dataNotif: action.payload.data.result.rows,
        page: action.payload.data.pageInfo,
        alertMsg: 'get notif Succesfully',
      };
    }
    case 'GET_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'DRAFT_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'DRAFT_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        draftEmail: action.payload.data,
        isDraft: true,
        alertMsg: 'get notif Succesfully',
      };
    }
    case 'DRAFT_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isDraft: false,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'AJUAN_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'AJUAN_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        draftEmail: action.payload.data,
        draftAjuan: true,
        alertMsg: 'get notif Succesfully',
      };
    }
    case 'AJUAN_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        draftAjuan: false,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'READ_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'READ_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isRead: true,
        alertMsg: 'send notif Succesfully',
      };
    }
    case 'READ_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isRead: false,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'DETAIL_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'DETAIL_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isGet: true,
        detEmail: action.payload.data.result,
        alertMsg: 'get detail notif Succesfully',
      };
    }
    case 'DETAIL_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'NEXT_DATA_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'NEXT_DATA_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isGet: true,
        dataNotif: action.payload.data.result.rows,
        alertMsg: 'next data Succesfully',
        page: action.payload.data.pageInfo,
      };
    }
    case 'NEXT_DATA_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isGet: false,
        isError: true,
        alertMsg: 'Unable connect to server',
      };
    }
    case 'UPDATE_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting',
      };
    }
    case 'UPDATE_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isUpdate: true,
        alertMsg: 'update user Succesfully',
      };
    }
    case 'UPDATE_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        alertMsg: 'failed update notif',
      };
    }
    case 'ADD_NEWNOTIF_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting ...',
      };
    }
    case 'ADD_NEWNOTIF_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isAdd: true,
        isError: false,
        alertMsg: 'add user Succesfully',
      };
    }
    case 'ADD_NEWNOTIF_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        alertMsg: 'failed create notif',
      };
    }
    case 'RESET_NEWNOTIF': {
      return {
        ...state,
        isError: false,
        isUpdate: false,
        isAdd: false,
        isDelete: false,
        isGet: false,
        isExport: false,
        isLoading: false,
        isUpload: false,
        isDraft: null,
        isRead: null,
        draftAjuan: null,
      };
    }
    default: {
      return state;
    }
  }
};
