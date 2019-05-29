import React, {Component} from 'react';
import {Avatar, Text} from 'gestalt';
import PropTypes from 'prop-types'

import './Left.scss'
import Menu from "./Menu";
import {MyIcon} from "../../../../layouts/MyIcon";
import {Button, Tooltip, message, Popconfirm} from "antd";
import Chat from "../message/Chat";
import {postAddBlocks, postAddFriend, postDelFriend} from "../../../../utils/fanfou";

const ButtonGroup = Button.Group;

export default class Left extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            openChat: false,
            userName: ''
        };
    }

    onRef = (ref) => {
        this.child = ref
    };

    handleItemClose = () => {
        this.setState({
            openChat: false
        })
    };


    render() {
        const {user} = this.context;
        const {openChat, userName} = this.state;
        console.log(user);
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

        let followIcon = "";
        let followStr = "";
        if (user.follow_me && user.following) {
            followIcon = "icon-huxiangguanzhu";
            followStr = "互关";
        } else if (user.following) {
            followIcon = "icon-weibiaoti--1";
            followStr = "已关";
        } else {
            followIcon = "icon-weibiaoti--";
            followStr = "关注";
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
                        <div>
                            <Tooltip placement="top" title={user.birthday}>
                                <MyIcon type="icon-shengrihanlibao" className='icon'/>
                            </Tooltip>
                            <Tooltip placement="top" title={user.location}>
                                <MyIcon type="icon-dizhi" className='icon'/>
                            </Tooltip>
                            <Tooltip placement="top" title={user.url}>
                                <a href={user.url} target="view_window"><MyIcon type="icon-lianjie"
                                                                                className='icon'/></a>
                            </Tooltip>
                        </div>
                        <Text inline size="xs">
                            今日是{pronoun}在饭否的第 {day} 个日子
                        </Text>
                    </div>
                    {pronoun !== "我" && (
                        <div className="operation">
                            <ButtonGroup>
                                <Button onClick={() => {
                                    if (user.following) {
                                        postDelFriend({id: user.id}).then((data) => {
                                            if (!data.error) {
                                                message.success('取消关注成功')
                                                this.context.onChangeUser(data);
                                            }
                                        })
                                    } else {
                                        postAddFriend({id: user.id}).then((data) => {
                                            console.log(data);
                                            if (data.error) {
                                                message.success(data.error);
                                            } else {
                                                message.success('关注成功');
                                                this.context.onChangeUser(data);
                                            }
                                        })
                                    }
                                }}>
                                    <MyIcon type={followIcon}/>
                                    {followStr}
                                </Button>
                                <Popconfirm title="确定加入黑名单？" okText="是" cancelText="否" onConfirm={() => {
                                    postAddBlocks({id: user.id}).then((data) => {
                                        if (data.error) {
                                            message.success(data.error)
                                        }else {
                                            message.success('已经成功加入黑名单')
                                        }
                                    })
                                }}>
                                    <Button>
                                        <MyIcon type="icon-lahei"/>
                                        拉黑
                                    </Button>
                                </Popconfirm>
                                <Button onClick={() => {
                                    if (user.follow_me && user.following) {
                                        this.setState({
                                            openChat: true,
                                            userName: user.name
                                        });

                                        if (this.child.userId !== user.id) {
                                            this.child.userId = user.id;
                                            this.child.openChat();
                                        }
                                    } else {
                                        message.error('客户端只能对互相关注的人发送私信，如需更多权限请前往饭否官网')
                                    }
                                }}>
                                    <MyIcon type="icon-dingdanxiangqing_sixin"/>
                                    私信
                                </Button>
                            </ButtonGroup>
                        </div>
                    )}
                </div>
                <Menu user={user} pronoun={pronoun} index={index}/>

                <Chat visible={openChat}
                      userName={userName}
                      onRef={this.onRef}
                      close={this.handleItemClose}/>
            </div>
        );
    }
}
