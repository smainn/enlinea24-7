
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Input from '../component/input';
import Table from '../component/table';

const columna = [
    'Nro',
    'Nombre',
    'Estado',
]

export default class IndexGrupoUsuario extends Component{

    constructor() {
        super();

        this.state = {
            buscar: '',

            gruposUsuarios: [],
        }
    }

    componentDidMount() {
        this.getGrupoUsuario(1, '', 5);
    }

    getGrupoUsuario(page, buscar, nroPaginacion) {

        axios.get('/commerce/api/grupousuario?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion).then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    this.setState({
                        gruposUsuarios: response.data.data.data,
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
                        <h1 className="lbls-title">Gestionar Grupo Usuario</h1>
                    </div>
                    <div className="pulls-right">
                        <Link to="/commerce/admin/indexGrupo/nuevo" className="btns btns-primary">
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
                            data={this.state.gruposUsuarios}
                            delete={this.handleDelete.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}