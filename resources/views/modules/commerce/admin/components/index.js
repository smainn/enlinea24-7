
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import store from '../redux/store';

import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import Landing from './layouts/landing';
import Login from './auth/login';

export default class Index extends Component{
    render(){
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/commerce/admin" component={Landing} />

                        <Route exact path="/login" component={Login} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}


