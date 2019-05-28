import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import Left from "./component/left/Left";
import Right from "./component/right/Right";
import Topic from "./component/topic/Topic";
import Photo from "./component/photo/Photo";
import Follower from "./component/follower/Follower";
import Message from "./component/message/Message";
import PropTypes from 'prop-types'
import {getRelationship} from "../../utils/fanfou";

export default class Home extends Component {
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
            <div style={{display: 'flex', minHeight: '100%'}}>
                <Left {...this.props}/>
                <div>
                    <Switch>
                        <Route path="/" exact component={props => (<Topic url='home' {...props}/>)}/>
                        <Route path="/photo/:id" component={Photo}/>
                        <Route path="/message" component={Message}/>
                        <Route path="/friends/:id" component={props => (<Follower url='friends' {...props}/>)}/>
                        <Route path="/followers/:id" component={props => (<Follower url='followers' {...props}/>)}/>
                        <Route path="/blocks/:id" component={props => (<Follower url='blocks' {...props}/>)}/>
                        <Route path="/requests/:id" component={props => (<Follower url='requests' {...props}/>)}/>
                        <Route path="/search/:text" component={props => <Topic url='search' {...props}/>}/>
                        <Route path="/at" component={props => <Topic url='at' {...props}/>}/>
                        <Route path="/user/:id" component={props => <Topic url='user' {...props}/>}/>
                        <Route path="/favorite/:id" component={props => <Topic url='favorite' {...props}/>}/>
                        <Redirect to="/error/404"/>
                    </Switch>
                </div>
                <Right/>
            </div>
        );
    }
}
