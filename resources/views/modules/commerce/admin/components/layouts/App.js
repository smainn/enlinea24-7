
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import Sidebar from './partials/Sidebar';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from '../Home';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Vehiculo from "../Taller/GestionarVehiculo/Vehiculo";
import CrearVehiculo from "../Taller/GestionarVehiculo/CrearVehiculo";
import IndexVehiculo from "../Taller/GestionarVehiculo/IndexVehiculo";
import IndexProducto from "../Producto/GestionarProducto/IndexProducto";
import CrearProducto from "../Producto/GestionarProducto/CrearProducto";

const style= {
    nav_title: {
        'border': '0'
    }
};

export default class App extends Component{
    render(){
        return (
            <div>
                <Router>
                    <div className="container body">
                        <div className="main_container">

                            <Sidebar />

                            <Header />

                            <div className="right_col" role="main">

                                <Route exact path="/commerce/admin/indexVehiculo/" component={IndexVehiculo} />
                                <Route exact path="/commerce/admin/indexProducto/" component={IndexProducto} />
                                <Route exact path="/commerce/admin/" component={Home} />
                                <Route exact path="/commerce/admin/indexVehiculo/nuevo/crearVehiculo" component={CrearVehiculo} />
                                <Route exact path="/commerce/admin/indexProducto/nuevo/crearProducto" component={CrearProducto} />

                            </div>

                            <Footer />

                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}

if (document.getElementById('appInicio')) {
    ReactDOM.render(<App />, document.getElementById('appInicio'));
}


