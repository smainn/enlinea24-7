

import React, { Component } from 'react';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const style= {
    nav_title: {
        'border': '0'
    }
};

export default class Sidebar extends Component{
    render() {
        return (
            <div className="col-md-3 left_col">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title" style={style.nav_title}>
                        <a href="/commerce/admin" className="site_title">
                            <i className="fa fa-paw"> </i> <span>Gentelella Alela!</span>
                        </a>
                    </div>
                    <div className="clearfix"> </div>

                    <div className="profile clearfix">
                        <div className="profile_pic">
                            <img src="../../images/img.jpg" alt="..." className="img-circle profile_img" />
                        </div>
                        <div className="profile_info">
                            <span>Welcome,</span>
                            <h2>John Doe</h2>
                        </div>
                    </div>

                    <br />


                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3>General</h3>
                            <ul className="nav side-menu">
                                <li><a><i className="fa fa-home"> </i> Home <span className="fa fa-chevron-down"> </span></a>
                                    <ul className="nav child_menu">
                                        <li><Link to="/commerce/admin">Inicio</Link></li>
                                        <li><a href="index2.html">Dashboard2</a></li>
                                    </ul>
                                </li>
                                <li><a><i className="fa fa-edit"> </i> Taller <span className="fa fa-chevron-down"> </span></a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <Link to="/commerce/admin/indexVehiculo">Vehiculo</Link>
                                        </li>
                                        <li><a href="form_advanced.html">Advanced Components</a></li>
                                        <li><a href="form_validation.html">Form Validation</a></li>
                                    </ul>
                                </li>
                                <li><a><i className="fa fa-edit"> </i> Producto <span className="fa fa-chevron-down"> </span></a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <Link to="/commerce/admin/indexProducto">Producto</Link>
                                        </li>
                                        <li><a href="form_advanced.html">Advanced Components</a></li>
                                        <li><a href="form_validation.html">Form Validation</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="menu_section">
                            <h3>Live On</h3>
                            <ul className="nav side-menu">
                                <li><a><i className="fa fa-bug"> </i> Additional Pages <span className="fa fa-chevron-down"> </span></a>
                                    <ul className="nav child_menu">
                                        <li><a href="e_commerce.html">E-commerce</a></li>
                                        <li><a href="projects.html">Projects</a></li>
                                        <li><a href="project_detail.html">Project Detail</a></li>
                                        <li><a href="contacts.html">Contacts</a></li>
                                        <li><a href="profile.html">Profile</a></li>
                                    </ul>
                                </li>
                                <li><a><i className="fa fa-windows"> </i> Extras <span className="fa fa-chevron-down"> </span></a>
                                    <ul className="nav child_menu">
                                        <li><a href="page_403.html">403 Error</a></li>
                                        <li><a href="page_404.html">404 Error</a></li>
                                        <li><a href="page_500.html">500 Error</a></li>
                                        <li><a href="plain_page.html">Plain Page</a></li>
                                        <li><a href="login.html">Login Page</a></li>
                                        <li><a href="pricing_tables.html">Pricing Tables</a></li>
                                    </ul>
                                </li>

                                <li><a href="#">
                                    <i className="fa fa-laptop"> </i> Landing Page
                                    <span className="label label-success pull-right">Coming Soon</span></a>
                                </li>
                            </ul>
                        </div>

                    </div>


                    <div className="sidebar-footer hidden-small">
                        <a data-toggle="tooltip" data-placement="top" title="Settings">
                            <span className="glyphicon glyphicon-cog" aria-hidden="true"> </span>
                        </a>
                        <a data-toggle="tooltip" data-placement="top" title="FullScreen">
                            <span className="glyphicon glyphicon-fullscreen" aria-hidden="true"> </span>
                        </a>
                        <a data-toggle="tooltip" data-placement="top" title="Lock">
                            <span className="glyphicon glyphicon-eye-close" aria-hidden="true"> </span>
                        </a>
                        <a data-toggle="tooltip" data-placement="top" title="Logout" href="login.html">
                            <span className="glyphicon glyphicon-off" aria-hidden="true"> </span>
                        </a>
                    </div>

                </div>
            </div>
        );
    }
}