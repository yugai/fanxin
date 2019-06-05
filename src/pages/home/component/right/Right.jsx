import React, {Component} from 'react';
import {Text, Box, Icon} from 'gestalt';
import {message} from 'antd';
import {Link} from 'react-router-dom';
import ReactFontFace from 'react-font-face';
import kaiti from '../../../../assets/simkai.ttf';
import impact from '../../../../assets/impact.ttf';
import './Right.scss'
import {getUserTimeLine} from "../../../../utils/fanfou";
import {Divider} from "antd";
import moment from 'moment'

class Right extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            holiday: false
        }
    }

    componentWillMount() {
        getUserTimeLine({id: '~GgkWKSUlLCo'}).then((data) => {
            this.setState({
                data: data[0]
            })
        });

        fetch(`http://timor.tech/api/holiday/info`, {
            method: 'GET'
        }).then(res => res.text()).then(
            data => {
                if (data.code === 0) {
                    this.setState({
                        holiday: data.holiday.holiday
                    })
                }
            }
        )
    }

    render() {
        console.log(this.state.data);
        return (
            <div className="sidebar">
                {this.state.data && this.state.data.repost_status && (
                    <div>
                        <div style={styles.bg}>
                            {this.state.data.photo && (<img style={styles.img} src={this.state.data.photo.originurl}/>)}
                            <div style={{color: this.state.holiday ? 'red' : 'black'}}>
                                <div style={styles.calendar}>
                                    <span style={styles.day}>{moment().format('DD')}</span>
                                    <div style={styles.group}>
                                        <span style={styles.year}>{moment().format('dddd')}</span>
                                        <span style={styles.year}>{moment().format('MMMM●YYYY年')}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={styles.feed}>
                                    {this.state.data.repost_status.plain_text}
                                </div>
                                <div style={styles.name}>
                                    via {this.state.data.repost_status.user.name}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={styles.about}>
                    <Text size="xs" color="gray">
                        本程序是由饭否提供开放
                        <a href="https://github.com/FanfouAPI/FanFouAPIDoc"> <Text inline size="xs"
                                                                                   color="gray"> API </Text> </a>
                        开发而成
                    </Text>
                    <Text size="xs" color="gray">
                        移动端 App 下载链接:
                        <a onClick={() => {
                            message.error('目前正在开发中，尽情期待')
                        }}> <Text inline size="xs" color="gray"> Android </Text></a>
                        <a onClick={() => {
                            message.error('目前正在开发中，尽情期待')
                        }}> <Text inline size="xs" color="gray"> iOS </Text></a>
                    </Text>
                    <Text size="xs" color="gray">
                        感谢
                        <Link to='/user/lito'> @飯小默 </Link>
                        提供的 SDK
                    </Text>

                    <Divider/>


                    <Box alignItems="center" display="flex">
                        <Box marginRight={1} padding={1}>
                            <Icon icon="heart" accessibilityLabel="heart" color="red"/>
                        </Box>
                        <a onClick={() => {
                            message.info('感谢您的好意，目前这只是一个测试按钮')
                        }}>
                            <Text color="blue" bold>赞助开发者</Text>
                        </a>
                    </Box>
                </div>
            </div>
        );
    }
}

let fontConfig = {
    file: [
        {
            fontFamily: 'kaiti',
            fontStyle: 'normal',
            file: kaiti,
        },
        {
            fontFamily: 'impact',
            file: impact
        }
    ],
};

const styles = {
    bg: {
        borderRadius: '5px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '12px'
    },
    img: {
        width: '100%',
        maxHeight: '200px',
        objectFit: 'cover',
        borderTopRightRadius: '5px',
        borderTopLeftRadius: '5px'
    },
    calendar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0px'
    },
    day: {
        fontFamily: 'impact',
        fontSize: '60px',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5px'
    },
    year: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    feed: {
        width: '100%',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontFamily: 'kaiti',
        fontSize: '18px',
        wordBreak: 'break-all',
        wordWrap: 'break-word'
    },
    name: {
        width: '100%',
        padding: '20px',
        fontFamily: 'kaiti',
        textAlign: 'right'
    },
    about: {
        background: '#fff',
        borderRadius: '5px',
        padding: '15px'
    }
};

export default ReactFontFace(Right, fontConfig);
