
import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import { message, Select, Modal, notification } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData, removeAllData, httpRequest } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';
import strings from '../../utils/strings';
import routes from '../../utils/routes';
import C_Button from '../../componentes/data/button';
import ws from '../../utils/webservices';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import { dateToString, stringToDate, fullHourToString } from '../../utils/toolsDate';
import C_DatePicker from '../../componentes/data/date';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
const {Option} = Select;

var number = 0;
var txt = ' Esta es la primera linea de texto que se desplaza y esta es la segunda, puedes poner todas las que quieras !'

class Restaurant_Venta_Create extends Component{

    constructor(props){
        super(props);
        this.state = {

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

            visible: false,
            loading: false,
            bandera: 0,

            idsucursal: '',
            idalmacen: '',
            idmoneda: '',
            idlistaprecio: '',

            tipo_entrega: 'L',
            idcliente: '',
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
            idmesero: '',
            nota: '',

            array_cliente: [],
            array_mesero: [],
            array_producto: [],

            array_categoria: [
                // {
                //     idfamilia: 2,
                //     descripcion: '',
                //     idpadrefamilia: null,
                //     estado: '',
                //     background: '',
                //     producto: [],
                //     categoria: [
                //         {
                //             idfamilia: '',
                //             descripcion: '',
                //             idpadrefamilia: '',
                //             estado: '',
                //         }
                //     ],
                // }
            ],

            array_tabla: [{
                idproducto: '',
                cantidad: number,
                precio: number.toFixed(2),
                precio_total: number.toFixed(2),
                operacion: '',
                array_producto: [],
                alert: 1,
            }],

            tipo_descuento: 'P',
            tipo_incremento: 'P',

            sub_total: number.toFixed(2),
            descuento_total: number.toFixed(2),
            incremento_total: number.toFixed(2),
            total_venta: number.toFixed(2),

            matriz_categoria: [],

            timeoutSearch: undefined,
            
            noSesion: false,
        }

        this.permisions = {
        }
    }
    componentDidMount() {
        this.get_data();
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
                        cantidad: number,
                        precio: number.toFixed(2),
                        precio_total: number.toFixed(2),
                        operacion: '',
                        array_producto: result.producto,
                        alert: 1,
                    };
                    this.state.array_tabla.push(objeto);
                }

                this.setState({
                    array_cliente: result.cliente,
                    array_mesero: result.mesero,
                    array_producto: result.producto,

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
        this.setState({
            idcliente: value,
        });
    }
    onDeleteCliente() {
        this.setState({
            idcliente: '',
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
        this.setState({
            idmesero: value,
        });
    }
    onDeleteIDMesero() {
        this.setState({
            idmesero: '',
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

                if (validacion) {
                    this.state.array_tabla[index].precio = parseFloat(result.data.precio).toFixed(2);
                    this.state.array_tabla[index].cantidad = 1;
                    this.state.array_tabla[index].precio_total = parseFloat(result.data.precio).toFixed(2);

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
            this.state.array_tabla[index].cantidad = number;
            this.state.array_tabla[index].precio = number.toFixed(2);
            this.state.array_tabla[index].precio_total = number.toFixed(2);
            this.state.array_tabla[index].alert = 1;

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
            cantidad: number,
            precio: number.toFixed(2),
            precio_total: number.toFixed(2),
            operacion: '',
            array_producto: this.state.array_producto,
            alert: 1,
        }
        this.state.array_tabla.push(objeto);
        this.setState({
            array_tabla: this.state.array_tabla,
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
    onSelectCategoria(idfamilia, index) {
        
        var body = {
            idfamilia: parseInt(idfamilia),
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
            idproductos: JSON.stringify(this.state.array_tabla),
        };
        httpRequest('post', ws.wsrestaurantventa + '/categoria_getproducto', body)
        .then(result => {
            if (result.response == 1) {
                console.log(result)
                this.state.array_categoria[index].producto = result.producto;
                this.setState({
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
                                cantidad: zero,
                                precio: zero.toFixed(2),
                                precio_total: zero.toFixed(2),
                                operacion: '',
                                array_producto: [],
                                alert: 1,
                            }
                            index = this.state.array_tabla.length;
                            this.state.array_tabla.push(objeto);
                        }

                        this.state.array_tabla[index].idproducto = result.data.idproducto;
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
    componenetOption() {
        
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
                {this.componenetOption()}
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
                            
                            <div style={{minWidth: 600, border: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', paddingBottom: 10,
                                    display: 'block',
                                }}
                            >

                                <div style={{width: '100%',}}>
                                    <button type='button' className='btns btns-primary secondary font_roboto'
                                        style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, }}
                                    >
                                        Productos Seleccionados
                                    </button>
                                </div>

                                <div style={{width: '100%', padding: 5, paddingBottom: 10, paddingTop: 10, 
                                        borderBottom: '1px solid #e8e8e8', marginTop: 5, 
                                    }}
                                >
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 200, padding: 5, margin: 'auto',}}>
                                            <C_Select title='Tipo Entrega'
                                                value={this.state.tipo_entrega}
                                                //onChange={this.onchangeIDCliente.bind(this)}
                                                component={[
                                                    <Option key={0} value="L"> Local </Option>,
                                                    <Option key={1} value="P"> Para Llevar </Option>,
                                                ]}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 200, padding: 5, margin: 'auto',}}>
                                            <C_Select title='Tipo Venta'
                                                showSearch={true}
                                                //value={this.state.idcliente}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                //onSearch={this.onSearchNombreCliente.bind(this)}
                                                //onChange={this.onchangeIDCliente.bind(this)}
                                                //component={this.componentCliente()}
                                                //allowDelete={(this.state.idcliente == '')?false:true}
                                                //onDelete={this.onDeleteCliente.bind(this)}
                                                className=''
                                            />
                                        </div>
                                    </div>
                                    <div style={{width: '100%', padding: 5,}}>
                                        <C_Input className=''
                                            value='Cliente: '
                                            style={{width: 100, textAlign: 'right', paddingRight: 10, background: 'transparent', }}
                                            readOnly={true}
                                        />
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 390, padding: 5, }}>
                                            <C_Select title='Nombre'
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
                                        <div style={{width: 210, padding: 5, }}>
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
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 500, padding: 5, margin: 'auto', display: 'flex', }}>
                                            <div style={{width: 250, padding: 10, }}>
                                                <C_DatePicker
                                                    allowClear={false}
                                                    value={this.state.fecha}
                                                    onChange={this.onChangeFecha.bind(this)}
                                                    className=''
                                                />
                                            </div>
                                            <div style={{width: 250, padding: 10, }}>
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
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <div style={{width: 220, padding: 5, }}>
                                            <C_Select title='Mesa'
                                                showSearch={true}
                                                //value={this.state.idcliente}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                //onSearch={this.onSearchNitCliente.bind(this)}
                                                //onChange={this.onchangeCliente.bind(this)}
                                                //component={this.componentNit()}
                                                //allowDelete={(this.state.idcliente == '')?false:true}
                                                //onDelete={this.onDeleteCliente.bind(this)}
                                                className=''
                                            />
                                        </div>
                                        <div style={{width: 380, padding: 5, }}>
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
                                            />
                                        </div>
                                    </div>
                                    <div style={{width: '100%', display: 'flex', padding: 5, }}>
                                        <C_TextArea title='Nota para la cocina'
                                            className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            value={this.state.nota}
                                            onChange={this.onChangeNota.bind(this)}
                                        />
                                    </div>

                                    
                                </div>
                                
                            </div>
                            
                            <div style={{minWidth: 500, height: 580, border: '1px solid #e8e8e8', paddingBottom: 10, 
                                    display: 'block', overflowX: 'auto', overflowY: 'hidden',
                                }}>
                                <div style={{display: 'flex', paddingBottom: 4, }}>

                                    {this.state.array_categoria.map(
                                        (data, key) => {
                                            if (key == 0) {
                                                return (
                                                    <div style={{minWidth: 300, height: '100%', }} key={key}>
                                                        <button type={'button'} className='btns btns-primary success font_roboto' 
                                                            style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, background: data.background }} >
                                                            {data.descripcion}
                                                        </button>

                                                        <div style={{minWidth: 300, height: 400, borderRight: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', 
                                                                padding: 1, overflowX: 'hidden', overflowY: 'auto', paddingBottom: 15, }}>

                                                            <div style={{width: '100%', display: 'table', }}>

                                                                {data.producto.map(
                                                                    (producto, pos) => (
                                                                        <div key={pos} style={{width: '50%', height: 100, border: '1px solid #e8e8e8', boxSizing: 'border-box', float: 'left', position: 'relative' }}>
                                                                            {(producto.imagen.length == 0)?
                                                                                <img src="/images/default.jpg" alt="none" className="img-principal" />:
                                                                                <img src={producto.imagen[0]} alt="none" className="img-principal" style={{cursor: 'pointer'}}
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
                                                                )}

                                                            </div>
                                                        </div>

                                                        <div style={{boxSizing: 'border-box', minWidth: 300, height: 120, marginTop: 10, border: '1px solid #e8e8e8', 
                                                                overflowX: 'hidden', overflowY: 'auto', paddingBottom: 8,
                                                            }}
                                                        >
                                                            
                                                            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                                                {data.categoria.map(
                                                                    (categoria, index) => (
                                                                        <div key={index} style={{width: 95, height: 40, padding: 1, }}>
                                                                            <input type='text' value={categoria.descripcion} className='font_roboto'
                                                                                style={{
                                                                                    width: '100%', height: '100%', outline: 'none', cursor: 'pointer',
                                                                                    border: '1px solid #e8e8e8', paddingLeft: 4, paddingRight: 5, fontSize: 13,
                                                                                    display: 'block', background: data.background_categoria[index], color: 'white',
                                                                                }} readOnly={true}
                                                                                onClick={this.onSelectCategoria.bind(this, categoria.idfamilia, key)}
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                );
                                            }else {
                                                return (
                                                    <div style={{minWidth: 200, height: '100%', }} key={key}>
                                                        <button type={'button'} className='btns btns-primary primary font_roboto' 
                                                            style={{width: '100%', padding: 3, borderRadius: 1, marginTop: 0, background: data.background }} >
                                                            {data.descripcion}
                                                        </button>

                                                        <div style={{minWidth: 200, height: 400, borderRight: '1px solid #e8e8e8', 
                                                                borderBottom: '1px solid #e8e8e8', padding: 1, overflowX: 'hidden', overflowY: 'auto', 
                                                                paddingBottom: 15, 
                                                            }}
                                                        >
                                                            <div style={{width: '100%', display: 'table', }}>

                                                                {data.producto.map(
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
                                                                )}

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
                                                                                <input type='text' value={categoria.descripcion} className='font_roboto'
                                                                                    style={{
                                                                                        width: '100%', height: '100%', outline: 'none', cursor: 'pointer',
                                                                                        border: '1px solid #e8e8e8', paddingLeft: 4, paddingRight: 5, fontSize: 13,
                                                                                        display: 'block', background: data.background_categoria[index], color: 'white',
                                                                                    }} readOnly={true}
                                                                                    onClick={this.onSelectCategoria.bind(this, categoria.idfamilia, key)}
                                                                                />
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
                            <div style={{minWidth: 10,}}></div>
                        </div>

                        <div style={{width: 600, minWidth: 600, marginTop: 10, }}>

                            <div style={{width: '100%', display: 'block', padding: 1, position: 'relative', }}>

                                <C_Button title={<i className='fa fa-plus'></i>}
                                    type='danger' size='small'
                                    style={{padding: 3, position: 'absolute', top: -5, right: -10, }}
                                    onClick={this.onAddRow.bind(this)}
                                />

                                <div style={{width: '100%', display: 'flex', height: 'auto', background: 'red', }}>
                                    <div style={{width: 250, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
                                        <label className='size_table_font'>
                                            Producto
                                        </label>
                                    </div>
                                    <div style={{width: 80, padding: 5, border: '1px solid #e8e8e8', textAlign: 'center', }}>
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
                                    <div style={{width: 100, padding: 5, border: '1px solid #e8e8e8', }}>
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
                                                <div style={{width: 250, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
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
                                                <div style={{width: 80, padding: 5, paddingTop: 18, paddingBottom: 12, borderRight: '1px solid #e8e8e8', }}>
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
                                                <div style={{width: 100, padding: 5, paddingTop: 18, paddingBottom: 12, }}></div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div style={{width: '100%', display: 'block', marginTop: 25, border: '1px solid #e8e8e8',}}>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', }}>
                                        <div style={{width: 410, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Sub Total: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 90, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.sub_total}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, }}></div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', }}>
                                        <div style={{width: 210, padding: 5, borderRight: '1px solid #e8e8e8', }}>
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
                                                    <Option key={0} value="P">Porcentual</Option>,
                                                    <Option key={1} value="M">Monto</Option>,
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
                                        <div style={{width: 90, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.descuento_total}
                                                onChange={this.onChangeDescuento.bind(this)}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 20, }}
                                                number={true}
                                                readOnly={(parseFloat(this.state.sub_total) == 0)?true:false}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, }}></div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', borderBottom: '1px solid #e8e8e8', }}>
                                        <div style={{width: 210, padding: 5, borderRight: '1px solid #e8e8e8', }}>
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
                                                    <Option key={0} value="P">Porcentual</Option>,
                                                    <Option key={1} value="M">Monto</Option>,
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
                                        <div style={{width: 90, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.incremento_total}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 20, }}
                                                number={true}
                                                onChange={this.onChangeIncremento.bind(this)}
                                                readOnly={(parseFloat(this.state.sub_total) == 0)?true:false}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, }}></div>
                                    </div>

                                    <div style={{width: '100%', display: 'flex', height: 'auto', }}>
                                        <div style={{width: 410, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={'Total Venta: '}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 90, padding: 5, borderRight: '1px solid #e8e8e8', }}>
                                            <C_Input className=''
                                                value={this.state.total_venta}
                                                style={{width: '100%', textAlign: 'right', paddingRight: 10, }}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div style={{width: 100, padding: 5, }}></div>
                                    </div>

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

