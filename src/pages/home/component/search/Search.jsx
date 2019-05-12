import React, {Component} from 'react';
import {Spinner} from 'gestalt';
import DocumentTitle from 'react-document-title';
import LoadList from "../topic/LoadList";
import {getSearchTimeLine} from "../../../../utils/fanfou";
import {message} from "antd/lib/index";

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemIndex: 0,
            data: [],
            loading: false,
        };
    }

    componentWillMount() {
        this.page = 0;
        this.fetchData()
    };

    renderItem = (item, i) => {
        return <div>1111</div>
    };

    handleInfiniteOnLoad = () => {
        this.fetchData();
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


        getSearchTimeLine({page: this.page,q:this.props.match.params.text}).then((data) => {
            const list = that.state.data.concat(data);
            console.log(list);
            that.setState({
                data: list
            })
        }).catch((e) => {
            console.log(e);
            message.error('请求失败');
        }).finally(() => {
            this.setState({
                loading: false
            });
        })

    };

    render() {
        const {loading, data} = this.state;
        return (
            <div className='center-container'>
                <LoadList
                    itemDiv={this.renderItem.bind(this)}
                    loadMore={this.handleInfiniteOnLoad.bind(this)}
                    data={data}
                    num={50}
                />
                <Spinner show={loading} accessibilityLabel="spinner"/>
                <DocumentTitle title="搜索" key="title"/>
            </div>
        );
    }
}
