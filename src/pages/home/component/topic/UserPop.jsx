import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Avatar, Spinner, Text, Link} from 'gestalt';
import {Button, message} from 'antd'
import {getUserInfo, postAddFriend, postDelFriend} from '../../../../utils/fanfou';
import {MyIcon} from "../../../../layouts/MyIcon";
import {history} from "../../../../history";


export default class UserPop extends Component {
    static contextTypes = {
        onChangeUser: PropTypes.func
    };

    static propTypes = {
        id: PropTypes.string.isRequired,
        user: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true
        }
    }

    componentWillMount() {
        const that = this;
        if (this.props.id) {
            getUserInfo({"id": this.props.id}).then((data) => {
                that.setState({
                    user: data,
                    isLoading: false
                })
            }).catch(() => {
                console.log("error")
            })
        } else {
            this.setState({
                isLoading: false,
                user: this.props.user
            })
        }
    }

    renderUserGender() {
        if (this.state.user.gender === "男") {
            return (
                <MyIcon type="icon-xingbienan"/>
            );
        } else if (this.state.user.gender === "女") {
            return (
                <MyIcon type="icon-xingbienv"/>
            );
        }
    }

    handleFollow = () => {
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
    };

    render() {
        const {user, isLoading} = this.state;
        return (
            <div style={styles.container}>
                <div hidden={!isLoading} style={{margin: '10px'}}>
                    <Spinner show={isLoading} accessibilityLabel="spinner"/>
                </div>
                {user && (
                    <div>
                        <img style={styles.backgroundImage} src={user.profile_background_image_url} alt="背景"/>
                        <div style={styles.info}>
                            <div style={styles.user} onClick={() => {
                                this.context.onChangeUser(user);
                                const url = '/user/' + user.id;
                                history.push(url);
                            }}>
                                <Avatar
                                    name={user.name}
                                    src={user.profile_image_origin_large}
                                    size="lg"
                                />
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Text bold><Link inline>
                                        {user.name}
                                    </Link></Text>
                                    {this.renderUserGender()}
                                </div>
                            </div>
                            <span style={styles.describe}>{user.description}</span>
                        </div>

                        <div style={{padding: '10px'}}>
                            <Button type={user.following ? "danger" : "primary"} block
                                    onClick={this.handleFollow}>{user.following ? "取消关注" : "关注"}</Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const styles = {
    container: {
        width: "250px",
    },
    backgroundImage: {
        display: 'inline-block',
        width: '250px',
        height: '100px',
        objectFit: 'cover',
        borderTopRightRadius: '3px',
        borderTopLeftRadius: '3px'
    },
    info: {
        marginTop: '-46px',
    },
    user: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '5px',

    },
    describe: {
        width: '250px',
        whiteSpace:'pre-wrap',
        textAlign: 'center',
        overflow: 'hidden',
        display:'-webkit-box',
        webkitBoxOrient:'vertical'
    }

};
