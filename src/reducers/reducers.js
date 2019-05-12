import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, TEST} from '../actions/types';
import {combineReducers} from 'redux'

function messageReducer(state = [], action) {
    switch (action.type) {
        case TEST:
            return action.text
        default:
            return state;
    }
}

function loginReducer(state = [], action) {
    console.log(action.type);
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({},state,{
                isLoading: true
            });
        case LOGIN_SUCCESS:
            return Object.assign({},state,{
                isLoading: false,
                user: action.user
            });
        case LOGIN_FAILURE:
            return Object.assign({},state,{
                isLoading: false,
                error:'登录失败'
            });
        default:
            return state;
    }
}

function searchReducer(state = [], action) {
    switch (action.type) {
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    messageReducer,
    loginReducer,
    searchReducer
});

export default rootReducer
