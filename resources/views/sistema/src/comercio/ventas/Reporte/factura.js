
import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';

import { message, Select, Dropdown, Input, Menu, Tree } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import CDatePicker from '../../../componentes/datepicker';
import { dateToString, hourToString, convertDmyToYmd } from '../../../utils/toolsDate';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_Input from '../../../componentes/data/input';
import C_Button from '../../../componentes/data/button';
const { Option } = Select;

export default class Reporte_Venta_Factura extends Component{
    constructor(props){
        super(props);
        this.state = {
            dropdowncliente: false,
            search_cliente: '',
            searchs_clientes: [],
            check_clientes: [],

            array_sucursal: [],
            array_almacen: [],
            array_dosificacion: [],
            idsucursal: '',
            idalmacen: '',
            iddosificacion: '',
            numeroautorizacion: '',
            estado: 'V',
            fechainicio: '',
            fechafin: '',
            cliente: '',
            nitcliente: '',
            ordenar: 1,
            exportar: 'N',

            idscliente: [],
            noSesion: false,
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsventafactura)
        .then(result => {
            console.log(result)
            if (result.response == -2) {
                this.setState({ noSesion: true });
                return;
            }
            if (result.response == 1) {
                this.setState({
                    array_sucursal: result.sucursal,
                    array_dosificacion: result.dosificacion,
                });
            }
        }) .catch( error => {
            console.log(error);
        } );
    }
    getAlmacen(value) {
        var body = { idsucursal: value, };
        httpRequest('post', ws.wssucursal + '/get_almacen', body)
        .then((result) => {
            if (result.response == 1) {
                console.log(result)
                this.setState({
                    array_almacen: result.almacen,
                });
            } else if (result.response == -2) {
                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);
            }
        }) . catch((error) => {
            console.log(error);
        });
    }
    onchangeSucursal(value) {
        console.log(value)
        this.setState({
            idsucursal: value, idalmacen: '',
        });
        if (value != '') {
            this.getAlmacen(value);
        }
    }
    deleteSucursal() {
        this.setState({
            idsucursal: '', idalmacen: '', array_almacen: [],
        });
    }
    onchangeAlmacen(value) {
        this.setState({ idalmacen: value, });
    }
    deleteAlmacen() {
        this.setState({ idalmacen: '', });
    }
    onchangeDosificacion(value, option) {
        console.log(option)
        this.setState({ iddosificacion: value, numeroautorizacion: option.props.title, });
    }
    deleteDosificacion() {
        this.setState({ iddosificacion: '', numeroautorizacion: '', });
    }
    onchangeEstado(value) {
        this.setState({ estado: value, });
    }
    onChangeFechaInicio(event) {
        if (event == '' || this.state.fechafin == '') {
            this.setState({
                fechafin: '', fechainicio: event,
            });
        }else {
            if (event <= this.state.fechafin) {
                this.setState({ fechainicio: event, });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
    }
    onChangeFechaFinal(event) {
        if (event == '') {
            this.setState({ fechafin: '', });
        }else {
            if (event >= this.state.fechainicio) {
                this.setState({ fechafin: event, });
            }else {
                message.error('Fecha Final no puede ser menor que la Fecha Inicio');
            }
        }
    }
    componentSucursal() {
        let data = this.state.array_sucursal;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            var empresa = 'S/N';
            if (data[i].tipoempresa == 'N') {
                empresa = data[i].nombrecomercial == null ? 'S/N' : data[i].nombrecomercial;
            }
            if (data[i].tipoempresa == 'J') {
                empresa = data[i].razonsocial == null ? 'S/N' : data[i].razonsocial;
            }
            arr.push(
                <Option key={i} value={data[i].idsucursal}>
                    {empresa}
                </Option>
            );
        }
        return arr;
    }
    componentAlmacen() {
        let data = this.state.array_almacen;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    componentDosificacion() {
        let data = this.state.array_dosificacion;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idfacdosificacion} title={data[i].numeroautorizacion}>
                    {data[i].numeroautorizacion}
                </Option>
            );
        }
        return arr;
    }
    componentEstado() {
        let arr = [];
        arr.push(
            <Option key={1} value={'V'}>
                {'Activo'}
            </Option>
        );
        arr.push(
            <Option key={1} value={'A'}>
                {'Anulado'}
            </Option>
        );
        return arr;
    }
    renderTreeNodeCliente(data) {
        var array = [];
        data.map((item, key) => {
            if (typeof this.state.searchs_clientes[key] == 'undefined') {
                this.state.searchs_clientes[key] = true;
            }
            var nombre = item.apellido == null ? item.nombre : item.nombre + ' ' + item.apellido;
            array.push(
                <Tree.TreeNode 
                    title={nombre} 
                    posicion={key}  key={item.idcliente} dataRef={item}
                    style={{display: this.state.searchs_clientes[key] ? 'block' : 'none',}}
                >
                    {/* {this.renderTreeNodeCuenta(item.children)} */}
                </Tree.TreeNode>
            );
        });
        return array;
    }
    menu_cliente() {
        return (
            <Menu className='scrollbars' id={`styles-scrollbar`} style={{height: 'auto', maxHeight: 400,}}>
                <div className='forms-groups' style={{paddingRight: 8, paddingLeft: 8, borderBottom: '1px solid #e8e8e8'}}>
                    <div style={{marginTop: -15, textAlign: 'center',}}>
                        <Input.Search
                            value={this.state.search_cliente}
                            // onChange={this.onSearchAlumno.bind(this)}
                            style={{width: '60%', maxWidth: '60%', }}
                        />
                    </div>
                </div>
                <div className='forms-groups' style={{paddingRight: 8, paddingLeft: 8, borderBottom: '1px solid #e8e8e8'}}>
                    <Tree checkable
                        onCheck={(idscliente, checked) => {
                            var array = [];
                            checked.checkedNodesPositions.map(data => {
                                var usuario = this.state.array_alumno[ data.pos[data.pos.length - 1] ];
                                var nombre = usuario.apellido == null ? usuario.nombre : usuario.apellido + ' ' + usuario.nombre;
                                array.push(nombre);
                            });
                            this.setState({idscliente: idscliente, check_clientes: array}); 
                        }}
                        checkedKeys={this.state.idscliente}
                    >
                        {this.renderTreeNodeCliente(this.state.array_alumno)}
                    </Tree>
                </div>
            </Menu>
        );
    }
    onDropdownCliente() {
        this.setState({
            dropdowncliente: !this.state.dropdowncliente,
            search_cliente: '', searchs_clientes: [],
        });
    }
    render() {

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;

        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Reporte de Factura</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <form action={routes.reporte_venta_factura_generar} target="_blank" method="post">
                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />

                            <input type="hidden" value={usuario} name="usuario" />
                            <input type="hidden" value={idusuario} name="idusuario" />

                            <div className='forms-groups'>
                                <C_Select
                                    value={this.state.idsucursal}
                                    onChange={ this.onchangeSucursal.bind(this) }
                                    component={this.componentSucursal()}
                                    onDelete={ this.deleteSucursal.bind(this) }
                                    allowDelete={this.state.idsucursal == '' ? false : true}
                                    title="Sucursal"
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type="hidden" value={this.state.idsucursal} name="idsucursal" />
                                <C_Select
                                    value={this.state.idalmacen}
                                    onChange={ this.onchangeAlmacen.bind(this) }
                                    component={this.componentAlmacen()}
                                    onDelete={ this.deleteAlmacen.bind(this) }
                                    allowDelete={this.state.idalmacen == '' ? false : true}
                                    title="Almacen"
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    readOnly={this.state.idsucursal == '' ? true : false}
                                />
                                <input type="hidden" value={this.state.idalmacen} name="idalmacen" />
                                <C_Select
                                    value={this.state.iddosificacion}
                                    onChange={ this.onchangeDosificacion.bind(this) }
                                    component={this.componentDosificacion()}
                                    onDelete={ this.deleteDosificacion.bind(this) }
                                    allowDelete={this.state.iddosificacion == '' ? false : true}
                                    title="Nro Autorizacion"
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type="hidden" value={this.state.numeroautorizacion} name="iddosificacion" />
                                <C_Select
                                    value={this.state.estado}
                                    onChange={ this.onchangeEstado.bind(this) }
                                    component={this.componentEstado()}
                                    title="Estado"
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type="hidden" value={this.state.estado} name="estado" />
                            </div>

                            <div className='forms-groups'>
                                <div className='cols-lg-1 cols-md-1'></div>
                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='NIT Cliente'
                                    value={this.state.nitcliente} 
                                    onChange={(value) => this.setState({nitcliente: value,})}
                                />
                                <input type="hidden" value={this.state.nitcliente} name="nitcliente" />
                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Cliente'
                                    value={this.state.cliente} 
                                    onChange={(value) => this.setState({cliente: value,})}
                                />
                                <input type="hidden" value={this.state.cliente} name="cliente" />
                                {/* <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'> */}
                                    {/* <Dropdown overlay={this.menu_cliente()} trigger={['click']} 
                                        visible={this.state.dropdowncliente}
                                        onVisibleChange={this.onDropdownCliente.bind(this)}
                                    > */}
                                        {/* <Input
                                            value={this.state.check_clientes}
                                            style={{width: '100%', minWidth: '100%', cursor: 'pointer', }} 
                                            readOnly placeholder={'SELECCIONAR CLIENTES'}
                                            title={this.state.check_clientes}
                                        /> */}
                                    {/* </Dropdown> */}
                                {/* </div> */}
                            </div>

                            <div className='forms-groups'>
                                <div className='cols-lg-3 cols-md-3'></div>
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechainicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Fecha Inicio"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechainicio)} name="fechainicio" />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechafin}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title="Fecha Final"
                                    readOnly={ this.state.fechainicio == '' ? true: false }
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechafin)} name="fechafin" />
                            </div>

                            <div className='forms-groups'>
                                <div className='cols-lg-3 cols-md-3'></div>
                                <C_Select 
                                    value={this.state.ordenar}
                                    title='Ordenar Por'
                                    onChange={(value) => this.setState({ordenar: value,})}
                                    component={[
                                        <Option key={0} value={1}> ID FACTURA </Option>,
                                        <Option key={1} value={2}> NRO AUTORIZACION </Option>,
                                        <Option key={2} value={3}> FECHA </Option>,
                                        <Option key={3} value={4}> CLIENTE </Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenar} name="ordenar" />
                                <C_Select 
                                    value={this.state.exportar}
                                    onChange={(value) => this.setState({exportar: value,})}
                                    title='Exportar'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" value={this.state.exportar} name="exportar" />
                            </div>

                            <div className="forms-groups"
                                style={{'marginBottom': '-10px'}}>
                                <div className="txts-center">
                                    <C_Button
                                        title='Limpiar'
                                        type='primary'
                                        // onClick={this.limpiarDatos.bind(this)}
                                    />
                                    <C_Button
                                        title='Generar'
                                        type='primary'
                                        submit={true}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}