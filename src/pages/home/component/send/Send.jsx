import React, {Component} from 'react';
import {Mention, Avatar, Button, Progress, Upload, message} from 'antd';
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart';
import Popup from "reactjs-popup";
import {postStatus, postPhoto, getFriends} from "../../../../utils/fanfou";
import {MyIcon} from "../../../../layouts/MyIcon";
import PropTypes from "prop-types";

const {toContentState} = Mention;


const Nav = Mention.Nav;

let webFrameworks = [];

export default class Send extends Component {
    static propTypes = {
        onSend: PropTypes.func
    };
    static defaultProps = {
        onSend: Promise.resolve.bind(Promise),
    };

    constructor(props) {
        super(props);
        this.state = {
            input: toContentState(''),
            suggestions: [],
            loading: false,
            visible: false,
            sending: false,
            focus: false,
            over: false,
            verbalContent: 0,
            mediaContent: 0,
            fileList: [],
        };
        message.config({
            top: 100,
            duration: 2,
            maxCount: 3,
        });
    }

    componentWillMount() {
        getFriends({mode: 'lite'}).then((data) => {
            webFrameworks = data;
        })
    }

    handFocus = () => {
        this.setState({
            focus: true,
        });
    };

    handBlur = () => {
        this.setState({
            focus: false,
        });
    };

    handleSend = () => {
        const that = this;
        if (that.state.verbalContent + that.state.mediaContent >= 100) {
            message.error('内容长度超出，请删减');
            return
        }
        that.setState({sending: true});

        if (that.state.fileList.length > 0) {
            that.setState({sending: true});
            const content = {
                status: Mention.toString(this.state.input),
                photo: that.state.fileList[0].originFileObj
            };
            postPhoto(content).then((data) => {
                message.success('发送成功');
                that.setState({
                    input: toContentState(''),
                    verbalContent: 0,
                    mediaContent: 0,
                    fileList: [],
                });
                console.log(data);
                that.props.onSend(data)

            }).catch(() => {
                message.error('发送失败');
            }).finally(() => {
                new Promise(() => {
                    that.setState({sending: false});
                })
            })
        } else {
            const content = {
                status: Mention.toString(this.state.input),
            };
            postStatus(content).then((data) => {
                message.success('发送成功');
                that.setState({
                    input: toContentState(''),
                    verbalContent: 0,
                });
                that.props.onSend(data)

            }).catch(() => {
                message.error('发送失败');
            }).finally(() => {
                new Promise(() => {
                    that.setState({sending: false});
                })
            });
        }
    };


    handleChange = (editorState) => {
        const content = Mention.toString(editorState);
        this.setState({
            input: editorState,
            verbalContent: content.length / 140 * 100 + this.state.mediaContent
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


    onSearchChange = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = webFrameworks.filter(item => item.screen_name.toLowerCase().indexOf(searchValue) !== -1);
        const suggestions = filtered.map(suggestion => (
            <Nav
                value={suggestion.screen_name}
                data={suggestion}
                disabled={suggestion.disabled}
            >
                <Avatar
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

    render() {
        const {suggestions, loading, sending, verbalContent, mediaContent, fileList} = this.state;
        return (
            <div style={styles.container}>
                <Mention
                    style={{width: '100%', height: 80}}
                    loading={loading}
                    suggestions={suggestions}
                    onSearchChange={this.onSearchChange}
                    value={this.state.input}
                    multiLines={true}
                    placeholder={"你在想什么？"}
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
                <Progress
                    strokeWidth={6}
                    strokeWidth={4}
                    strokeColor={(verbalContent + mediaContent) >= 100 ? '#ff0000' : '#0000ff'}
                    percent={verbalContent + mediaContent}
                    successPercent={mediaContent} showInfo={false}/>
                <div style={styles.tools}>
                    <Popup trigger={<Button style={{border: '0px'}}>
                        <MyIcon type="icon-emoji" style={{fontSize: '24px'}}/>
                    </Button>} position="bottom center"
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

                    <Button style={{border: '0px', marginLeft: '10px'}}>
                        <MyIcon type="icon-shipin" style={{fontSize: '26px'}}/>
                    </Button>

                    <div style={{flex: '1'}}/>

                    <Button type="primary"
                            loading={sending}
                            disabled={(verbalContent + mediaContent) <= 0}
                            onClick={this.handleSend}>发送</Button>

                </div>
            </div>
        );
    }
}

const
    styles = {
        container: {
            width: '100%',
            paddingRight: '10px',
            paddingLeft: '10px',
            paddingBottom: '10px'
        },
        tools: {
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center'
        }
    };
