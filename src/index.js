import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './configureStore'
import {Provider} from 'react-redux'
import BaseLayout from './layouts/BaseLayout'
import * as serviceWorker from './serviceWorker';
import './index.scss'

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BaseLayout/>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
