import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import {Spinner} from 'gestalt';
import {message, Alert, Button} from 'antd';
import LoadList from './LoadList'
import Send from "../send/Send";
import {
    getHomeTimeLine,
    getUserTimeLine,
    getSearchTimeLine,
    getMentions,
    getFavoritesList,
    getUserInfo
} from '../../../../utils/fanfou';
import './Topic.scss'
import Item from "./Item";
import PropTypes from 'prop-types'
import ErrorImg from '../../../../assets/e-private.png';


export default class Topic extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func
    };
    static propTypes = {
        url: PropTypes.string
    };
    static defaultProps = {
        url: 'home'

    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            newData: [],
            hasNewFeed: false,
            isPublic: false,
            loading: false,
            count: 0
        };
    }

    componentWillMount() {
        this.fetchData();
        this.getUser();
    }

    fetchData = () => {
        const that = this;
        if (this.state.loading) {
            return
        }
        this.setState({
            loading: true
        });
        let response;
        let maxId = "";
        if (this.state.data.length > 0) {
            maxId = this.state.data[this.state.data.length - 1].id
        }
        if (!this.page) {
            this.page = 1;
        } else {
            this.page++;
        }

        switch (this.props.url) {
            case 'home':
                response = getHomeTimeLine({max_id: maxId});
                break;
            case 'at':
                response = getMentions({max_id: maxId});
                break;
            case 'search':
                response = getSearchTimeLine({max_id: maxId, q: this.props.match.params.text});
                break;
            case 'user':
                response = getUserTimeLine({max_id: maxId, id: this.props.match.params.id});
                break;
            case 'favorite':
                response = getFavoritesList({page: this.page, id: this.props.match.params.id});
                break
        }

        response.then((data) => {
            console.log(data);
            if (data.error != null) {
                that.setState({
                    isPublic: true
                })
            } else {
                const list = that.state.data.concat(data);
                that.setState({
                    data: list
                })
            }
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
        } else {
            if (this.context.user.id !== this.context.loginUser.id) {
                this.context.onChangeUser(this.context.loginUser);
            }

        }
    }

    handleFollow = () => {

    };


    handleInfiniteOnLoad = () => {
        this.fetchData();
    };

    handleClose = () => {
        this.setState({
            hasNewFeed: false,
            data: this.state.newData,
            newData: [],
            count: 0
        });
    };

    renderItem = (item, i) => {
        return <Item item={item} key={item.id} onDel={() => {
            this.state.data.splice(i, 1);
            this.setState({
                data: this.state.data
            })
        }}/>
    };


    render() {
        const {
            data,
            count,
            loading,
            isPublic,
            hasNewFeed,
        } = this.state;

        let title = "饭新";

        switch (this.props.url) {
            case 'home':
                title = "饭新";
                break;
            case 'at':
                title = "@我";
                break;
            case 'search':
                title = "搜索";
                break;
            case 'user':
                title = this.context.user.name;
                break;
            case 'favorite':
                title = "收藏";
                break
        }

        let send;
        if (this.props.url === "home") {
            send = (<Send onSend={(item) => {
                    getHomeTimeLine().then((data) => {
                        if (Array.isArray(data) && data[0].id !== item.id) {
                            data.unshift(item)
                        }
                        this.setState({
                            hasNewFeed: false,
                            data: data,
                            newData: [],
                            count: 0
                        })
                    })
                }}/>
            )
        }

        return (
            <div className="center-container">
                {send}
                {
                    hasNewFeed && (
                        <Alert
                            message={"您有" + count + "新的消息"}
                            banner={true} type="warning"
                            showIcon={false}
                            closeText="点击查看"
                            closable
                            afterClose={this.handleClose}/>
                    )
                }
                {
                    isPublic ? (
                        <div className='private'>
                            <img
                                src={ErrorImg}
                                className='image'
                            />
                            <div>
                                <span className='text'>我只向关注我的人公开我的消息。</span>
                            </div>
                            <Button type="primary"
                                    className="follow"
                                    onClick={this.handleFollow}>关注</Button>
                        </div>
                    ) : (
                        <LoadList
                            itemDiv={this.renderItem.bind(this)}
                            loadMore={this.handleInfiniteOnLoad.bind(this)}
                            data={data}
                            num={50}
                        />
                    )
                }
                <Spinner show={loading} accessibilityLabel="spinner"/>
                <DocumentTitle title={title} key="title"/>
            </div>
        );
    }


    componentDidMount() {
        const that = this;
        if (this.props.url === "home") {
            that.timer = setInterval(
                () => {
                    getHomeTimeLine().then((data) => {
                        const item = data[data.length - 1];
                        console.log(item);
                        let count = data.length;
                        if (that.state.hasNewFeed) {
                            that.state.newData.map((element, index) => {
                                if (element && element.id === item.id) {
                                    count = data.length - 1 - index;
                                    if (count > 0) {
                                        that.setState({
                                            count: count + that.state.count,
                                            newData: data.slice(0, count).concat(this.state.newData)
                                        })
                                    }

                                }
                            })
                        } else {
                            that.state.data.map((element, index) => {
                                if (element.id === item.id) {
                                    count = data.length - 1 - index;
                                    if (count > 0) {
                                        that.setState({
                                            hasNewFeed: true,
                                            count: count,
                                            newData: data.slice(0, count).concat(this.state.data)
                                        })
                                    }

                                }
                            })
                        }
                    })
                },
                10000
            );
        }

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

}
