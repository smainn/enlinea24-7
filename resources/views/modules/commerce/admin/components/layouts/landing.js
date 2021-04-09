
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {Link, withRouter} from 'react-router-dom';

export default class Landing extends Component{

    logout(event) {
        event.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/`);
    }

    render(){
        const loginRegLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
            </ul>
        );

        const userLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                
                    <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                    <a href="/" onClick={this.logout.bind(this)} className="nav-link">Logout</a>
                </li>
            </ul>
        );

        
        return (
            <div>

                <div className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
                
                    <button className="navbar-toggle" type="button" data-toggle="collapse" 
                        data-target="#navbar1" aria-controls="navbar1" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="navbar1" className="collapse navbar-collapse justify-content-md-center">

                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                        </ul>
                        {localStorage.usertoken ? userLink: loginRegLink}

                    </div>
                </div>

                <div className="container">

                    <div className="jumbotron mt-5">

                        <div className="col-sm-8 mx-auto">
                        
                            <h1 className="text-center">WELCOME</h1>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}



