/* eslint-disable no-undef */
import {TEST, LOGIN_FAILURE, LOGIN_SUCCESS, LOGIN_REQUEST, LOGOUT} from './types';
import {history} from "../history";
import {xauth} from "../utils/fanfou";
import {notification} from 'antd';


export function test(text) {
    return {
        type: TEST,
        text
    }
}

export function login(username, password) {
    return async dispatch => {
        dispatch(request());
        try {
            const {token, profile} = await xauth(username, password);
            if (profile) {
                console.log(profile);
                console.log(token);
                dispatch(success(profile));
                localStorage.setItem('user', JSON.stringify(profile));
                localStorage.setItem('token', JSON.stringify(token));
                history.push('/');
            } else {
                dispatch(failure());

            }

        } catch (error) {
            dispatch(failure(error));
        }
    };

    function request() {
        return {type: LOGIN_REQUEST}
    }

    function success(user) {
        return {type: LOGIN_SUCCESS, user}
    }

    function failure(error) {
        notification.error({
            message: '提示',
            description: '登录失败',
        });

        return {type: LOGIN_FAILURE, error}
    }
}

export function logout() {

}
