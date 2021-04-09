
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate } from '../../../tools/toolsDate';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../../tools/toolsStorage';
import Lightbox from 'react-image-lightbox';
import CImage from '../../../components/image';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import CSelect from '../../../components/select2';
import PropTypes from 'prop-types';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_DatePicker from '../../../components/data/date';
import C_Caracteristica from '../../../components/data/caracteristica';
import C_TextArea from '../../../components/data/textarea';
import C_Button from '../../../components/data/button';
const {Option} = Select;

const URL_GET_COMSION_VENTA = '/commerce/api/comisionventa';
const URL_STORE_VENDEDOR = '/commerce/api/vendedor';

let dateReference = new Date();
dateReference.setFullYear(dateReference.getFullYear() - 18);

class CreateVendedor extends Component{

    constructor(props){
        super(props);
        this.state = {
            openImage: false,
            nro: 0,
            codvendedor: '',
            nombre: '',
            apellido: '',
            sexo: 'N',
            nit: '',
            fechanac: '',
            idcomision: 0,
            notas: '',
            foto: '',
            nameFoto: '',
            comisionventa: [],
            referencias: [],
            dataRefencias: [],
            dataValues: [],
            redirect: false,
            noSesion: false,
            configCodigo: false,
            configTitleVendedor: '',
            timeoutSearch: undefined,
            validarCodigo: 1,
            valSearchUser: undefined,
            timeoutSearch: undefined,
            resultUsers: [],
            resultUsersDefault: [],
            isUsuario: false,
            isAbogado: false,
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

        this.handleNombre = this.handleNombre.bind(this);
        this.handleApellido = this.handleApellido.bind(this);
        this.handleCodVendedor = this.handleCodVendedor.bind(this);
        this.handleSexo = this.handleSexo.bind(this);
        this.handleNit = this.handleNit.bind(this);
        this.handleRefencias = this.handleRefencias.bind(this);
        this.handleComision = this.handleComision.bind(this);
        this.handleInputD = this.handleInputD.bind(this);
        this.handleFechaNac = this.handleFechaNac.bind(this);
        this.storeVendedor = this.storeVendedor.bind(this);
        this.handleNotas = this.handleNotas.bind(this);
        this.selectImg = this.selectImg.bind(this);
        this.removeImg = this.removeImg.bind(this);
        this.addRowReferencia = this.addRowReferencia.bind(this);
        this.removeRowReferencia = this.removeRowReferencia.bind(this);
        this.searchUserById = this.searchUserById.bind(this);
        this.searchUserByNom = this.searchUserByNom.bind(this);
        this.handleSearchUserByNom = this.handleSearchUserByNom.bind(this);
        this.handleSearchUserById = this.handleSearchUserById.bind(this);
        this.onChangeSearchUser = this.onChangeSearchUser.bind(this);
        this.onDeleteUser = this.onDeleteUser.bind(this);
        this.onChangeIsUsuario = this.onChangeIsUsuario.bind(this);
    }

    onChangeIsUsuario(event) {
        this.setState({
            isUsuario: !this.state.isUsuario
        })
    }

    onDeleteUser(){
        this.setState({
            valSearchUser: undefined,
            nombre: '',
            apellido: '',
            sexo: '',
            foto: ''
        })
    }

    searchUserById(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchusuarioid + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultUsers: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultUsers: this.state.resultUsersDefault
                    });
                    console.log(result);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                resultUsers: this.state.resultUsersDefault
            });
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

    searchUserByNom(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchusuarionom + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultUsers: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultUsers: this.state.resultUsersDefault
                    });
                    console.log(result);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                resultUsers: this.state.resultUsersDefault
            });
        }
    }

    handleSearchUserByNom(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchUserByNom(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchUser(value) {
        let data = this.state.resultUsers;
        let length = data.length;
        let nombre = '';
        let apellido = '';
        let sexo = 'N';
        let foto = '';
        for (let i = 0; i < length; i++) {
            if (data[i].idusuario == value) {
                nombre = data[i].nombre;
                apellido = data[i].apellido == null ? '' : data[i].apellido;
                sexo = data[i].sexo;
                foto = data[i].foto;
                break;
            }
        }
        this.setState({
            valSearchUser: value,
            nombre: nombre,
            apellido: apellido,
            sexo: sexo,
            foto: foto
        })
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodvendedorvalido + '/' + value)
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

    handleCodVendedor(value) {
        this.handleVerificCodigo(value);
        this.setState({
            codvendedor: value
        });
    }

    handleNombre(value) {
        this.setState({
            nombre: value
        });
    }

    handleApellido(value) {
        this.setState({
            apellido: value
        });
    }

    handleNit(value) {
        this.setState({
            nit: value
        });
    }

    handleSexo(value) {
        this.setState({
            sexo: value
        });
    }

    handleComision(value) {
        this.setState({
            idcomision: value
        });
    }

    handleRefencias(event) {
        
        let index = event.id;
        let valor = event.value;
        if (valor == "") {
            this.state.dataValues[index] = "";
        }
        this.state.dataRefencias[index] = valor;
        this.setState({
            dataRefencias: this.state.dataRefencias
        });

    }
    
    handleInputD(event) {

        let index = event.id;
        let value = event.value;

        if (this.state.dataRefencias[index] == "") return;

        this .state.dataValues[index] = value;

        this.setState({
            dataValues: this.state.dataValues
        });
       
    }

    handleNotas(value) {
        this.setState({
            notas: value
        });
    }

    handleFechaNac(date) {
        let dateReference = new Date();
        dateReference.setFullYear(dateReference.getFullYear() - 18);
        dateReference.getDate(dateReference.getDate() - 1);
        let dateNac = stringToDate(date);
        if (dateReference < dateNac) {
            message.error('El ' + this.state.configTitleVendedor + ' debe ser mayor de edad');
        } else {
            this.setState({
                fechanac: date
            });
        }
    }

    abrirImagen() {
        this.setState({
            openImage: true,
        });
    }

    closeImagen() {
        this.setState({
            openImage: false,
        });
    }

    removeImg() {
        this.setState({
            foto: ''
        });
    }

    selectImg(event) {
        let type = event.target.files[0].type;
        if ((type !== "image/jpeg") && (type !== "image/png")) {
            this.setState({
                imagenNoValida: true
            });
        } else {
            this.setState({
                imagenNoValida: false
            });
            this.createImage(event.target.files[0]);
        }

    }

    createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                foto: e.target.result,
                nameFoto: file.name
            });
        };
        reader.readAsDataURL(file);
    }

    getIndexSeleccionadosReferencias(arrayRef, arrayVal) {
        let dataR = this.state.dataRefencias;
        let dataV = this.state.dataValues;
        for (let i = 0; i < dataR.length; i++) {
            if (dataV[i] !== "") {
                arrayRef.push(dataR[i]);
                arrayVal.push(dataV[i]);
            }
        }
    }

    async confirmStore() {
        return await Modal.confirm({
            title: 'Guardar ' + this.state.configTitleVendedor,
            content: '¿Esta seguro de registrar al ' + this.state.configTitleVendedor + '?',
            onOk() {
                console.log('OK');
                return true;
            },
            onCancel() {
                console.log('Cancel');
                return false;
            },
        });
                
    }

    validarDatos() {
        let codigo = this.state.codvendedor.trim();
        if (codigo.length === 0 && this.state.configCodigo) {
            message.error('El codigo es obligatorio');
            return false;
        }
        let nombre = this.state.nombre.trim();
        if (nombre.length === 0) {
            message.error('El nombre es obligatorio');
            return false;
        }
        
        return true;
    }

    storeVendedor(e) {
        let dataValues = [];
        let dataReferencias = [];
        this.getIndexSeleccionadosReferencias(dataReferencias, dataValues);
        let body = {
            codvendedor: this.state.codvendedor,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            nit: this.state.nit,
            sexo: this.state.sexo,
            fechanac: this.state.fechanac,
            idcomision: this.state.idcomision,
            notas: this.state.notas,
            foto: this.state.foto,
            namefoto: this.state.nameFoto,
            dataValues: JSON.stringify(dataValues),
            dataReferencias: JSON.stringify(dataReferencias),
            isusuario: this.state.isUsuario,
            idusuario: this.state.valSearchUser
        };

        httpRequest('post', URL_STORE_VENDEDOR, body)
        .then((result) => {
            console.log('VENDEDOR ==> ', result);
            if (result.response == 1) {
                message.success(result.message);
                if (this.props.bandera == 0) {
                    this.setState({redirect: true});
                }else {
                    if (this.validar(this.props.onSubmit)) {
                        this.limpiarElements();
                        this.props.onSubmit(result.data);
                    }
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
    }

    removeRowReferencia(index) {
        this.state.dataRefencias.splice(index, 1);
        this.state.dataValues.splice(index, 1);
        this.setState({
            dataRefencias: this.state.dataRefencias,
            dataValues: this.state.dataValues
        });
    }

    getComisionVenta() {
        httpRequest('get', URL_GET_COMSION_VENTA)
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                let id = result.data[0].idcomisionventa;
                this.setState({
                    comisionventa: result.data,
                    idcomision: id,
                    resultUsers: result.usuarios,
                    resultUsersDefault: result.usuarios,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getReferenciaContactos() {
        httpRequest('get', ws.wsreferenciascont)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0;i < length; i++) {
                    arr.push({
                        id: data[i].idreferenciadecontacto,
                        title: data[i].descripcion
                    });
                    if (i <= 2) {
                        this.state.dataRefencias.push("");
                        this.state.dataValues.push("");
                    }
                }
                this.setState({
                    referencias: arr,
                    dataRefencias: this.state.dataRefencias,
                    dataValues: this.state.dataValues
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    addRowReferencia() {
        this.state.dataRefencias.push('');
        this.state.dataValues.push("");
        this.setState({
            dataRefencias: this.state.dataRefencias,
            dataValues: this.state.dataValues,
        });
    }

    showConfirmStore() {
        if (!this.validarDatos()) return;
        const storeVendedor = this.storeVendedor.bind(this);
        Modal.confirm({
          title: 'Guardar ' + this.state.configTitleVendedor,
          content: '¿Estas seguro de registrar el ' + this.state.configTitleVendedor + '?',
          onOk() {
            console.log('OK');
            storeVendedor();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    limpiarElements() {
        this.setState({
            codvendedor: '',
            nit: '',
            fechanac: '',
            nombre: '',
            apellido: '',
            sexo: 'N',
            foto: '',
            notas: '',
            referencias: [],
            dataRefencias: [],
            dataValues: [],
            idcomision: 0,
        });
    }

    validar(data) {
        if (typeof data == 'undefined') {
            return false;
        }
        if (data == null) {
            return false;
        }
        return true;
    }

    redirect() {
        if (this.props.bandera == 0) {
            this.setState({ redirect: true});
        }else {
            if (this.validar(this.props.onCancel)) {
                this.limpiarElements();
                this.props.onCancel();
            }
        }
    }

    showConfirmCancel() {
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro del nuevo ' + this.state.configTitleVendedor + '?',
            content: 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?',
            okText: 'Si',
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

    componentDidMount() {
        this.getConfigsClient();
        if (this.props.bandera == 0) {
            this.getData();
        }
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios,
                    configTitleVendedor: isAbogado == 'A' ? 'Abogado' : 'Vendedor'
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getData() {
        this.getComisionVenta();
        this.getReferenciaContactos();
    }

    listaComisiones() {
        let data = this.state.comisionventa;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} 
                    value={data[i].idcomisionventa} 
                    >
                    {data[i].descripcion + '   -   ' + data[i].valor + '%'}
                </Option>
            );
        }
        return arr;
    }

    componentFechaNac() {
        if (this.permisions.fecha_nac.visible == 'A') {
            let disabled = this.permisions.fecha_nac.editable == 'A' ? false : true;
            return (
                <C_DatePicker 
                    allowClear={true}
                    value={this.state.fechanac}
                    onChange={this.handleFechaNac}
                    title="Fecha Nacimiento"
                    readOnly={disabled}
                />
            );
        }
        return null;
    }

    listUsersId() {
        let data = this.state.resultUsers;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idusuario} >{data[i].idusuario}</Option>
            );
        }
        return arr;
    }

    listUsersNom() {
        let data = this.state.resultUsers;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option key={i} value={data[i].idusuario} >{data[i].nombre + ' ' + apellido}</Option>
            );
        }
        return arr;
    }

    componentIsUsuario() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        if (isAbogado === 'A') {
            const listUsersId = this.listUsersId();
            const listUsersNom = this.listUsersNom();
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                        <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12">
                            <p>Es usuario:</p>
                        </div>
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <label className="checkboxContainer">
                                <input 
                                    type="checkbox"
                                    onChange={this.onChangeIsUsuario}
                                    checked={this.state.isUsuario}
                                />
                                <span className="checkmark">  </span>
                            </label>
                        </div>
                    </div>
                    <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                        <CSelect
                            showSearch={true}
                            value={this.state.valSearchUser}
                            placeholder={"Buscar por Id"}
                            style={{ width: '100%' }}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleSearchUserById}
                            onChange={this.onChangeSearchUser}
                            notFoundContent={null}
                            component={listUsersId}
                            title="Id Usuario"
                            allowClear={true}
                            onDelete={this.onDeleteUser}
                            allowDelete={true}
                            readOnly={!this.state.isUsuario}
                            //permisions={this.permisions.cli_cod}
                        />
                    </div>
                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                        <CSelect
                            showSearch={true}
                            value={this.state.valSearchUser}
                            placeholder={"Buscar por nombre"}
                            style={{ width: '100%' }}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleSearchUserByNom}
                            onChange={this.onChangeSearchUser}
                            notFoundContent={null}
                            component={listUsersNom}
                            title="Nombre Usuario"
                            allowClear={true}
                            onDelete={this.onDeleteUser}
                            allowDelete={true}
                            readOnly={!this.state.isUsuario}
                            //permisions={this.permisions.cli_cod}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {

        const keyCreateVendedor = readData(keysStorage.createvendedor);
        if (keyCreateVendedor == 'A') {
            this.getData();
            saveData(keysStorage.createvendedor, 'N');
        }
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/vendedor/index/"/>
            )
        }

        const listaComisiones = this.listaComisiones();
        const componentFechaNac = this.componentFechaNac();
        const componentIsUsuario = this.componentIsUsuario();
        return (
            <div className="rows">
                {(this.state.openImage)?
                    <Lightbox
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={this.state.foto}
                    />
                :''}
                <div className="cards">
                    <div className="forms-groups" style={{'marginTop': '-15px'}}>

                        <div className="pulls-left">
                            <h1 className="lbls-title">{'Registrar ' + this.state.configTitleVendedor}</h1>
                        </div>
                    </div>

                    <div className="forms-groups">

                        { componentIsUsuario }
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                           
                            <C_Input
                                title="Codigo"
                                value={this.state.codvendedor}
                                onChange={this.handleCodVendedor}
                                validar={this.state.validarCodigo}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.configCodigo}
                                mensaje='El codigo ya existe'
                            />

                            <C_Select 
                                title="Comision Venta"
                                value={this.state.idcomision}
                                onChange={this.handleComision}
                                component={listaComisiones}
                                permisions={this.permisions.comision}
                            />

                            <C_Input
                                title="Nit/Ci"
                                value={this.state.nit}
                                onChange={this.handleNit}
                                permisions={this.permisions.nit}
                            />

                            { componentFechaNac }
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-1 cols-md-1"></div>
                            
                            <C_Input
                                title="Nombre"
                                value={this.state.nombre}
                                onChange={this.handleNombre}
                                permisions={this.permisions.nombre}
                            />
                            
                            <C_Input
                                title="Apellido"
                                value={this.state.apellido}
                                onChange={this.handleApellido}
                                permisions={this.permisions.apellido}
                                className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                            />

                            <C_Select 
                                title='Genero'
                                value={this.state.sexo}
                                onChange={this.handleSexo}
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
                                data={this.state.referencias}
                                onAddRow={this.addRowReferencia}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.dataRefencias}
                                onChangeSelect={this.handleRefencias}
                                valuesInput={this.state.dataValues}
                                onChangeInput={this.handleInputD}
                                onDeleteRow={this.removeRowReferencia}
                                permisions={this.permisions.caracteristicas}
                            />

                            <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.selectImg}
                                    image={this.state.foto}
                                    images={[]}
                                    delete={this.removeImg}
                                    style={{ 
                                            height: 240, 
                                            'border': '1px solid transparent',
                                        }}
                                    permisions={this.permisions.imagen}
                                />
                                
                            </div>

                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                title="Notas"
                                value={this.state.notas}
                                onChange={this.handleNotas}
                                permisions={this.permisions.notas}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            />

                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Guardar'
                                    type='primary'
                                    onClick={this.showConfirmStore.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={this.showConfirmCancel.bind(this)}
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

export default CreateVendedor;

