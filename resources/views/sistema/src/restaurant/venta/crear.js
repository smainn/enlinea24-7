
import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import { message, Select, Modal, notification, Alert, Spin, Icon, Popover, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData, removeAllData, httpRequest, saveData } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';
import strings from '../../utils/strings';
import routes from '../../utils/routes';
import C_Button from '../../componentes/data/button';
import ws from '../../utils/webservices';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import { dateToString, stringToDate, fullHourToString, convertDmyToYmd } from '../../utils/toolsDate';
import C_DatePicker from '../../componentes/data/date';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
import Confirmation from '../../componentes/confirmation';
const {Option} = Select;

var number = 0;
var txt = ' Esta es la primera linea de texto que se desplaza y esta es la segunda, puedes poner todas las que quieras !'

class Restaurant_Venta_Create extends Component{

    constructor(props){
        super(props);
        this.state = {
            inicio_venta: false,

            mensaje: setInterval(() => {
                this.setState({
                    mensaje: txt,
                });
                setTimeout(() => {
                    txt = txt.substring(1, txt.length) + txt.charAt(0);
                    this.setState({
                        mensaje: txt,
                    });
                }, 2000);
            }, 1000),

            visible_submit: false,
            visible_cancel: false,

            loading: false,
            bandera: 0,

            idsucursal: '',
            idalmacen: '',
            idmoneda: '',
            idlistaprecio: '',

            tipo_entrega: 'M',
            readOnly_entrega: false,

            fecha: setInterval(() => {
                let dateNow = new Date();
                this.setState({
                    fecha: dateToString(dateNow, 'f2'),
                });
            }, 1000),
            hora: setInterval(() => {
                this.setState({
                    hora: fullHourToString(),
                });  
            }, 1000),

            idmesa: '',
            idmesero: '',
            idcliente: '',

            nombrecliente: '',
            nombremesero: '',

            idtipopago: '',

            nota: '',

            array_cliente: [],
            array_mesero: [],
            array_producto: [],
            array_tipopago: [],

            array_categoria: [],

            array_tabla: [{
                idproducto: '',
                producto: '',
                idalmacenprodetalle: '',
                cantidad: number,
                precio: number.toFixed(2),
                precio_total: number.toFixed(2),
                operacion: '',
                checked: {
                    mesa: true,
                    llevar: false,
                },
                nota: '',
                array_producto: [],
                alert: 1,
                loading: false,
            }],

            tipo_descuento: 'P',
            tipo_incremento: 'P',

            sub_total: number.toFixed(2),
            descuento_total: number.toFixed(2),
            incremento_total: number.toFixed(2),
            total_venta: number.toFixed(2),

            timeoutSearch: undefined,
            noSesion: false,
        }

        this.permisions = {
        }
    }
    componentDidMount() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'restaurant_venta_create') {
                    bandera =  this.validar_data(on_data.validacion)?on_data.validacion:false;
                    var objecto_data = {
                        on_create: null,
                        data_actual: null,
                        new_data: null,
                        validacion: null,
                    };
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                }
            }
        }
        if (bandera) {
            this.cargar_data(on_data.data_actual);
            return;
        }
        this.get_data();
    }
    cargar_data(data) {
        if (this.validar_data(data.cliente)) {
            data.array_cliente.push(data.cliente);
            data.cliente = null;
        }
        this.setState({
            inicio_venta: true,

            idsucursal: data.idsucursal,
            idalmacen: data.idalmacen,
            idmoneda: data.idmoneda,
            idlistaprecio: data.idlistaprecio,

            tipo_entrega: data.tipo_entrega,
            readOnly_entrega: data.readOnly_entrega,

            idtipopago: data.idtipopago,
            idcliente: data.idcliente,
            idmesero: data.idmesero,
            nota: data.nota,

            nombrecliente: data.nombrecliente,
            nombremesero: data.nombremesero,

            array_cliente: data.array_cliente,
            array_mesero: data.array_mesero,
            array_producto: data.array_producto,
            array_tipopago: data.array_tipopago,
            array_categoria: data.array_categoria,
            array_tabla: data.array_tabla,

            tipo_descuento: data.tipo_descuento,
            tipo_incremento: data.tipo_incremento,

            sub_total: data.sub_total,
            descuento_total: data.descuento_total,
            incremento_total: data.incremento_total,
            total_venta: data.total_venta,

        });
    }
    get_data() {
        
        httpRequest('get', ws.wsrestaurantventa + '/create')
        .then((result) => {
            if (result.response == 1) {
                console.log(result)
                var number = 0;

                this.state.array_tabla[0].array_producto = result.producto;

                for (let i = 0; i < 2; i++) {
                    var objeto = {
                        idproducto: '',
                        producto: '',
                        idalmacenprodetalle: '',
                        cantidad: number,
                        precio: number.toFixed(2),
                        precio_total: number.toFixed(2),
                        operacion: '',
                        checked: {
                            mesa: true,
                            llevar: false,
                        },
                        nota: '',
                        array_producto: result.producto,
                        alert: 1,
                        loading: false,
                    };
                    this.state.array_tabla.push(objeto);
                }

                this.setState({
                    inicio_venta: true,
                    array_cliente: result.cliente,
                    array_mesero: result.mesero,
                    array_producto: result.producto,
                    array_tipopago: result.tiposcontacredito,

                    idtipopago: (result.tiposcontacredito.length > 0)?result.tiposcontacredito[0].idtipocontacredito:'',

                    array_categoria: result.array_categoria,

                    array_tabla: this.state.array_tabla,
                    idsucursal: (result.sucursal.length > 0)?result.sucursal[0].idsucursal : '',
                    idalmacen: (result.almacen.length > 0)?result.almacen[0].idalmacen : '',
                    idlistaprecio: (result.lista_precio.length > 0)?result.lista_precio[0].idlistaprecio : '',
                    idmoneda: (result.moneda.length > 0)?result.moneda[0].idmoneda : '',

                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            if (result.response == -1) {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        });
    }
    onchangeTipoEntrega(value) {
        if (value == 'P') {
            this.setState({
                readOnly_entrega: true,
                idmesero: '',
                tipo_entrega: value,
            });
        }else {
            this.setState({
                readOnly_entrega: false,
                tipo_entrega: value,
            });
        }
    }
    onchangeIDTipoPago(value) {
        this.setState({
            idtipopago: value,
        });
    }
    searchClienteByNit(value) {
        httpRequest('post', ws.wssearchclientenit, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchNitCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNit(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchClienteByNombre(value) {
        httpRequest('post', ws.wssearchclientenombre, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchNombreCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onchangeIDCliente(value) {
        var nombrecliente = '';
        for (let i = 0; i < this.state.array_cliente.length; i++) {
            var data = this.state.array_cliente[i];
            if (value == data.idcliente) {
                var apellido = (data.apellido == null) ? '': data.apellido;
                nombrecliente = data.nombre + ' ' + apellido;
                break; 
            }
        }

        this.setState({
            idcliente: value,
            nombrecliente: nombrecliente,
        });
    }
    onDeleteCliente() {
        this.setState({
            idcliente: '',
            nombrecliente: '',
        });
        this.searchClienteByNombre('');
    }
    onChangeFecha(date){
        var fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() - 1);

        var fecha = stringToDate(date, 'f2');

        if(fecha.getTime() < fechaActual.getTime()){
            message.warning("Fecha Invalida");
        }else{
            this.setState({
                fecha: date,
            });
        }
    }
    onChangeHora(event) {
        this.setState({
            hora: event,
        });
    }
    searchVendedorByFullName(value) {
        httpRequest('post', ws.wssearchvendedorfullname, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_mesero: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Error al realizar servicio Favor de cargar la pagina');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchNombreMesero(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByFullName(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onchangeIDMesero(value) {
        console.log(this.state.array_mesero[0])
        var nombremesero = '';
        for (let i = 0; i < this.state.array_mesero.length; i++) {
            var data = this.state.array_mesero[i];
            if (value == data.idvendedor) {
                var apellido = (data.apellido == null) ? '': data.apellido;
                nombremesero = data.nombre + ' ' + apellido;
                break; 
            }
        }
        this.setState({
            idmesero: value,
            nombremesero: nombremesero,
        });
    }
    onDeleteIDMesero() {
        this.setState({
            idmesero: '',
            nombremesero: '',
        });
        this.searchVendedorByFullName('');
    }
    onChangeNota(value) {
        this.setState({
            nota: value,
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
    componentNit() {
        let data = this.state.array_cliente;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let nit = data[i].nit == null ? 'S/Nit' : data[i].nit;
            array.push(
                <Option key={i} value={data[i].idcliente}>{nit}</Option>
            );
        }
        return array;
    }
    componentTipoPago() {
        let data = this.state.array_tipopago;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idtipocontacredito}>{data[i].descripcion}</Option>
            );
        }
        return array;
    }
    componentMesero() {
        let data = this.state.array_mesero;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            array.push(
                <Option key={i} value={data[i].idvendedor}>{data[i].nombre + ' ' + apellido}</Option>
            );
        }
        return array;
    }
    componentProducto(index) {
        let data = this.state.array_tabla[index].array_producto;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array;
    }
    searchProducto(value, index) {
        var body = {
            value: value,
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wsrestaurantventa + '/search_producto', body)
        .then((result) => {
            if (result.response == 1) {
                this.state.array_tabla[index].array_producto = result.data;
                this.setState({
                    array_tabla: this.state.array_tabla,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obtener el precio del producto');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchProducto(index, value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProducto(value, index), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    esProductoSeleccionado(value) {
        var data = this.state.array_tabla;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == value) {
                return true;
            }
        }
        return false;
    }
    get_data_producto(index, id) {
        var body = {
            idproducto: parseInt(id),
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wsventa + '/get_productoprecio', body)
        .then(result => {
            if (result.response == 1) {
                
                var validacion = (result.data == null)? false: true;
                console.log(result.data)

                if (validacion) {
                    this.state.array_tabla[index].precio = parseFloat(result.data.precio).toFixed(2);
                    this.state.array_tabla[index].producto = result.data.descripcion;
                    this.state.array_tabla[index].cantidad = 1;
                    this.state.array_tabla[index].precio_total = parseFloat(result.data.precio).toFixed(2);
                    this.state.array_tabla[index].idalmacenprodetalle = result.data.idalmacenproddetalle;

                    if (parseInt(result.data.stock) < 1) {
                        var number = 0;
                        this.state.array_tabla[index].cantidad = 0;
                        this.state.array_tabla[index].precio_total = number.toFixed(2);
                        this.state.array_tabla[index].alert = -1;
                        message.warning('Producto agotado...');
                    }else {
                        this.state.array_tabla[index].alert = 1;
                    }

                    var subtotal = 0;
                    this.state.array_tabla.map(
                        data => {
                            subtotal = subtotal + parseFloat(data.precio_total);
                        }
                    );

                    var descuento = 0;
                    var incremento = 0;

                    if (this.state.tipo_descuento == 'P') {
                        descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * subtotal);
                    }else {
                        descuento = parseFloat(this.state.descuento_total);
                    }

                    if (this.state.tipo_incremento == 'P') {
                        incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * subtotal);
                    }else {
                        incremento = parseFloat(this.state.incremento_total);
                    }

                    var total_venta = subtotal - descuento + incremento;

                    for (let i = 0; i < this.state.array_categoria.length; i++) {
                        for (let j = 0; j < this.state.array_categoria[i].producto.length; j++) {
                            var idproducto = this.state.array_categoria[i].producto[j].idproducto;
                            if (id == idproducto) {
                                this.state.array_categoria[i].producto[j].checked = true;
                            }else {
                                var bandera = false;
                                for (let k = 0; k < this.state.array_tabla.length; k++) {
                                    if (this.state.array_tabla[k].idproducto == idproducto){
                                        bandera = true;
                                        break;
                                    }
                                }
                                if (!bandera) {
                                    this.state.array_categoria[i].producto[j].checked = false;
                                }
                            }
                        }
                    }

                    this.setState({
                        array_tabla: this.state.array_tabla,
                        sub_total: parseFloat(subtotal).toFixed(2),
                        total_venta: parseFloat(total_venta).toFixed(2),
                        array_categoria: this.state.array_categoria,
                    });

                    this.searchProducto('', index);

                }else {
                    message.error('Error al traer detalle del producto!!!')
                }

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Favor de intentar nuevamente...');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onchangeIDProductoTabla(index, value) {
        if (!this.esProductoSeleccionado(value)) {
            this.state.array_tabla[index].idproducto = value;
            this.setState({
                array_tabla: this.state.array_tabla,
            });
            this.get_data_producto(index, value);
        }else {
            message.warning('El producto ya fue seleccionado...');
        }
    }
    onDeleteProducto(index) {
        const actualizar = () => {
            var number = 0;
            var id = this.state.array_tabla[index].idproducto;
            this.state.array_tabla[index].idproducto = '';
            this.state.array_tabla[index].producto = '';
            this.state.array_tabla[index].idalmacenprodetalle = '';
            this.state.array_tabla[index].cantidad = number;
            this.state.array_tabla[index].precio = number.toFixed(2);
            this.state.array_tabla[index].precio_total = number.toFixed(2);
            this.state.array_tabla[index].alert = 1;
            this.state.array_tabla[index].nota = '';
            this.state.array_tabla[index].checked = {
                mesa: true,
                llevar: false,
            };

            var subtotal = 0;
            this.state.array_tabla.map(
                data => {
                    subtotal = subtotal + parseFloat(data.precio_total);
                }
            );

            var descuento = 0;
            var incremento = 0;

            if (this.state.tipo_descuento == 'P') {
                descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * subtotal);
            }else {
                descuento = parseFloat(this.state.descuento_total);
            }

            if (this.state.tipo_incremento == 'P') {
                incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * subtotal);
            }else {
                incremento = parseFloat(this.state.incremento_total);
            }

            var total_venta = subtotal - descuento + incremento;

            for (let i = 0; i < this.state.array_categoria.length; i++) {
                for (let j = 0; j < this.state.array_categoria[i].producto.length; j++) {
                    var idproducto = this.state.array_categoria[i].producto[j].idproducto;
                    if (id == idproducto) {
                        this.state.array_categoria[i].producto[j].checked = false;
                        break;
                    }
                }
            }

            this.setState({
                array_tabla: this.state.array_tabla,
                sub_total: parseFloat(subtotal).toFixed(2),
                total_venta: parseFloat(total_venta).toFixed(2),
            });
        };
        Modal.confirm({
            title: 'Quitar Producto',
            content: 'Al quitar se perderan los registros seleccionados, ¿Desea continuar?',
            onOk() {
                actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    validar_stock(idalmacen, index, cantidad) {
        var  body =  {
            idalmacen: idalmacen,
            idproducto: this.state.array_tabla[index].idproducto,
        }
        httpRequest('post', ws.wsverificarstock, body).
        then(result => {
            if (result.response == 1) {
                if (result.data == null) {
                    message.error('No existe producto en almacen!!!');
                    message.warning('Favor de actualizar datos nuevamente!!!');
                }else {
                    var stock = parseInt(result.data.stock);
                    cantidad = parseInt(cantidad);
                    if (cantidad > stock) {

                        message.warning('No existe la cantidad requerida del producto');

                        this.state.array_tabla[index].cantidad = stock;
                        var precio = this.state.array_tabla[index].precio;

                        this.state.array_tabla[index].precio_total = parseFloat(precio * stock).toFixed(2);

                        var subtotal = 0;
                        this.state.array_tabla.map(
                            data => {
                                subtotal = subtotal + parseFloat(data.precio_total);
                            }
                        );

                        var descuento = 0;
                        var incremento = 0;

                        if (this.state.tipo_descuento == 'P') {
                            descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * subtotal);
                        }else {
                            descuento = parseFloat(this.state.descuento_total);
                        }

                        if (this.state.tipo_incremento == 'P') {
                            incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * subtotal);
                        }else {
                            incremento = parseFloat(this.state.incremento_total);
                        }

                        var total_venta = subtotal - descuento + incremento;

                        this.setState({
                            array_tabla: this.state.array_tabla,
                            sub_total: parseFloat(subtotal).toFixed(2),
                            total_venta: parseFloat(total_venta).toFixed(2),
                        });

                        message.warning('El stock tope del producto requerido es ' + result.data.stock);

                    }
                }
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onChangeCantidadTabla(index, value) {
        var cantidad = (value == '')?1:parseInt(value);
        if (cantidad > 0) {

            this.state.array_tabla[index].cantidad = cantidad;

            var precio = this.state.array_tabla[index].precio;

            this.state.array_tabla[index].precio_total = parseFloat((precio * cantidad)).toFixed(2);

            var subtotal = 0;
            this.state.array_tabla.map(
                data => {
                    subtotal = subtotal + parseFloat(data.precio_total);
                }
            );

            var descuento = 0;
            var incremento = 0;

            if (this.state.tipo_descuento == 'P') {
                descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * subtotal);
            }else {
                descuento = parseFloat(this.state.descuento_total);
            }

            if (this.state.tipo_incremento == 'P') {
                incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * subtotal);
            }else {
                incremento = parseFloat(this.state.incremento_total);
            }

            var total_venta = subtotal - descuento + incremento;

            this.setState({
                array_tabla: this.state.array_tabla,
                sub_total: parseFloat(subtotal).toFixed(2),
                total_venta: parseFloat(total_venta).toFixed(2),
            });
            this.validar_stock(this.state.idalmacen, index, value);
        }
    }
    onChangeTipoDescuento(value) {
        var total_venta = 0;
        if (value == 'P') {
            total_venta = parseFloat(this.state.total_venta) + parseFloat(this.state.descuento_total);
        }else {
            var descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * this.state.sub_total);
            total_venta =  parseFloat(this.state.total_venta) + descuento;
        }
        this.setState({
            tipo_descuento: value,
            descuento_total: 0,
            total_venta: parseFloat(total_venta).toFixed(2),
        });
    }
    onChangeTipoIncremento(value) {
        var total_venta = 0;
        if (value == 'P') {
            total_venta = parseFloat(this.state.total_venta) - parseFloat(this.state.incremento_total);
        }else {
            var incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * this.state.sub_total);
            total_venta = parseFloat(this.state.total_venta) - incremento;
        }
        this.setState({
            tipo_incremento: value,
            incremento_total: 0,
            total_venta: parseFloat(total_venta).toFixed(2),
        });
    }
    onChangeDescuento(value) {
        value = value == '' ? 0: value;
        if (this.state.tipo_descuento == 'P') {
            if (value >= 0 && value <= 100) {

                var incremento = 0;
                if (this.state.tipo_incremento == 'P') {
                    incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * this.state.sub_total);
                }else {
                    incremento = parseFloat(this.state.incremento_total);
                }

                var descuento = parseFloat(parseFloat(value / 100) * this.state.sub_total);
                var total_venta = parseFloat(this.state.sub_total) - descuento + incremento;
                
                this.setState({
                    descuento_total: value,
                    total_venta: parseFloat(total_venta).toFixed(2),
                });
            }
        }else {
            if (this.state.sub_total >= parseFloat(value)) {

                var incremento = 0;
                if (this.state.tipo_incremento == 'P') {
                    incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * this.state.sub_total);
                }else {
                    incremento = parseFloat(this.state.incremento_total);
                }

                var total_venta = parseFloat(this.state.sub_total) - parseFloat(value) + incremento;

                this.setState({
                    descuento_total: value,
                    total_venta: parseFloat(total_venta).toFixed(2),
                });
            }else {
                notification.error({
                    message: 'Advertencia',
                    description: 'No se permite monto mayor al sub Total..',
                });
            }
        }
    }
    onChangeIncremento(value) {
        value = value == '' ? 0 : value;
        if (this.state.tipo_incremento == 'P') {
            if (value >= 0 && value <= 100) {

                var descuento = 0;
                if (this.state.tipo_descuento == 'P') {
                    descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * this.state.sub_total);
                }else {
                    descuento = parseFloat(this.state.descuento_total);
                }

                var incremento = parseFloat(parseFloat(value / 100) * this.state.sub_total);
                var total_venta = parseFloat(this.state.sub_total) + incremento - descuento;

                this.setState({
                    incremento_total: value,
                    total_venta: parseFloat(total_venta).toFixed(2),
                });
            }
        }else {

            var descuento = 0;
            if (this.state.tipo_descuento == 'P') {
                descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * this.state.sub_total);
            }else {
                descuento = parseFloat(this.state.descuento_total);
            }

            var total_venta = parseFloat(this.state.sub_total) + parseFloat(value) - descuento;
            this.setState({
                incremento_total: value,
                total_venta: parseFloat(total_venta).toFixed(2),
            });
        }
    }
    onAddRow() {
        var number = 0;
        var objeto = {
            idproducto: '',
            producto: '',
            cantidad: number,
            precio: number.toFixed(2),
            precio_total: number.toFixed(2),
            operacion: '',
            checked: {
                mesa: true,
                llevar: false,
            },
            nota: '',
            array_producto: this.state.array_producto,
            alert: 1,
            loading: false,
        }
        this.state.array_tabla.push(objeto);
        this.setState({
            array_tabla: this.state.array_tabla,
        });
    }
    onDeleterow(pos) {
        const actualizar = () => {
            this.state.array_tabla.splice(pos, 1);
            this.setState({
                array_tabla: this.state.array_tabla,
            });
        }
        
        Modal.confirm({
            title: 'Eliminar Fila',
            content: 'Al quitar se perderan los registros seleccionados, ¿Desea continuar?',
            onOk() {
                actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    backgroundRandom() {
        var x = Math.floor(Math.random() * 255);
        var y = Math.floor(Math.random() * 255);
        var z = Math.floor(Math.random() * 255);
        return "rgb(" + x + "," + y + "," + z + ")";
    }
    categoria_value(categoria) {
        setTimeout(() => {
            return categoria.substring(1, categoria.length) + categoria.charAt(0);
        }, 200);
    }
    onSelectCategoria(idfamilia, index, pos) {
        
        var body = {
            idfamilia: parseInt(idfamilia),
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
            idproductos: JSON.stringify(this.state.array_tabla),
        };
        this.state.array_categoria[index].loading = true;
        this.state.array_categoria[index].background_categoria[pos].loading = true;
        this.setState({
            array_categoria: this.state.array_categoria,
        });
        httpRequest('post', ws.wsrestaurantventa + '/categoria_getproducto', body)
        .then(result => {
            if (result.response == 1) {
                console.log(result)
                this.state.array_categoria[index].producto = result.producto;
                this.state.array_categoria[index].loading = false;
                this.state.array_categoria[index].background_categoria[pos].loading = false;
                this.setState({
                    array_categoria: this.state.array_categoria,
                    array_categoria: this.state.array_categoria,
                });

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Favor de intentar nuevamente...');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onclickSeleccionarProducto(idproducto) {
        
        var body = {
            idproducto: parseInt(idproducto),
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
        };

        httpRequest('post', ws.wsventa + '/get_productoprecio', body)
        .then(result => {
            if (result.response == 1) {
                
                var validacion = (result.data == null)? false: true;

                if (validacion) {

                    if (!this.esProductoSeleccionado(idproducto)) {
                        console.log('SI')

                        var index = this.getIndex_TablaProducto();
                        console.log(index)
                        console.log(result)

                        if (index == -1) {
                            var zero = 0;
                            var objeto = {
                                idproducto: '',
                                producto: '',
                                idalmacenprodetalle: '',
                                cantidad: zero,
                                precio: zero.toFixed(2),
                                precio_total: zero.toFixed(2),
                                operacion: '',
                                checked: {
                                    mesa: true,
                                    llevar: false,
                                },
                                nota: '',
                                array_producto: [],
                                alert: 1,
                                loading: false,

                            }
                            index = this.state.array_tabla.length;
                            this.state.array_tabla.push(objeto);
                        }

                        this.state.array_tabla[index].idproducto = result.data.idproducto;
                        this.state.array_tabla[index].producto = result.data.descripcion;
                        this.state.array_tabla[index].idalmacenprodetalle = result.data.idalmacenproddetalle;
                        this.state.array_tabla[index].precio = parseFloat(result.data.precio).toFixed(2);
                        this.state.array_tabla[index].cantidad = 1;
                        this.state.array_tabla[index].precio_total = parseFloat(result.data.precio).toFixed(2);

                        var array = [];
                        array.push(result.data);
                        this.state.array_tabla[index].array_producto = array;

                        if (parseInt(result.data.stock) < 1) {
                            var number = 0;
                            this.state.array_tabla[index].cantidad = 0;
                            this.state.array_tabla[index].precio_total = number.toFixed(2);
                            this.state.array_tabla[index].alert = -1;
                            message.warning('Producto agotado...');
                        }else {
                            this.state.array_tabla[index].alert = 1;
                        }

                    }else {
                        console.log('No')
                        var index = this.getIndex_TablaProducto(result.data.idproducto);

                        var cantidad = this.state.array_tabla[index].cantidad + 1;

                        this.state.array_tabla[index].idproducto = result.data.idproducto;
                        this.state.array_tabla[index].producto = result.data.descripcion;
                        this.state.array_tabla[index].idalmacenprodetalle = result.data.idalmacenproddetalle;
                        this.state.array_tabla[index].precio = parseFloat(result.data.precio).toFixed(2);
                        this.state.array_tabla[index].cantidad = cantidad;
                        this.state.array_tabla[index].precio_total = parseFloat(result.data.precio * cantidad).toFixed(2);

                        var array = [];
                        array.push(result.data);
                        this.state.array_tabla[index].array_producto = array;

                        if (parseInt(result.data.stock) < 1) {
                            var number = 0;
                            this.state.array_tabla[index].cantidad = 0;
                            this.state.array_tabla[index].precio_total = number.toFixed(2);
                            this.state.array_tabla[index].alert = -1;
                            message.warning('Producto agotado...');
                        }else {
                            this.state.array_tabla[index].alert = 1;
                            if ( parseInt(result.data.stock) < cantidad) {
                                this.state.array_tabla[index].cantidad =  parseInt(result.data.stock);
                                this.state.array_tabla[index].precio_total = parseFloat(result.data.precio * result.data.stock).toFixed(2);
                                message.warning('Cantidad requerida insuficiente...');
                            }
                        }
                    }

                    var subtotal = 0;
                    this.state.array_tabla.map(
                        data => {
                            subtotal = subtotal + parseFloat(data.precio_total);
                        }
                    );

                    var incremento = 0;
                    if (this.state.tipo_incremento == 'P') {
                        incremento = parseFloat(parseFloat(this.state.incremento_total / 100) * subtotal);
                    }else {
                        incremento = parseFloat(this.state.incremento_total);
                    }

                    var descuento = 0;
                    if (this.state.tipo_descuento == 'P') {
                        descuento = parseFloat(parseFloat(this.state.descuento_total / 100) * subtotal);
                    }else {
                        descuento = parseFloat(this.state.descuento_total);
                    }

                    var total_venta = parseFloat(subtotal) + incremento - descuento;

                    for (let i = 0; i < this.state.array_categoria.length; i++) {
                        for (let j = 0; j < this.state.array_categoria[i].producto.length; j++) {
                            var id = this.state.array_categoria[i].producto[j].idproducto;
                            if (id == idproducto) {
                                this.state.array_categoria[i].producto[j].checked = true;
                                break;
                            }
                        }
                    }

                    this.setState({
                        array_tabla: this.state.array_tabla,
                        sub_total: parseFloat(subtotal).toFixed(2),
                        total_venta: parseFloat(total_venta).toFixed(2),
                        array_categoria: this.state.array_categoria,
                    });

                }else {
                    message.error('Error al traer producto Favor de actualizar informacion...');
                }

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Favor de intentar nuevamente...');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    getIndex_TablaProducto(idproducto = '') {
        var pos = 0;
        for (let i = 0; i < this.state.array_tabla.length; i++) {
            var data = this.state.array_tabla[i];
            pos = i;
            if (data.idproducto == idproducto) {
                return pos;
            }
        }
        return -1;
    }
    NameCategoria(categoria) {
        return categoria;

        // this.setState({
        //     mensaje: txt,
        // });
        // setTimeout(() => {
        //     txt = txt.substring(1, txt.length) + txt.charAt(0);
        //     this.setState({
        //         mensaje: txt,
        //     });
        // }, 2000);
    }
    onChangeOrdenPedidoMesa(pos) {
        if (this.state.array_tabla[pos].checked.llevar) {
            this.state.array_tabla[pos].checked.mesa = true;
            this.state.array_tabla[pos].checked.llevar = false;
            this.setState({
                array_tabla: this.state.array_tabla,
            });
        }
    }
    onChangeOrdenPedidoLlevar(pos) {
        if (this.state.array_tabla[pos].checked.mesa) {
            this.state.array_tabla[pos].checked.mesa = false;
            this.state.array_tabla[pos].checked.llevar = true;
            this.setState({
                array_tabla: this.state.array_tabla,
            });
        }
    }
    contentOrdenPedido(pos) {
        return (
            <div>
              <div>
                  <C_CheckBox 
                    checked={this.state.array_tabla[pos].checked.mesa}
                    onChange={this.onChangeOrdenPedidoMesa.bind(this, pos)}
                    color={'success'}
                    title={'Mesa'}
                  />
              </div>
              <div>
                <C_CheckBox 
                    checked={this.state.array_tabla[pos].checked.llevar}
                    onChange={this.onChangeOrdenPedidoLlevar.bind(this, pos)}
                    color={'success'}
                    title={'Llevar'}
                  />
              </div>
            </div>
        );
    }
    onchangeNotaPedido(pos, value) {
        this.state.array_tabla[pos].nota =value;
        this.setState({
            array_tabla: this.state.array_tabla,
        });
    }
    contentNotaPedido(pos) {
        return (
            <div style={{padding: 5, }}>
                <C_TextArea style={{resize: 'none'}}
                    className=''
                    title='Especificaciones'
                    value={this.state.array_tabla[pos].nota}
                    onChange={this.onchangeNotaPedido.bind(this, pos)}
                />
            </div>
        );
    }
    crearNuevoCliente() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'restaurant_venta_create',
                data_actual: this.on_data_component(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }

        var url = routes.cliente_create;
        this.props.history.push(url);
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    on_data_component() {
        return {
            idsucursal: this.state.idsucursal,
            idalmacen: this.state.idalmacen,
            idmoneda: this.state.idmoneda,
            idlistaprecio: this.state.idlistaprecio,

            tipo_entrega: this.state.tipo_entrega,
            readOnly_entrega: this.state.readOnly_entrega,

            idtipopago: this.state.idtipopago,
            idcliente: this.state.idcliente,
            idmesero: this.state.idmesero,
            
            nombremesero: this.state.nombremesero,
            nombrecliente: this.state.nombrecliente,

            nota: this.state.nota,

            array_cliente: this.state.array_cliente,
            array_mesero: this.state.array_mesero,
            array_producto: this.state.array_producto,
            array_tipopago: this.state.array_tipopago,
            array_categoria: this.state.array_categoria,
            array_tabla: this.state.array_tabla,

            tipo_descuento: this.state.tipo_descuento,
            tipo_incremento: this.state.tipo_incremento,

            sub_total: this.state.sub_total,
            descuento_total: this.state.descuento_total,
            incremento_total: this.state.incremento_total,
            total_venta: this.state.total_venta,

        };
    }
    onGuardarData() {
        if (this.state.idcliente == '') {
            notification.error({
            message: 'Advertencia',
            description:
                'Campo cliente requerido. Favor de revisar...',
            });
            return;
        }
       var cantidad = 0;
       for (let i = 0; i < this.state.array_tabla.length; i++) {
           var data = this.state.array_tabla[i];
           if (data.idproducto != '' && data.cantidad == 0) {
                notification.error({
                    message: 'Advertencia',
                    description:
                        'No se permite producto con cantidad menor a 1. Favor de revisar...',
                });
                return;
           }
           if (data.idproducto == '') {
               cantidad++;
           }
       }
       if (cantidad == this.state.array_tabla.length) {
            notification.error({
                message: 'Advertencia',
                description:
                    'Campo producto requerido. Favor de revisar...',
            });
            return;
       }
       this.setState({
           visible_submit: true,
       });
    }
    onhandleCerrar() {
        this.setState({
            visible_submit: false,
        });
    }
    onSubmitVenta() {
        var ventadetalle = [];
        for (let i = 0; i < this.state.array_tabla.length ; i++) {
            var producto = this.state.array_tabla[i];
            if ((producto.idproducto != '') && (producto.precio > 0) && (producto.cantidad > 0)) {
                var detalle = {
                    cantidad: parseInt(producto.cantidad),
                    preciounit: parseFloat(producto.precio),
                    fkidalmacenprodetalle: parseInt(producto.idalmacenprodetalle),
                    fkidlistaproddetalle: parseInt(this.state.idlistaprecio),
                    idproducto: parseInt(producto.idproducto),
                    producto: producto.producto,
                    nota: producto.nota,
                    orden_pedido: (producto.checked.mesa)?'M':'P',
                    estadoproceso: 'P',
                }
                ventadetalle.push(detalle);
            }
        }
        var user = JSON.parse(readData(keysStorage.user));
        var idusuario = ((user == null) || (typeof user == 'undefined'))?null:user.idusuario;

        let body = {
            fecha: convertDmyToYmd(this.state.fecha),
            hora: this.state.hora,

            estadoproceso: 'P',
            estado: 'V',

            fkidcliente: this.state.idcliente,
            fkidvendedor: this.state.idmesero,

            nombrecliente: this.state.nombrecliente,
            nombremesero: this.state.nombremesero,

            fkidmoneda: this.state.idmoneda,
            fkidsucursal: this.state.idsucursal,
            fkidtipocontacredito: this.state.idtipopago,
            fkidtipotransacventa: 3,
            idusuario: idusuario,

            totalventa: parseFloat(this.state.total_venta),

            descuento: parseFloat(this.state.descuento_total),
            incremento: parseFloat(this.state.incremento_total),

            tipo_descuento: this.state.tipo_descuento,
            tipo_incremento: this.state.tipo_incremento,
            tipo_entrega: this.state.tipo_entrega,

            notas: this.state.nota,
            arrayventadetalle: JSON.stringify(ventadetalle),
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsrestaurantventa + '/store', body)
        .then(result => {
            if (result.response == 1) {
                console.log(result)
                this.setState({
                    loading: false,
                    visible_submit: false,
                });
                message.success("Se inserto correctamente");
            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                message.error('Ocurrio un problema en el servidor');
                this.setState({
                    loading: false,
                });
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
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
                <Confirmation
                    visible={this.state.visible_submit}
                    title="Registrar Pedido"
                    loading={this.state.loading}
                    onCancel={this.onhandleCerrar.bind(this)}
                    onClick={this.onSubmitVenta.bind(this)}
                    width={350}
                    content={'Estas seguro de registrar el pedido de venta?'}
                />

                <div className="cards">

                    <div style={{ display: 'block', overflowX: 'auto', overflowY: 'hidden',
                        border: '1px solid #e8e8e8', borderRadius: 5, padding: 5}}>

                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title" style={{marginTop: 0, padding: 2, }}>
                                    {'Nueva venta para la mesa '}
                                </h1>
                            </div>
                        </div>

                        <div style={{display: 'flex', margin: 'auto', }}>
                            
                            <div style={{width: 400, minWidth: 400, borderRight: '1px solid #e8e8e8', paddingBottom: 10,
                                    display: 'block',
                                }}
                            >

                                <div style={{width: '100%',}}>
                                    <button type='button' className='btns btns-primary secondary font_roboto'
                                        style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, }}
                                    >
                                        Registro de Datos
                                    </button>
                                </div>

                                <div style={{width: '100%', padding: 4, paddingBottom: 10, paddingTop: 10, 
                                        borderBottom: '1px solid #e8e8e8', marginTop: 5, 
                                    }}
                                >
                                    <div style={{width: '100%', display: 'flex', padding: 5, justifyContent: 'space-between' }}>
                                        <div style={{width: 125, padding: 5, }}>
                                            <C_DatePicker
                                                allowClear={false}
                                                value={this.state.fecha}
                                                onChange={this.onChangeFecha.bind(this)}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 125, padding: 5, }}>
                                            <C_DatePicker 
                                                allowClear={false}
                                                value={this.state.hora}
                                                onChange={this.onChangeHora.bind(this)}
                                                title="Hora"
                                                mode='time'
                                                format='HH:mm:ss'
                                                showTime={true}
                                                className=''
                                            />
                                        </div>
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 200, padding: 5,}}>
                                            <C_Select title='Tipo Entrega'
                                                value={this.state.tipo_entrega}
                                                onChange={this.onchangeTipoEntrega.bind(this)}
                                                component={[
                                                    <Option key={0} value="M"> Mesa </Option>,
                                                    <Option key={1} value="P"> Para Llevar </Option>,
                                                ]}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 200, padding: 5,}}>
                                            <C_Select title='Tipo Venta'
                                                value={this.state.idtipopago}
                                                onChange={this.onchangeIDTipoPago.bind(this)}
                                                component={this.componentTipoPago()}
                                                className=''
                                            />
                                        </div>
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 120, padding: 5, }}>
                                            <C_Select title='Nit'
                                                showSearch={true}
                                                value={this.state.idcliente}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.onSearchNitCliente.bind(this)}
                                                onChange={this.onchangeIDCliente.bind(this)}
                                                component={this.componentNit()}
                                                allowDelete={(this.state.idcliente == '')?false:true}
                                                onDelete={this.onDeleteCliente.bind(this)}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 260, padding: 5, }}>
                                            <C_Select title='Nombre Cliente'
                                                showSearch={true}
                                                value={this.state.idcliente}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.onSearchNombreCliente.bind(this)}
                                                onChange={this.onchangeIDCliente.bind(this)}
                                                component={this.componentCliente()}
                                                allowDelete={(this.state.idcliente == '')?false:true}
                                                onDelete={this.onDeleteCliente.bind(this)}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 20, padding: 5, position: 'relative' }}>
                                            {(this.state.inicio_venta)?
                                                <C_Button title={<i className='fa fa-plus'></i>}
                                                    type='danger' size='small'
                                                    style={{padding: 3, position: 'absolute', right: -10, top: 6, }}
                                                    onClick={this.crearNuevoCliente.bind(this)}
                                                />:null
                                            }
                                        </div>
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 120, padding: 5, }}>
                                            <C_Select title='Mesa'
                                                showSearch={true}
                                                value={this.state.idmesa}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                //onSearch={this.onSearchNitCliente.bind(this)}
                                                //onChange={this.onchangeCliente.bind(this)}
                                                //component={this.componentNit()}
                                                allowDelete={(this.state.idmesa == '')?false:true}
                                                //onDelete={this.onDeleteCliente.bind(this)}
                                                className=''
                                                readOnly={this.state.readOnly_entrega}
                                            />
                                        </div>
                                        <div style={{width: 280, padding: 5, }}>
                                            <C_Select title='Mesero'
                                                showSearch={true}
                                                value={this.state.idmesero}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.onSearchNombreMesero.bind(this)}
                                                onChange={this.onchangeIDMesero.bind(this)}
                                                component={this.componentMesero()}
                                                allowDelete={(this.state.idmesero == '')?false:true}
                                                onDelete={this.onDeleteIDMesero.bind(this)}
                                                className=''
                                                readOnly={this.state.readOnly_entrega}
                                            />
                                        </div>
                                    </div>
                                    <div style={{width: '100%', padding: 5, }}>
                                        <C_TextArea title='Nota para la cocina'
                                            className=''
                                            value={this.state.nota}
                                            onChange={this.onChangeNota.bind(this)}
                                        />
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                            <div style={{width: 600, minWidth: 600, display: 'block', }}>

                                <div style={{width: '100%', display: 'flex', paddingBottom: 5, }}>
                                    
                                    <C_Button title='Nueva Venta'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Editar Venta'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Cobrar'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Productos'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Tickets'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Clientes'
                                        type='primary'
                                        style={{width: 100, padding: 3, borderRadius: 1, marginTop: 0, }}
                                        //onClick={this.onGuardarData.bind(this)}
                                    />
                                </div>
                            
                                <div style={{width: '100%', height: 480, border: '1px solid #e8e8e8', paddingBottom: 10, 
                                        display: 'block', overflowX: 'auto', overflowY: 'hidden',
                                    }}>
                                    <div style={{display: 'flex', paddingBottom: 4, }}>

                                        {this.state.array_categoria.map(
                                            (data, key) => {
                                                if (key == 0) {
                                                    return (
                                                        <div style={{width: 400, minWidth: 400, height: '100%', }} key={key}>
                                                            <button type={'button'} className='btns btns-primary success font_roboto' 
                                                                style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, background: data.background }} >
                                                                {data.descripcion}
                                                            </button>

                                                            <div style={{width: 400, minWidth: 400, height: 300, borderRight: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', 
                                                                    padding: 1, overflowX: 'hidden', overflowY: 'auto', paddingBottom: 15, }}>

                                                                <div style={{width: '100%', display: 'table', }}>

                                                                    {(data.loading)?

                                                                        <div style={{width: '100%', padding: 10, marginTop: 100, }}>
                                                                            <Spin tip="Loading...">
                                                                                <Alert
                                                                                message=""
                                                                                description="Favor de esperar, Cargando informacion..."
                                                                                type="info"
                                                                                />
                                                                            </Spin>,
                                                                        </div>:

                                                                        data.producto.map(
                                                                            (producto, pos) => (
                                                                                <div key={pos} style={{width: 99, height: 100, border: '1px solid #e8e8e8', boxSizing: 'border-box', float: 'left', position: 'relative' }}>
                                                                                    {(producto.imagen.length == 0)?
                                                                                        <img src="/images/default.jpg" alt="none" className="img-principal" />:
                                                                                        <img src={producto.imagen[0].foto} alt="none" className="img-principal" style={{cursor: 'pointer'}}
                                                                                            onClick={this.onclickSeleccionarProducto.bind(this, producto.idproducto)}
                                                                                        />
                                                                                    }
                                                                                    {(producto.checked && producto.imagen.length > 0)?
                                                                                        <div style={{position: 'absolute', width: '100%', height: '100%', 
                                                                                                top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, .25)', 
                                                                                                cursor: 'pointer', 
                                                                                            }}
                                                                                            onClick={this.onclickSeleccionarProducto.bind(this, producto.idproducto)}    
                                                                                        >
                                                                                                <C_CheckBox 
                                                                                                    checked={true}
                                                                                                    disabled={true}
                                                                                                    color={'success'}
                                                                                                    style={{position: 'absolute', right: 0, top: 1, zIndex: 15, }}
                                                                                                />
                                                                                        </div>:null
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        )
                                                                    }

                                                                </div>
                                                            </div>

                                                            <div style={{width: 400, minWidth: 400, height: 120, marginTop: 10, border: '1px solid #e8e8e8', 
                                                                    overflowX: 'hidden', overflowY: 'auto', paddingBottom: 8,
                                                                }}
                                                            >
                                                                
                                                                <div style={{width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                                                    {data.categoria.map(
                                                                        (categoria, index) => (
                                                                            <div key={index} style={{width: 95, height: 40, padding: 1, }}>

                                                                                {(data.background_categoria[index].loading)?
                                                                                    <div style={{width: '100%', height: '100%',
                                                                                            textAlign: 'center', paddingTop: 10, background: 'rgba(0, 0, 0, 0.05)',
                                                                                        }}
                                                                                    >
                                                                                        <Spin />
                                                                                    </div>:

                                                                                    <input type='text' value={categoria.descripcion} className='font_roboto'
                                                                                        style={{
                                                                                            width: '100%', height: '100%', outline: 'none', cursor: 'pointer',
                                                                                            border: '1px solid #e8e8e8', paddingLeft: 4, paddingRight: 5, fontSize: 13,
                                                                                            display: 'block', background: data.background_categoria[index].background, color: 'white',
                                                                                        }} readOnly={true}
                                                                                        onClick={this.onSelectCategoria.bind(this, categoria.idfamilia, key, index)}
                                                                                    />
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    );
                                                }else {
                                                    return (
                                                        <div style={{width: 200, minWidth: 200, height: '100%', }} key={key}>
                                                            <button type={'button'} className='btns btns-primary primary font_roboto' 
                                                                style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, background: data.background }} >
                                                                {data.descripcion}
                                                            </button>

                                                            <div style={{width: 200, minWidth: 200, height: 300, borderRight: '1px solid #e8e8e8', 
                                                                    borderBottom: '1px solid #e8e8e8', padding: 1, overflowX: 'hidden', overflowY: 'auto', 
                                                                    paddingBottom: 15, 
                                                                }}
                                                            >
                                                                <div style={{width: '100%', display: 'table', }}>

                                                                {(data.loading)?

                                                                    <div style={{width: '100%', padding: 10, marginTop: 100, }}>
                                                                        <Spin tip="Loading...">
                                                                            <Alert
                                                                            message=""
                                                                            description="Favor de esperar, Cargando informacion..."
                                                                            type="info"
                                                                            />
                                                                        </Spin>,
                                                                    </div>:

                                                                    data.producto.map(
                                                                        (producto, pos) => (
                                                                            <div key={pos} style={{width: '50%', height: 100, border: '1px solid #e8e8e8', boxSizing: 'border-box', float: 'left', 
                                                                                    position: 'relative',
                                                                                }}
                                                                            >
                                                                                {(producto.imagen.length == 0)?
                                                                                    <img src="/images/default.jpg" alt="none" className="img-principal" />:
                                                                                    <img src={producto.imagen[0].foto} alt="none" className="img-principal" style={{cursor: 'pointer'}}
                                                                                        onClick={this.onclickSeleccionarProducto.bind(this, producto.idproducto)}
                                                                                    />
                                                                                }
                                                                                {(producto.checked && producto.imagen.length > 0)?
                                                                                    <div style={{position: 'absolute', width: '100%', height: '100%', 
                                                                                            top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, .25)', 
                                                                                            cursor: 'pointer', 
                                                                                        }}
                                                                                        onClick={this.onclickSeleccionarProducto.bind(this, producto.idproducto)}    
                                                                                    >
                                                                                            <C_CheckBox 
                                                                                                checked={true}
                                                                                                disabled={true}
                                                                                                color={'success'}
                                                                                                style={{position: 'absolute', right: 0, top: 1, zIndex: 15, }}
                                                                                            />
                                                                                    </div>:null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )
                                                                }

                                                                </div>
                                                            </div>

                                                            <div style={{boxSizing: 'border-box', minWidth: 200, height: 120, marginTop: 10, border: '1px solid #e8e8e8', 
                                                                    overflowX: 'hidden', overflowY: 'auto', paddingBottom: 8,
                                                                }}
                                                            >

                                                                <div style={{width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                                                
                                                                    {data.categoria.map(
                                                                        (categoria, index) => {
                                                                            return (
                                                                                <div key={index} style={{width: 95, height: 40, padding: 1, }}>

                                                                                    {(data.background_categoria[index].loading)?
                                                                                        <div style={{width: '100%', height: '100%',
                                                                                                textAlign: 'center', paddingTop: 10, background: 'rgba(0, 0, 0, 0.05)',
                                                                                            }}
                                                                                        >
                                                                                            <Spin />
                                                                                        </div>:

                                                                                        <input type='text' value={categoria.descripcion} className='font_roboto'
                                                                                            style={{
                                                                                                width: '100%', height: '100%', outline: 'none', cursor: 'pointer',
                                                                                                border: '1px solid #e8e8e8', paddingLeft: 4, paddingRight: 5, fontSize: 13,
                                                                                                display: 'block', background: data.background_categoria[index].background, color: 'white',
                                                                                            }} readOnly={true}
                                                                                            onClick={this.onSelectCategoria.bind(this, categoria.idfamilia, key, index)}
                                                                                        />
                                                                                    }
                                                                                    
                                                                                </div>
                                                                            )
                                                                        }
                                                                    )}
                                                                </div>
                                                                
                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            }
                                        )}

                                        <div style={{minWidth: 400, height: '100%', }}></div>

                                    </div>
                                    <div style={{display: 'flex', paddingBottom: 4, }}></div>
                                </div>
                            </div>
                            
                        </div>

                        <div style={{display: 'flex', margin: 'auto', paddingBottom: 15,  }}>

                            <div style={{width: 550, minWidth: 550, marginTop: 10, }}>

                                <div style={{width: '100%', display: 'block', padding: 1, position: 'relative', }}>

                                    <C_Button title={<i className='fa fa-plus'></i>}
                                        type='danger' size='small'
                                        style={{padding: 3, position: 'absolute', top: -5, right: -10, }}
                                        onClick={this.onAddRow.bind(this)}
                                    />

                                    <div style={{width: '100%', display: 'flex', height: 'auto', background: 'red', }}>
                                        <div style={{width: 200, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
                                            <label className='size_table_font'>
                                                Producto
                                            </label>
                                        </div>
                                        <div style={{width: 70, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
                                            <label className='size_table_font'>
                                                Cantidad
                                            </label>
                                        </div>
                                        <div style={{width: 80, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
                                            <label className='size_table_font'>
                                                Precio
                                            </label>
                                        </div>
                                        <div style={{width: 90, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
                                            <label className='size_table_font'>
                                                Total
                                            </label>
                                        </div>
                                        <div style={{width: 110, padding: 5, border: '1px solid #e8e8e8', }}>
                                            <label className='size_table_font'>
                                                Operacion
                                            </label>
                                        </div>
                                    </div>

                                    <div style={{width: '100%', display: 'block', border: '1px solid #e8e8e8', 
                                            maxHeight: 350,  overflowX: 'hidden', overflowY: 'auto', paddingBottom: 15,
                                        }}
                                    >
                                        {this.state.array_tabla.map(
                                            (data, key) => (
                                                <div key={key} style={{width: '100%', display: 'flex', height: 'auto', position: 'relative', borderBottom: '1px solid #e8e8e8', }}>
                                                    {(data.alert == -1)?
                                                        <div className='alert_commerce' style={{left: -5, top: -5, }}>
                                                            Agotado
                                                        </div>:null
                                                    }
                                                    <div style={{width: 200, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
                                                        <C_Select title='Nombre'
                                                            showSearch={true}
                                                            value={data.idproducto}
                                                            defaultActiveFirstOption={false}
                                                            showArrow={false}
                                                            filterOption={false}
                                                            onSearch={this.onSearchProducto.bind(this, key)}
                                                            onChange={this.onchangeIDProductoTabla.bind(this, key)}
                                                            component={this.componentProducto(key)}
                                                            allowDelete={(data.idproducto == '')?false:true}
                                                            onDelete={this.onDeleteProducto.bind(this, key)}
                                                            className=''
                                                        />
                                                    </div>
                                                    <div style={{width: 70, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
                                                        <C_Input className=''
                                                            value={data.cantidad}
                                                            onChange={this.onChangeCantidadTabla.bind(this, key)}
                                                            style={{width: '100%', textAlign: 'right', paddingRight: (data.idproducto == '')?5:20, }}
                                                            number={true}
                                                            readOnly={(data.idproducto == '')?true:false}
                                                        />
                                                    </div>
                                                    <div style={{width: 80, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
                                                        <C_Input className=''
                                                            value={data.precio}
                                                            style={{width: '100%', textAlign: 'right', paddingRight: 5, }}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div style={{width: 90, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
                                                        <C_Input className=''
                                                            value={data.precio_total}
                                                            style={{width: '100%', textAlign: 'right', paddingRight: 10, }}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div style={{width: 110, padding: 5, paddingTop: 18, paddingBottom: 12, display: 'flex' }}>
                                                        <div style={{width: 36, height: '100%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <Popover content={this.contentOrdenPedido(key)} title="Orden de Pedido" trigger="click">
                                                                <Tooltip placement="bottom" title={'Orden Pedido'}>
                                                                    <Icon type="book" style={{color: '#1890ff', borderRadius: 5, border: '1px solid #1890ff', padding: 3, fontSize: 13, cursor: 'pointer'  }} />
                                                                </Tooltip>
                                                            </Popover>
                                                        </div>
                                                        <div style={{width: 36, height: '100%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <Popover content={this.contentNotaPedido(key)} title="Nota Extra" trigger="click">
                                                                <Tooltip placement="bottom" title={'Nota Extra'}>
                                                                    <Icon type="file-text" style={{color: '#1890ff', borderRadius: 5, border: '1px solid #1890ff', padding: 3, fontSize: 13, cursor: 'pointer'}} />
                                                                </Tooltip>
                                                            </Popover>
                                                        </div>
                                                        <div style={{width: 36, height: '100%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <Icon type="close" style={{color: 'red', borderRadius: 5, border: '1px solid red', padding: 3, fontSize: 13, cursor: 'pointer'}} 
                                                                onClick={this.onDeleterow.bind(this, key)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div style={{width: 450, minWidth: 450, marginTop: 10, padding: 3, }}>
                                <div style={{width: '100%', display: 'block', marginTop: 25, border: '1px solid #e8e8e8', }}>

                                    <div className='font_roboto' style={{width: '100%', display: 'flex', justifyContent: 'center', padding: 5, 
                                            fontWeight: '500', fontSize: 20
                                        }}
                                    >
                                        TOTAL A PAGAR
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', borderTop: '1px solid #e8e8e8', }}>
                                        <div style={{width: 340, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Sub Total: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.sub_total}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, }}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', }}>
                                        <div style={{width: 140, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Tipo Descuento: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 120, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Select className='' 
                                                value={this.state.tipo_descuento}
                                                onChange={this.onChangeTipoDescuento.bind(this)}
                                                component={[
                                                    <Option key={0} value="P">Porcentaje</Option>,
                                                    <Option key={1} value="F">Fijo</Option>,
                                                ]}
                                            />
                                        </div>
                                        <div style={{width: 80, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Valor: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.descuento_total}
                                                onChange={this.onChangeDescuento.bind(this)}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 20, }}
                                                number={true}
                                                readOnly={(parseFloat(this.state.sub_total) == 0)?true:false}
                                            />
                                        </div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', }}>
                                        <div style={{width: 140, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Tipo Incremento: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 120, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Select className='' 
                                                value={this.state.tipo_incremento}
                                                onChange={this.onChangeTipoIncremento.bind(this)}
                                                component={[
                                                    <Option key={0} value="P">Porcentaje</Option>,
                                                    <Option key={1} value="F">Fijo</Option>,
                                                ]}
                                            />
                                        </div>
                                        <div style={{width: 80, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Valor: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.incremento_total}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 20, }}
                                                number={true}
                                                onChange={this.onChangeIncremento.bind(this)}
                                                readOnly={(parseFloat(this.state.sub_total) == 0)?true:false}
                                            />
                                        </div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', }}>
                                        <div style={{width: 340, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Total Venta: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.total_venta}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, }}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div style={{width: '100%', textAlign: 'right', paddingRight: 10, }}>
                                    <C_Button title='Guardar'
                                        type='primary'
                                        onClick={this.onGuardarData.bind(this)}
                                    />
                                    <C_Button title='Guardar y Cobrar'
                                        type='primary'
                                    />
                                    <C_Button title='Salir sin Guardar'
                                        type='danger'
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Restaurant_Venta_Create);

