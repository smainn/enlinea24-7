
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link } from 'react-router-dom';
import { message, Modal, Select, Icon } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, hourToString, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_TextArea from '../../../componentes/data/textarea';
import Confirmation from '../../../componentes/confirmation';
import keysStorage from '../../../utils/keysStorage';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';


const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
let dateIni = new Date();
let dateFin = new Date();
dateFin.setMonth(dateFin.getMonth() + 1);
const { Option } = Select;
let now = new Date();
export default class CrearTraspasoProducto extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            codigo: '',
            validarCodigo: 1,
            timeoutSearch: undefined,

            tipotraspaso: '',
            arraytipotraspaso: [],

            fecha: dateToString(now, 'f2'),
            hora: hourToString(),

            arrayalmacen: [],
            almacensalida: '',
            almacenentrada: '',

            arrayproducto: [],

            productos: [],

            nota: '',

            redirect: false,
            noSesion: false,
            configCodigo: false,
        }
        this.permisions = {
            codigo: readPermisions(keys.traspaso_input_codigo),
            tipo: readPermisions(keys.traspaso_select_tipo),
            fecha: readPermisions(keys.traspaso_fecha),
            almacen_salida: readPermisions(keys.traspaso_sale_almacen),
            almacen_entrada: readPermisions(keys.traspaso_entra_almacen),
            notas: readPermisions(keys.traspaso_textarea_notas),
            t_cantidad: readPermisions(keys.traspaso_column_cantidad)
        }
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios,
                })
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    getTipoTraspaso() {
        httpRequest('get', ws.wstraspasotipoget)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    arraytipotraspaso: result.data,
                    tipotraspaso: (result.data.length > 0)?result.data[0].idingresosalidatrastipo:''
                })
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    getAlmacen() {
        httpRequest('get', ws.wstraspasogetalmacen)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    arrayalmacen: result.data,
                })
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getTipoTraspaso();
        this.getAlmacen();
    }

    onChangeCodigo(event) {
        this.setState({
            codigo: event,
            validarCodigo: 1,
        });

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }

        this.state.timeoutSearch = setTimeout(() => { this.verificarCodigo(event); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    verificarCodigo(value) {
        if (value.toString().trim().length > 0) {
            httpRequest('get', ws.wstraspasovalidarcod + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validarCodigo: 1 });
                    } else {
                        this.setState({ validarCodigo: 0 });
                    }
                }
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    onChangeTipoTraspaso(event) {
        this.setState({
            tipotraspaso: event,
        });
    }

    onChangeFecha(event) {
        this.setState({
            fecha: event,
        });
    }
    onChangeHora(event) {
        this.setState({
            hora: event,
        });
    }
    onChangeAlmacenSale(event) {
        this.setState({
            almacensalida: event,
        });
    }
    onChangeAlmacenEntrada(event) {
        this.setState({
            almacenentrada: event,
        });
    }
    onChangeNota(event) {
        this.setState({
            nota: event,
        });
    }
    verificarCodigoProducto(value, bandera) {
        var array = [];
                array.push(this.state.almacenentrada);
                array.push(this.state.almacensalida);
                var body = {
                    almacen: JSON.stringify(array),
                    value: value,
                    bandera: bandera,
                };

                httpRequest('post', ws.wstraspasogetalacemprod, body)
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
    onSearchCodigoProducto(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarCodigoProducto(value, 1); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onSearchDescripcionProducto(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarCodigoProducto(value, 2); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeCodigoProducto(pos, value) {
        var bandera = 0;
        for (let i = 0; i < this.state.productos.length; i++) {
            if (this.state.productos[i].id == value) {
                bandera = 1;
                break;
            }
        }
        if (bandera == 0) {
            var objeto = {
                id: value,
                stockactualsalida: this.state.productos[pos].stockactualsalida,
                stockactualentrante: this.state.productos[pos].stockactualentrante,
                cantidad: 0,
            };
            this.state.productos[pos] = objeto;
            this.setState({
                productos: this.state.productos,
            });
            this.getStockAlmacenes(value, pos);
        }else {
            message.warning('El producto ya fue seleccionado');
        }
    }
    getStockAlmacenes(idproducto, pos) {
        var array = [];
        array.push(this.state.almacenentrada);
        array.push(this.state.almacensalida);

        var body = {
            almacen: JSON.stringify(array),
            id: idproducto,
        };

        httpRequest('post', ws.wstraspasogetstockalm, body)
        .then((result) => {
            if (result.response == 1) {
                for (let i = 0; i < result.data.length; i++) {
                    if (this.state.almacenentrada == result.data[i].almacen) {
                        this.state.productos[pos].stockactualentrante = parseInt(result.data[i].stock);
                    }else {
                        this.state.productos[pos].stockactualsalida =  parseInt(result.data[i].stock);
                    }
                }
                this.setState({
                    productos: this.state.productos,
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

    onChangeCantidad(pos, value) {
        if (!isNaN(value)) {
            if (value == '') {
                this.state.productos[pos].cantidad = 0;
            }else {
                var cantidad = parseInt(value);
                if (cantidad <= this.state.productos[pos].stockactualsalida) {
                    this.state.productos[pos].cantidad = parseInt(value);
                } 
            }
            this.setState({
                productos: this.state.productos,
            });
        }
    }
    onDeleteIDProducto(pos){
        this.state.productos[pos].id = ''; 
        this.state.productos[pos].cantidad = '',
        this.state.productos[pos].stockactualentrante = '';
        this.state.productos[pos].stockactualsalida = '';
        this.setState({
            productos: this.state.productos,
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }

    componentArrayTipoTraspaso() {
        let array = [];
        let data = this.state.arraytipotraspaso;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(
                <Option 
                    key={i} value={data[i].idingresosalidatrastipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array; 
    }
    onClickMostrarProductos() {
        var entrada = this.state.almacenentrada;
        var salida = this.state.almacensalida;
        
        if ((entrada == '') || (salida == '')) {
            message.error('Favor de seleccionar Almacen');
        }else {
            if (entrada == salida) {
                message.warning('No se permite mismo Almacen');
            }else {

                var bandera = 0 ;

                for (let i = 0; i < this.state.productos.length; i++) {
                    if (this.state.productos[i].id != '') {
                        bandera = 1;
                        break;
                    }
                }

                if (bandera == 0) {
                    var array = [];
                    array.push(this.state.almacenentrada);
                    array.push(this.state.almacensalida);
                    var body = {
                        almacen: JSON.stringify(array),
                    };

                    httpRequest('post', ws.wstraspasogetalacemprod, body)
                    .then((result) => {
                        if (result.response == 1) {
                            if (result.data.data.length > 0) {
                                var objeto = {
                                    id: '',
                                    stockactualsalida: '',
                                    stockactualentrante: '',
                                    cantidad: '',
                                }
                                this.state.productos = [];
                                this.state.productos.push(objeto);
                                this.state.productos.push(objeto);
                                this.state.productos.push(objeto);

                                this.setState({
                                    arrayproducto: result.data.data,
                                    productos: this.state.productos,
                                });
                            }else {
                                this.setState({
                                    arrayproducto: [],
                                    arrayitem: [],
                                    productos: [],
                                });
                                message.warning('No existe ningun productos en comun');
                            }
                        }
                        if (result.response == -2) {
                            this.setState({ noSesion: true })
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }else {
                    this.setState({
                        visible: true,
                        bandera: 1,
                    });
                }
            }
        }
    }

    getMostrarProductos() {
        var array = [];
        array.push(this.state.almacenentrada);
        array.push(this.state.almacensalida);
        var body = {
            almacen: JSON.stringify(array),
        };

        this.setState({
            loading: true,
        });

        httpRequest('post', ws.wstraspasogetalacemprod, body)
        .then((result) => {
            if (result.response == 1) {
                if (result.data.data.length > 0) {
                    var objeto = {
                        id: '',
                        stockactualsalida: '',
                        stockactualentrante: '',
                        cantidad: '',
                    }
                    this.state.productos = [];
                    this.state.productos.push(objeto);
                    this.state.productos.push(objeto);
                    this.state.productos.push(objeto);

                    this.setState({
                        arrayproducto: result.data.data,
                        productos: this.state.productos,
                    });
                }else {
                    this.setState({
                        arrayproducto: [],
                        arrayitem: [],
                        productos: [],
                    });
                    message.warning('No hay productos');
                }
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.handleCerrarModal()
        })
        .catch((error) => {
            console.log(error);
        });
    }
    addRowProducto() {
        var objeto = {
            id: '',
            stockactualsalida: '',
            stockactualentrante: '',
            cantidad: '',
        }
        this.state.productos.push(objeto);
        this.setState({
            productos: this.state.productos,
        });
    }
    onDeleteRowProducto(pos) {
        this.state.productos.splice(pos, 1);
        this.setState({
            productos: this.state.productos,
        });
    }
    componentArrayAlmacenSalida() {
        let array = [];
        let data = this.state.arrayalmacen;
        let length = data.length;
        array.push(
            <Option 
                key={0} value={''}>
                {'Seleccionar'}
            </Option>
        );
        for (let i = 0; i < length; i++) {
            array.push(
                <Option 
                    key={i + 1} value={data[i].idalmacen}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array; 
    }
    componentArrayAlmacenEntrada() {
        let array = [];
        let data = this.state.arrayalmacen;
        let length = data.length;
        array.push(
            <Option 
                key={0} value={''}>
                {'Seleccionar'}
            </Option>
        );
        for (let i = 0; i < length; i++) {
            array.push(
                <Option 
                    key={i + 1} value={data[i].idalmacen}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array; 
    }
    componentArrayCodigoProducto() {
        let array = [];
        let data = this.state.arrayproducto;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let codigo = this.state.configCodigo ? data[i].codigo : data[i].id;
            array.push(
                <Option 
                    key={i + 1} value={data[i].id}>
                    {codigo}
                </Option>
            );
        }
        return array; 
    }
    componentArrayDescripcionProducto() {
        let array = [];
        let data = this.state.arrayproducto;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(
                <Option 
                    key={i + 1} value={data[i].id}>
                    {data[i].producto}
                </Option>
            );
        }
        return array; 
    }
    handleCerrarModal() {
        this.setState({
            loading: false,
            visible: false,
            bandera: 0,
        });
    }
    componentConfirmacion() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Registro de Almacen'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.getMostrarProductos.bind(this)}
                    content={
                        <label style={{paddingBottom: 5}}>
                            ¿Desea continuar los cambios?
                        </label>
                    }
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Cancelar Registro'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.regresarIndex.bind(this)}
                    content={
                        <label style={{paddingBottom: 5}}>
                            ¿Desea cancelar los registros?
                        </label>
                    }
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Guardar Registro'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.onSubmit.bind(this)}
                    content={
                        <label style={{paddingBottom: 5}}>
                            ¿Desea guardar los registros?
                        </label>
                    }
                />
            );
        }
    }
    CancelConfirmacion() {
        this.setState({
            visible: true,
            bandera: 2,
        });
    }
    onConfirmacion() {
        var bandera = 0;
        for (let i = 0; i < this.state.productos.length; i++) {
            if (this.state.productos[i].cantidad > 0) {
                bandera = 1;
                break;
            }
        }
        if ((this.state.almacenentrada == '') || (this.state.almacensalida == '') ||
                (this.state.fecha == '') || (this.state.hora == '')
            ) {
            message.error('No se permite campo vacio');
        }else {
            if (bandera == 0) {
                message.warning('Por lo menos un producto debe tener una cantidad mayor a cero.');
            }else {
                var user = JSON.parse(readData(keysStorage.user));
                var idusuario = (user == null)?'':user.idusuario;
                if (idusuario == '') {
                    message.error('Usuario no autentificado');
                }else {
                    this.setState({
                        visible: true,
                        bandera: 3,
                    });
                }
            }
        }
    }
    onSubmit() {
        var array = [];
        array.push(this.state.almacenentrada);
        array.push(this.state.almacensalida);

        var user = JSON.parse(readData(keysStorage.user));
        var idusuario = (user == null)?'':user.idusuario;

        var body = {
            codigo: this.state.codigo,
            tipo: this.state.tipotraspaso,
            fecha: convertDmyToYmd(this.state.fecha),
            hora: this.state.hora,
            almacen: JSON.stringify(array),
            nota: this.state.nota,
            producto: JSON.stringify(this.state.productos),
            idusuario: idusuario,
        };

        this.setState({
            loading: true,
        });

        httpRequest('post', ws.wstraspasostore, body)
        .then((result) => {
            if (result.response == 1) {
                message.success('Exito en realizar traspaso');
                this.setState({
                    redirect: true,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.handleCerrarModal();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    regresarIndex() {
        this.setState({
            redirect: true,
        });
    }

    render(){
        const componentArrayTipoTraspaso = this.componentArrayTipoTraspaso();
        const componentArrayAlmacenSalida = this.componentArrayAlmacenSalida();
        const componentArrayAlmacenEntrada = this.componentArrayAlmacenEntrada();
        const componentArrayCodigoProducto = this.componentArrayCodigoProducto();
        const componentArrayDescripcionProducto = this.componentArrayDescripcionProducto();

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.traspaso_producto_index} />
            )
        }
        return (
            <div className="rows">
                {this.componentConfirmacion()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Traspaso de Producto</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form encType="multipart/form-data">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={this.state.codigo}
                                    title='Codigo'
                                    onChange={this.onChangeCodigo.bind(this)}
                                    mensaje='El codigo ya existe'
                                    validar={this.state.validarCodigo}
                                    configAllowed={this.state.configCodigo}
                                    permisions={this.permisions.codigo}
                                />

                                <C_Select
                                    value={(this.state.tipotraspaso == '')?undefined:this.state.tipotraspaso}
                                    onChange={this.onChangeTipoTraspaso.bind(this)}
                                    component={componentArrayTipoTraspaso}
                                    title="Tipo Traspaso"
                                    permisions={this.permisions.tipo}
                                />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fecha}
                                    onChange={this.onChangeFecha.bind(this)}
                                    title="Fecha"
                                    permisions={this.permisions.fecha}
                                />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.hora}
                                    onChange={this.onChangeHora.bind(this)}
                                    title="Hora"
                                    mode='time'
                                    format='HH:mm:ss'
                                    showTime={true}
                                    permisions={this.permisions.fecha}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Select
                                    value={this.state.almacensalida}
                                    onChange={this.onChangeAlmacenSale.bind(this)}
                                    component={componentArrayAlmacenSalida}
                                    title="Almacen Salida"
                                    permisions={this.permisions.almacen_salida}
                                />
                                <C_Select
                                    value={this.state.almacenentrada}
                                    onChange={this.onChangeAlmacenEntrada.bind(this)}
                                    component={componentArrayAlmacenEntrada}
                                    title="Almacen Entrante"
                                    permisions={this.permisions.almacen_entrada}
                                />
                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                    <C_Button onClick={this.onClickMostrarProductos.bind(this)}
                                        type='primary' title='Mostrar'
                                    />
                                </div>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    title='Nota'
                                    value={this.state.nota}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    onChange={this.onChangeNota.bind(this)}
                                    permisions={this.permisions.notas}
                                />
                            </div>
                            <div className="row-title">
                                Traspasos de Productos
                                <C_Button onClick={this.addRowProducto.bind(this)}
                                    type='primary' size='small'
                                    style={{padding: 2, lineHeight: '0', 'float': 'right'}}
                                    title={<Icon type='plus' />}
                                />
                                
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="table-content">
                                    <table className="table-responsive-content">
                                        <thead>
                                            <tr style={{background: '#fafafa'}} className="row-header">
                                                <th colSpan='3'>
                                                    Productos
                                                </th>
                                                <th>
                                                    Almacen-Salida
                                                </th>
                                                <th>
                                                    Almacen-Entrante
                                                </th>
                                                <th style={{'textAlign': 'right'}}>
                                                    <C_Button title={<Icon type='plus'/>}
                                                        type='primary' size='small'
                                                        style={{padding: 2, lineHeight: '0'}}
                                                        onClick={this.addRowProducto.bind(this)}
                                                    />
                                                </th>
                                            </tr>
                                            <tr style={{background: '#fafafa'}} className="row-header">
                                                <th>Nro</th>
                                                <th>Codigo</th>
                                                <th>Descripcion</th>
                                                <th>Stock Actual</th>
                                                <th>Stock Actual</th>
                                                <th>Cantidad a Traspasar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.productos.map(
                                                (data, key) => (
                                                    <tr key={key}>
                                                        <th>
                                                            <label className="col-show">Nro: </label>
                                                            {key + 1}
                                                        </th>
                                                        <th>
                                                            <label className="col-show">Codigo Producto: </label>
                                                            <C_Select
                                                                showSearch={true}
                                                                value={
                                                                    (data.id == '')?
                                                                        undefined: 
                                                                        data.id
                                                                }
                                                                placeholder={"Buscar por codigo"}
                                                                defaultActiveFirstOption={false}
                                                                showArrow={false}
                                                                filterOption={false}
                                                                onSearch={this.onSearchCodigoProducto.bind(this)}
                                                                onChange={this.onChangeCodigoProducto.bind(this , key)}
                                                                component={componentArrayCodigoProducto}
                                                                onDelete={this.onDeleteIDProducto.bind(this, key)}
                                                                allowDelete={true}
                                                                className=''
                                                            />
                                                        </th>
                                                        <th>
                                                            <label className="col-show"> Producto: </label>
                                                            <C_Select
                                                                showSearch={true}
                                                                value={
                                                                    (data.id == '')?
                                                                        undefined: 
                                                                        data.id
                                                                }
                                                                placeholder={"Buscar por codigo"}
                                                                defaultActiveFirstOption={false}
                                                                showArrow={false}
                                                                filterOption={false}
                                                                onSearch={this.onSearchDescripcionProducto.bind(this)}
                                                                onChange={this.onChangeCodigoProducto.bind(this , key)}
                                                                component={componentArrayDescripcionProducto}
                                                                onDelete={this.onDeleteIDProducto.bind(this, key)}
                                                                allowDelete={true}
                                                                className=''
                                                            />
                                                        </th>
                                                        <th>
                                                            <label className="col-show"> Stock Actual: </label>
                                                            <C_Input 
                                                                readOnly={true}
                                                                className='columna-table'
                                                                value={data.stockactualsalida}
                                                                style={{ textAlign: 'right' }}
                                                            />
                                                        </th>
                                                        <th>
                                                            <label className="col-show"> Stock Actual: </label>
                                                            <C_Input 
                                                                readOnly={true}
                                                                className='columna-table'
                                                                value={data.stockactualentrante}
                                                                style={{ textAlign: 'right' }}
                                                            />
                                                        </th>
                                                        <th style={{position: 'relative'}}>
                                                            <label className="col-show"> Cantidad: </label>
                                                            <C_Input 
                                                                readOnly={
                                                                    (data.id == '')?
                                                                        true:false
                                                                }
                                                                className='columna-table'
                                                                value={data.cantidad}
                                                                onChange={this.onChangeCantidad.bind(this , key)}
                                                                style={{ textAlign: 'right' }}
                                                            />
                                                            <C_Button 
                                                                type='danger' size='small'
                                                                onClick={this.onDeleteRowProducto.bind(this, key)}
                                                                style={{padding: 2, lineHeight: '0', 
                                                                    'position': 'absolute', 'right': '-17px',
                                                                    'top': '7px'
                                                                }}
                                                                title={<Icon type='delete' />}
                                                            />
                                                        </th>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button onClick={this.onConfirmacion.bind(this)}
                                        type='primary' title='Guardar'
                                    />
                                    <C_Button onClick={this.CancelConfirmacion.bind(this)}
                                        type='danger' title='Cancelar'
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


