
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter} from 'react-router-dom';
import keysStorage from './../utils/keysStorage';
import { readData, removeAllData } from './../utils/toolsStorage';
import keys from './../utils/keys';
import routes from './../utils/routes';

class Landing extends Component{

    logout(event) {
        event.preventDefault();
        removeAllData();
        //console.log('PERMISIONS LOGOUT', localStorage.getItem(keysStorage.permisions));
        //console.log('TOKEN', localStorage.getItem(keysStorage.token));
        this.props.history.push(routes.inicio);
    }

    verificarSession() {
        let sessionToken = readData(keysStorage.token);
        if (sessionToken == null) {
            return (
                    <>
                        <Link className='nav-links' to="/commerce/admin/login">Login</Link>
                    </>
                    );
        } else {
            return (
                <a className='nav-links' onClick={this.logout.bind(this)} href='/commerce/admin'>Logout</a>
            );
        }
    }


    render(){
        const verificarSession = this.verificarSession(); 
        return (
            <div>
                <header className="encabezado-header position-header">
                    <div className="wrapper-header">
                        <div className="logo">
                            Sistema ERP
                        </div>
                        <nav>
                            {/*<Link className='nav-links' to={routes.home}>Inicio</Link>*/}
                            <a className='nav-links' href='#'>Inicio</a>
                            <a className='nav-links' href='#'>Servicios</a>
                            <a className='nav-links' href='#'>Mensajes</a>
                            
                            {/*<Link className='nav-links' to="/commerce/admin/register">Register</Link>*/}
                            { verificarSession }
                        </nav>
                        
                    </div>
                </header>
            </div>
        );
    }
}

export default withRouter(Landing);


