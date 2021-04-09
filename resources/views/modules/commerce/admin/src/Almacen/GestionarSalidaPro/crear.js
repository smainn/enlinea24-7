
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link } from 'react-router-dom';
import { message, Select, DatePicker, Modal } from 'antd';
import 'antd/dist/antd.css';
import { dateHourToString } from '../../../tools/toolsDate';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';

import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
const { Option } = Select;

import moment from 'moment';
import CSelect from '../../../components/select2';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import C_Button from '../../../components/data/button';
import C_TextArea from '../../../components/data/textarea';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
let dateReference = new Date();
export default class CreateSalidaPro extends Component{

    constructor(){
        super();
        this.state = {
            nro: 0,
            fecha: this.fechaActual(),

            codsalidaprod: '',
            fechahora: dateHourToString(dateReference),
            notas: '',
            idtipo: 0,
            idalmacen: 0,
            resultProductos: [],
            productosSelected: [],
            idsAlmacenProd: [],
            almacenesProd: [],
            tipos: [],
            almacenes: [],
            cantidades: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,
            redirect: false,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1
        }

        this.permisions = {
            codigo: readPermisions(keys.salida_producto_input_codigo),
            tipo: readPermisions(keys.salida_producto_select_tipo),
            almacen: readPermisions(keys.salida_producto_select_almacen),
            fecha: readPermisions(keys.salida_producto_fechaHora),
            searchprod: readPermisions(keys.salida_producto_input_search_producto),
            t_almacen: readPermisions(keys.salida_producto_tabla_columna_almacen),
            t_cantidad: readPermisions(keys.salida_producto_tabla_columna_cantidad),
            notas: readPermisions(keys.salida_producto_textarea_nota)
        }

        this.handleCodSalidaPro = this.handleCodSalidaPro.bind(this);
        this.handleFechaHora = this.handleFechaHora.bind(this);
        this.handleNotas = this.handleNotas.bind(this);
        this.handleTipo = this.handleTipo.bind(this);
        this.handleValProd = this.handleValProd.bind(this);
        this.searchProducto = this.searchProducto.bind(this);
        this.handleSearchProd = this.handleSearchProd.bind(this);
        //this.handleCantidad = this.handleCantidad.bind(this);
        this.handleAlmacen = this.handleAlmacen.bind(this);
        this.handleAlmacenProd = this.handleAlmacenProd.bind(this);
        this.storeSalidaProducto = this.storeSalidaProducto.bind(this);
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = dia + '/' + mes + '/' + year;

        return fechaFormato;   
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodsalidaprodvalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validarCodigo: 1 })
                    } else {
                        this.setState({ validarCodigo: 0 })
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({ validarCodigo: 1 })
        }
        
    }

    handleVerificCodigo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    handleCodSalidaPro(value) {
        this.handleVerificCodigo(value);
        this.setState({
            codsalidaprod: value
        });
    }

    handleFechaHora(date, dateString) {
        this.setState({
            fechahora: dateString
        });
    }

    handleTipo(value) {
        this.setState({
            idtipo: value
        });
    }

    handleNotas(value) {
        this.setState({
            notas: value
        });
    }

    handleCantidad(index, value) {
        if (value >= 0){
            this.state.cantidades[index] = parseInt(value);
            this.setState({
                cantidades: this.state.cantidades
            });
        }else {
            message.error('No se permite menor a 0');
        }
        
        console.log(this.state.cantidades);
    }

    handleAlmacen(value) {
        this.setState({
            idalmacen: value
        },
            () => this.actualizarSelectsAlmacen()
        );
    }

    handleAlmacenProd(index, value) {
        let array = this.state.almacenesProd[index];
        let idalmacenprod = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idalmacen == value) {
                idalmacenprod = array[i].idalmacenprod;
                break;
            }
        }
        this.state.idsAlmacenProd[index].idalmacen = value;
        this.state.idsAlmacenProd[index].idalmacenprod = idalmacenprod;
        this.setState({
            idsAlmacenProd: this.state.idsAlmacenProd
        });
    }

    searchProducto(value) {
        if (value.length > 0) {
           httpRequest('get', ws.wssearchonlyproduct + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if(result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                resultProductos: []
            });
        }

    }

    handleSearchProd(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchProducto(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    actualizarSelectsAlmacen() {

        let array = this.state.almacenesProd;
        for (let i = 0; i < array.length; i++) {
            let arr = array[i];
            let idalmacen = 0;
            let idalmacenprod = 0;
            for(let j = 0; j < arr.length; j++) {
                if (arr[j].idalmacen == this.state.idalmacen) {
                    idalmacen = arr[j].idalmacen;
                    idalmacen = arr[j].idalmacen;
                    idalmacenprod = arr[j].idalmacenprod;
                    idalmacen = arr[j].idalmacen;
                    break;
                }
            }
            this.state.idsAlmacenProd[i].idalmacen = idalmacen;
            this.state.idsAlmacenProd[i].idalmacenprod = idalmacenprod;
        }
        this.setState({
            idsAlmacenProd: this.state.idsAlmacenProd
        });
    }

  

    async handleValProd(value) {
        //console.log('HANDLE VAL ', value);
        let productSelected = this.getProductoSelected(value);
        
        if (productSelected) {
            let almacenes = await this.getAlmacemProducto(productSelected);
            
            var option = 0;
            var idalmacenprod = 0;
            for (let i = 0; i < almacenes.length; i++) {
                //console.log('ELEMTN ', almacenes[i]);
                if (almacenes[i].idalmacen == this.state.idalmacen) {
                    option = this.state.idalmacen;
                    idalmacenprod = almacenes[i].idalmacenprod
                    break;
                }
            }
            let obj = {
                idalmacen: option,
                idalmacenprod: idalmacenprod
            };
            //console.log('ENTRO SI');
            this.setState({
                valueSeacrhProd: value,
                productosSelected: [
                    ...this.state.productosSelected,
                    productSelected
                ],
                cantidades: [
                    ...this.state.cantidades,
                    ''
                ],
                almacenesProd: [
                    ...this.state.almacenesProd,
                    almacenes
                ],
                idsAlmacenProd: [
                    ...this.state.idsAlmacenProd,
                    obj
                ]
            });
        } else {
            //console.log('ENTRO NO');
            this.setState({
                valueSeacrhProd: value
            });
        }
        
    }

    /** Metedos Auxiliar */
    //Metodo devuelve null si el producto no existe
    //o si ya fue seleccionado
    getProductoSelected(id) {
        let array = this.state.resultProductos;
        let arraySeleted = this.state.productosSelected;
        let length = arraySeleted.length;
        for (let i = 0; i < length; i++) {
            if (arraySeleted[i].idproducto == id) {
                return false;
            }
        }

        length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idproducto == id) {
                return array[i];
            }
        }
        return false;
    }
    /** */

    getAlmacenes() {
        httpRequest('get', ws.wsalmacen)
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                
                this.setState({
                    almacenes: result.data,
                    idalmacen: result.data[0].idalmacen
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getIdsProductosSeleceted() {
        
        let data = this.state.productosSelected;
        let array = [];
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(data[i].idproducto);
        }
        return array;
    }

    getIdsAlmacenProd() {

        let array = this.state.idsAlmacenProd;
        let data = [];
        for (let i = 0; i < array.length; i++) {
            data.push(array[i].idalmacenprod);
        }
        return data;
    }

    validarDatos() {
        if (this.state.productosSelected.length === 0) {
            message.error('Debe seleccionar por lo menos un producto');
            return;
        }
        
        if (this.state.codsalidaprod.length === 0 && this.state.configCodigo) {
            message.error('El codigo es obligatorio');
            return false;
        }
        
        for (let i = 0; i < this.state.idsAlmacenProd.length; i++) {
            if (this.state.idsAlmacenProd[i].idalmacen == 0) {
                message.error('Debe seleccionar un almacen para ' + this.state.productosSelected[i].descripcion);
                return;
            }
        }
        return true;
    }

    verificarCantidades() {
        
        let data = [];
        let array = this.state.cantidades;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i] == '' || array[i] <= 0) {
                message.warning('La cantidad del producto debe ser mayor que cero');
                return false;
            }
        }
        return true;
    }


    storeSalidaProducto(e) {

        let idsProductos = this.getIdsProductosSeleceted();
        let idsAlmacenProd = this.getIdsAlmacenProd();
        let body = {
            "codsalidaprod": this.state.codsalidaprod,
            "idtipo": this.state.idtipo,
            "fechahora": this.state.fechahora,
            "notas": this.state.notas,
            "cantidades": JSON.stringify(this.state.cantidades),
            "idsProductos": JSON.stringify(idsProductos),
            "idsAlmacenProd": JSON.stringify(idsAlmacenProd)
        };

        console.log("BODY ",body);
        
        httpRequest('post', ws.wssalidaproducto, body)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({redirect: true});
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
             } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    removeProductSelected(index) {
        this.state.productosSelected.splice(index, 1);
        this.state.cantidades.splice(index, 1);
        this.state.almacenesProd.splice(index, 1);
        this.state.idsAlmacenProd.splice(index, 1);
        this.setState({
            productosSelected: this.state.productosSelected,
            cantidades: this.state.cantidades,
            almacenesProd: this.state.almacenesProd,
            idsAlmacenProd: this.state.idsAlmacenProd,
            valueSeacrhProd: undefined
        });
    }


    componentDidMount() {
        this.getConfigsClient();
        this.getTiposSalIngreTransp();
        this.getAlmacenes();
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getTiposSalIngreTransp() {
        httpRequest('get', ws.wstiposalingresotrans)
        .then((result) => {
            //console.log('RESP TIPO', resp);
            if (result.response == 1 && result.data.length > 0) {
                this.setState({
                    tipos: result.data,
                    idtipo: result.data[0].idingresosalidatrastipo,
                    nro: result.salidas,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message)
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleChangeListaPrecio(value) {
        this.getListaProductos(value);
    }
    
    onOk(value) {
        console.log('VALUE ', value);
    }

    async getAlmacemProducto(producto) {
        return await httpRequest('get', ws.wsgetalmacenprod + '/' + producto.idproducto)
        .then((result) => {
            //console.log('RESP SERV GETALM ', result);
            if (result.response > 0) {
                return result.data;
            }
            return [];
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
    }

    showConfirmStore() {

        if (!this.verificarCantidades()) return;
        if (!this.validarDatos()) return;
        const storeSalidaProducto = this.storeSalidaProducto.bind(this);
        Modal.confirm({
          title: 'Guardar Salida Producto',
          content: '¿Estas seguro de registrar la salida de producto?',
          onOk() {
            console.log('OK');
            storeSalidaProducto();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }
    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro de la nueva salida de producto?',
            content: 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              console.log('OK');
              redirect();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    componentFechaHora() {
        if (this.permisions.fecha.visible == 'A') {
            let disabled = this.permisions.fecha.editable == 'A' ? false : true;
            return (
                <>
                    <DatePicker
                        showTime
                        allowClear={false}
                        format='YYYY-MM-DD HH:mm'
                        style={{'width': '100%', 'minWidth': '100%'}}
                        placeholder="Select Time"
                        value={moment(this.state.fechahora,'YYYY-MM-DD HH:mm')}
                        onChange={this.handleFechaHora}
                        onOk={this.onOk}
                        disabled={disabled}
                    />
                    <label 
                        htmlFor="fechahora" 
                        className="lbls-input active">
                        Fecha-Hora 
                    </label>
                </>
            );
        }
        return null;
    }

    compResultProd() {
        let arr = [];
        let data = this.state.resultProductos;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(<Option 
                        key={i} value={data[i].idproducto}>
                        {data[i].idproducto + " " + data[i].descripcion}
                    </Option>);
        }
        return arr;
    }
    
    listTiposSalida() {
        let data = this.state.tipos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idingresosalidatrastipo}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    listAlmacenes() {
        let data = this.state.almacenes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    getAlmacenesProd(key) {
        let data = this.state.almacenesProd[key];
        let length = data.length;
        let arr = [
            <Option key={-1} value={0} >Seleccionar</Option>
        ];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen} >{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/salida-producto"/>
            )
        }
        const compResultProd = this.compResultProd();
        const listTiposSalida = this.listTiposSalida();
        const listAlmacenes = this.listAlmacenes();
        const componentFechaHora = this.componentFechaHora();
        //let dataListaPrecios = this.state.listaprecios.filter(o => !selectedListaPrecios.includes(o));
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Salida Producto</h1>
                        </div>
                    </div>


                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <Input 
                                    title="Codigo"
                                    value={this.state.codsalidaprod}
                                    onChange={this.handleCodSalidaPro}
                                    validar={this.state.validarCodigo}
                                    configAllowed={this.state.configCodigo}
                                    permisions={this.permisions.codigo}
                                />
                                {
                                    this.state.validarCodigo == 0 ?
                                        <p style={{ color: 'red' }}>El codigo ya existe</p>
                                    :
                                        ''
                                }
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <CSelect
                                    title='Tipo Salida'
                                    value={this.state.idtipo}
                                    onChange={this.handleTipo}
                                    component={listTiposSalida}
                                    permisions={this.permisions.tipo}
                                />
                                {/*}
                                <div className="inputs-groups">
                                    <select
                                        id="tipo"
                                        className="forms-control"
                                        onChange={this.handleTipo}>
                                        {
                                            this.state.tipos.map((item, key) => (
                                                <option 
                                                    key={key}
                                                    value={item.idingresosalidatrastipo}>
                                                    {item.descripcion}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <label 
                                        htmlFor="tipo" 
                                        className="lbls-input active"> Tipo Salida 
                                    </label>
                                </div>
                                */}
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <CSelect
                                    title='Tipo Salida'
                                    value={this.state.idalmacen}
                                    onChange={this.handleAlmacen}
                                    component={listAlmacenes}
                                    permisions={this.permisions.almacen}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                { componentFechaHora }
                                
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <CSelect
                                    title='Producto'
                                    showSearch={true}
                                    value={this.state.valueSeacrhProd}
                                    placeholder={"Buscar producto por Id o descripcion"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchProd}
                                    onChange={this.handleValProd}
                                    notFoundContent={null}
                                    allowDelete={true}      
                                    onDelete={() => this.setState({ valueSeacrhProd: undefined })}    
                                    component={compResultProd}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="table-detalle">
                                    <table className="table-response-detalle">
                                        
                                        <thead>
                                            <tr>
                                                <th>Nro</th>
                                                <th>Id Producto</th>
                                                <th>Descripcion</th>
                                                { this.permisions.t_almacen.visible == 'A' ? <th>Almacen</th> : null }
                                                { this.permisions.t_cantidad.visible == 'A' ? <th>Cantidad</th> : null }
                                                <th>Opcion</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.state.productosSelected.map(
                                                (item, key) => (
                                                    <tr key={key}>
                                                        <td>
                                                            <Input 
                                                                value={key + 1}
                                                                readOnly={true}
                                                                style={{'width': '40px'}}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input 
                                                                value={item.idproducto}
                                                                readOnly={true}
                                                                style={{'width': '50px'}}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input 
                                                                value={item.descripcion}
                                                                readOnly={true}
                                                                style={{'width': '150px'}}
                                                            />
                                                        </td>
                                                        <td>
                                                            <CSelect
                                                                style={{'width': '120px'}}
                                                                onChange={this.handleAlmacenProd.bind(this, key)}
                                                                value={this.state.idsAlmacenProd[key].idalmacen}
                                                                component={this.getAlmacenesProd(key)}
                                                                permisions={this.permisions.t_almacen}
                                                            />
                                                            {/*}
                                                            <select
                                                                id={key}
                                                                className="forms-control"
                                                                style={{'width': '120px'}}
                                                                onChange={this.handleAlmacenProd}
                                                                value={this.state.idsAlmacenProd[key].idalmacen}
                                                            >
                                                                <option value={0}>
                                                                    Seleccionar
                                                                </option>
                                                                {
                                                                    this.state.almacenesProd[key].map((item, key) => (
                                                                        <option 
                                                                            key={key}
                                                                            value={item.idalmacen}>
                                                                            {item.descripcion}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>
                                                            */}
                                                        </td>
                                                        <td>
                                                            <Input 
                                                                type="number"
                                                                value={this.state.cantidades[key]}
                                                                onChange={this.handleCantidad.bind(this, key)}
                                                                style={{'width': '100px'}}
                                                                permisions={this.permisions.t_cantidad}
                                                            />
                                                        </td>
                                                        <td>
                                                            <C_Button title={<i className='fa fa-remove'></i>}
                                                                type='danger' size='small'
                                                                onClick={() => this.removeProductSelected(key)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    title="Notas"
                                    value={this.state.notas}
                                    onChange={this.handleNotas}
                                    permisions={this.permisions.notas}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button onClick={this.showConfirmStore.bind(this)}
                                        type='primary' title='Guardar'
                                    />
                                    <C_Button onClick={this.showConfirmCancel.bind(this)}
                                        type='danger' title='Cancelar'
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


