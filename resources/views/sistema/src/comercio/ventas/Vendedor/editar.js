
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, convertDmyToYmd, convertYmdToDmy } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import Lightbox from 'react-image-lightbox';
import CImage from '../../../componentes/image';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import CSelect from '../../../componentes/select2';
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

const {Option} = Select;

let dateReference = new Date();
dateReference.setFullYear(dateReference.getFullYear() - 18);
export default class EditVendedor extends Component{

    constructor(props){
        super(props);
        this.state = {
            openImage: false,
            nro: 0,
            idvendedor: 0,
            codvendedor: '',
            nombre: '',
            apellido: '',
            sexo: 'N',
            nit: '',
            fechanac: '',
            idcomision: 0,
            notas: '',
            foto: null,
            estado: 'A',
            nameFoto: '',
            comisionventa: [],
            referencias: [],
            idsReferencias: [],
            dataReferencias: [],
            valuesSelectRef: [],
            valuesInputRef: [],

            idsRefActuales: [],
            dataValues: [],
            dataReferenciasNew: [],
            dataValuesNew: [],
            idsEliminados: [],
            indexNew: [],
            eliminarImagen: false,
            redirect: false,
            noSesion: false,
            configCodigo: false,
            configTitleVendedor: '',
            resultUsers: [],
            resultUsersDefault: [],
            isUsuario: false,
            valSearchUser: undefined,
            timeoutSearch: undefined,
            modalCancel: false,
            modalOk: false,
            loadingOk: false
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
        this.handleSexo = this.handleSexo.bind(this);
        this.handleNit = this.handleNit.bind(this);
        this.handleRefencias = this.handleRefencias.bind(this);
        this.handleComision = this.handleComision.bind(this);
        this.handleInputD = this.handleInputD.bind(this);
        this.handleFechaNac = this.handleFechaNac.bind(this);
        this.handleEstado = this.handleEstado.bind(this);
        this.updateVendedor = this.updateVendedor.bind(this);
        this.handleNotas = this.handleNotas.bind(this);
        this.selectImg = this.selectImg.bind(this);
        this.removeImg = this.removeImg.bind(this);
        this.addRowReferencias = this.addRowReferencias.bind(this);
        this.removeRowReferencia = this.removeRowReferencia.bind(this);
        this.onChangeIsUsuario = this.onChangeIsUsuario.bind(this);
        this.onDeleteUser = this.onDeleteUser.bind(this);
        this.onChangeSearchUser = this.onChangeSearchUser.bind(this);
        this.searchUserById = this.searchUserById.bind(this);
        this.searchUserByNom = this.searchUserByNom.bind(this);
        this.handleSearchUserById = this.handleSearchUserById.bind(this);
        this.handleSearchUserByNom = this.handleSearchUserByNom.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    validarData() {
        if (!this.validarDatos()) return;
        this.setState({
            modalOk: true
        })
    }

    onOkMO() {
        this.updateVendedor();
        this.setState({
            loadingOk: true
        })
    }

    onCancelMO() {
        this.setState({
            modalOk: false
        })
    }

    onOkMC() {
        this.setState({
            modalCancel: false,
            redirect: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
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
                    console.log('Ocurrio un problema en el servidor');
                }
            })
            .catch((error) => {
                console.log(error);                
                message.error(strings.message_error);
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
                    console.log('Ocurrio un problema en el servidor');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
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
            foto: foto,
            eliminarImagen: true
        })
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
        this.state.dataReferencias[index].idrc = valor;
        this.state.valuesSelectRef[index] = valor;
        this.setState({
            dataReferencias: this.state.dataReferencias,
            valuesSelectRef: this.state.valuesSelectRef
        });

    }

    handleInputD(event) {
        let index = event.id;
        let valor = event.value;
        if (this.state.dataReferencias[index].idrc == '') return;
        this.state.dataReferencias[index].valor = valor;
        this.state.valuesInputRef[index] = valor;
        this.setState({
            dataReferencias: this.state.dataReferencias,
            valuesInputRef: this.state.valuesInputRef
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
    
    handleEstado(value) {
        this.setState({
            estado: value
        });
    }

    componentImg() {
        
        if (this.state.foto == '' || this.state.foto == null) {
            return (
                <img 
                    src='/images/default.jpg'
                    alt="none" className="img-principal" />
            )
            
        } else {
            return (
                <img 
                    src={this.state.foto}
                    onClick={this.abrirImagen.bind(this)}
                    alt="none" className="img-principal" />
            )
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
            foto: '',
            nameFoto: 'deleteimg',
            eliminarImagen: true
        });
    }

    iconDelete() {
        
        if (this.state.foto !== '') {
            return (
                <i 
                    className="styleImg-content fa fa-trash" style={{'right': '5px'}}
                    onClick={() => this.removeImg() }>
                </i>
            )
        } else {
            return null;
        }
    }

    iconZoom() {
        if (this.state.foto !== '') {
            return (
                <i 
                    className="styleImg fa fa-search-plus" 
                    onClick={() => console.log('hola mundo')}> 
                </i>
            )
        } else {
            return null;
        }
    }

    selectImg(e) {
        let type = e.target.files[0].type;
        if (type !== "image/jpeg" && type !== "image/png") {
            this.setState({
                imagenNoValida: true
            });
        } else {
            this.setState({
                imagenNoValida: false
            });
            this.createImage(e.target.files[0]);
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

    getVendedor() {

        httpRequest('get', ws.wsvendedor + '/' + this.props.match.params.id + '/edit')
        .then((result) => {
            if (result.response == 1) {

                let array = [];
                let idsActuales = [];
                let longitud = result.referencias.length;
                let arr = [];
                let arr2 = [];
                for (let i = 0; i < longitud; i++) {
                    let object = {
                        idvc: result.referencias[i].idvendedorcontactarlo,
                        valor: result.referencias[i].valor,
                        idrc: result.referencias[i].idrefcontacto,
                    };
                    idsActuales.push(result.referencias[i].idvendedorcontactarlo);
                    array.push(object);
                    arr.push(result.referencias[i].idrefcontacto);
                    arr2.push(result.referencias[i].valor);
                }
                
                let vendedor = result.vendedor;
                let codigoVend = this.state.configCodigo ? vendedor.codvendedor : vendedor.idvendedor
                this.setState({
                    idvendedor: vendedor.idvendedor,
                    codvendedor: codigoVend,
                    nombre: vendedor.nombre,
                    apellido: vendedor.apellido,
                    foto: vendedor.foto,
                    sexo: vendedor.sexo,
                    fechanac: convertYmdToDmy(result.vendedor.fechanac),
                    idcomision: vendedor.fkidcomisionventa,
                    estado: vendedor.estado,
                    notas: (vendedor.notas == null)?'':vendedor.notas,
                    nit: vendedor.nit,
                    dataReferencias: array,
                    valuesSelectRef: arr,
                    valuesInputRef: arr2,
                    idsRefActuales: idsActuales,
                    nro: vendedor.idvendedor,
                    isUsuario: vendedor.fkidusuario == null ? false : true,
                    valSearchUser: vendedor.fkidusuario == null ? undefined : vendedor.fkidusuario,
                    resultUsers: result.usuarios,
                    resultUsersDefault: result.usuarios,
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
    }

    getReferencias(dataRef, dataVal, dataRefNew, dataValNew) {

        let i = 0;
        let array = this.state.dataReferencias;
        let length = array.length;
        while (i < length && array[i].idvc > 0) {
            if (array[i].valor != "") {
                dataRef.push(array[i].idrc);
                dataVal.push(array[i].valor);
            }
            i++;
        }

        while (i < length) {
            if (array[i].valor !== "") {
                dataRefNew.push(array[i].idrc);
                dataValNew.push(array[i].valor);
            }
            i++;
        }
    }

    validarDatos() {

        let nombre = this.state.nombre.trim();
        if (nombre.length === 0) {
            message.error('El nombre es obligatorio');
            return false;
        }
        return true;
    }

    updateVendedor(e) {

        let dataValues = [];
        let dataReferencias = [];
        let dataValuesNew = [];
        let dataReferenciasNew = [];
        this.getReferencias(dataReferencias, dataValues, dataReferenciasNew, dataValuesNew);
        let body = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            nit: this.state.nit,
            sexo: this.state.sexo,
            fechanac: (this.state.fechanac == '')?'':convertDmyToYmd(this.state.fechanac),
            idcomision: this.state.idcomision,
            estado: this.state.estado,
            notas: this.state.notas,
            foto: this.state.foto,
            namefoto: this.state.nameFoto,
            dataValues: JSON.stringify(dataValues),
            dataReferencias: JSON.stringify(dataReferencias),
            dataValuesNew: JSON.stringify(dataValuesNew),
            dataReferenciasNew: JSON.stringify(dataReferenciasNew),
            idsEliminados: JSON.stringify(this.state.idsEliminados),
            idsActualizar: JSON.stringify(this.state.idsRefActuales),
            eliminarImagen: this.state.eliminarImagen,
            isusuario: this.state.isUsuario,
            idusuario: this.state.valSearchUser
        };
        
        httpRequest('put', ws.wsvendedor + '/' + this.state.idvendedor, body)
        .then((result) => {
            
            if (result.response == 1) {
                message.success(result.message);
                this.setState({redirect: true, modalOk: false, loadingOk: false});
            } else if (result.response == -2) {
                this.setState({ noSesion: true, modalOk: false, loadingOk: false });
            } else {
                message.error(result.message);
                this.setState({
                    loadingOk: false,
                    modalCancel: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                loadingOk: false,
                modalCancel: false
            })
        })
        
    }

    removeRowReferencia(index) {

        let array = this.state.dataReferencias;
        if (array[index].idvc > 0) {
            this.state.idsEliminados.push(array[index].idvc);
            let position = this.state.idsRefActuales.indexOf(array[index].idvc);
            if (position >= 0) {
                this.state.idsRefActuales.splice(position, 1);
            }
        }

        this.state.dataReferencias.splice(index, 1);
        this.state.valuesInputRef.splice(index, 1);
        this.state.valuesSelectRef.splice(index, 1);
        this.setState({
            dataReferencias: this.state.dataReferencias,
            idsEliminados: this.state.idsEliminados,
            idsActuales: this.state.idsActuales,
            valuesSelectRef: this.state.valuesSelectRef,
            valuesInputRef: this.state.valuesInputRef
        });
    }

    getComisionVenta() {

        httpRequest('get', ws.wscomisionventa)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    comisionventa: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getReferenciaContactos() {

        httpRequest('get', ws.wsreferenciascont)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idreferenciadecontacto,
                        title: data[i].descripcion
                    });
                }
                this.setState({
                    referencias: arr
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
    }

    addRowReferencias() {
        let object = {
            valor: "",
            idvc: -1,
            idrc: 0
        };
        this.state.dataReferencias.push(object);
        this.setState({
            dataReferencias: this.state.dataReferencias,
            valuesSelectRef: [
                ...this.state.valuesSelectRef,
                ''
            ],
            valuesInputRef: [
                ...this.state.valuesInputRef,
                ""
            ]
        });
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getComisionVenta();
        this.getReferenciaContactos();
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getVendedor();
                this.setState({
                    configCodigo: result.configcliente.codigospropios,
                    configTitleVendedor: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    showConfirmUpdate() {

        if (!this.validarDatos()) return;
        const updateVendedor = this.updateVendedor.bind(this);
        Modal.confirm({
          title: 'Actualizar ' + this.state.configTitleVendedor,
          content: '¿Estas seguro de actualizar el ' + this.state.configTitleVendedor + '?',
          onOk() {
            console.log('OK');
            updateVendedor();
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
            title: 'Cancelar editar ' + this.state.configTitleVendedor,
            content: 'Los cambios realizados no se guardaran, ¿Desea continuar?',
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

    listaComisiones() {

        let data = this.state.comisionventa;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} 
                    id={data[i].idcomisionventa} 
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
        if (isAbogado == 'A') {
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
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.vendedor_index} />
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
                <Confirmation
                    visible={this.state.modalOk}
                    title="Editar Vendedor"
                    loading={this.state.loadingOk}
                    onCancel={this.onCancelMO}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de editar el vendedor?
                            </label>
                        </div>
                    ]}
                />
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Editar Vendedor"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar la actualizacion del vendedor?
                                Los datos modificados se perderan.
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">{'Editar ' + this.state.configTitleVendedor}</h1>
                        </div>
                    </div>
                    

                    <div className="forms-groups">

                        { componentIsUsuario }
                        
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <C_Input 
                                title={'Codigo ' + this.state.configTitleVendedor} 
                                value={this.state.codvendedor}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                            />

                            <C_Select 
                                title="Comision Venta"
                                value={this.state.idcomision}
                                onChange={this.handleComision}
                                component={listaComisiones}
                                readPermisions={this.permisions.comision}
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
                            />

                            <C_Select 
                                title='Genero'
                                value={this.state.sexo}
                                onChange={this.handleSexo}
                                readPermisions={this.permisions.genero}
                                component={[
                                    <Option key={0} value="M">Masculino</Option>,
                                    <Option key={1}  value="F">Femenino</Option>,
                                    <Option key={2} value="N">Ninguno</Option>
                                ]}
                            />

                            <C_Select 
                                title='Estado'
                                value={this.state.estado}
                                onChange={this.handleEstado}
                                permisions = {this.permisions.estado}
                                component={[
                                    <Option key={0} value="A">Activo</Option>,
                                    <Option key={1} value="N">No Activo</Option>
                                ]}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                            <C_Caracteristica 
                                title="Referencia Para Contactarlo "
                                data={this.state.referencias}
                                onAddRow={this.addRowReferencias}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.valuesSelectRef}
                                onChangeSelect={this.handleRefencias}
                                valuesInput={this.state.valuesInputRef}
                                onChangeInput={this.handleInputD}
                                onDeleteRow={this.removeRowReferencia}
                                permisions={this.permisions.caracteristicas}
                            />

                            <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.selectImg}
                                    image={this.state.foto}
                                    images={[]}
                                    //images={this.state.arrayImage}
                                    //next={this.next}
                                    //prev={this.prev}
                                    //index={this.state.indice}
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
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
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
                                    onClick={() => this.setState({ modalCancel: true })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


