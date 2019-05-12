import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Sticky} from 'gestalt';
import {history} from '../../../../history'
import './Left.scss'

export default class Menu extends Component {
    static propTypes = {
        user: PropTypes.object,
        pronoun: PropTypes.string,
        index: PropTypes.number
    };

    static defaultProps = {
        pronoun: '我',
        index: 0
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    getClassName = (index) => {
        if (index === this.props.index) {
            return 'item-select';
        } else {
            return 'item';
        }
    };
    handleItemClick = (index) => {
        this.setState({
            select: index
        });

        if (!this.props.user.protected || this.props.user.following) {
            switch (index) {
                case 1:
                    history.push('/user/' + this.props.user.id);
                    break;
                case 2:
                    history.push('/photo/' + this.props.user.id);
                    break;
                case 3:
                    history.push('/favorite/' + this.props.user.id);
                    break;
                case 4:
                    history.push('/friends/' + this.props.user.id);
                    break;
                case 5:
                    history.push('/followers/' + this.props.user.id);
                    break;
            }
        } else {
            history.push('/user/' + this.props.user.id)
        }


    };

    render() {
        const {user, pronoun} = this.props;

        return (
            <Sticky top="60px">
                <div className="menu">
                    <div className={this.getClassName(1)} onClick={() => this.handleItemClick(1)}>
                        {pronoun}发布的
                        <div className='right'>{user.statuses_count}</div>
                    </div>
                    <div className={this.getClassName(2)} onClick={() => this.handleItemClick(2)}>
                        <div>{pronoun}的相册</div>
                        <div className='right'>{user.photo_count}</div>
                    </div>
                    <div className={this.getClassName(3)} onClick={() => this.handleItemClick(3)}>
                        <div>{pronoun}的收藏</div>
                        <div className='right'>{user.favourites_count}</div>
                    </div>
                    <div className={this.getClassName(4)} onClick={() => this.handleItemClick(4)}>
                        <div>{pronoun}关注的</div>
                        <div className='right'>{user.friends_count}</div>
                    </div>
                    <div className={this.getClassName(5)} onClick={() => this.handleItemClick(5)}>
                        <div>关注{pronoun}的</div>
                        <div className='right'>{user.followers_count}</div>
                    </div>
                </div>
            </Sticky>
        );
    }
}
