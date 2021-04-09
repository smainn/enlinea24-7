
import React, { Component, Fragment } from 'react';

import { Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, message, Table, Select } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import strings from '../../utils/strings';
import routes from '../../utils/routes';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';
const { Option } = Select;

class Restaurant_Venta_Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            array_venta: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },

            pagina: 1,
            buscar: '',
            nroPaginacion: 10,

            timeoutSearch: undefined,

            noSesion: false,
        }
        this.permisions = {
            btn_ver: readPermisions(keys.vendedor_btn_ver),
            btn_nuevo: readPermisions(keys.vendedor_btn_nuevo),
            btn_editar: readPermisions(keys.vendedor_btn_editar),
            btn_eliminar: readPermisions(keys.vendedor_btn_eliminar),
        }
    }
    componentDidMount() {
        //this.get_data(1, '', 10);
    }
    get_data(page, buscar, sizepaginacion) {

        httpRequest('get', ws.wsvendedor + '?page=' + page, {
            buscar: buscar,
            paginate: sizepaginacion,
        })
        .then((resp) => {
            if (resp.response == 1) {
                this.setState({
                    pagination: resp.pagination,
                })
            } else if(resp.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onCreateData() {
        var url = routes.restaurant_venta_create;
        this.props.history.push(url);
    }
    btnNuevo() {
        //if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button title='Nuevo' type='primary'
                    onClick={this.onCreateData.bind(this)}
                />
            );
        //}
        //return null;
    }
    onChangePaginate(page) {
        //this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        //this.get_data(1, this.state.buscar, value);
    }
    handleSearchData(value){
        this.setState({
            buscar: value,
        });
        // if (this.state.timeoutSearch) {
        //     clearTimeout(this.state.timeoutSearch);
        //     this.setState({ timeoutSearch: undefined});
        // }
        // this.state.timeoutSearch = setTimeout(() => this.get_data(1, value, this.state.nroPaginacion), 300);
        // this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        });
    }
    componentModalShow() {
        
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                {this.componentModalShow()}
                <div className="cards">
                    <div className='forms-groups' style={{marginBottom: 15,}}>
                        <div className="pulls-left">
                            <h1 className="lbls-title">{'Gestion de ventas para la mesa'}</h1>
                        </div>
                        <div className='pulls-right'>
                            { this.btnNuevo() }
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value={this.state.nroPaginacion}
                                onChange={this.onChangeSizePagination.bind(this)}
                                title='Mostrar'
                                className=''
                                style={{ width: 65 }}
                                component = {[
                                    <Option key={0} value={10}>10</Option>,
                                    <Option key={1} value={25}>25</Option>,
                                    <Option key={2} value={50}>50</Option>,
                                    <Option key={3} value={100}>100</Option>,
                                ]}
                            />
                        </div>
                        <div className="pulls-right">
                            <C_Input
                                value={this.state.buscar}
                                onChange={this.handleSearchData.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent={this.state.pagina}
                            pageSize={this.state.nroPaginacion}
                            onChange={this.onChangePaginate.bind(this)}
                            total={this.state.pagination.total}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Restaurant_Venta_Index);
