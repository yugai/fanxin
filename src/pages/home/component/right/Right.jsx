import React, {Component} from 'react';
import {Button, Text, Link, Box, Avatar, Icon} from 'gestalt'
import {Carousel, Divider} from 'antd';
import './Right.scss'
import Img from '../../../../assets/user_bg.jpg'

export default class Right extends Component {
    render() {
        return (
            <div className="sidebar">
                <Carousel>
                    <div>
                        <div style={styles.bg}>
                            <img style={styles.img} src={Img} alt="img"/>
                            <div style={styles.text}>
                                <Text color='white'>
                                    风特别大，月亮很圆,
                                    我们站在一起说话,
                                    总是笑场
                                </Text>
                            </div>
                            <div style={styles.bottom}>
                                <Box display="flex" alignItems="center">
                                    <Avatar
                                        size="md"
                                        src="/gestalt/static/media/keerthi.b283324e.jpg"
                                        name="Keerthi"
                                    />
                                    <Box flex="grow" marginLeft={2}>
                                        <Text bold color="white">王兴</Text>
                                        <Text inline size="xs" color="white">1天前</Text>
                                    </Box>
                                    <Box paddingX={1}>
                                        <Button text="Follow" size="sm" color="red"/>
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    </div>
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
        background: '#000'
    },
    img: {
        width: '100%',
        height: '400px',
        opacity: 0.8,
        borderRadius: '5px',
        filter: 'alpha(opacity=80)',
    },
    text: {
        position: 'absolute',
        top: '0px',
        padding: '10px'
    },
    bottom: {
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
