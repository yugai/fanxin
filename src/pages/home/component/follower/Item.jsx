import React, {Component} from 'react';
import {Button} from 'antd';
import {Box, Avatar, Text} from 'gestalt';
import PropTypes from "prop-types";

export default class Item extends Component {
    static propTypes = {
        item: PropTypes.object,
        type: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            following: this.props.item.following
        }

    }

    render() {
        const {item, type} = this.props;
        let following = false;
        let button = '';
        switch (type) {
            case 0:
                following = this.state.following;
                button = '取消关注';
                break;
            case 1:
                following = this.state.following;
                button = following ? '取消关注' : '关注';
                break;
            case 2:
                button = '移除黑名单';
                break;
            case 3:
                button = '同意';
                break;
        }
        return (
            <div style={{
                display: 'flex',
                padding: '5px 10px',
                borderBottom: '0.5px solid #eeeeee'
            }}>
                <Box alignItems='center'>
                    <Avatar
                        size="md"
                        src={item.profile_image_url}
                        name={item.name}
                    />
                </Box>
                <div style={{display: 'flex', flexDirection: 'column', padding: '0px 10px', maxWidth: '75%'}}>
                    <div>
                        <Text bold inline>{item.screen_name}</Text>
                    </div>
                    <Text truncate leading="tall">
                        {item.description ? item.description : '暂无'}
                    </Text>
                    <Text size="sm">{item.location ? item.location : '暂无'}</Text>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end'
                }}>
                    {type === 3 && (<div style={{flexGrow: 1}}>
                        <Button type={following ? 'danger' : 'default'}
                                shape='round'>拒绝</Button>
                    </div>)}
                    <Button type={following ? 'danger' : 'default'}
                            shape='round'>{button}</Button>

                </div>
            </div>
        );
    }
}
