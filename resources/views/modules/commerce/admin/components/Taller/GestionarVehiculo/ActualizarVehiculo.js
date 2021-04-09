
import React, { Component } from 'react';

import axios from 'axios';

export default class ActualizarVehiculo extends Component{

    constructor(){
        super();
        this.state = {
            codvehiculo: ''
        }
    }

    render() {

        return (
            <div>
                <div className="row-content">
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Actualizar Vehiculo </h1>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}



