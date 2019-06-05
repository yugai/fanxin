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
    getUserInfo,
    getBrowse, postAddFriend
} from '../../../../utils/fanfou';
import './Topic.scss'
import Item from "./Item";
import PropTypes from 'prop-types'
import ErrorImg from '../../../../assets/e-private.png';
import {history} from "../../../../history";


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
            isPublic: false,
            loading: false,
            canLoad: true
        };

        if (props.cacheLifecycles) {
            props.cacheLifecycles.didCache(this.componentDidCache);
            props.cacheLifecycles.didRecover(this.componentDidRecover);
        }
    }

    componentDidCache = () => {
        console.log('List cached');
    };

    componentDidRecover = () => {
        console.log('List recovered');
        this.getUser();
    };


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
            case 'browse':
                response = getBrowse({max_id: maxId});
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
                that.setState({
                    data: that.state.data.concat(data),
                    canLoad: this.props.url !== 'browse'
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
        console.log(this.props.match.params.id);
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
        postAddFriend({id: this.context.user.id}).then((data) => {
            console.log(data);
            if (data.error) {
                message.success(data.error);
            } else {
                message.success('关注成功');
                this.context.onChangeUser(data);
            }
        })
    };


    handleInfiniteOnLoad = () => {
        this.fetchData();
    };

    handleClose = () => {
        this.setState({
            data: this.state.newData.concat(this.state.data),
            newData: []
        });
    };

    renderItem = (item, i) => {
        return <Item item={item} key={item.id}
                     onDel={() => {
                         this.state.data.splice(i, 1);
                         this.setState({
                             data: this.state.data
                         })
                     }}
                     onOpenUser={(user) => {
                         const url = '/user/' + user;
                         history.push(url);
                     }}
        />
    };


    render() {
        const {
            data,
            newData,
            loading,
            isPublic,
            canLoad
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
                    let data = this.state.newData.concat(this.state.data);
                    data.unshift(item);
                    this.setState({
                        data: data,
                        newData: []
                    })
                }}/>
            )
        }

        const count = newData.length;

        return (
            <div className="center-container">
                {send}
                {
                    count > 0 && (
                        <Alert
                            message={"您有" + count + "条新的消息"}
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
                            hasMore={canLoad}
                            num={50}
                        />
                    )
                }
                <Spinner show={loading} accessibilityLabel="spinner"/>
                <DocumentTitle title={title} key="title"/>
            </div>
        );
    }

    refreshFeed() {
        const that = this;
        that.timer = setInterval(
            () => {
                let response;
                if (this.props.url === "home") {
                    response = getHomeTimeLine();
                    if (this.state.data[0].user.id === this.context.loginUser.id) {
                        this.state.data.pop();
                    }
                } else {
                    response = getBrowse();
                }
                response.then((data) => {
                    const arr = this.state.newData.concat(this.state.data);
                    if (arr[0].id !== data[0].id) {
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if (arr[i].id === data[j].id && j > 0) {
                                    that.setState({
                                        newData: data.slice(0, j).concat(this.state.newData)
                                    });
                                    return;
                                }
                            }
                        }
                    }
                })
            },
            10000
        );
    }

    componentDidMount() {
        if (this.props.url === "home" || this.props.url === "browse") {
            this.refreshFeed()
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

}
