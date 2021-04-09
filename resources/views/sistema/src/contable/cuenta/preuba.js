
import React, { Component } from 'react';

import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import {Redirect} from 'react-router-dom';
import routes from  '../../utils/routes'; 
import C_Button from '../../componentes/data/button';
import keysStorage from '../../utils/keysStorage';
import { Icon, Dropdown, Menu, message, Select } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import ws from '../../utils/webservices';
import { dateToString, hourToString } from '../../utils/toolsDate';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';

const {Option} = Select;

//php artisan db:seed --class=\\Modules\\Commerce\\Database\\Seeders\\CuentaPlanEjemploTableSeeder

export default class Plan_de_Cuenta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            familiacuenta: [],
            noSesion: false,
            height: 0,
            visible: false,
            bandera: 0,
            loading: false,
            value: 'P',

            nombre: '',
            idtipo: '',
            codigo: '',
            esctadetalle: 'N',

            codigoOrigen: '',
            nivel: '',

            arraytipocuenta: [],

            cuentaplan: {
                codigo: "1.0.0.00.000",
                title: "Activo",
                value: 181,
                cuenta: 0,
            },

            config: {
                formato: '',
                nivel: '',
            }
        }

        this.permisions = {
            btn_por_defecto: readPermisions(keys.plan_cuentas_btn_por_defecto),
            btn_vaciar: readPermisions(keys.plan_cuentas_btn_vaciar),
            btn_imprimir_pdf: readPermisions(keys.plan_cuentas_btn_imprimir_pdf),
            btn_importar: readPermisions(keys.plan_cuentas_btn_importar),
            btn_export_excel: readPermisions(keys.plan_cuentas_btn_export_excel)
        }
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event,
        });
    }
    onchangeIDTipo(event) {
        this.setState({
            idtipo: event,
        });
    }
    onchangeCodigo(event) {
        if (!isNaN(event)) {
            var arrayformato = this.state.config.formato.split('.');
            var sizeformato = arrayformato[this.state.nivel].toString().length;
            var size = event.toString().length;
            if (size <= sizeformato) {
                var arraycodigo = this.state.codigoOrigen.split('.');
                arraycodigo[this.state.nivel] = event;
                var nuevocodigo = '';
                for (let i = 0; i < arraycodigo.length; i++) {
                    if (i == arraycodigo.length - 1) {
                        nuevocodigo = nuevocodigo + arraycodigo[i];
                    }else {
                        nuevocodigo+= arraycodigo[i] + '.';
                    }
                }
                this.setState({
                    codigo: event,
                    codigoOrigen: nuevocodigo,
                });
            }
        }
    }
    componentDidMount() {
        httpRequest('get', ws.wscuentaplan + '/index').then(
            response => {
                if (response.response == 1) {
                    var objecto = {
                        formato: (response.config == null)?'':response.config.formato,
                        nivel: (response.config == null)?'':response.config.numniveles,
                    }
                    this.setState({
                        data: response.data,
                        config: objecto,
                    });
                    this.cargarTree(response.data);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    cargarTree(data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == null) {
                var objeto = {
                    codigo: array[i].codcuenta,
                    title: array[i].nombre,
                    value: array[i].idcuentaplan,
                    idpadre: array[i].fkidcuentaplanpadre,
                    idcuentatipo: array[i].fkidcuentaplantipo,
                    cuenta: parseInt(array[i].cuenta),
                    
                    icon: false,
                    treenode: false,
                    visible: false,
                    nivel: 1,
                };
                array_aux.push(objeto);
            }
        }
        this.arbolFamilia(array_aux, 2);
        this.setState({
            familiacuenta: array_aux,
            visible: false,
            bandera: 0,
        });
    }
    onClickPorDefecto() {
        this.setState({
            bandera: 1,
            visible: true,
        });
    }
    cargarPorDefecto(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscuentaplan + '/por_defecto').then(
            response => {
                if (response.response == 1) {
                    var objecto = {
                        formato: response.config.formato,
                        nivel: response.config.numniveles,
                    }
                    this.setState({
                        data: response.data,
                        config: objecto,
                    });
                    this.cargarTree(response.data);
                    message.success('exito en cargar datos!!!');
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
                if (response.response == 0) {
                    message.warning('No permitido ya que hiciste transaccion');
                }
                this.onClose()
            }
        ).catch(
            error => console.log(error)
        );
    }

    arbolFamilia(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].value, contador);
            data[i].children = hijos;
            this.arbolFamilia(hijos, contador + 1);
        }
    }
    hijosFamilia(idpadre, contador) {
        var array =  this.state.data;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    codigo: array[i].codcuenta,
                    title: array[i].nombre,
                    value: array[i].idcuentaplan,
                    idpadre: array[i].fkidcuentaplanpadre,
                    idcuentatipo: array[i].fkidcuentaplantipo,
                    cuenta: parseInt(array[i].cuenta),

                    icon: false,
                    treenode: false,
                    visible: false,
                    nivel: contador,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    cargarTreeNode(data, bool) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            data[i].treenode = bool;
            this.cargarTreeNode(data[i].children, bool);
        }
    }
    onChangeChecked(event) {
        event.icon = !event.icon;
        this.cargarTreeNode(event.children, event.icon);
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    vistaPlanCuenta() {
        var recorrido = [];
        var contador = 0;
        this.recorridoEnPreOrden(this.state.familiacuenta, recorrido, contador);
        return recorrido;
    }
    recorridoEnPreOrden(nodoActual, recorrido, contador) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {

            var longitud = contador * 17 + 18;
            longitud = longitud.toString();
            longitud = longitud + 'px';
            
            var numniveles = this.state.config.nivel;

            if (contador < numniveles) {

                recorrido.push(
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" 
                        key={nodoActual[i].value} 
                        style={{ 'height': '35px', paddingTop: 4,
                            'display' : (nodoActual[i].treenode)?'none':'block', 
                        }}
                    >

                        <div className="cols-lg-12 cols-md-9 cols-sm-12 cols-xs-12 padding-0" 
                            style={{'height': '100%',}}>
                        
                            <label style={{'position': 'relative', 'cursor': 'pointer',
                                    'marginLeft': longitud.toString(),
                                    fontWeight: (nodoActual[i].idpadre == null)?'bold':'normal',
                                    borderBottom: '1px solid #e8e8e8'
                                }}
                            >

                                    <input type="checkbox" 
                                        style={{'display': 'none'}} 
                                        id={nodoActual[i].value} 
                                        onChange={this.onChangeChecked.bind(this, nodoActual[i])}
                                        checked={nodoActual[i].icon} 
                                    />
                                    <label 
                                        style={{'padding': '3px', 'margin': '0', 'fontSize': 14,
                                            lineHeight: 'normal', 'position': 'relative',
                                            'marginRight': '5px', 'marginTop': '-2px',
                                            'paddingRight': '1px', 'cursor': 'pointer',
                                        }}
                                        htmlFor={nodoActual[i].value}>
                                        <Icon style={{'display': 'block', 'fontWeight': 'bold'}} 
                                            type={
                                                (nodoActual[i].icon)?'right':'down'
                                            } 
                                        />
                                    </label>
                                    {nodoActual[i].codigo}
                                    &nbsp;&nbsp;
                                    {nodoActual[i].title}

                            </label>

                            <Dropdown overlay={
                                <Menu style={{padding: 3}}>
                                    <Menu.Item key="0"
                                        onClick={this.onAdicionar.bind(this, nodoActual[i])}
                                    >
                                        Adicionar Cuenta
                                    </Menu.Item>
                                    <Menu.Item key="1"
                                        onClick={this.onEditar.bind(this, nodoActual[i])}
                                    >
                                        Editar Cuenta
                                    </Menu.Item>
                                    <Menu.Item key="2"
                                        onClick={this.onDelete.bind(this, nodoActual[i])}
                                    >
                                        Eliminar Cuenta
                                    </Menu.Item>
                                </Menu>
                            } 

                                trigger={['click']} visible={nodoActual[i].visible}
                                    onVisibleChange={this.onClickDropDownMenu.bind(this, nodoActual[i])}>
                                <Icon type="more"
                                    style={{padding: 0, position: 'relative',
                                        left: 10, top: -1, paddingTop: 3, paddingBottom: 3,
                                        cursor: 'pointer',}}
                                />
                            </Dropdown>
                            
                        </div>
                    </div>
                );
                
            }

            this.recorridoEnPreOrden(nodoActual[i].children, recorrido, contador + 1);
        }
    }
    getTipoCuenta() {
        httpRequest('get', ws.wscuentaplan + '/get_tipo_cuenta').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        arraytipocuenta: response.data,
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
    cantidadDigito(size) {
        var dig = 1;
        for (let i = 0; i < size; i++) {
            dig = dig*10;
        }
        return dig;
    }
    onAdicionar(data) {
        data.visible = !data.visible;
        
        var arraycodigo = data.codigo.split('.');
        var nivel = data.nivel;

        var arrayformato = this.state.config.formato.split('.');

        if (nivel < arrayformato.length) {

            var cantidadChildren = data.children.length + 1;
            
            var sizeformato = arrayformato[nivel].toString().length;
            var sizechildren = cantidadChildren.toString().length;

            if (cantidadChildren < this.cantidadDigito(sizeformato)) {

                var formato = cantidadChildren;

                for (let i = sizechildren; i < sizeformato; i++) {
                    formato = '0' + formato;
                }

                var nuevocodigo = '';

                for (let i = 0; i < arraycodigo.length; i++) {
                    if (i == nivel) {
                        if (i == arraycodigo.length - 1) {
                            nuevocodigo = nuevocodigo + formato;
                        }else {
                            nuevocodigo = nuevocodigo + formato + '.';
                        }
                    }else {
                        if (i == arraycodigo.length - 1) {
                            nuevocodigo = nuevocodigo + arraycodigo[i];
                        }else {
                            nuevocodigo = nuevocodigo + arraycodigo[i] + '.';
                        }
                    }
                } //esctadetalle

                if (nivel == (arrayformato.length - 1)) {
                    this.state.esctadetalle = 'S';
                }
                
                this.setState({
                    familiacuenta: this.state.familiacuenta,
                    bandera: 3,
                    visible: true,
                    cuentaplan: data,
                    codigo: formato,
                    codigoOrigen: nuevocodigo,
                    nivel: parseInt(nivel),
                    esctadetalle: this.state.esctadetalle,
                });

            }else {
                this.setState({
                    familiacuenta: this.state.familiacuenta,
                });
                message.warning('Limite excedido');
            }

        }else {
            this.setState({
                familiacuenta: this.state.familiacuenta,
            });
            message.warning('nivel no habilitado!!!');
        }
    }
    onEditar(data) {
        data.visible = !data.visible;
        
        var arraycodigo = data.codigo.split('.');
        var nivel = data.nivel - 1;

        //this.getTipoCuenta();
        this.setState({
            familiacuenta: this.state.familiacuenta,
            bandera: 4,
            visible: true,
            cuentaplan: data,
            codigoOrigen: data.codigo,
            codigo: arraycodigo[nivel],
            nombre: data.title,
            nivel: nivel,
        });
    }
    onDelete(data) {
        data.visible = !data.visible;
        this.setState({
            familiacuenta: this.state.familiacuenta,
            bandera: 5,
            visible: true,
            cuentaplan: data,
        });
    }
    onClickDropDownMenu(nodoActual) {
        nodoActual.visible = !nodoActual.visible;
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    onContraerArbol(data) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idpadre == null) {
                data[i].icon = true;
                this.cargarTreeNode(data[i].children, data[i].icon);
            }
        }
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    onExpandirArbol(data) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idpadre == null) {
                data[i].icon = false;
                this.cargarTreeNode(data[i].children, data[i].icon);
            }
        }
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    onClose() {
        this.setState({
            visible: false,
            bandera: 0,
            loading: false,
            nombre: '',
            idtipo: '',
            codigo: '',
            codigoOrigen: '',
            esctadetalle: 'N',
        });
    }
    componentArrayTipocuenta() {
        var array = [];
        array.push(
            <Option key={-1} value=""> Seleccionar </Option>
        );
        this.state.arraytipocuenta.map(
            (data, key) => {
                array.push(
                    <Option key={key} value={data.idcuentaplantipo}> {data.descripcion} </Option>
                );
            }
        );
        return array;
    }
    addCuentaPlan(event) {
        event.preventDefault();

        var arrayformato = this.state.config.formato.split('.');
        var sizeformato = arrayformato[this.state.nivel].toString().length;
        
        var sizecodigo = this.state.codigo.toString().length;

        var formato = this.state.codigo;

        for (let i = sizecodigo; i < sizeformato; i++) {
            formato = '0' + formato;
        }

        var arraycodigo = this.state.codigoOrigen.split('.');
        arraycodigo[this.state.nivel] = formato;
        var nuevocodigo = '';
        for (let i = 0; i < arraycodigo.length; i++) {
            if (i == arraycodigo.length - 1) {
                nuevocodigo = nuevocodigo + arraycodigo[i];
            }else {
                nuevocodigo+= arraycodigo[i] + '.';
            }
        }

        if (this.state.nombre.toString().trim().length > 0) {
            var objeto = {
                idpadre: this.state.cuentaplan.value,
                idcuentatipo: this.state.cuentaplan.idcuentatipo,
                nombre: this.state.nombre,
                codigo: nuevocodigo,
                esctadetalle: this.state.esctadetalle,
            }
            this.setState({
                loading: true,
            });
            httpRequest('post', ws.wscuentaplan + '/store', objeto).then(
                response => {
                    if (response.response == 1) {
                        this.setState({
                            data: response.data,
                        });
                        this.cargarTree(response.data);
                        message.success('Exito en ingresar cuenta!!!')
                    }
                    if (response.response == -2) {
                        this.setState({ noSesion: true })
                    }
                    if (response.response == 0) {
                        message.error('El codigo ya existe!!!');
                        this.setState({
                            loading: false,
                        });
                    }else {
                        this.onClose()
                    }
                }
            ).catch(
                error => console.log(error)
            );
        }else {
            message.error('Nombre cuenta requerido!!!');
        }
    }

    updateCuentaPlan(event) {
        event.preventDefault();

        var arrayformato = this.state.config.formato.split('.');
        var sizeformato = arrayformato[this.state.nivel].toString().length;
        
        var sizecodigo = this.state.codigo.toString().length;

        var formato = this.state.codigo;

        for (let i = sizecodigo; i < sizeformato; i++) {
            formato = '0' + formato;
        }

        var arraycodigo = this.state.codigoOrigen.split('.');
        arraycodigo[this.state.nivel] = formato;
        var nuevocodigo = '';
        for (let i = 0; i < arraycodigo.length; i++) {
            if (i == arraycodigo.length - 1) {
                nuevocodigo = nuevocodigo + arraycodigo[i];
            }else {
                nuevocodigo+= arraycodigo[i] + '.';
            }
        }

        if (this.state.nombre.toString().trim().length > 0) {
            var objeto = {
                id: this.state.cuentaplan.value,
                nombre: this.state.nombre,
                codigo: nuevocodigo,
                codigooriginal: this.state.cuentaplan.codigo,
            }
            this.setState({
                loading: true,
            });
            httpRequest('post', ws.wscuentaplan + '/update', objeto).then(
                response => {
                    if (response.response == 1) {
                        this.setState({
                            data: response.data,
                        });
                        this.cargarTree(response.data);
                        message.success('Exito en editar cuenta!!!')
                    }
                    if (response.response == -2) {
                        this.setState({ noSesion: true })
                    }
                    if (response.response == 0) {
                        message.error('El codigo ya existe!!!');
                        this.setState({
                            loading: false,
                        });
                    }else {
                        this.onClose()
                    }
                }
            ).catch(
                error => console.log(error)
            );
        }else {
            message.error('Nombre cuenta requerido!!!');
        }

    }
    deleteCuentaPlan(event) {
        event.preventDefault();
        var objeto = {
            id: this.state.cuentaplan.value,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscuentaplan + '/delete', objeto).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                    });
                    this.cargarTree(response.data);
                    message.success('Exito en eliminar cuenta!!!')
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
                    title = "Confirmacion de Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de cargar datos por defecto?</label>
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                   onClick={this.cargarPorDefecto.bind(this)}
                />
            );
        } 
        if (this.state.bandera == 2) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Confirmacion de Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de vaciar datos?</label>
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                   onClick={this.vaciarDatos.bind(this)}
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Nuevo Sub Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{marginTop: -10}}
                        >
                            <C_Input 
                                title='Codigo Original'
                                value={this.state.codigoOrigen}
                                readOnly={true}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            <C_Input 
                                title='Codigo'
                                value={this.state.codigo}
                                onChange={this.onchangeCodigo.bind(this)}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            <C_Input 
                                title='Nombre'
                                value={this.state.nombre}
                                onChange={this.onChangeNombre.bind(this)}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            {/* <C_Select 
                                value={this.state.idtipo} 
                                onChange={this.onchangeIDTipo.bind(this)}
                                title='Tipo Cuenta'
                                component={this.componentArrayTipocuenta()}
                            /> */}
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                    onClick={this.addCuentaPlan.bind(this)}
                />
            );
        }
        if (this.state.bandera == 4) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Editar Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{marginTop: -10}}
                        >
                            <C_Input 
                                title='Codigo Original'
                                value={this.state.codigoOrigen}
                                readOnly={true}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            {(this.state.cuentaplan.cuenta > 0)?null:
                                <C_Input 
                                    title='Codigo'
                                    value={this.state.codigo}
                                    onChange={this.onchangeCodigo.bind(this)}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                                />
                            }

                            <C_Input 
                                title='Nombre'
                                value={this.state.nombre}
                                onChange={this.onChangeNombre.bind(this)}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                    onClick={this.updateCuentaPlan.bind(this)}
                />
            );
        }
        if (this.state.bandera == 5) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Confirmacion de Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de eliminar la cuenta?</label>
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                    onClick={this.deleteCuentaPlan.bind(this)}
                />
            );
        } 
    }
    vaciarDatos(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscuentaplan + '/vaciar').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                    });
                    this.cargarTree(response.data);
                    message.success('Exito en vaciar datos!!!');
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
                if (response.response == 0) {
                    message.warning('No permitido ya que hiciste transaccion');
                }
                this.onClose();
            }
        ).catch(
            error => console.log(error)
        );
    }
    generarPDF(event) {
        event.preventDefault();
        document.getElementById('imprimir').submit();
    }
    generarExcel(event) {
        event.preventDefault();
        this.setState({
            value: 'E',
        });
        setTimeout(() => {
            document.getElementById('imprimir').submit();
        }, 500);
    }
    onClickVaciar(event) {
        event.preventDefault();
        this.setState({
            bandera: 2,
            visible: true,
        });
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
            )
        }
        var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        return (
            <div className='rows'>
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Plan de cuentas</h1>
                        </div>

                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0 scrollbars' 
                            id={`styles-scrollbar${colors}`} style={{border: '1px solid #e8e8e8'}}
                        >
                            {this.vistaPlanCuenta()}
                        </div>

                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='txts-center'>
                                <C_Button title='Expandir'
                                    type='primary'
                                    onClick={this.onExpandirArbol.bind(this, this.state.familiacuenta)}
                                />
                                <C_Button title='Contraer'
                                    type='primary'
                                    onClick={this.onContraerArbol.bind(this, this.state.familiacuenta)}
                                />
                                <C_Button title='Imprimir PDF'
                                    type='primary'
                                    onClick={this.generarPDF.bind(this)}
                                    permisions={this.permisions.btn_imprimir_pdf}
                                />
                                <C_Button title='Exportar EXCEL'
                                    type='primary'
                                    onClick={this.generarExcel.bind(this)}
                                    permisions={this.permisions.btn_export_excel}
                                />
                            </div>
                            <form action={routes.cuentaplan + '/reporte'} target="_blank" method='post'
                                id='imprimir' style={{display: 'none',}}>
                                <input type="hidden" value={_token} name="_token" />
                                <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                <input type="hidden" value={x_login} name="x_login" />
                                <input type="hidden" value={x_fecha} name="x_fecha" />
                                <input type="hidden" value={x_hora} name="x_hora" />
                                <input type="hidden" value={x_connection} name="x_conexion" />
                                <input type="hidden" value={token} name="authorization" />
                                <input type='hidden' value={this.state.value} name='value' />
                                <input type='hidden' value={usuario} name='usuario' />

                                <input type='hidden' value={JSON.stringify(this.state.familiacuenta)} name='cuenta' />
                            </form>
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='txts-center'>
                                {/*<C_Button title='Importar'
                                    type='primary'
                                    permisions={this.permisions.btn_importar}
                                />*/}
                                <C_Button title='Por defecto'
                                    type='primary'
                                    onClick={this.onClickPorDefecto.bind(this)}
                                    permisions={this.permisions.btn_por_defecto}
                                />
                                <C_Button title='Vaciar'
                                    type='primary'
                                    onClick={this.onClickVaciar.bind(this)}
                                    permisions={this.permisions.btn_vaciar}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}