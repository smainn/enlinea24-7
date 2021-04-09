import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import { TreeSelect, message, Modal, Spin, Icon } from 'antd';
import 'antd/dist/antd.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';

import SelectView from '../../../componentes/select';
import Confirmation from '../../../componentes/confirmation';
import CCharacteristic from '../../../componentes/characteristic';
import CImage from '../../../componentes/image';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import C_TextArea from '../../../componentes/data/textarea';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Input from '../../../componentes/data/input';
import C_TreeSelect from '../../../componentes/data/treeselect';
import strings from '../../../utils/strings';

export default class EditarProveedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {

            openImage: false,

            visible: false,
            loadModal: false,
            inputInicio: true,

            redirect: false,

            validarNombre: 1,

            codigoProveedor: '',
            nitProveedor: '',
            nombreProveedor: '',
            apellidoProveedor: '',

            imagenProveedor: '',
            imagenNuevo : 0,

            notaProveedor: '',
            descripcionProveedor: '',

            estadoProveedor: '',

            ciudadProveedor: 0,

            ciudadCargadas: [],
            ciudades: [],

            referenciaContacto: [],
            validacion: [1, 1, 1, 1],

            items: [],
            arrayProveedorContactarlo: [],
            arrayReferenciaDeContacto: [],

            arrayEliminadoContacto: [],

            codigo: '',
            nombre: '',
            apellido: '',
            nit: '',
            nota: '',
            descripcion: '',

