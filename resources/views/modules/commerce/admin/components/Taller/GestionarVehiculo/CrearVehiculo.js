

import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';


import { TreeSelect } from 'antd';

import 'antd/dist/antd.css';

export default class CrearVehiculo extends Component{

    constructor(){
        super();
        this.handleAddRow = this.handleAddRow.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.onChangePlacaVehiculo = this.onChangePlacaVehiculo.bind(this);
        this.onChangeImageVehiculo = this.onChangeImageVehiculo.bind(this);
        this.onChangePreview = this.onChangePreview.bind(this);
        this.onChangeNext = this.onChangeNext.bind(this);
        this.state = {
            items: [],
            modal: 'none',
            arrayImage: [],
            imageVehiculo: '',
            placaVehiculo: '',
            codigoVehiculo: '',
            chasisVehiculo: '',
            notaVehiculo: '',
            descripcionVehiculo: '',
            indice: 0,
            bandera: 0,
            mensaje: [],
            validacion: [],
            redirect: false,
            idCliente: 0,
            tipoCliente: 'T',
            tipoVehiculo: '',
            cliente: [],
            datosCliente: [],
            arrayCaracteristicaVehiculo: [],
            arrayCaracteristicaCard: [],
            arrayDetalleCaracteristicaVehiculo: [],
            validacionArrayCaracteristica: [],
            arrayTipoVehiculo: [],
            valueTreeFamilyTipoCard: undefined
        }
    }

