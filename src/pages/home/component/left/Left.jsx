import React, {Component} from 'react';
import {Avatar, Text} from 'gestalt';
import PropTypes from 'prop-types'

import './Left.scss'
import Menu from "./Menu";

export default class Left extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object
    };

    constructor(props) {
        super(props);
    }


    render() {
        const {user} = this.context;
        let pronoun;
        if (user.id === this.context.loginUser.id) {
            pronoun = '我';
        } else if (user.gender === '男') {
            pronoun = '他'
        } else if (user.gender === '女') {
            pronoun = '她'
        } else {
            pronoun = 'ta'
        }
        console.log(this.props.location);
        let index = 0;
        const arr = this.props.location.pathname.split('/');
        switch (arr[1]) {
            case 'user':
                index = 1;
                break;
            case 'photo':
                index = 2;
                break;
            case 'favorite':
                index = 3;
                break;
            case 'friends':
                index = 4;
                break;
            case 'followers':
                index = 5;
                break;
            default:
                index = 0;
                break
        }

        const day = parseInt((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
        return (
            <div className="sidebar">
                <div className="user">
                    <img className='background' src={user.profile_background_image_url} alt="背景"/>
                    <div className="info">
                        <Avatar
                            name={user.name}
                            src={user.profile_image_origin_large}
                            size="lg"
                        />
                        <div className="padding"/>
                        <Text bold>{user.screen_name}</Text>
                        <div className="padding"/>
                        <span className="describe">{user.description}</span>
                        <Text inline size="xs">
                            今日是{pronoun}在饭否的第 {day} 个日子
                        </Text>
                    </div>
                </div>
                <Menu user={user} pronoun={pronoun} index={index}/>
            </div>
        );
    }
}
