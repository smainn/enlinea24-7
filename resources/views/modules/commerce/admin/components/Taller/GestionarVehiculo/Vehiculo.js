

import React, { Component } from 'react';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import IndexVehiculo from "./IndexVehiculo";
import CrearVehiculo from "./CrearVehiculo";

export default class Vehiculo extends Component{
    render() {

        return (
            <div>
                    <div>
                        <Route exact path="/commerce/admin/indexVehiculo/" component={IndexVehiculo} />
                        <Route exact path="/commerce/admin/indexVehiculo/nuevo/crearVehiculo/" component={CrearVehiculo} />
                    </div>
            </div>
        );

    }
}




