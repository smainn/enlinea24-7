
import React, {Component} from 'react';

import {getProfile} from './userFunction';

import {Link, withRouter} from 'react-router-dom';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            usuario: ''
        }
    }

    componentDidMount() {
        getProfile().then(response => {
            this.setState({
                name: response.user.nombre,
                usuario: response.user.login,
            });
        })
    }

    logout(event) {
        event.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/commerce/admin`);
    }

    render() {

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
            <div className="container">

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

                <div className="jumbotron mt-5">
                    <div className="col-sm-4 mx-auto">
                        <h1 className="text-center">Profile</h1>
                    </div>
                    <table className="table col-md-4 mx-auto">
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{this.state.name}</td>
                            </tr>
                            <tr>
                                <td>Usuario</td>
                                <td>{this.state.usuario}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(Profile);
