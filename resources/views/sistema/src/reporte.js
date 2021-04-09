

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import routes from './utils/routes';
/* Reporte */
import Reporte_Log from './comercio/reportes/pdf/seguridad/log';

export default class REPORTE extends Component{
    constructor(props) {
        super(props);
        this.state = { }
    }
    render(){
        return (
            <BrowserRouter>
                <Switch>
                    {/* reporte seguridad */}
                    <Route exact path={routes.reporte_log_sistema} render={props => <Reporte_Log { ...props} /> } />
                </Switch>
            </BrowserRouter>
        );
    }
}

if (document.getElementById('report')) {
    ReactDOM.render(<REPORTE />, document.getElementById('report'));
}