    componentWillMount() {
        for (var i =0; i < 5; i++){
            if (i < 3){
                this.state.items.push( i + 1);
                this.state.arrayCaracteristicaCard.push('');
                this.state.arrayDetalleCaracteristicaVehiculo.push('');
                this.state.validacionArrayCaracteristica.push(0);
                this.state.mensaje.push('');
            }
            this.state.validacion.push('form-control-content')
        }

        this.setState({
            items: this.state.items,
            arrayCaracteristicaCard: this.state.arrayCaracteristicaCard,
            arrayDetalleCaracteristicaVehiculo: this.state.arrayDetalleCaracteristicaVehiculo,
            mensaje: this.state.mensaje,
            validacion: this.state.validacion,
            validacionArrayCaracteristica: this.state.validacionArrayCaracteristica
        });

        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));

        axios.get('/commerce/admin/getCliente').then(resultado => {
            if(resultado.data.ok){
                this.setState({
                    cliente: resultado.data.data
                });
            }

        }).catch(error => {
            console.log(error)
        });
        axios.get('/commerce/admin/getCaracteristicaVehiculo').then(resultado => {
            if(resultado.data.ok){
                this.setState({
                    arrayCaracteristicaVehiculo: resultado.data.data
                });
            }

        }).catch(error => {
            console.log(error)
        });

        axios.get('/commerce/admin/getTipoVehiculo').then(resultado => {
            if(resultado.data.ok){
                this.setState({
                    arrayTipoVehiculo: resultado.data.data
                });
                console.log(this.state.arrayTipoVehiculo);
                var array = resultado.data.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrevehiculo == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idtipovehiculo
                        };
                        array_aux.push(elem);
                    }
                }
                console.log(this.state.arrayTipoVehiculo);
                this.arbolTipoVehiculo(array_aux);
                this.setState({
                    arrayTipoVehiculo: array_aux
                });
                console.log(this.state.arrayTipoVehiculo)
            }

        }).catch(error => {
            console.log(error)
        });

    }
    arbolTipoVehiculo(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosTipoVehiculo(data[i].value);
            if (hijos.length > 0) {
                data[i].children = hijos;
            }
            this.arbolTipoVehiculo(hijos);
        }
    }

    hijosTipoVehiculo(idpadre) {
        var array =  this.state.arrayTipoVehiculo;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idtipovehiculo
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    onChangeImageVehiculo(e) {

        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                var longitud = this.state.arrayImage.length;
                this.state.arrayImage.push(e.target.result);
                this.setState({
                    imageVehiculo: e.target.result,
                    arrayImage: this.state.arrayImage,
                    indice: longitud
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    onChangePreview() {
        if (this.state.arrayImage.length > 1){
            var indicePreview = this.state.indice;
            if (indicePreview === 0){
                indicePreview = this.state.arrayImage.length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.setState({
                indice: indicePreview
            })
        }
    }

    onChangeNext() {
        if (this.state.arrayImage.length > 1){
            var indiceNext = this.state.indice;
            if (indiceNext === (this.state.arrayImage.length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.setState({
                indice: indiceNext
            })
        }
    }

    handleAddRow() {
        this.state.items.push(this.state.items.length + 1);
        this.state.arrayCaracteristicaCard.push('');
        this.state.arrayDetalleCaracteristicaVehiculo.push('');
        this.state.validacionArrayCaracteristica.push(0);
        this.setState({
            items: this.state.items,
            arrayCaracteristicaCard: this.state.arrayCaracteristicaCard,
            arrayDetalleCaracteristicaVehiculo: this.state.arrayDetalleCaracteristicaVehiculo,
            validacionArrayCaracteristica: this.state.validacionArrayCaracteristica
        });
    }

    handleRemoveRow(i) {
        this.state.items.splice(i, 1);
        this.state.arrayCaracteristicaCard.splice(i, 1);
        this.state.arrayDetalleCaracteristicaVehiculo.splice(i, 1);
        this.state.validacionArrayCaracteristica.splice(i, 1);
        this.setState({
            items: this.state.items,
            arrayDetalleCaracteristicaVehiculo: this.state.arrayDetalleCaracteristicaVehiculo,
            arrayCaracteristicaCard: this.state.arrayCaracteristicaCard,
            validacionArrayCaracteristica: this.state.validacionArrayCaracteristica
        });
    }

    handleRemoveImage() {
        const newImage = this.state.arrayImage;
        newImage.splice(this.state.indice, 1);
        if (this.state.indice === (this.state.arrayImage.length)){
            this.setState({
                indice: 0
            })
        }
        this.setState({arrayImage: newImage})

    }

    abrirModal(bandera) {
        this.setState({
            modal: 'block',
            bandera: bandera
        });
        this.onChangeShow();
    }

    onChangeShow() {
        if (this.state.bandera === 1){
            return (
                <div className="wrappper-content" style={{'background': 'transparent'}}>
                    <img src={this.state.arrayImage[this.state.indice]} className="img-show" alt=""/>
                    <i className="fa fa-chevron-left fa-left-content" onClick={this.onChangePreview}> </i>
                    <i className="fa fa-chevron-right fa-right-content" onClick={this.onChangeNext}> </i>
                    <i className="fa fa-times fa-close-content" onClick={this.cerrarModal}> </i>
                </div>
            )
        }
        if (this.state.bandera === 2){
            return (
                <div className="wrappper-content">
                    <div className="card-body-content">
                        <div className="text-center-content">
                            <h3 className="title-logo-content"> Datos del Cliente </h3>
                            <div className="pull-right-content">
                                <i onClick={this.cerrarModal}
                                    className="fa fa-times fa fa-times fa-form-control"> </i>
                            </div>
                        </div>
                        <div className="form-group-content col-lg-12-content col-md-12-content">
                            <div className="form-group-content col-lg-10-content col-md-10-content">
                                <div className="col-lg-4-content col-md-4-content">
                                    <h1 className="title-text-content">Codigo: <label className="title-min-text-content"> {(this.state.datosCliente.length === 0)?'':this.state.datosCliente[0].codcliente}</label></h1>
                                </div>
                                <div className="col-lg-4-content col-md-4-content">
                                    <h1 className="title-text-content">Tipo: <label className="title-min-text-content"> Comerciante</label></h1>
                                </div>
                                <div className="col-lg-4-content col-md-4-content">
                                    <h1 className="title-text-content">Personeria: <label className="title-min-text-content"> {(this.state.datosCliente.length === 0)?'':(this.state.datosCliente[0].tipopersoneria === 'N')?'Natural':'Juridico'}</label></h1>
                                </div>

                                <div className="col-lg-12-content col-md-12-content">
                                    <h1 className="title-text-content">Nombre Completo: <label className="title-min-text-content"> {(this.state.datosCliente.length === 0)?'':this.state.datosCliente[0].nombre} {(this.state.datosCliente.length === 0)?'':this.state.datosCliente[0].apellido} </label></h1>
                                </div>
                                <div className="col-lg-6-content col-md-6-content">
                                    <h1 className="title-text-content"> Nit: <label className="title-min-text-content"> {(this.state.datosCliente.length === 0)?'':this.state.datosCliente[0].nit}</label></h1>
                                </div>
                                <div className="col-lg-6-content col-md-6-content">
                                    <h1 className="title-text-content"> Sexo: <label className="title-min-text-content"> {(this.state.datosCliente.length === 0)?'':(this.state.datosCliente[0].sexo === 'F')?'Femino':'Masculino'}</label></h1>
                                </div>
                            </div>
                            <div className="form-group-content col-lg-2-content col-md-2-content">
                                <div className="text-center-content">
                                    <img className="img-circle-content" src="../../../../images/anonimo.jpg" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-content col-lg-12-content col-md-12-content">
                            <div className="form-group-content col-lg-9-content col-md-9-content">

                            </div>
                            <div className="form-group-content col-lg-3-content col-md-3-content">
                                <div className="text-center-content">
                                    <button type="button" onClick={this.cerrarModal}
                                            className="btn-content btn-success-content">Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    cerrarModal(){
        this.setState({
            modal: 'none'
        });
    }

    onchangeComponentImage() {
        if (this.state.arrayImage.length === 0) {
            return (
                <div>
                    <img src="/images/default.jpg" alt="none" className="content-principal" />
                </div>
            )
        }else{
            return (
                <div>
                    <img style={{'cursor': 'pointer'}}
                        onClick={this.abrirModal.bind(this, 1)}
                         src={this.state.arrayImage[this.state.indice]}
                         alt="none" className="content-principal" />
                </div>
            )
        }
    }

    onSubmit(e) {
        e.preventDefault();
        if ((this.state.codigoVehiculo.length === 0) || (this.state.idCliente === 0) || (this.state.tipoVehiculo.length === 0) ||
            (this.state.chasisVehiculo.length === 0) || (this.state.placaVehiculo.length === 0)){
            if (this.state.codigoVehiculo.length === 0){
                this.state.validacion[0] = 'form-control-content error';
                this.state.mensaje[0] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.placaVehiculo.length === 0){
                this.state.validacion[1] = 'form-control-content error';
                this.state.mensaje[1] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.chasisVehiculo.length === 0){
                this.state.validacion[2] = 'form-control-content error';
                this.state.mensaje[2] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.idCliente === 0){
                this.state.validacion[3] = 'form-control-content error';
                this.setState({
                    validacion: this.state.validacion
                })
            }
            if (this.state.tipoVehiculo.length === 0){
                this.state.validacion[4] = 'form-control-content error';
                this.setState({
                    validacion: this.state.validacion,
                })
            }
        }else{

            const formData = new FormData();

            formData.append('codigoVehiculo', this.state.codigoVehiculo);
            formData.append('placaVehiculo', this.state.placaVehiculo);
            formData.append('chasisVehiculo', this.state.chasisVehiculo);
            formData.append('tipoVehiculo', this.state.tipoVehiculo);
            formData.append('idCliente', this.state.idCliente);
            formData.append('notaVehiculo', this.state.notaVehiculo);
            formData.append('descripcionVehiculo', this.state.descripcionVehiculo);
            formData.append('vehiculoTipo', this.state.valueTreeFamilyTipoCard);
            formData.append('imagenVehiculo', JSON.stringify(this.state.arrayImage));
            formData.append('caracteristicaVehiculo', JSON.stringify(this.state.arrayCaracteristicaCard));
            formData.append('caracteristicaShowVehiculo', JSON.stringify(this.state.arrayDetalleCaracteristicaVehiculo));

            axios.post('/commerce/admin/postVehiculo', formData).then(
                response => {
                    if (response.data.response === 1){
                        this.setState({
                            redirect: !this.state.redirect
                        });
                        console.log(response.data.data);
                    }
                    if (response.data.response === 0){

                        console.log(response.data.data);
                    }
                }
            ).catch(
                    error => {
                        console.log(error);
                    }
                )

        }
    }

    onChangeCodigoVehiculo(e) {
        this.state.validacion[0] = 'form-control-content';
        this.state.mensaje[0] = '';
        this.setState({
            codigoVehiculo: e.target.value,
            validacion: this.state.validacion,
            mensaje: this.state.mensaje
        })
    }

    onChangePlacaVehiculo(e) {
        this.state.validacion[1] = 'form-control-content';
        this.state.mensaje[1] = '';
        this.setState({
            placaVehiculo: e.target.value,
            validacion: this.state.validacion,
            mensaje: this.state.mensaje
        });
    }

    onChangeChasisVehiculo(e) {
        this.state.validacion[2] = 'form-control-content';
        this.state.mensaje[2] = '';
        this.setState({
            chasisVehiculo: e.target.value,
            validacion: this.state.validacion,
            mensaje: this.state.mensaje
        })
    }

    onChangeIdCliente(e) {
        this.state.validacion[3] = 'form-control-content';
        const array = this.state.cliente;
        let tipo = 'T';
        let showCliente = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].idcliente == e.target.value) {
                tipo = array[i].tipopersoneria;
                showCliente.push(array[i]);
            }
        }
        if (e.target.value == '0') {
            this.setState({
                idCliente: 0,
                datosCliente: [],
                validacion: this.state.validacion,
            })
        } else {
            this.setState({
                idCliente: e.target.value,
                tipoCliente: tipo,
                datosCliente: showCliente,
                validacion: this.state.validacion,
            });
        }
    }

    onChangeTipoCliente(e) {

        this.setState({
            tipoCliente: e.target.value,
            idCliente: 0,
            datosCliente: []
        });

    }

    onChangeTipoVehiculo(e) {
        this.state.validacion[4] = 'form-control-content';
        this.setState({
            tipoVehiculo: e.target.value,
            validacion: this.state.validacion,
        })
    }

    ShowOptionTipoclienteIdCliente() {
        if (this.state.tipoCliente === 'T'){
            return (
                this.state.cliente.map((cliente, indice) => {
                    return(
                        (cliente.idcliente === this.state.idCliente)?
                            <option key={indice} value={cliente.idcliente} selected> {cliente.idcliente} </option>:
                            <option key={indice} value={cliente.idcliente}> {cliente.idcliente} </option>
                    )
                })
            )
        }else{
            if (this.state.tipoCliente === 'N'){
                return (
                    this.state.cliente.map((cliente, indice) => {
                        return(
                            (cliente.tipopersoneria === 'N')?
                                (cliente.idcliente === this.state.idCliente)?
                                    <option key={indice} value={cliente.idcliente} selected> {cliente.idcliente} </option>:
                                    <option key={indice} value={cliente.idcliente}> {cliente.idcliente} </option>:
                                ''
                        )
                    })
                )
            }else{
                return (
                    this.state.cliente.map((cliente, indice) => {
                        return(
                            (cliente.tipopersoneria === 'J')?
                                (cliente.idcliente === this.state.idCliente)?
                                    <option key={indice} value={cliente.idcliente} selected> {cliente.idcliente} </option>:
                                    <option key={indice} value={cliente.idcliente}> {cliente.idcliente} </option>:
                                ''
                        )
                    })
                )
            }
        }
    }

    ShowOptionTipoclienteNombreCliente() {
        if (this.state.tipoCliente === 'T'){
            return (
                this.state.cliente.map((cliente, indice) => {
                    return(
                        (cliente.idcliente === this.state.idCliente)?
                            <option key={indice} value={cliente.idcliente} selected> {cliente.nombre} </option>:
                            <option key={indice} value={cliente.idcliente}> {cliente.nombre} </option>
                    )
                })
            )
        }else{
            if (this.state.tipoCliente === 'N'){
                return (
                    this.state.cliente.map((cliente, indice) => {
                        return(
                            (cliente.tipopersoneria === 'N')?
                                (cliente.idcliente === this.state.idCliente)?
                                    <option key={indice} value={cliente.idcliente} selected> {cliente.nombre} </option>:
                                    <option key={indice} value={cliente.idcliente}> {cliente.nombre} </option>:
                                ''
                        )
                    })
                )
            }else{
                return (
                    this.state.cliente.map((cliente, indice) => {
                        return(
                            (cliente.tipopersoneria === 'J')?
                                (cliente.idcliente === this.state.idCliente)?
                                    <option key={indice} value={cliente.idcliente} selected> {cliente.nombre} </option>:
                                    <option key={indice} value={cliente.idcliente}> {cliente.nombre} </option>:
                                ''
                        )
                    })
                )
            }
        }
    }

    handleEventKeyPress(e) {
        if (e.key === 'Escape'){
            this.cerrarModal();
        }
    }

    onChangeArrayCaracteristicaCard(e) {
        this.state.arrayCaracteristicaCard[e.target.id] = e.target.value;
        this.state.validacionArrayCaracteristica[e.target.id] = 0;
        this.setState({
            arrayCaracteristicaCard: this.state.arrayCaracteristicaCard,
            validacionArrayCaracteristica: this.state.validacionArrayCaracteristica
        });
        if (e.target.value.length < 1){
            this.state.arrayDetalleCaracteristicaVehiculo[e.target.id] = '';
            this.setState({
                arrayDetalleCaracteristicaVehiculo: this.state.arrayDetalleCaracteristicaVehiculo
            })
        }
    }

    onchangeArrayDetalleCaracteristicaCard(e) {
        this.state.arrayDetalleCaracteristicaVehiculo[e.target.id] = e.target.value;
        this.setState({
            arrayDetalleCaracteristicaVehiculo: this.state.arrayDetalleCaracteristicaVehiculo
        });
        if (e.target.value.length > 0){
            if (this.state.arrayCaracteristicaCard[e.target.id] === ''){
                this.state.validacionArrayCaracteristica[e.target.id] = 1;
                this.setState({
                    validacionArrayCaracteristica: this.state.validacionArrayCaracteristica
                })
            }
        }
    }

    onChangeTreeFamilyTipoCard(value) {
        this.setState({
            valueTreeFamilyTipoCard: value
        })
    }

    onChangeNotaVehiculo(e) {
        this.setState({
            notaVehiculo: e.target.value
        })
    }

    onchangeDescripcionVehiculo(e) {
        this.setState({
            descripcionVehiculo: e.target.value
        })
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEventKeyPress.bind(this));
    }


    render() {
        const componentInmage = this.onchangeComponentImage();
        const componentShow = this.onChangeShow();
        const componentIdCliente = this.ShowOptionTipoclienteIdCliente();
        const componentNombreCliente = this.ShowOptionTipoclienteNombreCliente();

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/indexVehiculo"/>)
        }

        return (
            <div>

                <div id="capaModal" onClick={this.cerrarModal}
                     style={{'display': this.state.modal,
                         'backgroundColor': (this.state.bandera === 1)?'rgba(0, 0, 0, .99)':'rgba(0, 0, 0, .3)'
                     }}
                     className="divModal">
                </div>
                <div id="capaFormulario"
                     onKeyDown={this.handleEventKeyPress}
                     style={{'display': this.state.modal,
                         'marginLeft': (this.state.bandera === 1)?'25%':'18%',
                         'marginRight': (this.state.bandera === 1)?'25%':'18%',
                     }}
                     className="divFormulario">
                    {componentShow}
                </div>

                <div className="row-content">
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Vehiculo </h1>
                        </div>
                    </div>
                    <form
                        onSubmit={this.onSubmit.bind(this)}
                        className="formulario-content"
                        encType="multipart/form-data"
                        id="form_register">

                        <div>
                            <div className="form-group-content">
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="codigo" type="text"
                                               value={this.state.codigoVehiculo}
                                               placeholder="Ingresar Codigo ..."
                                               onChange={this.onChangeCodigoVehiculo.bind(this)}
                                               className={this.state.validacion[0]}
                                        />
                                        <label htmlFor="codigo"
                                               className="label-content"> Codigo {this.state.mensaje[0]}</label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="placa" type="text"
                                               value={this.state.placaVehiculo}
                                               placeholder="Ingresar Placa ..."
                                               onChange={this.onChangePlacaVehiculo}
                                               className={this.state.validacion[1]} />
                                        <label htmlFor="placa"
                                               className="label-content"> Placa {this.state.mensaje[1]}</label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="chasis" type="text"
                                               value={this.state.chasisVehiculo}
                                               placeholder="Ingresar Chasis ..."
                                               onChange={this.onChangeChasisVehiculo.bind(this)}
                                               className={this.state.validacion[2]} />
                                        <label htmlFor="chasis"
                                               className="label-content"> Chasis {this.state.mensaje[2]} </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-content">
                                <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select value={this.state.idCliente} onChange={this.onChangeIdCliente.bind(this)}
                                                id="idCliente" className={this.state.validacion[3]}>
                                            <option value="0"> Seleccionar </option>
                                            {
                                                componentIdCliente
                                            }
                                        </select>
                                        <label htmlFor="idCliente" className="label-content"> Cliente </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select value={this.state.idCliente} onChange={this.onChangeIdCliente.bind(this)}
                                                id="nombreCliente" className={this.state.validacion[3]}>
                                            <option value="0"> Seleccionar </option>
                                            {
                                                componentNombreCliente
                                            }
                                        </select>
                                        <label htmlFor="nombreCliente" className="label-content"> Nombre </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select value={this.state.tipoCliente} onChange={this.onChangeTipoCliente.bind(this)}
                                                id="tipoCliente" className="form-control-content">
                                            <option value="T"> Todos </option>
                                            <option value="N"> Natural </option>
                                            <option value="J"> Juridico </option>
                                        </select>
                                        <label htmlFor="tipoCliente" className="label-content"> Tipo Cliente </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select
                                            value={this.state.tipoVehiculo}
                                            onChange={this.onChangeTipoVehiculo.bind(this)}
                                            id="tipoUso"
                                            className={this.state.validacion[4]}>

                                            <option value=""> Seleccionar </option>
                                            <option value="R"> Privado </option>
                                            <option value="P"> Publico </option>
                                        </select>
                                        <label htmlFor="tipoUso" className="label-content"> Tipo Vehiculo </label>
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.idCliente === 0)?
                                    <div className="form-group-content">
                                        <div className="text-center-content">
                                            <button type="button"
                                                    className="btn-content btn-success-content">
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className="form-group-content">
                                        <div className="text-center-content">
                                            <button type="button" onClick={this.abrirModal.bind(this, 2)}
                                                    className="btn-content btn-primary-content">
                                                Ver Datos
                                            </button>
                                        </div>
                                    </div>

                            }
                            <div className="form-group-content">
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <TreeSelect
                                        value={this.state.valueTreeFamilyTipoCard}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.arrayTipoVehiculo}
                                        placeholder=" Seleccionar "
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={this.onChangeTreeFamilyTipoCard.bind(this)}
                                    />
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <textarea id="notasVehiculo" value={this.state.notaVehiculo}
                                                  onChange={this.onChangeNotaVehiculo.bind(this)}
                                                  className="texto-content" />
                                        <label htmlFor="notasVehiculo" className="label-content"> Notas </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <textarea id="descripcionVehiculo"
                                                  onChange={this.onchangeDescripcionVehiculo.bind(this)}
                                                  value={this.state.descripcionVehiculo}
                                                  className="texto-content" />
                                        <label htmlFor="descripcionVehiculo" className="label-content"> Descripcion </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-content">
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="card-caracteristica">
                                            <div className="pull-left-content">
                                                <h1 className="title-content"> Caracteristica </h1>
                                            </div>

                                            <div className="pull-right-content">
                                                <i className="fa fa-plus fa-form-control" onClick={this.handleAddRow}> </i>
                                            </div>


                                        <div className="caja-content">
                                            {
                                                this.state.items.map((valor, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                                                <select value={this.state.arrayCaracteristicaCard[i]}
                                                                        onChange={this.onChangeArrayCaracteristicaCard.bind(this)}
                                                                    id={i} className={(this.state.validacionArrayCaracteristica[i] === 1)?
                                                                    'form-control-content warning': 'form-control-content'
                                                                    }>
                                                                    <option value="">Seleccionar</option>
                                                                    {
                                                                        this.state.arrayCaracteristicaVehiculo.map((element, indice) => {
                                                                            return (
                                                                                <option key={indice} value={element.idvehiculocaracteristica}>
                                                                                    {element.caracteristica}
                                                                                    </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                                <input type="text"  id={i}
                                                                       onChange={this.onchangeArrayDetalleCaracteristicaCard.bind(this)}
                                                                       value={this.state.arrayDetalleCaracteristicaVehiculo[i]}
                                                                       placeholder="Ingresar detalles ..."
                                                                       className={(this.state.validacionArrayCaracteristica[i] === 1)?
                                                                           'form-control-content warning': 'form-control-content'}
                                                                />
                                                                <i className="fa fa-remove fa-form-sd-control" onClick={this.handleRemoveRow.bind(this, i)}> </i>
                                                            </div>
                                                            {(this.state.validacionArrayCaracteristica[i] === 1)?
                                                                <div style={{'backgroundColor': '#f0ad4e', 'height': '20px'}}
                                                                     className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                                                    <div className="text-center-content">
                                                                        <h1 style={{
                                                                            'fontSize': '12px',
                                                                            'marginTop': '-2px',
                                                                            'color': '#fff'
                                                                        }}>Favor de Seleccionar una opcion</h1>
                                                                    </div>
                                                                </div>:
                                                                ''
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="card-caracteristica">
                                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                            <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">
                                                <div className="text-left-content">
                                                    <i className="styleImg fa fa-download">
                                                        <input type="file" id="img-content"
                                                               onChange={this.onChangeImageVehiculo}/>
                                                    </i>
                                                </div>
                                            </div>
                                            <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">
                                                <div className="text-center-content">
                                                    {(this.state.arrayImage.length === 0)?'':
                                                        <i className="styleImg fa fa-times" onClick={this.handleRemoveImage.bind(this)}> </i>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">
                                                <div className="text-right-content">
                                                    {(this.state.arrayImage.length === 0)?'':
                                                        <i className="styleImg fa fa-search-plus" onClick={this.abrirModal.bind(this, 1)}> </i>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {componentInmage}

                                            <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">
                                                    <div className="text-left-content">
                                                        <i className="styleImg fa fa-angle-double-left" onClick={this.onChangePreview}> </i>

                                                    </div>
                                                </div>
                                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">

                                                    <div className="text-center-content">
                                                        <h1 className="text-title-content">{this.state.arrayImage.length === 0?0:this.state.indice + 1} de {this.state.arrayImage.length}</h1>
                                                    </div>

                                                </div>
                                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content">
                                                    <div className="text-right-content">
                                                        <i className="styleImg fa fa-angle-double-right" onClick={this.onChangeNext}> </i>
                                                    </div>
                                                </div>
                                            </div>

                                    </div>
                                </div>
                            </div>

                            <div className="form-group-content">
                                <div className="text-center-content">
                                    <button type="submit" className="btn-content btn-success-content">
                                        Aceptar
                                    </button>
                                    <button type="button" className="btn-content btn-danger-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );

    }
}




