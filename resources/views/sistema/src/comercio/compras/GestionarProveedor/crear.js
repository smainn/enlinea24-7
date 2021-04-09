import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';

import { TreeSelect, message, Modal, Spin, Icon } from 'antd';
import 'antd/dist/antd.css';

import Lightbox from 'react-image-lightbox';
import {Link} from 'react-router-dom';
import 'react-image-lightbox/style.css';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import Confirmation from '../../../componentes/confirmation';
import CImage from '../../../componentes/image';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_TextArea from '../../../componentes/data/textarea';
import strings from '../../../utils/strings';
import keysStorage from '../../../utils/keysStorage';

class CrearProveedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {

            openImage: false,

            redirect: false,
            visible: false,
            loadModal: false,
            inputInicio: true,

            validarNombre: 1,

            imagenProveedor: '',
            codigoProveedor: '',
            nitProveedor: '',
            nombreProveedor: '',
            apellidoProveedor: '',
            notaProveedor: '',
            descripcionProveedor: '',

            codigo: '',
            nombre: '',
            apellido: '',
            nit: '',
            nota: '',
            descripcion: '',

            ciudadProveedor: 0,

            ciudadCargadas: [],
            ciudades: [],

            items: [1, 2, 3],

            arrayProveedorContactarlo: ['', '', ''],
            arrayReferenciaDeContacto: ['', '', ''],

            referenciaContacto: [],
            validacion: [1, 1, 1, 1],

