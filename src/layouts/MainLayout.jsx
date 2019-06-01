import React, {Component} from 'react';

import Header from "./header";
import {BackTop} from 'antd';
import Home from '../pages/home'
import {getRelationship} from "../utils/fanfou";
import PropTypes from 'prop-types'

export default class MainLayout extends Component {
    // 声明Context对象属性
    static childContextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func,
    };

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem('user'));
        this.state = {
            user: user
        }
    }

    // 返回Context对象，方法名是约定好的
    getChildContext() {
        return {
            user: this.state.user,
            loginUser: JSON.parse(localStorage.getItem('user')),
            onChangeUser: this.callback.bind(this)
        }
    }

    callback(user) {
        this.setState({
            user: user
        });


        const loginUser = JSON.parse(localStorage.getItem('user'));
        if (user.id !== loginUser.id) {
            getRelationship({user_a: user.id, user_b: loginUser.id}).then((data) => {
                if (!data.error) {
                    user.follow_me = data;
                    this.setState({
                        user: user
                    });
                }
            })
        }
    }

    render() {
        return (
            <div className="router-view">
                <Header {...this.props}/>
                <div style={{height: '60px'}}/>
                <Home {...this.props}/>
                <BackTop/>
            </div>
        );
    }
}
