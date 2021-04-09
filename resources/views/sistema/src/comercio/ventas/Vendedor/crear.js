
import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import { message, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import CImage from '../../../componentes/image';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import PropTypes from 'prop-types';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import C_CheckBox from '../../../componentes/data/checkbox';
const {Option} = Select;

class CreateVendedor extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            timeoutSearch: undefined,

            codigo: '',
            idcomision: '',
            valor_comision: '',
            nit: '',
            fechanacimiento: '',
            nombre: '',
            apellido: '',
            genero: 'N',
            array_contacto_select: ['', '', ''],
            array_contacto_descripcion: ['', '', ''],
            imagen: '',
            nota: '',
            name_imagen: '',

            validar_codigo: 1,
            
            array_contacto: [],
            array_comision: [],
            array_usuario: [],

            config_codigo: false,
            cliente_es_abogado: '',

            checked_usuario: false,
            idusuario: '',
            
            noSesion: false,
        }

        this.permisions = {
            codigo: readPermisions(keys.vendedor_input_codigo),
            comision: readPermisions(keys.vendedor_select_comision),
            nit: readPermisions(keys.vendedor_input_nit),
            fecha_nac: readPermisions(keys.vendedor_fechaNacimiento),
            nombre: readPermisions(keys.vendedor_input_nombre),
            apellido: readPermisions(keys.vendedor_input_apellido),
            genero: readPermisions(keys.vendedor_select_genero),
            caracteristicas: readPermisions(keys.vendedor_caracteristicas),
            imagen: readPermisions(keys.vendedor_imagenes),
            notas: readPermisions(keys.vendedor_textarea_nota)
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        this.setState({
            cliente_es_abogado: (isAbogado == 'A') ? 'Abogado' : 'Vendedor',
        });

        httpRequest('get', ws.wsvendedor + '/create')
        .then((result) => {
            if (result.response == 1) {
                console.log(result)
                this.setState({
                    idcomision: (result.comision.length > 0)?result.comision[0].idcomisionventa:'',
                    valor_comision: (result.comision.length > 0)?result.comision[0].valor:'',

                    array_contacto: result.referencia_contacto,
                    array_comision: result.comision,
                    array_usuario: result.usuarios,

                    config_codigo: (result.config == null)?false:result.config.codigospropios,
                    cliente_es_abogado: (result.config == null)? '': (result.config.clienteesabogado)?'Abogado':'Vendedor',
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
    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodvendedorvalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1 });
                    } else {
                        this.setState({ validar_codigo: 0 });
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({ validar_codigo: 1 })
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
    onChangeCodigo(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigo: event,
        });
    }
    onChangeIDComision(event) {
        let data = this.state.array_comision;
        let valor_comision = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i].idcomisionventa == event) {
                valor_comision = data[i].valor;
                break;
            }
        }
        this.setState({
            idcomision: event,
            valor_comision: valor_comision,
        });
    }
    onChangeNit(event) {
        this.setState({
            nit: event,
        });
    }
    onChangeFechaNacimiento(event) {
        let dateReference = new Date();

        dateReference.setFullYear(dateReference.getFullYear() - 18);
        dateReference.getDate(dateReference.getDate() - 1);
        let dateNac = stringToDate(event, 'f2');

        if (dateReference < dateNac) {
            message.error('El ' + this.state.cliente_es_abogado + ' debe ser mayor de edad');
        } else {
            this.setState({
                fechanacimiento: event,
            });
        }
    }
    onchangeNombre(event) {
        this.setState({
            nombre: event,
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event,
        });
    }
    onChangeGenero(event) {
        this.setState({
            genero: event,
        });
    }
    handleAddRow() {
        this.state.array_contacto_select.push('');
        this.state.array_contacto_descripcion.push("");
        this.setState({
            array_contacto_select: this.state.array_contacto_select,
            array_contacto_descripcion: this.state.array_contacto_descripcion,
        });
    }
    handleRemoveRow(index) {
        this.state.array_contacto_descripcion.splice(index, 1);
        this.state.array_contacto_select.splice(index, 1);
        this.setState({
            array_contacto_descripcion: this.state.array_contacto_descripcion,
            array_contacto_select: this.state.array_contacto_select,
        });
    }
    onChangeSelectContacto(event) {
        let index = event.id;
        let valor = event.value;
        if (valor == "") {
            this.state.array_contacto_descripcion[index] = "";
        }
        this.state.array_contacto_select[index] = valor;
        this.setState({
            array_contacto_select: this.state.array_contacto_select,
            array_contacto_descripcion: this.state.array_contacto_descripcion,
        });
    }
    onChangeDescripcionContacto(event) {
        let index = event.id;
        let value = event.value;
        if (this.state.array_contacto_select[index] == "") {
            message.warning('Seleccione una opcion para poder seguir ');
            return;
        }
        this.state.array_contacto_descripcion[index] = value;
        this.setState({
            array_contacto_descripcion: this.state.array_contacto_descripcion
        });
    }
    onChangeImagen(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    imagen: e.target.result,
                    name_imagen: files[0].name,
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }
    onchangeNota(event) {
        this.setState({
            nota: event,
        });
    }
    deleteImagen() {
        this.setState({
            imagen: ''
        });
    }
    array_comision() {
        let data = this.state.array_comision;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option  key={i} value={data[i].idcomisionventa} >
                    {data[i].descripcion + '  -  ' + data[i].valor + '%'}
                </Option>
            );
        }
        return array;
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        })
    }
    onSalir(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var objecto_data = {
                    on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                    data_actual: this.validar_data(on_data.data_actual)?on_data.data_actual:null,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
            this.props.history.goBack();
        }, 400);
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    getIndexSeleccionadosReferencias(arrayRef, arrayVal) {
        let dataR = this.state.array_contacto_select;
        let dataV = this.state.array_contacto_descripcion;
        for (let i = 0; i < dataR.length; i++) {
            if (dataV[i] !== "") {
                arrayRef.push(dataR[i]);
                arrayVal.push(dataV[i]);
            }
        }
    }
    onSubmit() {
        this.setState({
            loading: true,
        });
        let dataValues = [];
        let dataReferencias = [];
        this.getIndexSeleccionadosReferencias(dataReferencias, dataValues);
        let body = {
            codvendedor: this.state.codigo,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            nit: this.state.nit,
            sexo: this.state.genero,
            fechanac: (this.state.fechanacimiento == '')?'':convertDmyToYmd(this.state.fechanacimiento),
            idcomision: this.state.idcomision,
            notas: this.state.nota,
            foto: this.state.imagen,
            namefoto: this.state.name_imagen,
            dataValues: JSON.stringify(dataValues),
            dataReferencias: JSON.stringify(dataReferencias),
            isusuario: this.state.checked_usuario,
            idusuario: this.state.idusuario
        };
        httpRequest('post', ws.wsvendedor, body)
        .then((result) => {
            if (result.response == 1) {

                var on_data = JSON.parse( readData(keysStorage.on_data) );
                if (this.validar_data(on_data)) {
                    var bandera = this.validar_data(on_data.data_actual)?true:false;
                    var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;

                    if (bandera) {
                        var apellido = (result.vendedor.apellido == null)?'':result.vendedor.apellido;

                        data_actual.idvendedor = result.vendedor.idvendedor;
                        data_actual.comision_vendedor = this.state.valor_comision;
                        data_actual.vendedor = result.vendedor;
                        data_actual.nombremesero = result.vendedor.nombre + ' ' + apellido;
                    }
                    var objecto_data = {
                        on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                        data_actual: (bandera)?data_actual:null,
                        validacion: true,
                    };
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                }


                message.success(result.message);
                this.props.history.goBack();

            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                message.error(result.message);
            }
            this.onClose();
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    componenetOption() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title={'Cancelar registro ' + this.state.cliente_es_abogado}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de cancelar los registros?
                                Los datos ingresados se perderan...
                            </label>
                        </div>
                    }
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title={'Registro de ' + this.state.cliente_es_abogado}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSubmit.bind(this)}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de registrar los datos?
                            </label>
                        </div>
                    }
                />
            );
        }
    }
    onChangeCheckedUsuario() {
        this.setState({
            checked_usuario: !this.state.checked_usuario,
        });
    }
    onChangeIDUsuario(value) {
        let data = this.state.array_usuario;
        let nombre = '';
        let apellido = '';
        let genero = 'N';
        let imagen = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i].idusuario == value) {
                nombre = data[i].nombre;
                apellido = data[i].apellido == null ? '' : data[i].apellido;
                genero = data[i].sexo;
                imagen = data[i].foto;
                break;
            }
        }
        this.setState({
            idusuario: value,
            nombre: nombre,
            apellido: apellido,
            genero: genero,
            imagen: imagen,
        })
    }
    get_usuario() {
        httpRequest('get', ws.wsvendedor + '/get_usuario')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_usuario: result.data
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
            console.log(error)
            message.error(strings.message_error);
        });
    }
    searchUserById(value) {
        if (value.toString().trim().length > 0) {
            httpRequest('get', ws.wssearchusuarioid + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        array_usuario: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            })
            .catch((error) => {
                console.log(error);                
                message.error(strings.message_error);
            })
        } else {
            this.get_usuario();
        }
    }
    searchUserByNom(value) {
        if (value.toString().trim().length > 0) {
            httpRequest('get', ws.wssearchusuarionom + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        array_usuario: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.get_usuario();
        }
    }
    handleSearchUserById(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchUserById(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    handleSearchUserByNom(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchUserByNom(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onDeleteUsuario(){
        this.setState({
            idusuario: '',
            nombre: '',
            apellido: '',
            genero: 'N',
            imagen: ''
        })
    }
    componentIsUsuario() {
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        if (isAbogado == 'A') {
            const componentIDUsuario = this.componentIDUsuario();
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        value='Es Usuario: '
                        readOnly={true}
                        style={{cursor: 'pointer', 
                            background: 'white',
                        }}
                        onClick={this.onChangeCheckedUsuario.bind(this)}
                        suffix={
                            <C_CheckBox
                                onChange={this.onChangeCheckedUsuario.bind(this)}
                                checked={this.state.checked_usuario}
                                style={{marginTop: -3, left: 5}}
                            />
                        }
                    />
                    <C_Select
                        showSearch={true}
                        value={this.state.idusuario}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleSearchUserById.bind(this)}
                        onChange={this.onChangeIDUsuario.bind(this)}
                        component={componentIDUsuario}
                        title="Id Usuario"
                        onDelete={this.onDeleteUsuario.bind(this)}
                        allowDelete={(this.state.idusuario == '')?false:true}
                        readOnly={!this.state.checked_usuario}
                    />
                    <C_Select
                        showSearch={true}
                        value={this.state.idusuario}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleSearchUserByNom.bind(this)}
                        onChange={this.onChangeIDUsuario.bind(this)}
                        component={this.componentNameUsuario()}
                        title="Nombre Usuario"
                        onDelete={this.onDeleteUsuario.bind(this)}
                        allowDelete={(this.state.idusuario == '')?false:true}
                        readOnly={!this.state.checked_usuario}
                        className={'cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'}
                    />
                </div>
            );
        }
        return null;
    }
    componentIDUsuario() {
        let data = this.state.array_usuario;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idusuario} >
                    {data[i].idusuario}
                </Option>
            );
        }
        return array;
    }
    componentNameUsuario() {
        let data = this.state.array_usuario;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            array.push(
                <Option key={i} value={data[i].idusuario} >{data[i].nombre + ' ' + apellido}</Option>
            );
        }
        return array;
    }
    validarData() {
        if ((this.state.codigo.toString().trim().length == 0 && this.state.config_codigo) || this.state.nombre.toString().trim().length == 0) {
            if (this.state.nombre.toString().trim().length == 0) {
                message.error('El nombre es obligatorio');
            }
            if (this.state.codigo.toString().trim().length == 0 && this.state.config_codigo) {
                message.error('El codigo es obligatorio');
            }
        }else {
            this.setState({
                visible: true,
                bandera: 2,
            });
        }
        
    }
    render() {
        const componentIsUsuario = this.componentIsUsuario();
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
                    <div className="forms-groups" style={{'marginTop': '-15px'}}>
                        <div className="pulls-left">
                            <h1 className="lbls-title">{'Registrar ' + this.state.cliente_es_abogado}</h1>
                        </div>
                    </div>
                    <div className="forms-groups">

                        { componentIsUsuario}

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input
                                title="Codigo"
                                value={this.state.codigo}
                                onChange={this.onChangeCodigo.bind(this)}
                                validar={this.state.validar_codigo}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.config_codigo}
                                mensaje='El codigo ya existe'
                            />
                            <C_Select 
                                title="Comision Venta"
                                value={this.state.idcomision}
                                onChange={this.onChangeIDComision.bind(this)}
                                component={this.array_comision()}
                                permisions={this.permisions.comision}
                            />
                            <C_Input
                                title="Nit/Ci"
                                value={this.state.nit}
                                onChange={this.onChangeNit.bind(this)}
                                permisions={this.permisions.nit}
                            />
                            <C_DatePicker
                                allowClear={true}
                                onChange={this.onChangeFechaNacimiento.bind(this)}
                                value={this.state.fechanacimiento}
                                title={'Fecha Nacimiento'}
                                permisions={this.permisions.fecha_nac}
                                readOnly={this.permisions.fecha_nac.editable == 'A' ? false : true}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1"></div>
                            <C_Input
                                title="Nombre"
                                value={this.state.nombre}
                                onChange={this.onchangeNombre.bind(this)}
                                permisions={this.permisions.nombre}
                            />
                            
                            <C_Input
                                title="Apellido"
                                value={this.state.apellido}
                                onChange={this.onChangeApellido.bind(this)}
                                permisions={this.permisions.apellido}
                                className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Select 
                                title='Genero'
                                value={this.state.genero}
                                onChange={this.onChangeGenero.bind(this)}
                                permisions={this.permisions.genero}
                                component={[
                                    <Option key={0} value="M">Masculino</Option>,
                                    <Option key={1} value="F">Femenino</Option>,
                                    <Option key={2} value="N">Ninguno</Option>
                                ]}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Caracteristica 
                                title="Referencia Para Contactarlo "
                                data={this.state.array_contacto}
                                onAddRow={this.handleAddRow.bind(this)}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.array_contacto_select}
                                onChangeSelect={this.onChangeSelectContacto.bind(this)}
                                valuesInput={this.state.array_contacto_descripcion}
                                onChangeInput={this.onChangeDescripcionContacto.bind(this)}
                                onDeleteRow={this.handleRemoveRow.bind(this)}
                                permisions={this.permisions.caracteristicas}
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.onChangeImagen.bind(this)}
                                    image={this.state.imagen}
                                    images={[]}
                                    delete={this.deleteImagen.bind(this)}
                                    style={{ height: 240, 
                                        'border': '1px solid transparent',
                                    }}
                                    permisions={this.permisions.imagen}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                title="Notas"
                                value={this.state.nota}
                                onChange={this.onchangeNota.bind(this)}
                                permisions={this.permisions.notas}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Guardar'
                                    type='primary'
                                    onClick={this.validarData.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({ visible: true, bandera: 1, })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateVendedor.propTypes = {
    id: PropTypes.number,
    bandera: PropTypes.number,
}

CreateVendedor.defaultProps = {
    id: 0,
    bandera: 0,
}

export default withRouter(CreateVendedor);

