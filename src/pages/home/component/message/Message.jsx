import React, {Component} from 'react';
import {Avatar, Text} from 'gestalt';
import LoadList from "../topic/LoadList";
import {message} from "antd/lib/index";
import {getConversation} from "../../../../utils/fanfou"
import DocumentTitle from 'react-document-title';
import moment from "moment/moment";
import './Message.scss';
import Chat from "./Chat";
import PropTypes from "prop-types";

export default class Message extends Component {
    static contextTypes = {
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            hasMore: true,
            page: 0,
            openChat: false,
            userName: ''
        };
    }

    componentWillMount() {
        this.fetchData();
        this.context.onChangeUser(this.context.loginUser);
    };

    handleItemClick = (user) => {
        console.log(user);
        this.setState({
            openChat: true,
            userName: user.name
        });

        if (this.child.userId !== user.id) {
            this.child.userId = user.id;
            this.child.openChat();
        }


    };

    handleItemClose = () => {
        this.setState({
            openChat: false
        })
    };

    handleInfiniteOnLoad = () => {
        this.fetchData();
    };

    onRef = (ref) => {
        this.child = ref
    };

    fetchData = () => {
        const that = this;
        const newPage = this.state.page + 1;
        this.setState({
            loading: true,
            page: newPage
        });
        getConversation({page: this.state.page}).then((data) => {
            console.log(data);
            const list = that.state.data.concat(data);
            this.setState({
                data: list,
                hasMore: data.size === 20
            })
        }).catch(() => {
            message.error('请求失败');
        }).finally(() => {
            this.setState({
                loading: false
            });
        })
    };

    renderItem = (item, i) => {
        let user;
        if (item.otherid === item.dm.recipient_id) {
            user = item.dm.recipient
        } else {
            user = item.dm.sender
        }
        return <div key={i} className="item-msg" onClick={() => this.handleItemClick(user)}>
            <div style={{
                alignItems: 'center',
                display: 'flex'
            }}>
                <Avatar
                    size="md"
                    src={user.profile_image_url}
                    name={user.name}
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: '0px 15px', maxWidth: '85%'}}>
                <div>
                    <Text bold inline>{user.name}</Text>

                </div>
                <Text truncate leading="tall" size='xs' color='gray'>
                    {item.dm.text}
                </Text>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                alignItems: 'flex-end',
                justifyContent: 'bottom',
                fontSize: 'x-small'
            }}>
                {moment(item.dm.created_at).fromNow()}
            </div>
        </div>
    };

    render() {
        const {data, hasMore, openChat, userName} = this.state;
        return (
            <div className='center-container'>
                <LoadList
                    itemDiv={this.renderItem.bind(this)}
                    loadMore={this.handleInfiniteOnLoad.bind(this)}
                    data={data}
                    hasMore={hasMore}
                    num={50}
                />
                <Chat visible={openChat}
                      userName={userName}
                      onRef={this.onRef}
                      close={this.handleItemClose}/>
                <DocumentTitle title={"私信"} key="title"/>
            </div>
        );
    }
}
