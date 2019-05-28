import React, {Component} from 'react';
import {SegmentedControl, Box, Spinner, Text} from 'gestalt';
import DocumentTitle from 'react-document-title';
import LoadList from "../topic/LoadList";
import {message} from "antd/lib/index";
import {getApi, getUserInfo} from "../../../../utils/fanfou";
import Item from "./Item";
import PropTypes from 'prop-types';
import {history} from "../../../../history";


export default class Follower extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func
    };
    static propTypes = {
        url: PropTypes.string
    };

    constructor(props) {
        super(props);
        let itemIndex = 0;
        switch (this.props.url) {
            case 'friends':
                itemIndex = 0;
                break;
            case 'followers':
                itemIndex = 1;
                break;
            case 'blocks':
                itemIndex = 2;
                break;
            case 'requests':
                itemIndex = 3;
                break;
        }
        this.state = {
            itemIndex: itemIndex,
            data: [],
            loading: false
        };
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    componentWillMount() {
        if (this.state.itemIndex === 0) {
            this.url = '/users/friends';
        } else if (this.state.itemIndex === 1) {
            this.url = '/users/followers';
        } else if (this.state.itemIndex === 2) {
            this.url = '/blocks/blocking';
        } else if (this.state.itemIndex === 3) {
            this.url = '/friendships/requests';
        }
        this.page = 0;
        this.fetchData();
        this.getUser();
    };


    fetchData = () => {
        const that = this;
        if (this.state.loading) {
            return
        }

        this.page = this.page + 1;
        this.setState({
            loading: true,
        });


        getApi(this.url, {page: this.page, id: this.props.match.params.id}).then((data) => {
            const list = that.state.data.concat(data);
            that.setState({
                data: list
            })
        }).catch(() => {
            message.error('请求失败');
        }).finally(() => {
            this.setState({
                loading: false
            });
        })
    };

    getUser() {
        if (this.props.match.params.id) {
            if (this.context.user.id !== this.props.match.params.id) {
                getUserInfo({"id": this.props.match.params.id}).then((data) => {
                    this.context.onChangeUser(data);
                })
            }
        }
    }


    handleItemChange({activeIndex}) {
        if (activeIndex === 0) {
            history.push('/friends/' + this.props.match.params.id)
        } else if (activeIndex === 1) {
            history.push('/followers/' + this.props.match.params.id)
        } else if (activeIndex === 2) {
            history.push('/blocks/' + this.props.match.params.id)
        } else if (activeIndex === 3) {
            history.push('/requests/' + this.props.match.params.id)
        }

    };

    handleInfiniteOnLoad = () => {
        this.fetchData();
    };

    renderItem = (item, i) => {
        return <Item item={item} type={this.state.itemIndex} key={item.id} onDel={()=>{
            this.state.data.splice(i, 1);
            this.setState({
                data: this.state.data
            })
        }}/>
    };

    render() {
        const {itemIndex, data, loading} = this.state;

        const {user} = this.context;
        let pronoun;
        if (user.id === this.context.loginUser.id) {
            pronoun = '我';
        } else if (user.gender === '男') {
            pronoun = '他'
        } else if (user.gender === '女') {
            pronoun = '她'
        } else {
            pronoun = 'ta'
        }
        let menu = [<span style={styles.span}>{pronoun}关注的人</span>, <span style={styles.span}>关注{pronoun}的人</span>];
        if (user.id === this.context.loginUser.id) {
            menu.push(<span style={styles.span}>黑名单</span>, <span style={styles.span}>好友请求</span>)
        }

        return (
            <div className='center-container'>
                <Box padding={5}>
                    <SegmentedControl
                        items={menu}
                        selectedItemIndex={itemIndex}
                        onChange={this.handleItemChange}
                    />
                </Box>
                <LoadList
                    itemDiv={this.renderItem.bind(this)}
                    loadMore={this.handleInfiniteOnLoad.bind(this)}
                    data={data}
                    num={50}
                />
                <Spinner show={loading} accessibilityLabel="spinner"/>
                <DocumentTitle title={"朋友"} key="title"/>
            </div>
        );
    }
}

const styles = {
    span: {
        fontWeight: 'bold',
        fontSize: 16
    }
};

