import React, {Component} from 'react';
import {Modal, Input, Icon, Button, message, Popover} from 'antd';
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import {Picker} from 'emoji-mart';
import {Avatar, Spinner} from 'gestalt';
import {getConversationDetails, postDestroyMessage, postNewMessage} from "../../../../utils/fanfou";
import moment from 'moment'
import {history} from "../../../../history";

export default class Chat extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        userName: PropTypes.string,
        close: PropTypes.func,
    };

    static defaultProps = {
        close: Promise.resolve.bind(Promise),
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sending: false,
            inputValue: '',
            data: [],
            page: 0,
            hasMore: false,
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }


    selectEmoji = (value) => {
        this.setState({
            inputValue: this.state.inputValue + value.native
        })
    };

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    };

    fetchData = () => {
        const that = this;
        this.page++;
        this.setState({
            loading: true
        });
        console.log(this.page);
        getConversationDetails({id: this.userId, page: this.page}).then((data) => {
            const list = data.reverse().concat(that.state.data);
            this.setState({
                data: list,
                hasMore: data.length === 20
            });

            this.timer = setInterval(() => {
                document.getElementById('chat-bottom').scrollIntoView();
                clearTimeout(this.timer)
            }, 500)
        }).catch((e) => {
            console.log(e);
            message.error('请求失败');
        }).finally(() => {
            this.setState({
                loading: false
            });
        })
    };

    openChat = () => {
        this.setState({
            loading: true,
            sending: false,
            inputValue: '',
            data: [],
            hasMore: false,
        });
        this.page = 0;
        this.fetchData()
    };

    del = (msgId) => {
        const that = this;
        postDestroyMessage({id: msgId}).then(() => {
            let array = that.state.data;
            for (let i = 0; i < array.length; i++) {
                if (msgId === array[i].id) {
                    array.splice(i, 1);
                    console.log(array);
                    that.setState({
                        data: array
                    });
                }
            }
        })
    };

    more = () => {
        this.fetchData()
    };

    handleOpenUser = (e, user) => {
        console.log(user);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const url = '/user/' + (user.id ? user.id : user);
        history.push(url);
    };

    handleSend = () => {
        this.setState({sending: true});
        postNewMessage({user: this.userId, text: this.state.inputValue}).then((data) => {
            if (data.error == null) {
                const list = this.state.data.concat(data);
                this.setState({
                    data: list,
                    inputValue: ''
                });
                document.getElementById('chat-bottom').scrollIntoView();
            } else {
                message.error(data.error)
            }
        }).catch((e) => {
            console.log(e);
            message.error('发送失败');
        }).finally(() => {
            this.setState({
                sending: false
            });
        })
    };

    getConversations(messages) {
        if (messages === undefined) {
            return;
        }

        return messages.map((message, index) => {
            let bubbleClass = 'me';
            let bubbleDirection = '';
            let timeClass = '';
            if (message.sender.id !== this.userId) {
                bubbleClass = 'you';
                bubbleDirection = "bubble-direction-reverse";
                timeClass = 'item-direction-reverse';
            }
            return (
                <div className={`bubble-container ${bubbleDirection}`} key={message.id}>
                    <div style={{height: '40px'}} onClick={e => this.handleOpenUser(e, message.sender)}>
                        <Avatar
                            size="md"
                            src={message.sender.profile_image_url}
                            name={message.sender.name}
                        />
                    </div>
                    <div>
                        <Popover placement='top' trigger="click" content={<a style={{color: 'red'}} onClick={() => {
                            this.del(message.id)
                        }}>删除消息</a>}>
                            <div className={`bubble ${bubbleClass}`}>
                                {message.text}
                            </div>
                        </Popover>


                        <span
                            className={`time ${timeClass}`}>{moment(message.created_at).format('YYYY/MM/DD HH:mm')}</span>
                    </div>

                </div>


            );
        });
    }


    render() {
        const {sending, inputValue, data, loading, hasMore} = this.state;
        const chatList = this.getConversations(data);
        return (
            <Modal
                visible={this.props.visible}
                footer={null}
                centered={true}
                bodyStyle={{paddingBottom: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}
                title={this.props.userName}
                maskClosable={true}
                onCancel={this.props.close}>
                <div style={{height: '50vh', display: 'flex', flexDirection: 'column'}}>
                    <Spinner show={loading} accessibilityLabel="spinner"/>
                    {!loading && <div className="chats">
                        <div className="chat-list">
                            {hasMore && <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                                <a onClick={this.more}>查看更早的消息</a>
                            </div>}
                            {chatList}
                            <div id='chat-bottom'></div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <Input addonAfter={<Popup trigger={<Icon type="meh"/>}
                                                      position="top center"
                                                      contentStyle={{width: 'auto'}}>
                                <Picker onSelect={this.selectEmoji}/>
                            </Popup>}
                                   value={inputValue}
                                   onChange={this.handleChange}
                            />
                            <div style={{marginLeft: 10}}>
                                <Button type="primary"
                                        loading={sending}
                                        shape='round'
                                        disabled={inputValue.length === 0}
                                        onClick={this.handleSend}>发送</Button>
                            </div>
                        </div>
                    </div>}
                </div>
            </Modal>
        );
    }
}