            InputFocusBlur: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            labelFocusBlur: [0, 1, 1, 1, 0, 0, 0, 0, 0],
            noSesion: false,
            configCodigo: false,
            modalCancel: false

        }
        this.permisions = {
            verNro: readPermisions(keys.proveedor_ver_nro),
            verFecha: readPermisions(keys.proveedor_ver_fecha),
            codigo: readPermisions(keys.proveedor_input_codigo),
            nombre: readPermisions(keys.proveedor_input_nombre),
            apellido: readPermisions(keys.proveedor_input_apellido),
            nit: readPermisions(keys.proveedor_input_nit),
            ciudad: readPermisions(keys.proveedor_select_ciudad),
            estado: readPermisions(keys.proveedor_select_estado),
            caracteristicas: readPermisions(keys.proveedor_caracteristicas),
            imagenes: readPermisions(keys.proveedor_imagenes),
            notas: readPermisions(keys.proveedor_textarea_nota),
            descripciones: readPermisions(keys.proveedor_textarea_descripcion),
        }

        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.onChangeArrayReferenciaDeContacto = this.onChangeArrayReferenciaDeContacto.bind(this);
        this.onChangeArrayProveedorContactarlo = this.onChangeArrayProveedorContactarlo.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleRemoveRow = this.handleRemoveRow.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
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

    llenarArrayDecontactoProveedor(posicion) {
        for (var i = 0; i < posicion; i++) {
            this.state.items.push('');
            this.state.arrayProveedorContactarlo.push('');
            this.state.arrayReferenciaDeContacto.push('');
        }
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

    componentDidMount() {
        this.getConfigsClient();
        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 600);
        httpRequest('get', ws.wsproveedoredit + '/' + this.props.match.params.id + '')
        .then(result => {
            if (result.response == 1) {
                
                result.proveedorContacto.map(
                    (resultado) => {
                        this.state.items.push(resultado.idproveedorcontactarlo);
                        this.state.arrayProveedorContactarlo.push(resultado.valor);
                        this.state.arrayReferenciaDeContacto.push(resultado.fkidreferenciadecontacto);
                    }
                );
                
                this.cargarReferencias(result.referenciaContacto);

                if (this.state.items.length < 3) {
                    this.llenarArrayDecontactoProveedor( 3 - this.state.items.length);
                }

                if (result.data.apellido != null) {
                    this.state.labelFocusBlur[4] = 1;
                }

                if (result.data.nit != null) {
                    this.state.labelFocusBlur[5] = 1;
                }

                if (result.data.notas != null) {
                    this.state.labelFocusBlur[6] = 1;
                }

                if (result.data.contactos != null) {
                    this.state.labelFocusBlur[7] = 1;
                }

                this.setState({

                    items: this.state.items,
                    arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
                    arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,

                    nro: result.data.idproveedor,

                    codigoProveedor: (result.data.codproveedor === null)?'':result.data.codproveedor,
                    nitProveedor: (result.data.nit === null)?'':result.data.nit,
                    nombreProveedor: result.data.nombre,
                    apellidoProveedor: (result.data.apellido === null)?'':result.data.apellido,
                    ciudadProveedor: (result.data.fkidciudad === null)?0:result.data.fkidciudad,
                    imagenProveedor: (result.data.foto === null)?'':result.data.foto,
                    notaProveedor: (result.data.notas === null)?'':result.data.notas,
                    descripcionProveedor: (result.data.contactos === null)?'':result.data.contactos,
                    
                    ciudadCargadas: result.ciudad,
                    estadoProveedor: result.data.estado,

                    codigo: (result.data.codproveedor === null)?'':result.data.codproveedor,
                    nit: (result.data.nit === null)?'':result.data.nit,
                    nombre: result.data.nombre,
                    apellido: (result.data.apellido === null)?'':result.data.apellido,
                    nota: (result.data.notas === null)?'':result.data.notas,
                    descripcion: (result.data.contactos === null)?'':result.data.contactos,

                    labelFocusBlur: this.state.labelFocusBlur,

                });

                var array = result.ciudad;
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

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
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

    onChangeCodigoProveedor(event) {
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
            nombre: event,
            validarNombre: this.state.validarNombre
        });
    }

    onChangeApellidoProveedor(event) {
        this.setState({
            apellidoProveedor: event,
            apellido: event,
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

    onChangeEstadoProveedor(event) {
        this.setState({
            estadoProveedor: event,
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
                    imagenNuevo: 1
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleRemoveImage() {
        //this.state.imagenProveedor = '';

        this.setState({
            imagenProveedor: '',
            imagenNuevo: 1
        });

    }

    handleAddRow() {
        this.state.items.push('');
        this.state.arrayProveedorContactarlo.push('');
        this.state.arrayReferenciaDeContacto.push('');
        this.setState({
            items: this.state.items,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
        });
    }

    handleRemoveRow(indice) {
        if (this.state.items[indice] != '') {
            this.state.arrayEliminadoContacto.push(this.state.items[indice]);
        }

        this.state.items.splice(indice, 1);
        this.state.arrayProveedorContactarlo.splice(indice, 1);
        this.state.arrayReferenciaDeContacto.splice(indice, 1);

        this.setState({
            items: this.state.items,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
            arrayEliminadoContacto: this.state.arrayEliminadoContacto
        });
    }

    onChangeArrayReferenciaDeContacto(event) {
        this.state.arrayReferenciaDeContacto[event.id] = event.value;
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

    onSubmit(e) {

        e.preventDefault();

        if (this.state.nombreProveedor !== ''){
            /*
            const formData = new FormData();
            formData.append('idProveedor', this.props.match.params.id);
            formData.append('codigoProveedor', this.state.codigo);
            formData.append('nitProveedor', this.state.nit);
            formData.append('nombreProveedor', this.state.nombre);
            formData.append('apellidoProveedor', this.state.apellido);
            formData.append('ciudadProveedor', this.state.ciudadProveedor);
            formData.append('estadoProveedor', this.state.estadoProveedor);
            formData.append('notaProveedor', this.state.nota);
            formData.append('descripcionProveedor', this.state.descripcion);
            formData.append('imagenProveedor', this.state.imagenProveedor);
            formData.append('arrayReferencia', JSON.stringify(this.state.arrayReferenciaDeContacto));
            formData.append('arrayContactarlo', JSON.stringify(this.state.arrayProveedorContactarlo));

            formData.append('arrayEliminadoContacto', JSON.stringify(this.state.arrayEliminadoContacto));

            formData.append('array', JSON.stringify(this.state.items));

            formData.append('bandera', this.state.imagenNuevo);
            */
            let body = {
                idProveedor: this.props.match.params.id,
                codigoProveedor: this.state.codigo,
                nitProveedor: this.state.nit,
                nombreProveedor: this.state.nombre,
                apellidoProveedor: this.state.apellido,
                ciudadProveedor: this.state.ciudadProveedor,
                estadoProveedor: this.state.estadoProveedor,
                notaProveedor: this.state.nota,
                descripcionProveedor: this.state.descripcion,
                imagenProveedor: this.state.imagenProveedor,
                arrayReferencia: JSON.stringify(this.state.arrayReferenciaDeContacto),
                arrayContactarlo: JSON.stringify(this.state.arrayProveedorContactarlo),
                arrayEliminadoContacto: JSON.stringify(this.state.arrayEliminadoContacto),
                array: JSON.stringify(this.state.items),
                bandera: this.state.imagenNuevo
            };
            this.setState({
                loadModal: true
            });

            httpRequest('post', ws.wsproveedorupdate, body)
            .then(result  => {
                if (result.response === 1) {
                    this.setState({
                        redirect: !this.state.redirect,
                        loadModal: false
                    });
                    message.success('Actualizacion exitosa');
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            })
            .catch(error => {
                console.log(error);
                message.error(strings.message_error);
            });

        }else {
            this.analizarValidacion();
        }
    }

    analizarValidacion() {
        
        if (this.state.nombreProveedor === ''){
            this.state.validarNombre = 0;
        }
        message.error('No se permite campo vacio');
        this.setState({
            validarNombre: this.state.validarNombre
        });
    }

    regresarListado() {
        this.setState({
            redirect: !this.state.redirect
        });
    }

    handleCerrar() {
        this.setState({
            visible: !this.state.visible
        });
    }

    onChangeModalShow() {
        return (
            <Confirmation
                visible={this.state.visible}
                loading={this.state.loadModal}
                onCancel={this.handleCerrar.bind(this)}
                title='Editar Proveedor'
                onClick={this.onSubmit.bind(this)}
                content='¿Estas seguro de guardas datos...?'
            />
        )
    }

    confirmarActualizacion(e) {
        //e.preventDefault();

        if (this.state.nombreProveedor !== ''){
            this.setState({
                visible: !this.state.visible
            });
        }else {
            this.analizarValidacion();
        }
    
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

        if (this.state.noSesion){
            removeAllData();
            return (<Redirect to={routes}/>)
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
                            <h1 className="lbls-title">Editar Proveedor</h1>
                        </div>
                    </div>
                    
                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Cancelar Editar Proveedor"
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de cancelar la actualizacion del proveedor?
                                    Los datos modificados se perderan.
                                </label>
                            </div>
                        ]}
                    />

                    <div className="forms-groups">
                        {/*<form onSubmit={this.confirmarActualizacion.bind(this)}
                            encType="multipart/form-data">*/}
                                
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                <C_Input 
                                    value={this.state.codigoProveedor}
                                    onChange={this.onChangeCodigoProveedor.bind(this)}
                                    title='Codigo*'
                                    readOnly={true}
                                    permisions = {this.permisions.codigo}
                                    configAllowed={this.state.configCodigo}
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

                                <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>
                                <C_TreeSelect
                                    title="Ciudad*"
                                    value={(this.state.ciudadProveedor == 0)?'Seleccionar':this.state.ciudadProveedor}
                                    treeData={this.state.ciudades}
                                    placeholder="Seleccione una opcion"
                                    onChange={this.onChangeCiudadProveedor.bind(this)}
                                    permisions = {this.permisions.ciudad}
                                />

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12 pt-bottom">
                                    <SelectView
                                        value={this.state.estadoProveedor}
                                        title='Estado*'
                                        onChange={this.onChangeEstadoProveedor.bind(this)}
                                        data={[
                                            {   value: 'A', title: 'Activo'},
                                            {   value: 'N', title: 'Desactivo'}
                                        ]}
                                        permisions = {this.permisions.estado}
                                    />
                                    
                                </div>
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

                                <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                    <CImage
                                        onChange={this.onChangeImagenProveedor.bind(this)}
                                        image={this.state.imagenProveedor}
                                        images={[]}
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
                                        onClick={this.confirmarActualizacion.bind(this)}
                                    />
                                    <C_Button
                                        title='Cancelar'
                                        type='danger'
                                        onClick={() => this.setState({ modalCancel: true }) }//this.regresarListado.bind(this)}
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