
import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';

import axios from 'axios';

import { TreeSelect, message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class EditarProveedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            visible: false,
            loadModal: false,

            redirect: false,

            codigoProveedor: '',
            nitProveedor: '',
            nombreProveedor: '',
            apellidoProveedor: '',

            imagenProveedor: '',
            imagenNuevo : 0,

            notaProveedor: '',
            descripcionProveedor: '',

            ciudadProveedor: 0,

            ciudadCargadas: [],
            ciudades: [],

            referenciaContacto: [],
            validacion: [1, 1, 1, 1],

            items: [],
            arrayProveedorContactarlo: [],
            arrayReferenciaDeContacto: [],

            arrayEliminadoContacto: [],

        }
    }

    llenarArrayDecontactoProveedor(posicion) {
        for (var i = 0; i < posicion; i++) {
            this.state.items.push('');
            this.state.arrayProveedorContactarlo.push('');
            this.state.arrayReferenciaDeContacto.push('');
        }
    }

    componentDidMount() {
        axios.get('' + this.props.match.params.id + '').then(
            resultado => {
                if (resultado.data.ok) {
                    
                    resultado.data.proveedorContacto.map(
                        (resultado) => {
                            this.state.items.push(resultado.idproveedorcontactarlo);
                            this.state.arrayProveedorContactarlo.push(resultado.valor);
                            this.state.arrayReferenciaDeContacto.push(resultado.fkidreferenciadecontacto);
                        }
                    );

                    if (this.state.items.length < 3) {
                        this.llenarArrayDecontactoProveedor( 3 - this.state.items.length);
                    }

                    this.setState({

                        items: this.state.items,
                        arrayProveedorContactarlo: this.state.arrayProveedorContactarlo,
                        arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,

                        codigoProveedor: resultado.data.data.codproveedor,
                        nitProveedor: (resultado.data.data.nit === null)?'':resultado.data.data.nit,
                        nombreProveedor: resultado.data.data.nombre,
                        apellidoProveedor: resultado.data.data.apellido,
                        ciudadProveedor: resultado.data.data.fkidciudad,
                        imagenProveedor: (resultado.data.data.foto === null)?'':resultado.data.data.foto,
                        notaProveedor: (resultado.data.data.notas === null)?'':resultado.data.data.notas,
                        descripcionProveedor: (resultado.data.data.contactos === null)?'':resultado.data.data.contactos,
                        
                        ciudadCargadas: resultado.data.ciudad,
                        referenciaContacto: resultado.data.referenciaContacto

                    });

                    var array = resultado.data.ciudad;
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
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
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

    onChangeCodigoProveedor(e) {
        this.state.validacion[0] = 1;
        this.setState({
            codigoProveedor: e.target.value,
            validacion: this.state.validacion
        });
    }

    onChangeNitProveedor(e) {
        this.setState({
            nitProveedor: e.target.value
        });
    }

    onChangeNombreProveedor(e) {
        this.state.validacion[1] = 1;
        this.setState({
            nombreProveedor: e.target.value,
            validacion: this.state.validacion
        });
    }

    onChangeApellidoProveedor(e) {
        this.state.validacion[2] = 1;
        this.setState({
            apellidoProveedor: e.target.value,
            validacion: this.state.validacion
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
        this.state.imagenProveedor = '';

        this.setState({
            imagenProveedor: this.state.imagenProveedor,
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

    onChangeArrayReferenciaDeContacto(e) {
        this.state.arrayReferenciaDeContacto[e.target.id] = e.target.value;
        this.setState({
            arrayReferenciaDeContacto: this.state.arrayReferenciaDeContacto,
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo
        });
    }

    onChangeArrayProveedorContactarlo(posicion, e) {
        this.state.arrayProveedorContactarlo[posicion] = e.target.value;
        
        this.setState({
            arrayProveedorContactarlo: this.state.arrayProveedorContactarlo
        });
    }

    onChangeNotaProveedor(e) {
        this.setState({
            notaProveedor: e.target.value
        });
    }

    onChangeDescripcionProveedor(e) {
        this.setState({
            descripcionProveedor: e.target.value
        });
    }

    onSubmit(e) {

        e.preventDefault();

        if ((this.state.codigoProveedor !== '') && (this.state.nombreProveedor !== '') && 
            (this.state.apellidoProveedor !== '') && (this.state.ciudadProveedor !== 0)){
        
            const formData = new FormData();

            formData.append('idProveedor', this.props.match.params.id);
            formData.append('codigoProveedor', this.state.codigoProveedor);
            formData.append('nitProveedor', this.state.nitProveedor);
            formData.append('nombreProveedor', this.state.nombreProveedor);
            formData.append('apellidoProveedor', this.state.apellidoProveedor);
            formData.append('ciudadProveedor', this.state.ciudadProveedor);
            formData.append('notaProveedor', this.state.notaProveedor);
            formData.append('descripcionProveedor', this.state.descripcionProveedor);
            formData.append('imagenProveedor', this.state.imagenProveedor);
            formData.append('arrayReferencia', JSON.stringify(this.state.arrayReferenciaDeContacto));
            formData.append('arrayContactarlo', JSON.stringify(this.state.arrayProveedorContactarlo));

            formData.append('arrayEliminadoContacto', JSON.stringify(this.state.arrayEliminadoContacto));

            formData.append('array', JSON.stringify(this.state.items));

            formData.append('bandera', this.state.imagenNuevo);

            this.setState({
                loadModal: true
            });

            axios.post('/commerce/admin/updateProveedor', formData).then(
                resultado  => {
                    if (resultado.data.response === 1) {
                        this.setState({
                            redirect: !this.state.redirect,
                            loadModal: false
                        });
                        message.success('Actualizacion exitosa');
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );

        }else {
            this.analizarValidacion();
        }
    }

    analizarValidacion() {
        if (this.state.codigoProveedor === '') {
            message.error('No se permite campo vacio en codigo del proveedor');
            this.state.validacion[0] = 0;
        }
        if (this.state.nombreProveedor === ''){
            message.error('No se permite campo vacio en el nombre del proveedor');
            this.state.validacion[1] = 0;
        }
        if (this.state.apellidoProveedor === ''){
            message.error('No se permite campo vacio en el apellido del proveedor');
            this.state.validacion[2] = 0;
        }
        if (this.state.ciudadProveedor === 0){
            message.error('No se permite campo vacio en la ciudad del proveedor');
            this.state.validacion[3] = 0;
        }
        this.setState({
            validacion: this.state.validacion
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
            <Modal
                title='Editar Proveedor'
                visible={this.state.visible}
                onOk={this.handleCerrar.bind(this)}
                onCancel={this.handleCerrar.bind(this)}
                footer={null}
                width={400}
            >
                <div>
                    <div className="form-group-content"
                        style={{'display': (this.state.loadModal)?'none':'block'}}>
                        
                        <form onSubmit={this.onSubmit.bind(this)} encType="multipart/form-data">
                            
                            <div className="text-center-content"
                                style={{'marginTop': '-15px'}}>
                                
                                <label className='label-group-content'>
                                    Estas seguro de actualizar el proveedor?
                                </label>
                            
                            </div>

                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
    
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button type="submit" 
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button>
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    </div>
                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadModal)?'block':'none',
                            'marginTop': '-15px'
                        }}>
                        <div className="text-center-content">
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                            
                        </div>
                        <div className="text-center-content"
                            style={{'marginTop': '20px'}}>
                            <label> Cargando Informacion Favor de Esperar ...</label>
                        </div>

                    </div>
                </div>

            </Modal>
        )
    }

    confirmarActualizacion() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/indexProveedor"/>)
        }

        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="row-content">

                {componentModalShow}

                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Editar Proveedor </h1>
                    </div>
                </div>
                <div className="card-body-content">
                    <form className="form-content" onSubmit={this.onSubmit.bind(this)}
                        encType="multipart/form-data">

                        <div className="form-group-content col-lg-9-content col-md-8-content col-sm-12-content col-xs-12-content">
                            
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">

                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.codigoProveedor}
                                            onChange={this.onChangeCodigoProveedor.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-control-content reinicio-padding':'form-control-content error reinicio-padding'}
                                            placeholder=" Ingresar Codigo"
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Codigo*</label>
                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.nitProveedor}
                                            onChange={this.onChangeNitProveedor.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar Nit"
                                        />
                                        <label className='label-group-content'>Nit</label>
                                    </div>
                                </div>

                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">

                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.nombreProveedor}
                                            onChange={this.onChangeNombreProveedor.bind(this)}
                                            className={(this.state.validacion[1] === 1)?'form-control-content reinicio-padding':'form-control-content error reinicio-padding'}
                                            placeholder=" Ingresar Nombre"
                                        />
                                        <label className={(this.state.validacion[1] === 1)?'label-group-content':'label-group-content error'}>Nombre*</label>
                                    </div>
                                </div>

                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.apellidoProveedor}
                                            onChange={this.onChangeApellidoProveedor.bind(this)}
                                            className={(this.state.validacion[2] === 1)?'form-control-content reinicio-padding':'form-control-content error reinicio-padding'}
                                            placeholder=" Ingresar Apellido"
                                        />
                                        <label className={(this.state.validacion[2] === 1)?'label-group-content':'label-group-content error'}>Apellido*</label>
                                    </div>
                                </div>

                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <TreeSelect
                                            value={(this.state.ciudadProveedor === 0)?'Seleccionar':this.state.ciudadProveedor}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                                            treeData={this.state.ciudades}
                                            allowClear
                                            onChange={this.onChangeCiudadProveedor.bind(this)}
                                        />
                                        <label className={(this.state.validacion[3] === 1)?'label-group-content':'label-group-content error'}>Ciudad*</label>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="form-group-content col-lg-3-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                <div className="card-caracteristica" >
                                    <div className="pull-left-content">
                                        <i className="styleImg fa fa-upload">
                                            <input type="file" className="img-content"
                                                onChange={this.onChangeImagenProveedor.bind(this)}
                                            />
                                        </i>
                                    </div>
                                    
                                    {(this.state.imagenProveedor === '')?'':
                                        <div className="pull-right-content">
                                            <i onClick={this.handleRemoveImage.bind(this)}
                                                className="styleImg fa fa-times"> </i>
                                        </div>
                                    }

                                    <div className="caja-img-xs">
                                        {(this.state.imagenProveedor === '')?
                                            <img src="/images/default.jpg" alt="none" className="img-principal" />
                                            :
                                            <img style={{'cursor': 'pointer'}} 
                                                src={this.state.imagenProveedor}
                                                alt="none" className="img-principal" />
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <div className="card-caracteristica">
                                    
                                    <div className="pull-left-content">
                                        <h1 className="title-logo-content"> Para Contactarlo </h1>
                                    </div>
                                    
                                    <div className="pull-right-content">
                                        <i className="fa fa-plus btn-content btn-secondary-content" onClick={this.handleAddRow.bind(this)}
                                            style={{'marginTop': '12px'}}> </i>
                                    </div>

                                    <div className="caja-content">
                                        {this.state.items.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice}>
                                                        <div className="col-lg-5-content col-md-5-content col-sm-5-content col-xs-5-content">
                                                            <select className="form-control-content" id={indice}
                                                                value={this.state.arrayReferenciaDeContacto[indice]}
                                                                onChange={this.onChangeArrayReferenciaDeContacto.bind(this)}
                                                            >
                                                                <option value=''> Seleccionar </option>

                                                                {this.state.referenciaContacto.map(
                                                                    (element, i) => {
                                                                        return (
                                                                            <option key={i} value={element.idreferenciadecontacto}>
                                                                                {element.descripcion}
                                                                            </option>
                                                                        )
                                                                    }
                                                                )}

                                                            </select>
                                                        </div>

                                                        <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                                            <input type="text"  
                                                                value={this.state.arrayProveedorContactarlo[indice]}
                                                                onChange={this.onChangeArrayProveedorContactarlo.bind(this, indice)}
                                                                placeholder=" Ingresar detalles ..."
                                                                className={(this.state.arrayReferenciaDeContacto[indice] != '')?'form-control-content':'form-control-content cursor-not-allowed'}
                                                                readOnly={(this.state.arrayReferenciaDeContacto[indice] != '')?false:true}
                                                            />
                                                        </div>

                                                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content">
                                                            <div className="text-center-content">
                                                                <i onClick={this.handleRemoveRow.bind(this, indice)}
                                                                    className="fa fa-times btn-content btn-xs btn-danger-content"> 
                                                                </i>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <textarea 
                                            value={this.state.notaProveedor}
                                            onChange={this.onChangeNotaProveedor.bind(this)}
                                            className="textarea-content">
                                        </textarea>
                                        <label className="label-group-content">Notas</label>
                                    </div>
                                </div>
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <textarea 
                                            value={this.state.descripcionProveedor}
                                            onChange={this.onChangeDescripcionProveedor.bind(this)}
                                            className="textarea-content">
                                        </textarea>
                                        <label className="label-group-content">Descripcion</label>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="form-group-content">
                            <div className="text-center-content">
                                <button type="button" onClick={this.confirmarActualizacion.bind(this)}
                                    className="btn-content btn-sm-content btn-success-content"
                                    style={{'marginRight': '20px'}}>
                                    Aceptar
                                </button>
                                <button onClick={this.regresarListado.bind(this)}
                                    type="button" className="btn-content btn-sm-content btn-danger-content">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}