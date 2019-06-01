import React, {Component} from 'react';
import {Router, Route, Switch} from 'react-router-dom'
import 'gestalt/dist/gestalt.css';
import "antd/dist/antd.css";
import 'react-image-lightbox/style.css';
import 'moment/locale/zh-cn';

import Login from "../pages/login";
import {history} from "../history";
import MainLayout from "./MainLayout";
import {PrivateRoute} from "./PrivateRoute";
import {notification,message} from "antd";
import Exception from '../pages/exception'


export default class BaseLayout extends Component {

    constructor(props) {
        super(props);
        notification.config({
            placement: 'bottomRight',
        });
        message.config({
            top: 100,
            duration: 2,
            maxCount: 3,
        });
    }

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/error/:code" component={Exception}/>
                    <PrivateRoute  path="/" component={MainLayout}/>
                </Switch>
            </Router>
        );
    }


}

