import React, {Component} from 'react';

import Header from "./header";
import {BackTop} from 'antd';
import Home from '../pages/home'

export default class MainLayout extends Component {
    render() {
        return (
            <div className="router-view">
                <Header/>
                <div style={{height: '60px'}}/>
                <Home {...this.props}/>
                <BackTop/>
            </div>
        );
    }
}
