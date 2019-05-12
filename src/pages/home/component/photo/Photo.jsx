import React, {Component} from 'react';
import Masonry from 'react-masonry-component';
import DocumentTitle from 'react-document-title';
import {Spinner} from 'gestalt';
import {message, Button} from 'antd';
import Lightbox from 'react-image-lightbox';
import {getPhotos, getUserInfo} from "../../../../utils/fanfou";
import moment from "moment/moment";
import PropTypes from 'prop-types';

export default class Photo extends Component {
    static contextTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.object,
        onChangeUser: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            openLight: false,
            item: null,
            data: [],
            codeType: true,
            hasMore: true,
            page: 0,
            loading: false
        }
    }

    componentWillMount() {
        this.fetchData();
        this.getUser();
    }

    fetchData = () => {
        const that = this;
        const newPage = this.state.page + 1;
        this.setState({
            loading: true,
            page: newPage
        });
        getPhotos({count: 60, page: this.state.page, id: this.props.match.params.id}).then((data) => {
            console.log(data);
            const list = that.state.data.concat(data);
            this.setState({
                hasMore: data.length === 60,
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

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll)
    }

    onScroll = (event) => {
        // 滚动的高度
        const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false) || window.pageYOffset || (event.srcElement ? event.srcElement.body.scrollTop : 0);
        // 视窗高度
        const clientHeight = (event.srcElement && event.srcElement.documentElement.clientHeight) || document.body.clientHeight;
        // 页面高度
        const scrollHeight = (event.srcElement && event.srcElement.documentElement.scrollHeight) || document.body.scrollHeight;
        // 距离页面底部的高度
        const height = scrollHeight - scrollTop - clientHeight;
        // 判断距离页面底部的高度
        if (height <= 50) {
            // 判断执行回调条件
            if (this.state.codeType && this.state.hasMore) {
                // 执行回调
                this.fetchData()
                // 关闭判断执行开关
                this.setState(
                    {
                        codeType: false,
                    }
                );
            }
        } else {
            // 打开判断执行开关
            this.setState({
                codeType: true
            });
        }
    };

    render() {
        const {data, loading, openLight, item} = this.state;
        return (
            <div style={{margin: '0px 12px', width: '600px', height: '100%'}}>
                <Masonry
                    ref={ref => (this.masonryRef = ref)}
                    elementType="div"
                    options={{transitionDuration: 3, fitWidth: true}}
                    disableImagesLoaded={false}
                    updateOnEachImageLoad={false}>
                    {data.map((elem) => {
                        return (
                            <div>
                                {elem.photo && (
                                    <img style={{
                                        width: '200px',
                                        minHeight: '100px',
                                        padding: '2px',
                                        borderRadius: '5px'
                                    }}
                                         src={elem.photo.imageurl} onClick={() => {
                                        this.setState({
                                            item: elem,
                                            openLight: true
                                        })
                                    }}/>
                                )}
                            </div>
                        );
                    })}
                </Masonry>
                <Spinner show={loading} accessibilityLabel="spinner"/>
                {openLight && (
                    <Lightbox
                        mainSrc={item.photo.originurl}
                        imageTitle={moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                        onCloseRequest={() => this.setState({openLight: false})}
                        animationDisabled={true}
                        imageCaption={item.plain_text}
                        toolbarButtons={[<Button type="dashed" ghost>查看原文</Button>]}
                    />
                )}
                <DocumentTitle title={"相册"} key="title"/>
            </div>
        );
    }
}
