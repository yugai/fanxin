import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Exception.scss';

import NotFoundImg from '../../assets/e-not-found.png';
import ErrorImg from '../../assets/e-error.png';

export default class Exception extends Component {


    render() {
        console.log(this.props.match.params.code);
        return (
            <div style={styles.parent}>
                <div style={styles.exceptionContent} className="exception-content">
                    <img
                        src={this.props.match.params.code==='404'?NotFoundImg:ErrorImg}
                        style={styles.image}
                        className="imgException"
                        alt={this.props.match.params.code==='404'?'404':'500'}
                    />
                    <div className="prompt">
                        <h3 style={styles.title} className="title">
                            {this.props.match.params.code==='404'?'抱歉，你访问的页面不存在':'王村可能在下片，请稍后访问'}
                        </h3>
                        <p style={styles.description} className="description">
                            请返回<Link to="/">首页</Link>继续浏览
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    parent: {
        position: 'fixed',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    exceptionContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#333',
    },
    description: {
        color: '#666',
    },
};
