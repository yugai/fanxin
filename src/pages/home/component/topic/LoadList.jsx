import React, {Component} from 'react';
import PropTypes from 'prop-types'

export default class LoadList extends Component {
    static propTypes = {
        loadMore: PropTypes.func,
        num: PropTypes.number,
        itemDiv: PropTypes.func,
        data: PropTypes.array,
        hasMore: PropTypes.bool,
    };
    static defaultProps = {
        loadMore: Promise.resolve.bind(Promise),
        hasMore: true,
        num: 50,
    };

    constructor(props) {
        super(props);
        this.state = {
            codeType: true,
        }
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
        if (height <= (this.props.num || 0)) {
            // 判断执行回调条件
            if (this.state.codeType && this.props.hasMore) {
                // 执行回调
                this.props.loadMore();
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

    renderItem(item, i) {
        return this.props.itemDiv(item, i)
    }

    render() {

        return (<div>
            {this.props.data.map((item, i) => (
                this.renderItem(item, i)
            ))}
        </div>);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll)
    }
}
