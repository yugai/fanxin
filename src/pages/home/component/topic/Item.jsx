import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Avatar, Text, Box, Link} from 'gestalt';
import {Tooltip, Button, Modal} from 'antd';
import Popup from "reactjs-popup";
import Lightbox from 'react-image-lightbox';
import {Player} from 'video-react';
import moment from 'moment'
import UserPop from "./UserPop";
import Reply from "../reply/Reply";
import {MyIcon} from "../../../../layouts/MyIcon";
import {history} from "../../../../history";
import {getUserInfo, postDelStatuses, postFavorites, postDelFavorites} from "../../../../utils/fanfou";


const confirm = Modal.confirm;

export default class Item extends Component {

    static propTypes = {
        item: PropTypes.object,
        onDel: PropTypes.func
    };

    static defaultProps = {
        onDel: Promise.resolve.bind(Promise)
    };

    constructor(props) {
        super(props);
        this.state = {
            openLight: false,
            openMenu: false,
            openReply: false,
            favorited: this.props.item.favorited
        }
    }

    renderContent(txt) {
        //删除转发原文
        if (this.props.item.repost_status && txt.length > this.props.item.repost_status.txt.length + 1) {
            const repost = this.props.item.repost_status.txt;
            repost.unshift({text: '@' + this.props.item.repost_status.user.name});
            const difference = txt.length - repost.length;
            for (let i = repost.length - 1; i >= 0; i--) {
                if (txt[difference + i].text.trim() === repost[i].text.trim()) {
                    txt.pop();
                    console.log(txt);
                }
            }
        }

        const content = [];
        txt.forEach((item) => {
            if (item.type === "text") {
                if (item.bold_arr) {
                    item.bold_arr.forEach(b => {
                        if (b.bold) {
                            content.push(<strong style={{color: 'red'}}>{b.text}</strong>)
                        } else {
                            content.push(b.text)
                        }
                    })
                } else {
                    content.push(<span style={{
                        wordBreak: 'pre-line',
                        textOverflow: 'ellipsis',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        margin: 0,
                        padding: 0
                    }}>{item.text}</span>)
                }
            } else if (item.type === "at") {
                content.push(<Popup trigger={<a onClick={e => this.handleOpenUser(e, item.id)}>{item.text}</a>}
                                    position={["bottom center", "top center"]}
                                    on='hover'
                                    contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                    <UserPop id={item.id}/>
                </Popup>)
            } else if (item.type === "tag") {
                content.push(<a onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    history.push('/search/' + item.query);
                }}>{item.text}</a>);
            } else if (item.type === "link") {
                content.push(<a href={item.link} target="view_frame" onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}>{item.text}</a>);
            }
        });


        return (<div>
            {content}
        </div>)
    }

    renderChild(item) {
        let media;
        if (false) {
            media = (
                <Player/>
            );
        }
        if (false) {
            let images = [];
            media = (
                <Box display="flex" wrap="true" width="100%">

                    {images.map((i) => <div key={i} className="square">
                        <img
                            src={i}/>
                    </div>)}
                </Box>
            );
        }
        if (item.photo) {
            media = (
                <img style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    border: '1px',
                    marginTop: '10px',
                    borderRadius: '10px'
                }}
                     src={item.photo.originurl}
                     onClick={(e) => {
                         e.stopPropagation();
                         e.nativeEvent.stopImmediatePropagation();
                         this.handleLightBox()
                     }}/>
            );
        }


        if (item.type === 'origin') {
            return media;
        } else if (item.repost_status) {
            item = item.repost_status;
            return (
                <div className='child-background'>
                    <Box display='flex' direction='row' justifyContent="start" alignItems="center">
                        <div style={{height: '24px', marginRight: '10px'}}
                             onClick={e => this.handleOpenUser(e, item.user)}>
                            <Avatar
                                size="sm"
                                src={item.user.profile_image_url}
                                name={item.user.name}
                            />
                        </div>
                        <Popup trigger={<div onClick={e => this.handleOpenUser(e, item.user)}>
                            <Text bold><Link inline>
                                {item.user.name}
                            </Link></Text>
                        </div>}
                               position={["bottom center", "top center"]}
                               on='hover'
                               contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                            <UserPop user={item.user}/>
                        </Popup>

                        <Box marginLeft={2} marginRight={2}>
                            <Tooltip title={moment(item.created_at).format('YYYY/MM/DD HH:mm:ss')}>
                                <span>{moment(item.created_at).fromNow()}</span>
                            </Tooltip>
                        </Box>
                    </Box>
                    <div style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-all',
                        wordWrap: 'break-word',
                        marginTop: '5px'
                    }}>
                        {this.renderContent.bind(this)(item.txt)}
                    </div>
                    {media}
                </div>
            )
        }
    }

    loadUser(id, cb) {
        getUserInfo({"id": id}).then((data) => {
            cb(data);
        }).catch(() => {
            console.log("error")
        })
    };

    handleLightBox() {
        this.setState({
            openLight: true,
        })
    };

    handleOpenUser = (e, user) => {
        console.log(user);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const url = '/user/' + (user.id ? user.id : user);
        history.push(url);
    };


    handleItemClick = () => {
        if (window.getSelection().toString() === "") {
            this.setState({
                openReply: true
            })
        }

    };

    handleItemClose = () => {
        this.setState({
            openReply: false
        })
    };

    showDeleteConfirm(item) {
        const that = this;
        confirm({
            title: '确定要删除这条消息吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                postDelStatuses({id: item.id}).then(() => {
                    that.props.onDel();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    render() {
        const item = this.props.item;
        const {openLight, openReply, replyType} = this.state;
        return (<div className="list-item">
                <div style={{display: 'flex', padding: '10px'}} onClick={this.handleItemClick}>
                    <div style={{height: '40px'}} onClick={e => this.handleOpenUser(e, item.user)}>
                        <Avatar
                            size="md"
                            src={item.user.profile_image_url}
                            name={item.user.name}
                        />
                    </div>
                    <Box display="flex" direction="column" width="100%" marginLeft={2}>
                        <Box display="flex" alignItems="center">
                            <Popup trigger={<div onClick={e => this.handleOpenUser(e, item.user)}>
                                <Text bold><Link inline>
                                    {item.user.name}
                                </Link></Text>
                            </div>}
                                   position={["bottom center", "top center"]}
                                   on='hover'
                                   contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                                <UserPop user={item.user}/>
                            </Popup>

                            <Box marginLeft={2} marginRight={2}>
                                <Tooltip title={moment(item.created_at).format('YYYY/MM/DD HH:mm:ss')}>
                                    <span>{moment(item.created_at).fromNow()}</span>
                                </Tooltip>
                            </Box>

                        </Box>
                        <div style={{width: '530px'}}>
                            {this.renderContent.bind(this)(item.txt)}
                        </div>
                        {this.renderChild.bind(this)(item)}
                        <div style={{display: 'flex', marginTop: '10px', justifyContent: 'space-between'}}>
                            {item.is_self ? (
                                <Button shape="circle" className='icon-button' onClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    this.showDeleteConfirm(item);
                                }}>
                                    <MyIcon type="icon-shanchu" style={{fontSize: '18px'}}/>
                                </Button>
                            ) : (
                                <Button shape="circle" className='icon-button' onClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    this.setState({
                                        replyType: 0,
                                        openReply: true
                                    })
                                }}>
                                    <MyIcon type="icon-pinglun" style={{fontSize: '18px'}}/>
                                </Button>
                            )}

                            <Button shape="circle" className='icon-button' onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                this.setState({
                                    replyType: 1,
                                    openReply: true
                                })
                            }}>
                                <MyIcon type="icon-zhuanfa" style={{fontSize: '18px'}}/>
                            </Button>

                            {this.state.favorited ? (
                                <Button shape="circle" className='icon-button' onClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    postDelFavorites(item.id).then(() => {
                                        this.setState({
                                            favorited: false
                                        })
                                    })
                                }}>
                                    <MyIcon type="icon-shoucang-copy"
                                            style={{fontSize: '18px'}}/>
                                </Button>
                            ) : (
                                <Button shape="circle" className='icon-button' onClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    postFavorites(item.id).then((data) => {
                                        console.log(data);
                                        this.setState({
                                            favorited: true
                                        })
                                    })
                                }}>
                                    <MyIcon type="icon-shoucang"
                                            style={{fontSize: '18px'}}/>
                                </Button>
                            )}


                        </div>
                    </Box>
                </div>


                {openLight && (
                    <Lightbox
                        mainSrc={item.photo.originurl}
                        imageTitle={moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                        onCloseRequest={() => this.setState({openLight: false})}
                        animationDisabled={true}
                        imageCaption={item.plain_text}
                    />
                )}
                <Modal
                    visible={openReply}
                    footer={null}
                    centered={true}
                    maskClosable={true}
                    destroyOnClose={true}
                    onCancel={this.handleItemClose}>
                    <Reply item={this.props.item} type={replyType} onSend={() => {
                        this.setState({openReply: false})
                    }}/>
                </Modal>
            </div>
        )
    }
}
