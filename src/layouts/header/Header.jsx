import React, {Component} from 'react';
import {Input, Badge, Upload, message, Modal} from 'antd';
import Popup from "reactjs-popup";
import {
    Tabs,
    Box,
    IconButton,
    Avatar,
    Button,
    Column,
    Label,
    TextArea,
    TextField,
    Text,
    Divider,
    Modal as Modal2
} from 'gestalt';
import './header.scss'
import Logo from '../../logo.svg';
import {MyIcon} from "../../layouts/MyIcon";
import {getTrends, getNotification} from "../../utils/fanfou";
import Send from "../../pages/home/component/send/Send";
import {history} from '../../history'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            trends: [],
            search: '',
            user: null,
            mentions: 0,
            direct_messages: 0,
            friend_requests: 0,
            showUserEdit: false,
            showSend: false,
            imageUrl: '',
            open: false
        };
        this.handleChange = this._handleChange.bind(this);
        this.handleToggleUserModal = this._handleToggleUserModal.bind(this);
        this.handleToggleSendModal = this._handleToggleSendModal.bind(this);
    }

    _handleChange({activeTabIndex, event}) {
        event.preventDefault();
        this.setState({
            activeIndex: activeTabIndex
        }, () => {
            switch (activeTabIndex) {
                case 0:
                    history.push('/');
                    break;
                case 1:
                    history.push('/');
                    break;
                case 2:
                    history.push('/at');
                    break;
            }
        });
    }

    handleChangeImage = (info) => {

        getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl
        }));
    };

    beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }

    _handleToggleUserModal() {
        this.setState(prevState => ({showUserEdit: !prevState.showUserEdit}));
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
            activeIndex,
            trends,
            search,
            user,
            mentions,
            direct_messages,
            friend_requests,
            showUserEdit,
            imageUrl,
            showSend
        } = this.state;

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
                                        <div className='user-item' onClick={() => this.setState({showUserEdit: true})}>
                                            <MyIcon type="icon-account-settings-variant" className='icon'/>
                                            编辑资料
                                        </div>
                                        <div className='user-item'>
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


                {showUserEdit && (
                    <Modal2
                        accessibilityCloseLabel="close"
                        onDismiss={this.handleToggleUserModal}
                        role='alertdialog'
                        footer={
                            <Box
                                justifyContent="between"
                                display="flex"
                                direction="row"
                                marginLeft={-1}
                                marginRight={-1}
                            >
                                <Box column={6} paddingX={1}>
                                    <Button text="更多设置" inline/>
                                </Box>
                                <Box column={6} paddingX={1}>
                                    <Box
                                        display="flex"
                                        direction="row"
                                        justifyContent="end"
                                        marginLeft={-1}
                                        marginRight={-1}
                                    >
                                        <Box paddingX={1}>
                                            <Button text="取消" inline onClick={this.handleToggleModal}/>
                                        </Box>
                                        <Box paddingX={1}>
                                            <Button color="red" inline text="保存"/>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        }
                        size="md"
                    >
                        <Box display="flex" direction="row" position="relative">
                            <Column span={12}>
                                <Box paddingY={2} paddingX={4} display="flex" alignItems='center'>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChangeImage}
                                    >
                                        <Avatar
                                            size="lg"
                                            src={imageUrl}
                                            name="Avatar"
                                        />
                                    </Upload>
                                </Box>
                                <Divider/>
                                <Box paddingY={2} paddingX={4} display="flex">
                                    <Column span={4}>
                                        <Label htmlFor="name">
                                            <Text align="left" bold>
                                                昵称
                                            </Text>
                                        </Label>
                                    </Column>
                                    <Column span={8}>
                                        <TextField id="name" onChange={() => undefined}/>
                                    </Column>
                                </Box>
                                <Divider/>
                                <Box paddingY={2} paddingX={4} display="flex">
                                    <Column span={4}>
                                        <Label htmlFor="desc">
                                            <Text align="left" bold>
                                                描述
                                            </Text>
                                        </Label>
                                    </Column>
                                    <Column span={8}>
                                        <TextArea id="desc" onChange={() => undefined}/>
                                    </Column>
                                </Box>
                                <Divider/>
                                <Box paddingY={2} paddingX={4} display="flex">
                                    <Column span={4}>
                                        <Label htmlFor="address">
                                            <Text align="left" bold>
                                                位置
                                            </Text>
                                        </Label>
                                    </Column>
                                    <Column span={8}>
                                        <TextField id="address" onChange={() => undefined}/>
                                    </Column>
                                </Box>
                                <Divider/>
                                <Box paddingY={2} paddingX={4} display="flex">
                                    <Column span={4}>
                                        <Label htmlFor="emile">
                                            <Text align="left" bold>
                                                邮箱
                                            </Text>
                                        </Label>
                                    </Column>
                                    <Column span={8}>
                                        <TextField id="emile" onChange={() => undefined}/>
                                    </Column>
                                </Box>
                                <Divider/>
                                <Box paddingY={2} paddingX={4} display="flex">
                                    <Column span={4}>
                                        <Label htmlFor="http">
                                            <Text align="left" bold>
                                                网址
                                            </Text>
                                        </Label>
                                    </Column>
                                    <Column span={8}>
                                        <TextField id="http" onChange={() => undefined}/>
                                    </Column>
                                </Box>
                            </Column>
                        </Box>
                    </Modal2>
                )}
            </header>
        );
    }
}
