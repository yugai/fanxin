import React, {Component} from 'react';
import {Button, message} from 'antd';
import {Box, Avatar, Text, Link} from 'gestalt';
import PropTypes from "prop-types";
import {history} from "../../../../history";
import {postAcceptFriend, postAddFriend, postDelFriend, postDenyBlocks, postDenyFriend} from "../../../../utils/fanfou";

export default class Item extends Component {
    static propTypes = {
        item: PropTypes.object,
        type: PropTypes.number,
        onDel: PropTypes.func
    };

    static defaultProps = {
        onDel: Promise.resolve.bind(Promise)
    };

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.item,
            type: this.props.type
        }

    }

    handleOpenUser = (user) => {
        const url = '/user/' + user.id;
        history.push(url);
    };

    handleClick = () => {
        switch (this.state.type) {
            case 0:
            case 1:
                if (this.state.user.following) {
                    postDelFriend({id: this.state.user.id}).then((data) => {
                        if (data.error) {
                            message.error("取消关注失败")
                        } else {
                            const user = this.state.user;
                            user.following = !user.following;
                            this.setState({
                                user: user
                            })
                        }
                    }).catch((e) => {
                        console.log(e);
                        message.error("取消关注失败")
                    })
                } else {
                    postAddFriend({id: this.state.user.id}).then((data) => {
                        if (data.error) {
                            message.error("关注失败")
                        } else {
                            const user = this.state.user;
                            user.following = !user.following;
                            this.setState({
                                user: user
                            })
                        }
                    }).catch((e) => {
                        console.log(e);
                        message.error("关注失败")
                    })
                }
                break;
            case 2:
                postDenyBlocks({id: this.state.user.id}).then(() => {
                    this.props.onDel();
                });
                break;
            case 3:
                postAcceptFriend({id: this.state.user.id}).then(() => {
                    this.props.onDel();
                });
                break;
        }
    };

    render() {
        const {user, type} = this.state;
        let button = '';
        switch (type) {
            case 0:
                button = user.following ? '取消关注' : '关注';
                break;
            case 1:
                button = user.following ? '取消关注' : '关注';
                break;
            case 2:
                button = '移除黑名单';
                break;
            case 3:
                button = '同意';
                break;
        }
        return (
            <div style={{
                display: 'flex',
                padding: '5px 10px',
                borderBottom: '0.5px solid #eeeeee'
            }}>
                <div style={{height: '40px'}} onClick={() => this.handleOpenUser(user)}>
                    <Avatar
                        size="md"
                        src={user.profile_image_url}
                        name={user.name}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', padding: '0px 10px', maxWidth: '75%'}}>
                    <div onClick={() => this.handleOpenUser(user)}>
                        <Text bold><Link inline>
                            {user.name}
                        </Link></Text>
                    </div>
                    <Text truncate leading="tall">
                        {user.description ? user.description : '暂无'}
                    </Text>
                    <Text size="sm">{user.location ? user.location : '暂无'}</Text>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end'
                }}>
                    {type === 3 && (<div style={{flexGrow: 1}}>
                        <Button shape='round' onClick={
                            postDenyFriend({id: user.id}).then(() => {
                                this.props.onDel();
                            })
                        }>拒绝</Button>
                    </div>)}
                    <Button type={user.following ? 'danger' : 'default'}
                            shape='round' onClick={this.handleClick}>{button}</Button>

                </div>
            </div>
        );
    }
}
