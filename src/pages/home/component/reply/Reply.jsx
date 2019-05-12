import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Text, Box, Link, SegmentedControl, Avatar, Spinner} from 'gestalt';
import Lightbox from 'react-image-lightbox';
import {Mention, Button, Upload, Progress, message, Avatar as AntdAvatar} from 'antd';
import {Player} from 'video-react';
import Popup from "reactjs-popup";
import moment from "moment/moment";
import {Picker} from 'emoji-mart';
import UserPop from "../topic/UserPop";
import {MyIcon} from "../../../../layouts/MyIcon";
import {history} from "../../../../history";
import {getFriends, postStatus, getContextStatuses} from "../../../../utils/fanfou";
import './Reply.scss'

const {toContentState} = Mention;


const Nav = Mention.Nav;

let webFrameworks = [];

export default class Reply extends Component {
    static propTypes = {
        item: PropTypes.object,
        type: PropTypes.number,
        onSend: PropTypes.func
    };

    static defaultProps = {
        onSend: Promise.resolve.bind(Promise),
        item: {},
        type: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openLight: false,
            item: this.props.item,
            selectItem: this.props.item,
            items: [],
            image: '',
            imageCaption: '',
            input: toContentState(''),
            suggestions: [],
            editLoading: false,
            sending: false,
            visible: false,
            focus: false,
            over: false,
            verbalContent: 0,
            mediaContent: 0,
            itemIndex: this.props.type,
            fileList: [],
        };
        this.handleItemChange = this.handleItemChange.bind(this);
        this.textInput = null;
    }

    componentWillMount() {
        getFriends({mode: 'lite'}).then((data) => {
            webFrameworks = data;
        });
        this.loadChildStatus()

    }

    loadChildStatus = () => {
        if (this.props.item.type === 'reply') {
            getContextStatuses({id: this.props.item.in_reply_to_status_id}).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    let selectItem;
                    data.map((item, i) => {
                        if (item.id === this.props.item.id) {
                            selectItem = item;
                        }
                    });
                    this.setState({items: data, item: data[0], selectItem: selectItem});
                }

            }).finally(() => {
                this.setState({loading: false})
            })
        } else {
            this.setState({loading: false})
        }
    };


    handFocus = () => {
        this.setState({
            focus: true,
        });

    };

    handBlur = () => {
        if (this.state.verbalContent === 0) {
            this.setState({
                focus: false,
            });
        }

    };

    handleLightBox() {
        this.setState({
            openLight: true,
            image: this.state.item.photo.originurl,
            imageCaption: this.state.item.plain_text
        })
    };


    handleChange = (editorState) => {
        if (this.state.itemIndex === 1 && !this.init) {
            editorState = toContentState('转@' + this.state.selectItem.user.name + ' ' + this.state.selectItem.plain_text);
            this.init = true;
        }
        const content = Mention.toString(editorState);
        this.setState({
            verbalContent: content.length / 140 * 100 + this.state.mediaContent + (this.state.itemIndex === 0 ? this.state.selectItem.user.name.length + 2 : 0),
            input: editorState
        });
    };

    selectEmoji = (value) => {
        const input = toContentState(Mention.toString(this.state.input) + value.native);
        this.setState({
            input: input,
        });
    };

    handleChangeImage = ({fileList}) => {
        fileList.map((data) =>
            data.status = 'done'
        );
        this.setState({fileList})
    };

    handleRemoveImage = () => {
        this.setState({
            fileList: []
        })
    };


    handleSend = () => {
        const that = this;
        if (that.state.verbalContent + that.state.mediaContent >= 100) {
            message.error('内容长度超出，请删减');
            return
        }
        that.setState({sending: true});
        let params = {status: Mention.toString(this.state.input)};
        if (this.state.itemIndex === 0) {
            params.status = '@' + this.state.selectItem.user.name + ' ' + params.status;
            params.in_reply_to_status_id = this.state.selectItem.id;
            params.in_reply_to_user_id = this.state.selectItem.user.id;
        } else {
            params.repost_status_id = this.state.selectItem.id;
        }
        postStatus(params).then(data => {
            if (!data.error) {
                message.success('发送成功')
                this.props.onSend()
            } else {
                message.error('发送失败')
            }
        }).catch(() => {
            message.error('发送失败')
        }).finally(() => {
            this.setState({sending: false})
        })
    };

    handleOpenUser = (e, user) => {
        const url = '/user/' + (user.id === null ? user : user.id);
        history.push(url);
    };

    handSelectComment = (isSelect, item) => {
        if (isSelect) {
            item = this.state.item;
        }
        this.setState({
            selectItem: item
        }, () => {
            if (this.state.focus) {
                this.sendInput.focus();
            }
        });

        if (this.state.itemIndex === 1 && this.state.focus) {
            this.handleChange(toContentState('转@' + item.user.name + ' ' + item.plain_text));
        }
    };

    handleItemChange({activeIndex}) {
        this.init = false;
        this.setState(prevState => ({
            itemIndex: activeIndex,
            input: toContentState(''),
            focus: false,
            verbalContent: 0,
            mediaContent: 0,
            fileList: [],
        }));
    };


    onSearchChange = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = webFrameworks.filter(item => item.screen_name.toLowerCase().indexOf(searchValue) !== -1);
        const suggestions = filtered.map(suggestion => (
            <Nav
                value={suggestion.screen_name}
                data={suggestion}
                disabled={suggestion.disabled}
            >
                <AntdAvatar
                    src={suggestion.profile_image_url}
                    size="small"
                    style={{
                        width: 14, height: 14, marginRight: 8, top: -1, position: 'relative',
                    }}
                />
                {suggestion.screen_name}
            </Nav>
        ));
        this.setState({suggestions});
    };


    renderContent(txt) {
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
                    content.push(item.text)
                }
            } else if (item.type === "at") {
                content.push(<Popup trigger={<a onClick={e => this.handleOpenUser(e, item.id)}>{item.text}</a>}
                                    position={["bottom center", "top center"]}
                                    on='hover'
                                    contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                    <UserPop id={item.id}/>
                </Popup>)
            } else if (item.type === "tag") {
                content.push(<a onClick={() => {
                    history.push('/search/' + item.query);
                }}>{item.text}</a>);
            } else if (item.type === "link") {
                content.push(<a href={item.link} target="view_frame">{item.text}</a>);
            }
        });
        return (<div>
            {content}
        </div>)
    }


    renderChild() {
        console.log('1111');
        let media;
        if (false) {
            media = (<Player/>);
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
        let {item} = this.state;
        if (item.photo) {
            media = (
                <img style={{width: '100%', height: '300px', objectFit: 'cover', border: '1px', marginTop: '10px'}}
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
                        <Box flex='grow' marginLeft={2}>
                            <span style={{marginTop: '-2px'}}>@{item.user.id}</span>
                        </Box>
                        <span
                            dangerouslySetInnerHTML={{__html: item.source}}
                        />
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
                    <span style={{
                        marginTop: '5px',
                        fontSize: '10px'
                    }}>{moment(item.created_at).format('YYYY/MM/DD HH:mm:ss')}</span>
                </div>
            )

        }
    }

    renderComment() {
        if (this.state.items.length > 1) {
            return (<div style={{marginTop: '10px', marginBottom: '10px'}}>
                {this.state.items.map((item, i) => {
                    let isSelect = false;
                    if (item.id === this.state.selectItem.id) {
                        isSelect = true;
                    }
                    return (
                        i > 0 && (<div key={i}
                                       className={isSelect ? 'reply-item-select' : 'reply-item'}
                                       onClick={() => this.handSelectComment(isSelect, item)}>
                            <div style={{display: 'flex'}}>
                                <div style={{height: '24px', marginRight: '10px'}}
                                     onClick={e => this.handleOpenUser(e, item.user)}>
                                    <Avatar
                                        size="sm"
                                        src={item.user.profile_image_url}
                                        name={item.user.name}
                                    />
                                </div>
                                <Popup trigger={<div onClick={e => this.handleOpenUser(e, item.user)}>
                                    <Text size='sm' bold><Link inline>
                                        {item.user.name}
                                    </Link></Text>
                                </div>}
                                       position={["bottom center", "top center"]}
                                       on='hover'
                                       contentStyle={{width: 'auto', padding: 0, border: 0, borderRadius: "3px"}}>
                                    <UserPop user={item.user}/>
                                </Popup>
                                <span style={{
                                    marginTop: '2px',
                                    fontSize: '10px',
                                    marginLeft: '10px'
                                }}>{moment(item.created_at).format('YYYY/MM/DD HH:mm:ss')}</span>
                            </div>
                            <div style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-all',
                                wordWrap: 'break-word',
                                marginTop: '5px',
                                marginLeft: '34px'
                            }}>
                                {this.renderContent.bind(this)(item.txt)}
                            </div>
                        </div>)
                    )
                })}
            </div>);
        }
    }


    render() {
        console.log(this.state.item);
        const {
            loading,
            openLight,
            image,
            item,
            imageCaption,
            editLoading,
            suggestions,
            fileList,
            input,
            verbalContent,
            mediaContent,
            sending,
            focus,
            itemIndex
        } = this.state;
        return (
            <div>
                <Spinner show={loading} accessibilityLabel="spinner"/>
                {!loading && <div>
                    <Box display='flex' alignItems='center' width='100%'>
                        <div style={{height: 40}} onClick={e => this.handleOpenUser(e, item.user)}>
                            <Avatar
                                size="md"
                                src={item.user.profile_image_url}
                                name={item.user.name}
                            />
                        </div>
                        <Box display='flex' direction='column' marginLeft={3} width='100%'>
                            <Text bold><Link inline>
                                {item.user.name}
                            </Link></Text>
                            <Box display='flex' direction='row' justifyContent="between" alignItems="end" width='100%'>
                                <span style={{marginTop: '-2px'}}>@{item.user.id}</span>
                                <span
                                    dangerouslySetInnerHTML={{__html: item.source}}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box display="flex" direction="column" width="100%">
                        <Box marginBottom={2} marginTop={2}>
                            {this.renderContent.bind(this)(item.txt)}
                        </Box>
                        {this.renderChild.bind(this)()}
                        <span style={{
                            marginTop: '2px',
                            fontSize: '10px'
                        }}>{moment(item.created_at).format('YYYY/MM/DD HH:mm:ss')}</span>


                        {this.renderComment.bind(this)()}

                        <SegmentedControl
                            items={["回复", "转发"]}
                            selectedItemIndex={itemIndex}
                            onChange={this.handleItemChange}
                        />

                        <div style={{marginTop: '5px'}}>
                            <Mention
                                ref={ele => {
                                    this.sendInput = ele;
                                }}
                                style={{width: '100%', height: focus ? 80 : 30}}
                                loading={editLoading}
                                suggestions={suggestions}
                                onSearchChange={this.onSearchChange}
                                value={input}
                                multiLines={true}
                                placeholder={"你想说什么？"}
                                onPressEnter={this.handleSend}
                                onChange={this.handleChange}
                                onFocus={this.handFocus}
                                onBlur={this.handBlur}
                            />
                            {fileList.length > 0 && (
                                <div style={{marginTop: '10px'}}>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        showUploadList={{showPreviewIcon: false}}
                                        onRemove={this.handleRemoveImage}
                                    >
                                    </Upload>
                                </div>
                            )}
                            <div>
                                <Progress
                                    strokeWidth={6}
                                    strokeWidth={4}
                                    strokeColor={(verbalContent + mediaContent) >= 100 ? '#ff0000' : '#0000ff'}
                                    percent={verbalContent + mediaContent}
                                    successPercent={mediaContent} showInfo={false}/>
                                <div style={{display: 'flex'}}>
                                    <Popup trigger={<Button style={{border: '0px'}}>
                                        <MyIcon type="icon-emoji" style={{fontSize: '24px'}}/>
                                    </Button>} position="left center"
                                           contentStyle={{width: 'auto'}}>
                                        <div><Picker onSelect={this.selectEmoji}/></div>
                                    </Popup>


                                    <Upload
                                        fileList={fileList}
                                        showUploadList={false}
                                        openFileDialogOnClick={fileList.length < 1}
                                        onChange={this.handleChangeImage}>
                                        <Button style={{border: '0px', marginLeft: '10px'}}>
                                            <MyIcon type="icon-image" style={{fontSize: '20px'}}/>
                                        </Button>
                                    </Upload>

                                    <div style={{flex: '1'}}/>

                                    <Button type="primary" loading={sending}
                                            disabled={(verbalContent + mediaContent) <= 0}
                                            onClick={this.handleSend}>{itemIndex === 0 ? "回复" : "转发"}</Button>
                                </div>
                            </div>
                        </div>

                    </Box>
                </div>}

                {openLight && (
                    <Lightbox
                        mainSrc={image}
                        onCloseRequest={() => this.setState({openLight: false})}
                        animationDisabled={true}
                        imageCaption={imageCaption}
                    />
                )}
            </div>
        );
    }
}
