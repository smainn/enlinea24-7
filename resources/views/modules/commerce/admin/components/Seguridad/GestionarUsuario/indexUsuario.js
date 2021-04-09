
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Input from '../component/input';
import Table from '../component/table';

const columna = [
    'Nro',
    'Nombre',
    'Email',
    'Usuario',
    'Telefono',
]

export default class IndexUsuario extends Component{

    constructor() {
        super();

        this.state = {
            buscar: '',

            usuarios: [],
        }
    }

    componentDidMount() {
        this.getUsuario(1, '', 5);
    }

    getUsuario(page, buscar, nroPaginacion) {

        axios.get('/commerce/api/usuario?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion).then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    this.setState({
                        usuarios: response.data.data.data,
                    });
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onchangeBuscar(event) {
        this.setState({
            buscar: event,
        });
    }
    handleDelete(event) {
        console.log(event)
    }

    render() {
        return (
            <div className="rows">
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Usuario</h1>
                    </div>
                    <div className="pulls-right">
                        <Link to="/commerce/admin/indexUsuario/nuevo" className="btns btns-primary">
                            Nuevo
                        </Link>
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
                                    <option value="5">5</option>
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
                    <hr />

                    <div className="forms-groups">

                        <Table 
                            columna={columna}
                            data={this.state.usuarios}
                            delete={this.handleDelete.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}