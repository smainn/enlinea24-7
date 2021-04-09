
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message, Select } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';

import { dateToString, hourToString } from '../../../tools/toolsDate';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_DatePicker from '../../../components/data/date';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import C_Button from '../../../components/data/button';
const { Option } = Select;

export default class Reporte_Venta_Por_Producto extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            usuario: '',
            fkidgrupo: 0,
            timeoutSearch: undefined,

            redirect: false,
            exportar: 'N',
            ordenarPor: 1,

            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',

            cliente: '',
            vendedor: '',
            idproducto: '',

            arrayMoneda: [],
            arrayAlmacen: [],
            ArraySucursal: [],
            Arraytipocontacredito: [],
            arrayproducto: [],

            inputInicio: true,

            noSesion: false,
            config: [
                {
                    comventasventaalcredito: false,
                    comtaller: false,
                },
            ],
            configTitleVend: '',
            codpropios: false,
            clienteesabogado: true,
        }

        this.permission = {
            sucursal: readPermisions(keys.venta_select_sucursal),
            almacen: readPermisions(keys.venta_select_almacen),
            moneda: readPermisions(keys.venta_select_moneda),
            veh_placa: readPermisions(keys.venta_select_search_placaVehiculo),
            t_prod_cod: readPermisions(keys.venta_tabla_columna_codigoProducto),
            t_prod_desc: readPermisions(keys.venta_tabla_columna_producto),
            t_cantidad: readPermisions(keys.venta_tabla_columna_cantidad),
            t_lista_precios: readPermisions(keys.venta_tabla_columna_listaPrecio),
            t_precio_unit: readPermisions(keys.venta_tabla_columna_precioUnitario),
            t_descuento: readPermisions(keys.venta_tabla_columna_descuento),
        }

        this.generarReporte = this.generarReporte.bind(this);
    }

    componentDidMount() {

        this.getConfigsClient();
        let key = JSON.parse(readData(keysStorage.user));
        var idgrupo = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        var usuario = (typeof key == 'undefined' || key == null)?'':
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        

        this.setState({
            fkidgrupo: (idgrupo == null)?0:idgrupo,
            usuario: (idgrupo > 2)?usuario:'',
        });

        httpRequest('get', '/commerce/api/venta/reporte_por_producto')
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
                    config: result.configuracion,
                    clienteesabogado: result.config.clienteesabogado,
                    arrayproducto: result.producto.data,
                    codpropios: result.config.codigospropios,
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
        this.setState({
            configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor'
        });
    }

    regresarIndexVenta() {
        this.setState({
            redirect: true,
        });
    }

    onChangeTipoVenta(event) {
        this.setState({
            tipo: event,
        });
    }

    onChangeFechaInicio(dateString) {
        if (this.state.fechaFinal == '') {
            this.setState({
                fechaInicio: dateString,
            });
        }else {
            if (dateString <= this.state.fechaFinal) {
                this.setState({
                    fechaInicio: dateString,
                });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
            });
        }
    }
    
    onChangeFechaFinal(dateString) {
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
            });
        }else {
            
            if (dateString >= this.state.fechaInicio) {
                this.setState({
                    fechaFinal: dateString,
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

    onChangeProducto(event) {
        this.setState({
            idproducto: event,
        });
    }

    onSearchCodIdProducto(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarCodIdProducto(value); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onSearchProducto(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarProducto(value); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    verificarCodIdProducto(value) {
        var body = {
            codigo: value,
            codigospropios: this.state.codpropios,
        };
        httpRequest('post', '/commerce/api/venta/get_codigo_producto', body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    arrayproducto: result.data.data,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    verificarProducto(value) {
        var body = {
            producto: value,
        };
        httpRequest('post', '/commerce/api/venta/get_descripcion_producto', body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    arrayproducto: result.data.data,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onDeleteProducto() {
        this.setState({
            idproducto: '',
        });
        this.verificarProducto('');
    }

    limpiarDatos() {
        this.setState({
            exportar: 'N',
            ordenarPor: 1,

            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',
            idproducto: '',

            cliente: '',
            vendedor: '',
        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
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

        if (this.state.fkidgrupo == 1 || this.state.fkidgrupo == 2) {
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

    componentArrayCodIdProducto() {
        let array = [];
        let data = this.state.arrayproducto;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (this.state.codpropios) {
                array.push(
                    <Option key={i} value={data[i].idproducto}>
                        {data[i].codproducto}
                    </Option>
                );
            }else {
                array.push(
                    <Option key={i} value={data[i].idproducto}>
                        {data[i].idproducto}
                    </Option>
                );
            }
        }
        return array;
    }
    componentArrayProducto() {
        let array = [];
        let data = this.state.arrayproducto;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array;
    }
    onMessage() {
        message.error('Favor de seleccionar producto');
    }

    generarReporte(e) {
        if (this.state.idproducto == '' || this.state.idproducto == undefined) {
            message.warning('Debe seleccionar un producto');
            return;
        }
        document.getElementById("form").submit();
    }

    render() {

        const componentArrayCodIdProducto = this.componentArrayCodIdProducto();
        const componentArrayProducto = this.componentArrayProducto();
        const componentvendedoradmin = this.componentvendedoradmin();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;

        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/venta/index"/>)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Reporte de Ventas por  Producto</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form 
                            id="form"
                            //action={this.generarReporte}
                            action="/commerce/admin/venta_por_producto/generar" 
                            target="_blank" 
                            method="post">

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
                            <input type="hidden" value={JSON.stringify(this.permission)} name="permisos" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className='cols-lg-2 cols-md-2'></div>

                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechaInicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Fecha Inicio"
                                />
                                <input type="hidden" value={this.state.fechaInicio} name="fechainicio" />

                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechaFinal}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title="Fecha Final"
                                    readOnly={
                                        (this.state.fechaInicio == '')?true:false
                                    }
                                />
                                <input type="hidden" value={this.state.fechaFinal} name="fechafinal" />

                                <C_Select
                                    value={(this.state.tipo == '')?undefined:this.state.tipo}
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
                                <input type="hidden" value={this.state.tipo} name="tipoventa" />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className='cols-lg-2 cols-md-2'></div>
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
                                    value={(this.state.moneda == '')?undefined:this.state.moneda}
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

                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <div className='cols-lg-3 cols-md-3'></div>
                                <C_Select 
                                    showSearch={true}
                                    value={(this.state.idproducto == '')?undefined:this.state.idproducto}
                                    placeholder={"Seleccionar..."}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchCodIdProducto.bind(this)}
                                    onChange={this.onChangeProducto.bind(this)}
                                    component={componentArrayCodIdProducto}
                                    title={
                                        (this.state.codpropios)?
                                            "Cod Producto":"Id Producto"
                                    }
                                    onDelete={this.onDeleteProducto.bind(this)}
                                    allowDelete={true}
                                />
                                <C_Select 
                                    showSearch={true}
                                    value={(this.state.idproducto == '')?undefined:this.state.idproducto}
                                    placeholder={"Seleccionar..."}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchProducto.bind(this)}
                                    onChange={this.onChangeProducto.bind(this)}
                                    component={componentArrayProducto}
                                    title="Nombre Producto"
                                    onDelete={this.onDeleteProducto.bind(this)}
                                    allowDelete={true}
                                />
                                <input type='hidden' value={this.state.idproducto} name='idproducto' />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>

                                <C_Select 
                                    value={this.state.ordenarPor}
                                    title='Ordenar Por'
                                    onChange={this.onChangeOrdenarPor.bind(this)}
                                    component={[
                                        <Option key={0} value={1}> ID Venta </Option>,
                                        <Option key={1} value={2}> Fecha </Option>,
                                        <Option key={2} value={3}> Cliente </Option>,
                                        <Option key={3} value={4}> {this.state.configTitleVend} </Option>,
                                        <Option key={4} value={5}> Tipo Venta </Option>,
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
                                    {(this.state.idproducto == '')?
                                        <C_Button 
                                            type='primary'
                                            title='Generar'
                                            onClick={this.onMessage.bind(this)}
                                        />:
                                        <C_Button
                                            title='Generar'
                                            type='primary'
                                            submit={true}
                                        />
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}