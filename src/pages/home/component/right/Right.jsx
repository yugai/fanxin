import React, {Component} from 'react';
import {Button, Text, Link, Box, Avatar, Icon} from 'gestalt'
import {Carousel, Divider} from 'antd';
import './Right.scss'
import Img from '../../../../assets/user_bg.jpg'
import {getUserTimeLine} from "../../../../utils/fanfou";

export default class Right extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        getUserTimeLine({id: 'lito'}).then((data) => {
            this.setState({
                data: data.slice(0, 5)
            })
        })
    }

    render() {
        return (
            <div className="sidebar">
                <Carousel autoplay={true}>
                    {this.state.data.map((item) => (
                        <div>
                            <div style={{
                                position: "relative",
                                borderRadius: '5px',
                                height: '400px',
                                background: item.photo ? 'black' : '#9E7A7A'
                            }}>
                                {item.photo && (<img style={styles.img} src={item.photo.largeurl} alt="img"/>)}
                                <div style={styles.text}>{item.plain_text}</div>
                                <div style={styles.bottom}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar
                                            size="md"
                                            src={item.user.profile_image_url}
                                            name={item.user.name}
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>

                <div style={styles.about}>
                    <Text size="xs" color="gray">
                        本程序是由饭否提供
                        <Text size="xs" inline italic>
                            <Link inline href="https://pinterest.com">
                                开放API
                            </Link>
                        </Text>
                        开发而成
                    </Text>
                    <Text size="xs" color="gray">
                        移动端App下载链接:
                        <Text size="xs" inline italic>
                            <Link inline href="https://pinterest.com">
                                Android
                            </Link>
                        </Text>
                        <Text size="xs" inline> </Text>
                        <Text size="xs" inline italic>
                            <Link inline href="https://pinterest.com">
                                iOS
                            </Link>
                        </Text>
                    </Text>
                    <Text size="xs" color="gray">
                        关于作者
                        <Text size="xs" inline italic>
                            <Link inline href="https://pinterest.com">
                                @饭新
                            </Link>
                        </Text>
                        <Text size="xs" inline italic>
                            <Link inline href="https://pinterest.com">
                                为什么
                            </Link>
                        </Text>
                        <Text size="xs" color="gray" inline> 要做这个程序</Text>
                    </Text>

                    <Divider/>


                    <Box alignItems="center" display="flex">
                        <Box marginRight={1} padding={1}>
                            <Icon icon="heart" accessibilityLabel="heart" color="red"/>
                        </Box>
                        <Link href="https://pinterest.com">
                            <Text color="blue" bold>赞助开发者</Text>
                        </Link>
                    </Box>
                </div>
            </div>
        );
    }
}

const styles = {
    bg: {
        position: "relative",
        borderRadius: '5px',
        height: '400px',
        background: 'black'
    },
    img: {
        zIndex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.8,
        borderRadius: '5px',
        objectFit: 'cover',
        filter: 'alpha(opacity=80)',
    },
    text: {
        zIndex: 2,
        width: '300px',
        position: 'absolute',
        padding: '10px',
        color: 'white',
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
    },
    bottom: {
        zIndex: 3,
        position: 'absolute',
        bottom: '10px',
        width: '300px',
        padding: '10px'
    },
    about: {
        marginTop: '12px',
        background: '#fff',
        borderRadius: '5px',
        padding: '15px'
    }
};
