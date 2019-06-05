import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import Left from "./component/left/Left";
import Right from "./component/right/Right";
import Topic from "./component/topic/Topic";
import Photo from "./component/photo/Photo";
import Follower from "./component/follower/Follower";
import Message from "./component/message/Message";

export default class Home extends Component {

    render() {
        return (
            <div style={{display: 'flex', minHeight: '100%'}}>
                <Left {...this.props}/>
                <div>
                    <CacheSwitch>
                        <CacheRoute path="/" when="back" exact render={props => <Topic url='home' {...props}/>}/>
                        <Route path="/photo/:id" component={Photo}/>
                        <Route path="/message" component={Message}/>
                        <Route path="/friends/:id" component={props => (<Follower url='friends' {...props}/>)}/>
                        <Route path="/followers/:id" component={props => (<Follower url='followers' {...props}/>)}/>
                        <Route path="/blocks/:id" component={props => (<Follower url='blocks' {...props}/>)}/>
                        <Route path="/requests/:id" component={props => (<Follower url='requests' {...props}/>)}/>
                        <Route path="/search/:text" component={props => <Topic url='search' {...props}/>}/>
                        <Route path="/at" component={props => <Topic url='at' {...props}/>}/>
                        <Route path="/browse" component={props => <Topic url='browse' {...props}/>}/>
                        <Route path="/user/:id" component={props => <Topic url='user' {...props}/>}/>
                        <Route path="/favorite/:id" component={props => <Topic url='favorite' {...props}/>}/>
                        <Redirect to="/error/404"/>
                    </CacheSwitch>
                </div>
                <Right/>
            </div>
        );
    }
}
