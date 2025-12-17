/* eslint-disable prettier/prettier */
const authState = {
  isLogin: false,
  isRegister: false,
  token: '',
  isLoading: false,
  isError: false,
  alertMsg: '',
  dataUser: {},
  chplant: '',
  listUser: [],
  dataToken: {},
};

export default (state = authState, action) => {
  switch (action.type) {
    case 'AUTH_USER_PENDING': {
      return {
        ...state,
        isError: false,
        isLoading: true,
        alertMsg: 'Login in ....',
      };
    }
    case 'AUTH_USER_FULFILLED': {
      // localStorage.setItem('token', action.payload.data.Token)
      // localStorage.setItem('level', action.payload.data.user.user_level)
      // localStorage.setItem('name', action.payload.data.user.username)
      // localStorage.setItem('fullname', action.payload.data.user.fullname)
      // localStorage.setItem('email', action.payload.data.user.email)
      // localStorage.setItem('kode', action.payload.data.user.kode_plant)
      // localStorage.setItem('id', action.payload.data.user.id)
      // localStorage.setItem('role', action.payload.data.user.role)
      // localStorage.setItem('it', action.payload.data.user.status_it)
      // localStorage.setItem('dataUser', action.payload.data.user.dataUser.length)
      return {
        ...state,
        isLogin: true,
        isError: false,
        isLoading: false,
        token: action.payload.data.Token,
        dataUser: action.payload.data.user,
        listUser: action.payload.data.user.dataUser,
        alertMsg: 'Login Succesfully',
      };
    }
    case 'AUTH_USER_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isLogin: false,
        isError: true,
        alertMsg: 'Login Failed',
      };
    }
    case 'SET_DATA_USER': {
      return {
        ...state,
        chplant: action.payload.chplant,
        token: action.payload.token,
        dataUser: action.payload.data,
      };
    }
    case 'REGISTER_PENDING': {
      return {
        ...state,
        isLoading: true,
        alertMsg: 'Waiting....',
      };
    }
    case 'REGISTER_FULFILLED': {
      return {
        ...state,
        isLoading: false,
        isLogin: false,
        isRegister: true,
        isError: false,
        alertMsg: 'Register Succesfully',
      };
    }
    case 'REGISTER_REJECTED': {
      return {
        ...state,
        isRegister: false,
        isError: true,
        alertMsg: 'Register Failed',
      };
    }
    case 'CH_PLANT_PENDING': {
        return {
            ...state,
            isLoading: true,
            alertMsg: 'Login in ....',
        };
    }
    case 'CH_PLANT_FULFILLED': {
        return {
            ...state,
            chplant: action.payload.data.result.kode_plant,
            isLoading: false,
            alertMsg: 'Login Succesfully',
        };
    }
    case 'CH_PLANT_REJECTED': {
        return {
            ...state,
            isLoading: false,
            alertMsg: 'Login Failed',
        };
    }
    case 'GET_LOGIN_PENDING': {
        return {
            ...state,
            isLoading: true,
            alertMsg: 'Login in ....',
        };
    }
    case 'GET_LOGIN_FULFILLED': {
        return {
            ...state,
            isLoading: false,
            dataUser: action.payload.data.result,
            alertMsg: 'Login Succesfully',
        };
    }
    case 'GET_LOGIN_REJECTED': {
        return {
            ...state,
            isLoading: false,
            alertMsg: 'Login Failed',
        };
    }
    case 'GET_TOKEN_PENDING': {
        return {
            ...state,
            isLoading: true,
            alertMsg: 'Login in ....',
        };
    }
    case 'GET_TOKEN_FULFILLED': {
        return {
            ...state,
            isLoading: false,
            dataToken: action.payload.data.result,
            alertMsg: 'Login Succesfully',
        };
    }
    case 'GET_TOKEN_REJECTED': {
        return {
            ...state,
            isLoading: false,
            alertMsg: 'Login Failed',
        };
    }
    case 'SET_TOKEN': {
        return {
          ...state,
          token: action.payload.token,
          isLogin: true,
        };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isRegister: false,
        isLogin: false,
        alertMsg: 'Logout success',
        token: '',
        dataUser: {},
        chplant: '',
      };
    }
    case 'ROUTE' : {
        return {
            ...state,
            isRoute: true,
        };
    }
    default: {
      return state;
    }
  }
};
