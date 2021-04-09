
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '../../../components/input';
import Table from '../../../components/table';
import Confirmation from '../../../components/confirmation';
import { message } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import keysStorage from '../../../tools/keysStorage';
import ws from '../../../tools/webservices';

export default class IndexUsuarioConectados extends Component{

    constructor(props) {
        super(props);

        this.state = {
            buscar: '',

            users: [],
            noSesion: false
        }

    }

    componentDidMount() {
        this.getUsersOnline();
    }

    getUsersOnline() {
        
        httpRequest('get', ws.wsusuariosconectados)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    users: result.users
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onchangeBuscar(event) {
        this.setState({
            buscar: event,
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        return (
            <div className="rows">
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Usuarios conectados</h1>
                    </div>
                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>

                                </select>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <Input
                                value={this.state.buscar}
                                onChange={this.onchangeBuscar.bind(this)}
                                title='Search...'
                            />
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">

                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Login</th>
                                        <th>Nombre</th>
                                        <th>Fecha Hora Inicio</th>
                                        <th>Ip</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.users.map((user, key) => {
                                        let apellido = user.apellido == null ? '' : user.apellido;
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{user.login}</td>
                                                <td>{user.nombre + ' ' + apellido}</td>
                                                <td>{user.lastlogin}</td>
                                                <td>{user.ip}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}