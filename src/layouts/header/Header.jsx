import React, {Component} from 'react';
import {Input, Badge, message, Modal} from 'antd';
import Popup from "reactjs-popup";
import {
    Tabs,
    Box,
    IconButton,
    Avatar
} from 'gestalt';
import './header.scss'
import Logo from '../../logo.svg';
import {MyIcon} from "../../layouts/MyIcon";
import {getTrends, getNotification} from "../../utils/fanfou";
import Send from "../../pages/home/component/send/Send";
import {history} from '../../history'
import PropTypes from "prop-types";


export default class Header extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            trends: [],
            search: '',
            user: null,
            mentions: 0,
            direct_messages: 0,
            friend_requests: 0,
            showSend: false,
            imageUrl: '',
            open: false
        };
        this.handleChange = this._handleChange.bind(this);
        this.handleToggleSendModal = this._handleToggleSendModal.bind(this);
    }

    _handleChange({activeTabIndex, event}) {
        event.preventDefault();
        switch (activeTabIndex) {
            case 0:
                const arr = this.props.location.pathname.split('/');
                console.log(arr);
                if (arr[1]==="") {
                    window.scrollTo({
                        left: 0,
                        top: 0,
                        behavior: 'smooth',
                    });
                } else {
                    history.push('/');
                }
                break;
            case 1:
                history.push('/browse');
                break;
            case 2:
                history.push('/at');
                break;
        }
    }


    _handleToggleSendModal() {
        this.setState(prevState => ({showSend: !prevState.showSend}));
    }

    componentWillMount() {
        const that = this;
        const user = JSON.parse(localStorage.getItem('user'))
        this.setState({
            user: user,
            imageUrl: user.profile_image_url
        });

        getTrends().then((data) => {
            this.setState({
                trends: data.trends
            })
        });

        this.timer = setInterval(
            () => {
                getNotification().then((data) => {
                    that.setState({
                        mentions: data.mentions,
                        direct_messages: data.direct_messages,
                        friend_requests: data.friend_requests
                    })
                })
            }, 20000);


    }


    handleSearch = () => {
        this.setState({
            open: false
        });
        history.push('/search/' + this.state.search)
    };

    render() {
        const {
            trends,
            search,
            user,
            mentions,
            direct_messages,
            friend_requests,
            showSend
        } = this.state;


        let activeIndex = 0;
        if (user && user.id === this.context.user.id) {
            const arr = this.props.location.pathname.split('/');
            switch (arr[1]) {
                case 'browse':
                    activeIndex = 1;
                    break;
                case 'at':
                    activeIndex = 2;
                    break;
                default:
                    activeIndex = 0;
                    break
            }
        } else {
            activeIndex = -1;
        }


        const hot = trends.map((item, i) => (
            <div className="trend" key={i} onClick={() => {
                this.setState({
                    search: item.name
                }, () => {
                    this.handleSearch()
                });
            }}>{item.name}</div>
        ));


        return (
            <header className="header">

                <div className="layout">
                    <img className="logo" src={Logo} alt="logo"/>
                    <div className="tabs">
                        <Tabs
                            tabs={[
                                {
                                    text: (<span style={{fontWeight: 'bold', fontSize: '18px'}}>首页</span>),
                                },
                                {
                                    text: (<span style={{fontWeight: 'bold', fontSize: '18px'}}>时刻</span>),
                                },
                                {
                                    text: (<Badge count={mentions} dot={true}>
                                        <span style={{fontWeight: 'bold', fontSize: '18px'}}>@我</span>
                                    </Badge>),
                                }
                            ]}
                            activeTabIndex={activeIndex}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="search">
                        <Popup
                            trigger={<Input.Search
                                placeholder={trends.length > 0 ? trends[0].name : "请输入搜索内容"}
                                onSearch={this.handleSearch}
                                value={search}
                                onChange={(e) => {
                                    this.setState({
                                        search: e.target.value
                                    })
                                }}
                            />}
                            position="bottom left"
                            arrow={false}
                            offsetX={10}
                            offsetY={2}
                            onOpen={() => this.setState({open: true})}
                            onClose={() => this.setState({open: false})}
                            closeOnDocumentClick
                            contentStyle={{
                                width: 'auto',
                                minWidth: '230px',
                                padding: 0,
                                border: 0,
                                borderRadius: "3px"
                            }}
                        >
                            {this.state.open && (
                                <div style={{padding: 10}}>
                                    <span style={{fontWeight: 'bold'}}>热门话题>></span>
                                    {hot}
                                </div>
                            )}
                        </Popup>
                    </div>

                    <div className="right">
                        <Box alignItems="center" display="flex">
                            <Box marginRight={8}>
                                <Popup trigger={<div><Avatar
                                    size="md"
                                    src={user.profile_image_url}
                                    name={user.name}
                                /></div>}
                                       position={["bottom center"]}
                                       on='hover'
                                       contentStyle={{
                                           width: 'auto',
                                           padding: 0,
                                           border: 0,
                                           borderRadius: "3px"
                                       }}>
                                    <div className='pop-user-menu'>
                                        <div className='user-item' onClick={() => message.info('请前往饭否官网修改用户信息')}>
                                            <MyIcon type="icon-account-settings-variant" className='icon'/>
                                            编辑资料
                                        </div>
                                        <div className='user-item' onClick={() => {
                                            localStorage.clear();
                                            history.push('/login');
                                        }}>
                                            <MyIcon type="icon-logout" className='icon'/>
                                            退出登录
                                        </div>
                                    </div>
                                </Popup>
                            </Box>

                            <Box marginRight={5}>
                                <Popup trigger={<Badge count={mentions + direct_messages + friend_requests}
                                                       offset={[-10, 10]}>
                                    <IconButton icon="bell"
                                                accessibilityLabel="bell"
                                                color="gray"
                                                size="md"
                                    />
                                </Badge>}
                                       position={["bottom center", "top center"]}
                                       on='hover'
                                       contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                                    <div className='pop-notice-menu'>
                                        <div className='notice-item' onClick={() => {
                                            history.push('/message');
                                        }}>私信<Badge count={direct_messages}/></div>
                                        <div className='notice-item' onClick={() => {
                                            history.push('/at');
                                        }}>@我的消息<Badge count={mentions}/></div>
                                        <div className='notice-item' onClick={() => {
                                            history.push('/requests/' + this.state.user.id);
                                        }}>新的关注<Badge count={friend_requests}/></div>
                                    </div>
                                </Popup>

                            </Box>
                            <Box marginRight={5}>
                                <IconButton icon="edit"
                                            accessibilityLabel="edit"
                                            color="gray"
                                            size="md"
                                            onClick={() => {
                                                this.setState({showSend: true})
                                            }}
                                />
                            </Box>
                        </Box>
                    </div>
                </div>
                <Modal
                    visible={showSend}
                    footer={null}
                    centered={true}
                    maskClosable={true}
                    title="发送到饭否"
                    onCancel={this.handleToggleSendModal}>
                    <Send onSend={() => {
                        this.setState({showSend: false})
                    }}/>
                </Modal>
            </header>
        );
    }
}
