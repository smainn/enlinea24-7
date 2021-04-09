
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message, Select } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
const { Option } = Select;

export default class Reporte_Venta extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            fkidgrupo: 0,
            usuario: '',

            redirect: false,
            exportar: 'N',
            ordenarPor: 1,

            id: '',
            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',

            cliente: '',
            vendedor: '',

            montoTotalVenta: '',
            operacionMontoTotal: '',
            montoTotalVentaHasta: '',

            operacionMontoTotalCobrado: '',
            montoTotalCobrado: '',
            montoTotalCobradoHasta: '',

            operacionMontoTotalPorCobrar: '',
            montoTotalPorCobrar: '',
            montoTotalPorCobrarHasta: '',

            arrayMoneda: [],
            arrayAlmacen: [],
            ArraySucursal: [],
            Arraytipocontacredito: [],

            inputInicio: true,

            InputFocusBlur: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            labelFocusBlur: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            noSesion: false,
            configTitleVend: '',
            clienteesabogado: true,
            config: 
                {
                    comventasventaalcredito: false,
                    comtaller: false,
                },
            
        }

        this.permission = {
            sucursal: readPermisions(keys.venta_select_sucursal),
            almacen: readPermisions(keys.venta_select_almacen),
            moneda: readPermisions(keys.venta_select_moneda),
        }
    }

    componentDidMount() {
        this.getConfigsClient();

        let key = JSON.parse(readData(keysStorage.user));
        var idgrupo = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        var usuario = (typeof key == 'undefined' || key == null)?'':
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        

        this.setState({
            fkidgrupo: (idgrupo == null)?0:idgrupo,
            usuario: (idgrupo == 3)?usuario:'',
        });

        httpRequest('get', ws.wsventareporte)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    arrayMoneda: result.data,
                    inputInicio: false,
                    arrayAlmacen: result.almacen,
                    ArraySucursal: result.sucursal,
                    Arraytipocontacredito: result.tipo,
                    clienteesabogado: result.config.clienteesabogado,
                    config: result.configuracion,
                });
            }
                
        })
        .catch(
            error => {
                console.log(error);
            }
        );
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor'
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    regresarIndexVenta() {
        this.setState({
            redirect: true,
        });
    }

    onChangeIdVenta(event) {
        this.setState({
            id: event,
        });
    }

    onChangeTipoVenta(event) {
        this.setState({
            tipo: event,
        });
    }

    onChangeFechaInicio(event) {
        if (this.state.fechaFinal == '') {
            this.setState({
                fechaInicio: event,
            });
        }else {
            if (event <= this.state.fechaFinal) {
                this.setState({
                    fechaInicio: event,
                });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
        if (event == '') {
            this.setState({
                fechaFinal: '',
            });
        }
    }
    
    onChangeFechaFinal(event) {
        if (event == '') {
            this.setState({
                fechaFinal: '',
            });
        }else {
            
            if (event >= this.state.fechaInicio) {
                this.setState({
                    fechaFinal: event,
                });
            }else {
                message.error('Fecha Final no puede ser menor que la fecha Inicio');
            }
        
        }
    }

    onChangeSucursalVenta(event) {
        this.setState({
            sucursal: event,
        });
    }

    onChangeAlmacenVenta(event) {
        this.setState({
            almacen: event,
        });
    }

    onChangeMonedaVenta(event) {
        this.setState({
            moneda: event,
        });
    }

    onChangeClienteVenta(event) {
        this.setState({
            cliente: event,
        });
    }

    onChangeVendedorVenta(event) {
        this.setState({
            vendedor: event,
        });
    }

    onChangeOperacionMontoTotal(event) {

        this.setState({
            operacionMontoTotal: event.target.value,
            montoTotalVentaHasta: '',
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalVenta: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto total fin');
        }
    }

    onChangeMontoTotalVenta(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalVenta: event,
           });
        }
    }

    onChangeMontoTotalVentaHasta(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalVentaHasta: event,
           });
        }
    }

    onChangeOperacionMontoTotalCobrado(event) {
        this.setState({
            operacionMontoTotalCobrado: event.target.value,
            montoTotalCobradoHasta: ''
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalCobrado: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto cobrado fin');
        }
    }

    onChangeMontoTotalCobrado(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalCobrado: event,
           });
        }
    }

    onChangeMontoTotalCobradoHasta(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalCobradoHasta: event,
           });
        }
    }

    onChangeOperacionMontoTotalPorCobrar(event) {

        this.setState({
            operacionMontoTotalPorCobrar: event.target.value,
            montoTotalPorCobrarHasta: ''
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalPorCobrar: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto por cobrar fin');
        }
    }

    onChangeMontoTotalPorCobrar(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalPorCobrar: event,
           });
        }
    }

    onChangeMontoTotalPorCobrarHasta(event) {
        if (!isNaN(event)) {
           this.setState({
               montoTotalPorCobrarHasta: event,
           });
        }
    }

    limpiarDatos() {
        this.setState({
            exportar: 'N',
            ordenarPor: 1,

            id: '',
            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',

            cliente: '',
            vendedor: '',

            montoTotalVenta: '',
            operacionMontoTotal: '',
            montoTotalVentaHasta: '',

            operacionMontoTotalCobrado: '',
            montoTotalCobrado: '',
            montoTotalCobradoHasta: '',

            operacionMontoTotalPorCobrar: '',
            montoTotalPorCobrar: '',
            montoTotalPorCobrarHasta: '',

        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    montoTotalPorCobrarFocus() {
        this.state.InputFocusBlur[16] = 1;
        this.state.labelFocusBlur[16] = 1;
        this.setState({
            InputFocusBlur: this.state.InputFocusBlur,
            labelFocusBlur: this.state.labelFocusBlur,
        });
    }

    montoTotalPorCobrarBlur() {
        if (this.state.montoTotalPorCobrar.length == 0) {
            this.state.InputFocusBlur[16] = 0;
            this.state.labelFocusBlur[16] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
                labelFocusBlur: this.state.labelFocusBlur,
            });
        }else {
            this.state.InputFocusBlur[16] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
            });
        }
    }

    montoTotalPorCobrarHastaFocus() {
        this.state.InputFocusBlur[17] = 1;
        this.state.labelFocusBlur[17] = 1;
        this.setState({
            InputFocusBlur: this.state.InputFocusBlur,
            labelFocusBlur: this.state.labelFocusBlur,
        });
    }

    montoTotalPorCobrarHastaBlur() {
        if (this.state.montoTotalPorCobrarHasta.length == 0) {
            this.state.InputFocusBlur[17] = 0;
            this.state.labelFocusBlur[17] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
                labelFocusBlur: this.state.labelFocusBlur,
            });
        }else {
            this.state.InputFocusBlur[17] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
            });
        }
    }

    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }

    onChangeOrdenarPor(event) {
        this.setState({
            ordenarPor: event,
        });
    }

    componentvendedoradmin() {
        if (this.state.fkidgrupo != 3) {
            return (
                <C_Input 
                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                    title={this.state.configTitleVend}
                    value={this.state.vendedor} 
                    onChange={this.onChangeVendedorVenta.bind(this)}
                />
            );
        }
        return (
            <C_Input 
                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                title={this.state.configTitleVend}
                value={this.state.usuario} 
                onChange={this.onChangeVendedorVenta.bind(this)}
            />
        );
    }

    render() {

        const componentvendedoradmin = this.componentvendedoradmin();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        
        let conexion = readData(keysStorage.connection);

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to={routes.venta_index} />)
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

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Reporte Venta</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form action={routes.reporte_venta_generar} target="_blank" method="post">

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
                            <input type="hidden" value={this.state.fkidgrupo} name="fkidgrupo" />
                            <input type="hidden" value={this.state.clienteesabogado} name="esabogado" /> 
                            <input type="hidden" name="comventasventaalcredito" 
                                value={(this.state.config.comventasventaalcredito)?'A':'N'} 
                            />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.id}
                                    title='Id Venta'
                                    onChange={this.onChangeIdVenta.bind(this)}
                                />
                                <input type="hidden" value={this.state.id} name="id" />

                                <div className="cols-lg-1 cols-md-1"></div>

                                <C_Select
                                    value={this.state.tipo}
                                    title='Tipo Venta'
                                    onChange={this.onChangeTipoVenta.bind(this)}
                                    component={
                                        this.state.Arraytipocontacredito.map(
                                            (data, key) => ((key == 0)?
                                                [
                                                    <Option key={-1} value={''}>
                                                        {'Seleccionar ... '}
                                                    </Option>,
                                                    <Option key={key} value={data.idtipocontacredito}>
                                                        {data.descripcion}
                                                    </Option>
                                                ]:
                                                    <Option key={key} value={data.idtipocontacredito}>
                                                        {data.descripcion}
                                                    </Option>
                                            )
                                        )
                                    }
                                />
                                <input type="hidden" value={this.state.tipo} name="tipoVenta" />

                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechaInicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Fecha Inicio"
                                />
                                <input type="hidden" value={this.state.fechaInicio} name="fechaInicio" />

                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechaFinal}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title="Fecha Final"
                                    readOnly={
                                        (this.state.fechaInicio == '')?true:false
                                    }
                                />
                                <input type="hidden" value={this.state.fechaFinal} name="fechaFinal" />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                {(this.state.clienteesabogado)?null:
                                    <div>
                                        <C_Select
                                            value={this.state.sucursal}
                                            title='Sucursal'
                                            onChange={this.onChangeSucursalVenta.bind(this)}
                                            permisions={this.permission.sucursal}
                                            component={
                                                this.state.ArraySucursal.map(
                                                    (data, key) => ((key == 0)?
                                                        [
                                                            <Option key={-1} value={''}>
                                                                {'Seleccionar ... '}
                                                            </Option>,
                                                            <Option key={key} value={data.idsucursal}>
                                                                {data.nombre}
                                                            </Option>
                                                        ]:
                                                            <Option key={key} value={data.idsucursal}>
                                                                {data.nombre}
                                                            </Option>
                                                    )
                                                )
                                            }
                                        />
                                        <input type="hidden" value={this.state.sucursal} name="sucursal"/>

                                        <C_Select
                                            value={this.state.almacen}
                                            title='Almacen'
                                            onChange={this.onChangeAlmacenVenta.bind(this)}
                                            permisions={this.permission.almacen}
                                            component={
                                                this.state.arrayAlmacen.map(
                                                    (data, key) => ((key == 0)?
                                                        [
                                                            <Option key={-1} value={''}>
                                                                {'Seleccionar ... '}
                                                            </Option>,
                                                            <Option key={key} value={data.idalmacen}>
                                                                {data.descripcion}
                                                            </Option>
                                                        ]:
                                                            <Option key={key} value={data.idalmacen}>
                                                                {data.descripcion}
                                                            </Option>
                                                    )
                                                )
                                            }
                                        />
                                        <input type="hidden" value={this.state.almacen} name="almacen"/>
                                    </div>
                                }

                                <C_Select
                                    value={this.state.moneda}
                                    title='Moneda'
                                    onChange={this.onChangeMonedaVenta.bind(this)}
                                    permisions={this.permission.moneda}
                                    component={
                                        this.state.arrayMoneda.map(
                                            (data, key) => ((key == 0)?
                                                [
                                                    <Option key={-1} value={''}>
                                                        {'Seleccionar ... '}
                                                    </Option>,
                                                    <Option key={key} value={data.idmoneda}>
                                                        {data.descripcion}
                                                    </Option>
                                                ]:
                                                    <Option key={key} value={data.idmoneda}>
                                                        {data.descripcion}
                                                    </Option>
                                            )
                                        )
                                    }
                                />
                                <input type="hidden" value={this.state.moneda} name="moneda"/>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Cliente'
                                    value={this.state.cliente} 
                                    onChange={this.onChangeClienteVenta.bind(this)}
                                />
                                <input type="hidden" value={this.state.cliente} name="cliente"/>
                                
                                {componentvendedoradmin}
                                <input type="hidden" value={this.state.vendedor} name="vendedor"/>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12 pt-bottom">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Monto Total Venta'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom">
                                    <div className="inputs-groups">
                                        <select 
                                            className={`forms-control ${colors}`}
                                            value={this.state.operacionMontoTotal}
                                            onChange={this.onChangeOperacionMontoTotal.bind(this)}>
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className={`lbls-input active ${colors}`}>Opcion</label>
                                        <input type="hidden" value={this.state.operacionMontoTotal} name="operacionMontoTotal"/>
                                    </div>
                                </div>

                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Monto Total'
                                    value={this.state.montoTotalVenta} 
                                    onChange={this.onChangeMontoTotalVenta.bind(this)}
                                    readOnly={(this.state.operacionMontoTotal != '')?false:true}
                                />
                                <input type="hidden" value={this.state.montoTotalVenta} name="montoTotal"/>

                                <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12 pt-bottom">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent', paddingLeft: 0}}
                                            value='Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Monto Total'
                                    value={this.state.montoTotalVentaHasta} 
                                    onChange={this.onChangeMontoTotalVentaHasta.bind(this)}
                                    readOnly={(this.state.operacionMontoTotal == '!')?false:true}
                                />
                                <input type="hidden" value={this.state.montoTotalVentaHasta} name="montoTotalFin"/>

                            </div>

                            {(this.state.config.comventasventaalcredito)?

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12 pt-bottom">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='Monto Total Cobrado'
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom">
                                        <div className="inputs-groups">
                                            <select 
                                                className={`forms-control ${colors}`}
                                                value={this.state.operacionMontoTotalCobrado}
                                                onChange={this.onChangeOperacionMontoTotalCobrado.bind(this)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="<">{'Menor'}</option>
                                                <option value="<=">{'Menor  igual'}</option>
                                                <option value=">">{'Mayor'}</option>
                                                <option value=">=">{'Mayor igual'}</option>
                                                <option value="<>">{'Diferente'}</option>
                                                <option value="=">{'Igual'}</option>
                                                <option value="!">{'Entre'}</option>
                                            </select>
                                            <label className={`lbls-input active ${colors}`}>Opcion</label>
                                            <input type="hidden" value={this.state.operacionMontoTotalCobrado} name="operacionMontoTotalCobrado"/>
                                        </div>
                                    </div>

                                    <C_Input 
                                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                        title='Monto Cobrado'
                                        value={this.state.montoTotalCobrado} 
                                        onChange={this.onChangeMontoTotalCobrado.bind(this)}
                                        readOnly={(this.state.operacionMontoTotalCobrado != '')?false:true}
                                    />
                                    <input type="hidden" value={this.state.montoTotalCobrado} name="montoTotalCobrado"/>

                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12 pt-bottom">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent', paddingLeft: 0}}
                                                value='Hasta '
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <C_Input 
                                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                        title='Monto Cobrado'
                                        value={this.state.montoTotalCobradoHasta} 
                                        onChange={this.onChangeMontoTotalCobradoHasta.bind(this)}
                                        readOnly={(this.state.operacionMontoTotalCobrado == '!')?false:true}
                                    />
                                    <input type="hidden" value={this.state.montoTotalCobradoHasta} name="montoTotalCobradoHasta"/>

                                </div>:''
                            }

                            {(this.state.config.comventasventaalcredito)?
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12 pt-bottom">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='MontoTotal por Cobrar'
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom">
                                        <div className="inputs-groups">
                                            <select className={`forms-control ${colors}`}
                                                value={this.state.operacionMontoTotalPorCobrar}
                                                onChange={this.onChangeOperacionMontoTotalPorCobrar.bind(this)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="<">{'Menor'}</option>
                                                <option value="<=">{'Menor igual'}</option>
                                                <option value=">">{'Mayor'}</option>
                                                <option value=">=">{'Mayor igual'}</option>
                                                <option value="<>">{'Diferente'}</option>
                                                <option value="=">{'Igual'}</option>
                                                <option value="!">{'Entre'}</option>
                                            </select>
                                            <label className={`lbls-input active ${colors}`}>Opcion</label>
                                            <input type="hidden" value={this.state.operacionMontoTotalPorCobrar} name="operacionMontoTotalPorCobrar"/>
                                        </div>
                                    </div>

                                    <C_Input 
                                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                        title='Monto por Cobrar'
                                        value={this.state.montoTotalPorCobrar} 
                                        onChange={this.onChangeMontoTotalPorCobrar.bind(this)}
                                        readOnly={(this.state.operacionMontoTotalPorCobrar != '')?false:true}
                                    />
                                    <input type="hidden" value={this.state.montoTotalPorCobrar} name="montoTotalPorCobrar"/>

                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12 pt-bottom">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent', paddingLeft: 0}}
                                                value='Hasta '
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <C_Input 
                                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                        title='Monto por Cobrar'
                                        value={this.state.montoTotalPorCobrarHasta} 
                                        onChange={this.onChangeMontoTotalPorCobrarHasta.bind(this)}
                                        readOnly={(this.state.operacionMontoTotalPorCobrar == '!')?false:true}
                                    />
                                    <input type="hidden" value={this.state.montoTotalPorCobrarHasta} name="montoTotalPorCobrarHasta"/>

                                </div>:'' 
                            }

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>

                                <C_Select 
                                    value={this.state.ordenarPor}
                                    title='Ordenar Por'
                                    onChange={this.onChangeOrdenarPor.bind(this)}
                                    component={[
                                        <Option key={0} value={1}> Id Venta </Option>,
                                        <Option key={1} value={2}> Fecha </Option>,
                                        <Option key={2} value={3}> Cliente </Option>,
                                        <Option key={3} value={4}> {this.state.configTitleVend} </Option>,
                                        <Option key={4} value={5}> Tipo Venta </Option>,
                                        <Option key={5} value={6}> Monto Total </Option>,
                                        <Option key={6} value={7}> Monto Cobrado </Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenarPor} name="order" />

                                <C_Select 
                                    value={this.state.exportar}
                                    onChange={this.onChangeExportar.bind(this)}
                                    title='Exportar'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" name="reporte" value={this.state.exportar} />

                            </div>

                            <div className="forms-groups"
                                style={{'marginBottom': '-10px'}}>
                                <div className="txts-center">
                                    <C_Button
                                        title='Limpiar'
                                        type='primary'
                                        onClick={this.limpiarDatos.bind(this)}
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