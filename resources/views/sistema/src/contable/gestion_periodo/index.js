
import React, { Component } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../utils/routes';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { cambiarFormato, dateToString, hourToString } from '../../utils/toolsDate';
import { message } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import keysStorage from '../../utils/keysStorage';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';

class IndexGestionPeriodo extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            detalle: [],

            id: '',
            visible: false,
            loading: false,
            bandera: 0,

            noSesion: false,
        }

        this.permision = {
            btn_add_gestion: readPermisions(keys.gestion_periodo_btn_add_gestion),
            btn_add_periodo: readPermisions(keys.gestion_periodo_btn_add_periodo),
            btn_edit_gestion: readPermisions(keys.gestion_periodo_btn_editar_gestion),
            btn_edit_periodo: readPermisions(keys.gestion_periodo_btn_editar_periodo),
            btn_del_gestion: readPermisions(keys.gestion_periodo_btn_eliminar_gestion),
            btn_del_periodo: readPermisions(keys.gestion_periodo_btn_eliminar_periodo),
            btn_imprimir: readPermisions(keys.gestion_periodo_btn_imprimir)
        }
    }

    componentDidMount(){
        httpRequest('get', ws.wsgestionperiodo + '/index').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                        detalle: response.detalle,
                    });
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onAddData(event) {
        event.preventDefault();
        this.props.history.push(routes.gestion_periodo_create);
    }
    delete_gestion(data) {
        if (data.estado == 'C') {
            message.warning('Gestion Cerrado!!!');
        }else {
            this.setState({
                visible: true,
                bandera: 1,
                id: data.idgestioncontable,
            });
        }
    }
    delete_periodo(data) {
        if (data.estado == 'C') {
            message.warning('Periodo Cerrado!!!');
        }else {
            this.setState({
                visible: true,
                bandera: 2,
                id: data.idperiodocontable,
            });
        }
    }
    editar_gestion(data) {
        if (data.estado == 'C') {
            message.warning('Gestion Cerrado!!!');
        }else {
            this.props.history.push(routes.gestion_periodo_editar + '/' + data.idgestioncontable);
        }
    }
    editar_periodo(data) {
        if (data.estado == 'C') {
            message.warning('Periodo Cerrado!!!');
        }else {
            this.props.history.push(routes.gestion_periodo_editar_periodo + '/' + data.idperiodocontable);
        }
    }
    get_data() {
        var array = [];
        for (let i = 0; i < this.state.data.length; i++) {
            var data = this.state.data[i];

            let btn_edit = this.permision.btn_edit_gestion.visible == 'A' ?
                            <a onClick={this.editar_gestion.bind(this, data)}
                                className="btns btns-sm btns-outline-primary"
                                style={{fontSize: 13, padding: 7, fontFamily: 'Roboto'}}
                            >
                                Edit G
                            </a> :
                            null;

            let btn_del = this.permision.btn_del_gestion.visible == 'A' ?
                            <a onClick={this.delete_gestion.bind(this, data)}
                                className="btns btns-sm btns-outline-danger"
                                style={{fontSize: 13, padding: 7, fontFamily: 'Roboto'}}
                            >
                                Elim G
                            </a> :
                            null;
            array.push(
                <tr key={i}>
                    <td><label className="col-show">Gestion: </label>
                        {data.descripcion}
                    </td>
                    <td><label className="col-show">Periodo: </label>
                        -
                    </td>
                    <td><label className="col-show">Fecha Inicial: </label>
                        {cambiarFormato(data.fechaini)}
                    </td>
                    <td><label className="col-show">Fecha Final: </label>
                        {cambiarFormato(data.fechafin)}
                    </td>
                    <td><label className="col-show">Estado: </label>
                        {(data.estado == 'A')?'Activa':(data.estado == 'P') ? 'Pendiente' : 'Cerrado'}
                    </td>
                    <td>
                        { btn_edit }
                        { btn_del }
                    </td>
                </tr>
            );
            array.push(
                this.get_detalle(data)
            );
        }
        return array;
    }

    get_detalle(gestion) {
        var id = gestion.idgestioncontable;
        var bandera = 0;
        var array = [];
        var fechafinal = '';

        for (let i = 0; i < this.state.detalle.length; i++) {
            var data = this.state.detalle[i];
            if (data.fkidgestioncontable == id) {
                fechafinal = data.fechafin;

                let btn_edit = this.permision.btn_edit_periodo.visible == 'A' ?
                            <a onClick={this.editar_periodo.bind(this, data)}
                                className="btns btns-sm btns-outline-success"
                                style={{fontSize: 13, padding: 7, fontFamily: 'Roboto'}}
                            >
                                Edit P
                            </a> :
                            null;
                let btn_del = this.permision.btn_del_periodo.visible == 'A' ?
                            <a onClick={this.delete_periodo.bind(this, data)}
                                className="btns btns-sm btns-outline-danger"
                                style={{fontSize: 13, padding: 7, fontFamily: 'Roboto'}}
                            >
                                Elim P
                            </a> :
                            null;
                array.push(
                    <tr key={'0' + i}>
                        <td><label className="col-show">Gestion: </label>
                            -
                        </td>
                        <td><label className="col-show">Periodo: </label>
                            {data.descripcion}
                        </td>
                        <td><label className="col-show">Fecha Inicial: </label>
                            {cambiarFormato(data.fechaini)}
                        </td>
                        <td><label className="col-show">Fecha Final: </label>
                            {cambiarFormato(data.fechafin)}
                        </td>
                        <td><label className="col-show">Estado: </label>
                            {(data.estado == 'A')?'Activa':'Cerrada'}
                        </td>
                        <td>
                            {btn_edit}
                            {btn_del}
                    </td>
                    </tr>
                );
                bandera = 1;
            } else {
                if (bandera == 1) {
                    break;
                }
            }
        }
        if (this.permision.btn_add_periodo.visible == 'A' && 
            (fechafinal == '') || (fechafinal < gestion.fechafin)) {
            array.push(
                <tr key={'000'}>
                    <td colSpan='6'>
                        <a onClick={this.addPeriodo.bind(this, id)}
                            className="btns btns-sm btns-outline-primary"
                            style={{fontSize: 15, padding: 7, fontFamily: 'Roboto',
                            }}
                        >
                            Adicionar Periodo
                        </a>
                    </td>
                </tr>
            );
        } else if (this.permision.btn_add_periodo.visible == 'A') {
            array.push(
                <tr key={'000'}>
                    <td colSpan='6'>
                        <a onClick={this.fullperiodo.bind(this, id)}
                            className="btns btns-sm btns-outline-primary"
                            style={{fontSize: 15, padding: 7, fontFamily: 'Roboto',
                            }}
                        >
                            Adicionar Periodo
                        </a>
                    </td>
                </tr>
            );
        }

        return array;
    }
    fullperiodo() {
        message.error('Gestion Completa!!!');
    }
    addPeriodo(id) {
        this.props.history.push(routes.gestion_periodo_create_periodo + '/' + id);
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            id: '',
        });
    }
    onDeleteGestion(event) {
        event.preventDefault();
        var objeto = {
            id: this.state.id
        };
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/delete_gestion', objeto).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                        detalle: response.detalle,
                    });
                    message.success('Exito en eliminar!!!');
                }
                if (response.response == 0) {
                    message.error(response.message);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
                this.onClose();
            }
        ).catch(
            error => console.log(error)
        );
    }
    onDeletePeriodo(event) {
        event.preventDefault();
        var objeto = {
            id: this.state.id
        };
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/delete_periodo', objeto).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                        detalle: response.detalle,
                    });
                    message.success('Exito en eliminar!!!');
                }
                if (response.response == 0) {
                    message.error(response.message);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
                this.onClose();
            }
        ).catch(
            error => console.log(error)
        );
    }
    componentConfirmation() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Gestion y Periodo"
                    onCancel={this.onClose.bind(this)}
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de eliminar la gestion?</label>
                        </div>
                    }
                    onClick={this.onDeleteGestion.bind(this)}
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Gestion y Periodo"
                    onCancel={this.onClose.bind(this)}
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de eliminar el periodo?</label>
                        </div>
                    }
                    onClick={this.onDeletePeriodo.bind(this)}
                />
            );
        }
    }
    generarPDF(event) {
        event.preventDefault();
        document.getElementById('imprimir').submit();
    }
    render() {
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        
        const usuario = user == null ? '' : 
            (user.apellido == null)?user.nombre:user.nombre + ' ' + user.apellido;

        const x_idusuario =  user == null ? 0 : user.idusuario;
        const x_grupousuario = user == null ? 0 : user.idgrupousuario;
        const x_login = user == null ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        return (
            <div className="rows">
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestión y Periodos </h1>
                    </div>
                    <div className="forms-groups">
                        {(this.state.data.length > 0)?
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <div className="table-content">
                                    <table className="table-responsive-content" 
                                    >
                                        <thead>
                                            <tr className="row-header">
                                                <th>Gestion</th>
                                                <th>Periodo</th>
                                                <th>Fecha Inicial</th>
                                                <th>Fecha Final</th>
                                                <th>Estado</th>
                                                <th>Operaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.get_data()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>:null
                        }
                    </div>
                    
                    <form action={routes.gestion_periodo + '/reporte'} target="_blank" method='post'
                            id='imprimir' style={{display: 'none',}}>
                        <input type="hidden" value={_token} name="_token" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />
                        <input type='hidden' value={usuario} name='usuario' />
                    </form>

                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title='Adicionar Gestion'
                                type='primary'
                                onClick={this.onAddData.bind(this)}
                                permisions={this.permision.btn_add_gestion}
                            />
                            <C_Button title='Imprimir'
                                onClick={this.generarPDF.bind(this)}
                                type='primary'
                                permisions={this.permision.btn_imprimir}
                            />
                            <C_Button title='Salir'
                                type='primary'
                            />
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title=''
                                type='primary'
                                style={{width: '100%', padding: 10}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(IndexGestionPeriodo);

