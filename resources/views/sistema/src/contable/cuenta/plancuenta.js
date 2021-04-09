
import React, { Component } from 'react';

import { httpRequest, removeAllData, readData, saveData } from '../../utils/toolsStorage';
import {Redirect, withRouter} from 'react-router-dom';
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
import C_Tree from '../../componentes/data/tree';

const {Option} = Select;

//php artisan db:seed --class=\\Modules\\Commerce\\Database\\Seeders\\CuentaPlanEjemploTableSeeder

class Plan_de_Cuenta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            plan_cuenta: [],
            plan_cuenta_tree: [],
            familiacuenta: [],

            noSesion: false,
            height: 0,
            visible: false,
            visible_loading: false,
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
                id: 181,
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

    componentDidMount() {
        this.get_data();
    }

    get_data() {
        httpRequest('get', ws.wscuentaplan + '/index').then(
            response => {
                if (response.response == 1) {
                    var objecto = {
                        formato: (response.config == null)?'':response.config.formato,
                        nivel: (response.config == null)?'':response.config.numniveles,
                    }
                    this.setState({
                        config: objecto,
                        plan_cuenta: response.data,
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
                    tipocuenta: array[i].tipocuenta,
                    codigo: array[i].codcuenta,
                    title: array[i].nombre,
                    id: array[i].idcuentaplan,
                    idcuentatipo: array[i].fkidcuentaplantipo,

                    cuenta: parseInt(array[i].cuenta),
                    
                    visible: false,
                    nivel: 1,
                };
                array_aux.push(objeto);
            }
        }
        this.arbolFamilia(array_aux, 2);
        this.setState({
            plan_cuenta_tree: array_aux,
        });
    }
    arbolFamilia(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].id, contador);
            data[i].children = hijos;
            this.arbolFamilia(hijos, contador + 1);
        }
    }
    hijosFamilia(idpadre, contador) {
        var array =  this.state.plan_cuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    tipocuenta: array[i].tipocuenta,
                    codigo: array[i].codcuenta,
                    title: array[i].nombre,
                    id: array[i].idcuentaplan,
                    idcuentatipo: array[i].fkidcuentaplantipo,

                    cuenta: parseInt(array[i].cuenta),

                    visible: false,
                    nivel: contador,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
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
    onChangeNombre(event) {
        this.setState({
            nombre: event,
        });
    }
    onClickPorDefecto() {
        this.setState({
            bandera: 1,
            visible: true,
        });
    }
    onClickVaciar(event) {
        event.preventDefault();
        this.setState({
            bandera: 2,
            visible: true,
        });
    }
    cargarTreeNode(data, array) {
        for (let i = 0; i < data.length; i++) {
            array.push(data[i]);
            this.cargarTreeNode(data[i].children, array);
        }
    }
    generarPDF(event) {
        event.preventDefault();
        var array = [];
        this.cargarTreeNode(this.state.plan_cuenta_tree, array);
        this.setState({
            familiacuenta: array,
            visible_loading: true,
            loading: true,
        });
        setTimeout(() => {
            this.setState({
                visible_loading: false,
                loading: false,
            })
            document.getElementById('imprimir').submit();
        }, 1000);
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
                        plan_cuenta: response.data,
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
    vaciarDatos(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscuentaplan + '/vaciar').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        plan_cuenta: response.data,
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
                idpadre: this.state.cuentaplan.id,
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
                            plan_cuenta: response.data,
                        });
                        
                        message.success('Exito en registrar cuenta!!!');

                        var on_data = JSON.parse( readData(keysStorage.on_data) );
                        var bandera = false;
                        if (this.validar_keyStorage(on_data)) {
                            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                                if (on_data.on_create == 'plancuenta_create') {
                                    bandera = true;
                                    var data_actual = on_data.data_actual;
                                    response.cuenta.nivel = (this.state.cuentaplan.nivel * 1) + 1;
                                    data_actual.cuentaplan = response.cuenta;

                                    var objecto_data = {
                                        on_create: on_data.on_create,
                                        data_actual: data_actual,
                                        validacion: true,
                                    };
                                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                                }
                            }
                        }

                        if (bandera) {
                            setTimeout(() => {
                                this.props.history.goBack();
                            }, 300);
                            return;
                        }else {
                            this.cargarTree(response.data);
                        }

                    }
                    if (response.response == -2) {
                        this.setState({ noSesion: true, });
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
                id: this.state.cuentaplan.id,
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
                            plan_cuenta: response.data,
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
            id: this.state.cuentaplan.id,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscuentaplan + '/delete', objeto).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        plan_cuenta: response.data,
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

    cantidadDigito(size) {
        var dig = 1;
        for (let i = 0; i < size; i++) {
            dig = dig*10;
        }
        return dig;
    }
    onAdicionar(data) {
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
                    plan_cuenta_tree: this.state.plan_cuenta_tree,
                    bandera: 3,
                    visible: true,
                    cuentaplan: data,
                    codigo: formato,
                    codigoOrigen: nuevocodigo,
                    nivel: parseInt(nivel),
                    esctadetalle: this.state.esctadetalle,
                });

            }else {
                data.visible = !data.visible;
                this.setState({
                    plan_cuenta_tree: this.state.plan_cuenta_tree,
                });
                message.warning('Limite excedido');
            }

        }else {
            data.visible = !data.visible;
            this.setState({
                plan_cuenta_tree: this.state.plan_cuenta_tree,
            });
            message.warning('nivel no habilitado!!!');
        }
    }
    onEdit(data) {
        var arraycodigo = data.codigo.split('.');
        var nivel = data.nivel - 1;

        this.setState({
            plan_cuenta_tree: this.state.plan_cuenta_tree,
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
        this.setState({
            plan_cuenta_tree: this.state.plan_cuenta_tree,
            bandera: 5,
            visible: true,
            cuentaplan: data,
        });
    }
    validar_keyStorage(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
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


        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                if (on_data.on_create == 'plancuenta_create') {
                    bandera = true;
                }
            }
        }

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
                <Confirmation
                    visible={this.state.visible_loading}
                    title="PLAN DE CUENTA"
                    loading={this.state.loading}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Cargando Plan de cuenta...?
                            </label>
                        </div>
                    }
                />
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Plan de cuentas</h1>
                        </div>
                    </div>
                    <C_Tree 
                        data={this.state.plan_cuenta_tree}
                        showcodigo={true}
                        onDropDown={() => this.setState({ 
                                plan_cuenta_tree: this.state.plan_cuenta_tree 
                            })
                        }
                        onCreate={this.onAdicionar.bind(this)}
                        onEdit={this.onEdit.bind(this)}
                        onDelete={this.onDelete.bind(this)}
                    />
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
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
                            {bandera ? null : 
                                <C_Button title='Por defecto'
                                    type='primary'
                                    onClick={this.onClickPorDefecto.bind(this)}
                                    permisions={this.permisions.btn_por_defecto}
                                />
                            }
                            {bandera ? null : 
                                <C_Button title='Vaciar'
                                    type='primary'
                                    onClick={this.onClickVaciar.bind(this)}
                                    permisions={this.permisions.btn_vaciar}
                                />
                            }
                            {!bandera ? null : 
                                <C_Button title='Cancelar'
                                    type='primary'
                                    onClick={() => this.props.history.goBack()}
                                />
                            }
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
                </div>
            </div>
        )
    }
}

export default withRouter(Plan_de_Cuenta);
