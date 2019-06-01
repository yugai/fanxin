import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import {login} from "../../actions/actions";
import {Box, Button, TextField} from 'gestalt';
import DocumentTitle from 'react-document-title';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        this.handleChangePassWord = this.handleChangePassWord.bind(this);
    }

    handleChangeUserName({value}) {
        this.setState({username: value});
    }

    handleChangePassWord({value}) {
        this.setState({password: value});
    }

    handleSubmit() {
        const {username, password} = this.state;
        const {dispatch} = this.props;
        if (username && password) {
            dispatch(login(username, password));
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <Row wrap style={styles.row}>
                    <Col span="16" style={styles.col}>
                        <div style={styles.left}>
                            <div style={styles.text}>
                                <div style={styles.title}>饭否</div>
                                <p style={styles.description}>--在幻变的生命里，岁月，原是最大的小偷。</p>
                            </div>
                            <div style={styles.mask}/>
                        </div>
                    </Col>
                    <Col span="8" style={styles.col}>
                        <div style={styles.content}>
                            <Box display='flex' direction='column' width='50%'>
                                <p style={styles.formTitle}>登录</p>
                                <Box marginBottom={5}>
                                    <TextField
                                        id="username"
                                        onChange={this.handleChangeUserName}
                                        placeholder="用户名"
                                        value={this.state.username}
                                        type="text"
                                    />
                                </Box>
                                <Box marginBottom={5}>
                                    <TextField
                                        id="password"
                                        onChange={this.handleChangePassWord}
                                        placeholder="密码"
                                        value={this.state.password}
                                        type="password"
                                    />
                                </Box>
                                <Button color="red" text="登录" type="submit" onClick={this.handleSubmit}
                                        disabled={this.props.isLoading}/>
                            </Box>
                        </div>
                    </Col>
                </Row>
                <DocumentTitle title="登录" key="title"/>
            </div>
        );
    }
}

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    row: {
        padding: '0',
    },
    col: {
        padding: '0',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fff',
    },

    left: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: '1',
        height: '100vh',
        backgroundImage: `url(${require('../../assets/login-think.jpg')})`,
        backgroundSize: 'cover',
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: '3',
    },
    mask: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: '2',
    },
    title: {
        marginTop: '60px',
        fontWeight: '500',
        fontSize: '38px',
        lineHeight: '1.5',
        textAlign: 'center',
        color: '#fff',
    },
    description: {
        marginTop: '30px',
        fontSize: '16px',
        color: '#fff',
    },
    formTitle: {
        marginBottom: '10px',
        fontWeight: '500',
        fontSize: '32px',
        textAlign: 'center',
        letterSpacing: '4px',
        fontFamily: 'Lobster',
        cursor: 'pointer'
    },
};

const mapStateToProps = (state, ownProps) => {
    console.log(state)
    return {
        state: state,
        isLoading: state.loginReducer.isLoading,
        error: state.loginReducer.error,
    }
};

export default connect(mapStateToProps)(Login);
