import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token:null,
    userId:null,
    error:null,
    loading:false,
    authRedirectPath: '/'
}

const authSuccess = (state, action) => {
    return {
        ...state,
        token:action.token,
        userId:action.userId,
        error:null,
        loading:false
    }
}

const authFail = (state, action) => {
    return {
        ...state,
        error:action.error,
        loading:false,
        authRedirect: '/'
    }
}

const authLogout = (state) => {
    return {
        ...state,
        token:null,
        userId:null
    }
}

const setAuthRedirect = (state, action) => {
    return {
        ...state,
        authRedirectPath: action.path
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return {...state, error:null, loading:true};
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirect(state, action);
        default: return state;
    }
}

export default reducer;