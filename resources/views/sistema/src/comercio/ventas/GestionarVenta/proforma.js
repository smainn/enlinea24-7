
import React, { Component } from 'react';

import { Select, Checkbox, message } from 'antd';

import "antd/dist/antd.css"; 
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { readData, httpRequest, removeAllData, saveData } from '../../../utils/toolsStorage';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import { Redirect, withRouter } from 'react-router-dom';
import routes from '../../../utils/routes';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import { convertYmdToDmy } from '../../../utils/toolsDate';
import C_Button from '../../../componentes/data/button';
import Confirmation from '../../../componentes/confirmation';

const {Option} = Select; 

class Venta_Proforma extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,
            
            key_venta: -1,

            timeoutSearch: undefined,

            array_cliente: [],
            idcliente: '',

            vendedores: [],
            productos: [],
            ventas: [],
            array_checked: [],

            isabogado: false,
            config_codigo: false,

            noSesion: false,
        }
        
        this.permisions = {
            btn_reporte_ventas: readPermisions(keys.venta_btn_reporte_ventas),
            btn_reporte_cobrar: readPermisions(keys.venta_btn_reporte_ventas_cobrar),
            btn_reporte_cobros: readPermisions(keys.venta_btn_reporte_ventas_cobros),
            btn_reporte_detalles: readPermisions(keys.venta_btn_reporte_ventas_detalles),
        }
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    componentDidMount() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'venta_create') {
                    bandera = true
                }
            }
        }
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsproformaventa)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                    isabogado: result.configCli.clienteesabogado,
                    config_codigo: result.configCli.codigospropios,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    getProformasCliente(id) {
        httpRequest('get', ws.wsgetproformascliente + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                let length = result.productos.length;
                let array = [];
                for (let i = 0; i < length; i++) {
                    array.push(false);
                }
                this.setState({
                    vendedores: result.vendedores,
                    productos: result.productos,
                    ventas: result.ventas,
                    array_checked: array,
                })
                console.log(result)
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onchangeCliente(value) {
        this.getProformasCliente(value);
        this.setState({
            idcliente: value,
        });
    }
    searchCliente(value) {
        httpRequest('post', ws.wsproformaventasearchcliente, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchCliente(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeCheckVentas(index) {
        for (let i = 0; i < this.state.array_checked.length; i++) {
            if (i == index) {
                this.state.key_venta = (this.state.array_checked[i])?-1:i;
                this.state.array_checked[i] = !this.state.array_checked[i];
            }else {
                this.state.array_checked[i] = false;
            }
        }
        this.setState({
            array_checked: this.state.array_checked,
            key_venta: this.state.key_venta,
        });
    }
    componentCliente() {
        let data = this.state.array_cliente;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            array.push(
                <Option key={i} value={data[i].idcliente}>{data[i].nombre + ' ' + apellido}</Option>
            );
        }
        return array;
    }
    onDeleteCliente() {
        this.setState({
            idcliente: '',

            vendedores: [],
            productos: [],
            ventas: [],
            array_checked: [],
            key_venta: -1,
        });
        this.onSearchCliente('');
    }
    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onCancelar.bind(this)}
                    title='Aceptar Proforma Venta'
                    width={380}
                    onClick={this.onSubmitProforma.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de guardar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onCancelar.bind(this)}
                    title='Cancelar Proforma venta'
                    width={380}
                    onClick={this.onSalir.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de eliminar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
    }
    onSubmitProforma() {
        var id = this.state.ventas[this.state.key_venta].idventa;
        this.setState({
            loading: true,
        });
        httpRequest('get', ws.wsproformacompleta + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                console.log(result)

                var on_data = JSON.parse( readData(keysStorage.on_data) );
                let proforma = result.proforma;

                if (this.validar_data(on_data)) {
                    if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
                    {
                        if (on_data.on_create == 'venta_create') {

                            var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;
                            
                            if (data_actual != null) {
                                var cliente = {
                                    idcliente:  proforma.idcliente,
                                    codcliente: proforma.codcliente,
                                    nombre: proforma.nomc,
                                    apellido: proforma.apec,
                                    nit: proforma.nit,
                                };
                                var vendedor = {
                                    idvendedor: proforma.idvendedor,
                                    codvendedor: proforma.codvendedor,
                                    nombre: proforma.nomv,
                                    apellido: proforma.apev,
                                    valor: proforma.tomarcomisionvendedor,
                                };
                                data_actual.fecha = convertYmdToDmy(proforma.fecha);
                                data_actual.idsucursal = proforma.idsucursal;
                                data_actual.idalmacen = proforma.idalmacen;
                                data_actual.idlistaprecio = proforma.idlistaprecio;
                                data_actual.idmoneda = proforma.idmoneda;
                                data_actual.idvendedor = proforma.idvendedor;
                                data_actual.comision_vendedor = proforma.tomarcomisionvendedor;
                                data_actual.idcliente = proforma.idcliente;
                                data_actual.namecliente = proforma.nomc + ' ' + (proforma.apec == null ? '' : proforma.apec);
                                data_actual.nitcliente = proforma.nit == null ? '' : proforma.nit;
                                data_actual.idvehiculo = proforma.idvehiculo == null ? '' : proforma.idvehiculo;
                                data_actual.descripcion_vehiculo = proforma.tipovehiculo == null ? '' : proforma.tipovehiculo;
                                data_actual.placa_vehiculo = proforma.placa == null ? '' : proforma.placa;
                                data_actual.observacion = proforma.observaciones == null ? '' : proforma.observaciones;

                                data_actual.array_cliente = [];
                                data_actual.array_cliente.push(cliente);

                                data_actual.array_vendedor = [];
                                data_actual.array_vendedor.push(vendedor);

                                data_actual.array_vehiculo = [];

                                if (proforma.idvehiculo != null) {
                                    var vehiculo = {
                                        idvehiculo: proforma.idvehiculo,
                                        placa: proforma.placa,
                                        vehiculotipo: proforma.tipovehiculo,
                                        codvehiculo: proforma.codvehiculo,
                                    };
                                    data_actual.array_vehiculo.push(vehiculo);
                                }

                                data_actual.array_tablero_venta = [];

                                let data = result.productos;

                                for (let i = 0; i < data.length ; i++) {

                                    var array_producto = [];
                                    array_producto.push({
                                        idproducto:  data[i].id,
                                        codproducto: data[i].codproducto,
                                        descripcion: data[i].descripcion,
                                        abreviacion: data[i].abreviacion,
                                    });

                                    var cantidad = 0;
                                    var alert = 1;

                                    if (data[i].tipo == 'S') {
                                        cantidad = result.cantidades[i];
                                    }else {
                                        if (result.cantidades[i] > data[i].stock) {
                                            if (data[i].stock == 0) {
                                                message.error('El producto ' + data[i].descripcion + ' se ha agotado');
                                                cantidad = 0;
                                                alert = -1;
                                            }else {
                                                message.warning('La cantidad requerida es insuficiente del producto ' + data[i].descripcion);
                                                cantidad = parseInt(data[i].stock);
                                            }
                                        }else {
                                            cantidad = result.cantidades[i];
                                        }
                                    }

                                    var descuento = parseFloat(parseFloat(result.descuentos[i] / 100) * data[i].precio * cantidad);

                                    var producto = {
                                        idproducto: data[i].id,
                                        unidadmedida: result.abreviaciones[i],
                                        cantidad: cantidad,
                                        idlistaprecio: result.listaprecios[i],
                                        idalmacenprodetalle: result.idsalmacenprod[i],
                                        idlistapreproducdetalle: data[i].idlistapreproducdetalle,
                                        preciounitario: data[i].precio,
                                        descuento: result.descuentos[i],

                                        preciototal: parseFloat((data[i].precio * cantidad) - descuento).toFixed(2),

                                        tipo: result.tipos[i],
                                        validacion: false,
                                        alert: alert,
                                        array_listaprecio: data_actual.array_listaprecio,
                                        array_producto: array_producto,
                                    };
                                    data_actual.array_tablero_venta.push(producto);
                                }

                                var subtotal = 0;
                                data_actual.array_tablero_venta.map(
                                    data => {
                                        subtotal = subtotal + parseFloat(data.preciototal);
                                    }
                                );

                                var descuento = parseFloat(parseFloat(proforma.descuentoporcentaje / 100) * subtotal);
                                var recargo = parseFloat(parseFloat(proforma.recargoporcentaje / 100) * subtotal);

                                data_actual.subtotal = subtotal;
                                data_actual.descuento_general = proforma.descuentoporcentaje;
                                data_actual.recargo_general = proforma.recargoporcentaje;
                                data_actual.total_general = parseFloat(subtotal + recargo - descuento).toFixed(2);

                                data_actual.vehiculo_historia = {
                                    diagnostico_entrada: (result.vehiculohistoria.diagnosticoEntrada == null)?'':result.vehiculohistoria.diagnosticoEntrada,
                                    trabajo_hecho: (result.vehiculohistoria.trabajosHechos == null)?'':result.vehiculohistoria.trabajosHechos,
                                    fecha: (result.vehiculohistoria.fecha == null)?'':result.vehiculohistoria.fecha,
                                    precio: (result.vehiculohistoria.precio == null)?'':result.vehiculohistoria.precio,
                                    km_actual: (result.vehiculohistoria.kmActual == null)?'':result.vehiculohistoria.kmActual,
                                    km_proximo: (result.vehiculohistoria.kmProximo == null)?'':result.vehiculohistoria.kmProximo,
                                    fecha_proxima: (result.vehiculohistoria.fechaProxima == null)?'':result.vehiculohistoria.fechaProxima,
                                    nota: (result.vehiculohistoria.notas == null)?'':result.vehiculohistoria.notas,
                                };

                                data_actual.array_vehiculoparte = {
                                    idvehiculoparte: result.vehiculopartes.idsvpartes,
                                    imagen: result.vehiculopartes.vpfotos,
                                    cantidad: result.vehiculopartes.vpcantidades,
                                    estado: result.vehiculopartes.vpestados,
                                    observacion: result.vehiculopartes.vpobservaciones,
                                };
                            }
                            var objecto_data = {
                                on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                                data_actual: data_actual,
                                validacion: true,
                            };
                            
                            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                        }
                    }
                }

                this.props.history.goBack();
                
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSalir() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {

                var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;

                var objecto_data = {
                    on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                    data_actual: data_actual,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
                
            this.props.history.goBack();
        }, 400);
    }
    onCancelar() {
        this.setState({
            visible: false,
        });
        setTimeout(() => {
            this.setState({
                bandera: 0,
            });
        }, 300);
    }
    onProforma() {
        if (this.state.idcliente == '') {
            message.warning('Favor de seleccionar un cliente!!!');
            return;
        }
        if (this.state.key_venta == -1) {
            message.warning('Favor de seleccionar una venta!!!');
            return;
        }
        this.setState({visible: true, bandera: 1, })
    }
    render(){
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalShow = this.componentModalShow();
        return (
            <div className='rows'>
                {componentModalShow}
                <div className="cards" style={{'padding': 0,}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Proforma Venta</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1"></div>
                            <C_Input 
                                readOnly={true}
                                title='Cliente: '
                                className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12'
                                style={{background: 'transparent', border: '1px solid transparent', textAlign: 'right'}}
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idcliente}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchCliente.bind(this)}
                                onChange={this.onchangeCliente.bind(this)}
                                component={this.componentCliente()}
                                allowDelete={(this.state.idcliente == '')?false:true}
                                onDelete={this.onDeleteCliente.bind(this)}
                                className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="table-detalle" style={{ width: '100%', margin: 'auto', overflow: 'auto',}}>
                                <table className="table-response-detalle">
                                    <thead>
                                        <tr>
                                            <th>Nro</th>
                                            <th>Cod/ID</th>
                                            {this.state.isabogado ? <th> Abogado</th> : <th> Vendedor</th>}
                                            <th>Fecha</th>
                                            <th>Productos</th>
                                            <th>Opcion</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.ventas.map((item, key) => {
                                            let codigo = this.state.config_codigo ? item.codventa : item.idventa;
                                            let nombreve = this.state.vendedores[key].nombre;
                                            let apellidove = this.state.vendedores[key].apellido == null ? '' : this.state.vendedores[key].apellido;
                                            let productos = this.state.productos[key].cadena;
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>
                                                        {codigo}
                                                    </td>
                                                    <td style={{ width: 230 }}>
                                                        {nombreve + ' ' + apellidove}
                                                    </td>
                                                    <td style={{ width: 100 }}>{convertYmdToDmy(item.fecha)}</td>
                                                    <td style={{ width: 200 }}>
                                                        {productos}
                                                    </td>
                                                    <td>
                                                        <Checkbox 
                                                            onChange={this.onChangeCheckVentas.bind(this, key)}
                                                            checked={this.state.array_checked[key]}>  
                                                        </Checkbox>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Seleccionar y volver'
                                    type='primary'
                                    onClick={this.onProforma.bind(this)}
                                />
                                <C_Button
                                    title='Volver sin seleccionar'
                                    type='danger'
                                    onClick={() => this.setState({visible: true, bandera: 2, })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Venta_Proforma);