            InputFocusBlur: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            labelFocusBlur: [0, 1, 0, 0, 0, 0, 0, 0, 0],
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,
            modalCancel: false,
        }
        this.permisions = {
            verNro: readPermisions(keys.proveedor_ver_nro),
            verFecha: readPermisions(keys.proveedor_ver_fecha),
            codigo: readPermisions(keys.proveedor_input_codigo),
            nombre: readPermisions(keys.proveedor_input_nombre),
            apellido: readPermisions(keys.proveedor_input_apellido),
            nit: readPermisions(keys.proveedor_input_nit),
            ciudad: readPermisions(keys.proveedor_select_ciudad),
            caracteristicas: readPermisions(keys.proveedor_caracteristicas),
            imagenes: readPermisions(keys.proveedor_imagenes),
            notas: readPermisions(keys.proveedor_textarea_nota),
            descripciones: readPermisions(keys.proveedor_textarea_descripcion),
        }

        this.redirect = this.redirect.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.onChangeArrayReferenciaDeContacto = this.onChangeArrayReferenciaDeContacto.bind(this);
        this.onChangeArrayProveedorContactarlo = this.onChangeArrayProveedorContactarlo.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleRemoveRow = this.handleRemoveRow.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        this.props.history.goBack();
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    cargarReferencias(data) {
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push({
                id: data[i].idreferenciadecontacto,
                title: data[i].descripcion
            });
        }

        this.setState({
            referenciaContacto: arr
        });
    }

    componentDidMount() {

        this.getConfigsClient();

        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 600);

        if (this.props.aviso === 1) {
            this.getCiudad();
            this.getReferenciaContacto();
        } else {
            //httpRequest('g)
            httpRequest('get', ws.wsproveedorcreate)
            .then(result => {
                if (result.response === 1) {
                    this.cargarReferencias(result.referenciaContacto);
                    this.setState({
                        nro: result.nro,
                        ciudadCargadas: result.data,
                        //referenciaContacto: result.referenciaContacto,
                    });

                    var array = result.data;
                    var array_aux = [];
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].idpadreciudad == null) {
                            var elem = {
                                title: array[i].descripcion,
                                value: array[i].idciudad,
                            };
                            array_aux.push(elem);
                        }
                    }

                    this.arbolCiudad(array_aux);

                    this.setState({
                        ciudades: array_aux
                    });
                } else if (result.response == 0) {
                    console.log(result.message);
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }

            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            });
        }
    }
    
    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios
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
    
    getReferenciaContacto(){
        httpRequest('get', ws.wsreferenciascont)
        .then((result) => {
            this.cargarReferencias(result.data);
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getCiudad(){
        httpRequest('get', ws.wsciudad)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    ciudadCargadas: result.data
                });
    
                var array = result.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadreciudad == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idciudad,
                        };
                        array_aux.push(elem);
                    }
                }
    
                this.arbolCiudad(array_aux);
    
                this.setState({
                    ciudades: array_aux
                });
            }
            

        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    arbolCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijos(data[i].value);
            
            if (hijos.length > 0) {
                data[i].children = hijos;
            }
            this.arbolCiudad(hijos);
            
        }
    }

    redirect() {
        this.setState({redirect: true});
    }

    showCancelConfirm() {
        const redirect = this.redirect;
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro del nuevo proveedor?',
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

    hijos(idpadre) {
        var array =  this.state.ciudadCargadas;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadreciudad == idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idciudad
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodproveedorvalido + '/' + value)
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
                message.error(strings.message_error);
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

    onChangeCodigoProveedor(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigoProveedor: event,
            codigo: event,
        });
    }

    onChangeNitProveedor(event) {
        this.setState({
            nitProveedor: event,
            nit: event,
        });
    }

    onChangeNombreProveedor(event) {
        this.state.validarNombre = 1;
        this.setState({
            nombreProveedor: event,
            validarNombre: this.state.validarNombre,
            nombre: event,
        });
    }

    onChangeApellidoProveedor(event) {
        this.setState({
            apellidoProveedor: event,
            apellido: event,
        });
    }

    onChangeNotaProveedor(event) {
        this.setState({
            notaProveedor: event,
            nota: event,
        });
    }

    onChangeDescripcionProveedor(event) {
        this.setState({
            descripcionProveedor: event,
            descripcion: event,
        });
    }

    onChangeCiudadProveedor(value) {

        this.state.validacion[3] = 1;
        
        if (typeof value === 'undefined') {
            this.setState({
                ciudadProveedor: 0,
                validacion: this.state.validacion
            });
        }else {
            this.setState({
                ciudadProveedor: value,
                validacion: this.state.validacion
            });
        }
        
    }

    onChangeArrayReferenciaDeContacto(event) {
        this.state.arrayReferenciaDeContacto[event.id] = event.value;
        this.state.arrayProveedorContactarlo[event.id] = '';
        this.setState({
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo
        });
    }

    onChangeArrayProveedorContactarlo(event) {
        let posicion = event.id;
        this.state.arrayProveedorContactarlo[posicion] = event.value;
        
        this.setState({
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo
        });
    }

    handleAddRow() {
        //this.state.items.push(this.state.items.length + 1);
        this.state.arrayProveedorContactarlo.push('');
        this.state.arrayReferenciaDeContacto.push('');
        this.setState({
            //items: this.state.items,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
        });
    }

    handleRemoveRow(indice) {
        //this.state.items.splice(indice, 1);
        this.state.arrayProveedorContactarlo.splice(indice, 1);
        this.state.arrayReferenciaDeContacto.splice(indice, 1);
        this.setState({
            //items: this.state.items,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
        });
    }

    onChangeImagenProveedor(e) {
        
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.state.imagenProveedor = e.target.result;
                this.setState({
                    imagenProveedor: this.state.imagenProveedor,
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleRemoveImage() {
        //this.state.imagenProveedor = '';

        this.setState({
            imagenProveedor: ''
        });

    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    onSubmit(e) {
        e.preventDefault();
        
        if (this.state.nombreProveedor !== ''){
            let body = {
                codigoProveedor: this.state.codigo,
                nitProveedor: this.state.nit,
                nombreProveedor: this.state.nombre,
                apellidoProveedor: this.state.apellido,
                ciudadProveedor: this.state.ciudadProveedor,
                notaProveedor: this.state.nota,
                descripcionProveedor: this.state.descripcion,
                imagenProveedor: this.state.imagenProveedor,
                arrayReferencia: JSON.stringify(this.state.arrayReferenciaDeContacto),
                arrayContactarlo: JSON.stringify(this.state.arrayProveedorContactarlo)
            };
            this.setState({
                loadModal: true,
            });

            httpRequest('post', ws.wsproveedorstore, body)
            .then(result  => {
                if (result.response === 1) {
                    //console.log(result)
                    var on_data = JSON.parse( readData(keysStorage.on_data) );
                    if (this.validar_data(on_data)) {
                        var bandera = this.validar_data(on_data.data_actual)?true:false;
                        var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;
                        if (bandera) {
                            data_actual.idproveedor = result.proveedor.idproveedor;
                            data_actual.nitproveedor = (result.proveedor.nit == null)?'':result.proveedor.nit;
                            data_actual.array_proveedor.push(result.proveedor);
                        }
                        var objecto_data = {
                            on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                            data_actual: (bandera)?data_actual:null,
                            validacion: true,
                        };
                        saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                    }
                    setTimeout(() => {
                        this.props.history.goBack();
                        message.success('Datos guardados exitosamente');
                    }, 300);

                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            });

        }else {
            this.analizarValidacion();
        }
    }

    limpiarDatos() {
        this.setState({
            redirect: false,
            visible: false,
            loadModal: false,

            imagenProveedor: '',
            codigoProveedor: '',
            nitProveedor: '',
            nombreProveedor: '',
            apellidoProveedor: '',
            notaProveedor: '',
            descripcionProveedor: '',

            codigo: '',
            nombre: '',
            apellido: '',
            nit: '',
            nota: '',
            descripcion: '',

            ciudadProveedor: 0,

            items: [1, 2, 3],

            arrayProveedorContactarlo: ['', '', ''],
            arrayReferenciaDeContacto: ['', '', ''],

        });
    }

    analizarValidacion() {
        var bandera = 0;
        
        if (this.state.nombreProveedor === ''){
            this.state.validarNombre = 0;
            bandera = 1;
        }

        this.setState({
            visible: false,
            validarNombre: this.state.validarNombre
        });
        return bandera;
    }

    regresarListado() {
        if (this.props.aviso === 1) {
            this.props.callback({}, 0);
        } else {
            this.setState({
                redirect: true,
            });
        }
    }

    confirmarDatos(e) {
        //e.preventDefault();
        if (this.analizarValidacion() === 0) {
            this.setState({
                visible: !this.state.visible
            });
        }else {
            message.error('No se permite campo vacio ');
        }
    }

    handleCerrar() {
        this.setState({
            visible: false,
            loadModal: false,
        });
    }

    onChangeModalShow() {
        return (
            <Confirmation 
                visible={this.state.visible}
                loading={this.state.loadModal}
                onCancel={this.handleCerrar.bind(this)}
                title='Nuevo Proveedor'
                onClick={this.onSubmit.bind(this)}
                content='¿Estas seguro de guardas datos...?'
            />
        )
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
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

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }
        if (this.state.redirect){
            return (<Redirect to={routes.proveedor_index} />)
        }

        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="rows">
                {componentModalShow}
                {(this.state.openImage)?
                    <Lightbox 
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={this.state.imagenProveedor}
                    />
                :''}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Proveedor</h1>
                        </div>
                    </div>

                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Cancelar Crear Proveedor"
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de cancelar el registro del proveedor?
                                    Los datos ingresados se perderan.
                                </label>
                            </div>
                        ]}
                    />

                    <div className="forms-groups">
                        {/*<form onSubmit={this.confirmarDatos.bind(this)} encType="multipart/form-data">*/}
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                <C_Input
                                    value={this.state.codigoProveedor}
                                    onChange={this.onChangeCodigoProveedor.bind(this)}
                                    title='Codigo'
                                    validar={this.state.validarCodigo}
                                    permisions={this.permisions.codigo}
                                    configAllowed={this.state.configCodigo}
                                    mensaje='El codigo ya existe'
                                />
                                <C_Input 
                                    value={this.state.nombreProveedor}
                                    onChange={this.onChangeNombreProveedor.bind(this)}
                                    validar={this.state.validarNombre}
                                    title='Nombre*'
                                    permisions = {this.permisions.nombre}
                                />
                                <C_Input 
                                    value={this.state.apellidoProveedor}
                                    onChange={this.onChangeApellidoProveedor.bind(this)}
                                    title='Apellido*'
                                    permisions = {this.permisions.apellido}
                                />
                                <C_Input 
                                    value={this.state.nitProveedor}
                                    onChange={this.onChangeNitProveedor.bind(this)}
                                    title='Nit*'
                                    permisions = {this.permisions.nit}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-4 cols-md-4 cols-sm-4"></div>

                                <C_TreeSelect
                                    title="Ciudad*"
                                    value={(this.state.ciudadProveedor == 0)?'Seleccionar':this.state.ciudadProveedor}
                                    treeData={this.state.ciudades}
                                    placeholder="Seleccione una opcion"
                                    onChange={this.onChangeCiudadProveedor.bind(this)}
                                    permisions = {this.permisions.ciudad}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Caracteristica
                                    title="Referencia Para Contactarlo "
                                    data={this.state.referenciaContacto}
                                    onAddRow={this.handleAddRow}
                                    optionDefault="Seleccionar"
                                    valuesSelect={this.state.arrayReferenciaDeContacto}
                                    onChangeSelect={this.onChangeArrayReferenciaDeContacto}
                                    valuesInput={this.state.arrayProveedorContactarlo}
                                    onChangeInput={this.onChangeArrayProveedorContactarlo}
                                    onDeleteRow={this.handleRemoveRow}
                                    permisions = {this.permisions.caracteristicas}
                                />

                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <CImage
                                        onChange={this.onChangeImagenProveedor.bind(this)}
                                        image={this.state.imagenProveedor}
                                        images={[]}
                                        //images={this.state.arrayImage}
                                        //next={this.next}
                                        //prev={this.prev}
                                        //index={this.state.indice}
                                        delete={this.handleRemoveImage}
                                        style={{ 
                                                height: 240, 
                                                'border': '1px solid transparent',
                                            }}
                                        permisions = {this.permisions.imagenes}
                                        //permisions={permisionsFoto}
                                    />
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_TextArea 
                                    value={this.state.notaProveedor}
                                    onChange={this.onChangeNotaProveedor.bind(this)}
                                    title='Notas'
                                    permisions = {this.permisions.notas}
                                />
                                <C_TextArea 
                                    value={this.state.descripcionProveedor}
                                    onChange={this.onChangeDescripcionProveedor.bind(this)}
                                    title='Descripcion'
                                    permisions = {this.permisions.descripciones}
                                />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <div className="text-center-content">
                                    <C_Button
                                        title='Aceptar'
                                        type='primary'
                                        onClick={this.confirmarDatos.bind(this)}
                                    />
                                    <C_Button
                                        title='Cancelar'
                                        type='danger'
                                        onClick={() => this.setState({ modalCancel: true })}//this.showCancelConfirm.bind(this)}
                                    />
                                </div>
                            </div>
                        {/*</form>*/}

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CrearProveedor);
