

import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';

import axios from 'axios';

import { TreeSelect } from 'antd';

import 'antd/dist/antd.css';

export default class CrearVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            modal: 'none',
            bandera: 0,
            seleccionClienteID: true,
            seleccionClienteNombre: true,
            redirect: false,

            nroCracteres: 4,
            configuracion: {
                numeros: true,
                mayusculas: true,
                minusculas: true
            },
            caracteres: {
                numeros: '0 1 2 3 4 5 6 7 8 9',
                mayusculas: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
                minusculas: 'a b c d e f g h i j k l m n o p q r s t u v w x y z'
            },
            codigoGenerado: '',

            codigoVehiculo: '',
            placaVehiculo: '',
            chasisVehiculo: '',
            tipoVehiculo: '',

            idCliente: 0,
            nombreCliente: '',
            codigoCliente: '',

            descripcionVehiculo: '',
            notaVehiculo: '',
            valueTreeFamilyTipoCard: 0,

            arrayTipoVehiculo: [],
            arrayPadreVehiculo: [],

            arrayImage: [],
            indice: 0,

            arrayImageRemove: [],

            items: [],
            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],

            caracteristicaVehiculo: [],
            clientes: [],
            pagination: {
                total: 0,
                current_page: 0,
                per_page: 0,
                last_page: 0,
                from: 0,
                to:   0
            },
            offset : 3,
            buscarCliente: '',
            arrayDetalle: [],
            arrayDeleteCaracteristica: [],

            modalImage: 'none',

            validacion: [1, 1, 1, 1, 1, 1, 1],
            mensaje: 'Chasis*',
            tecla: 0
        }

    }

    componentDidMount() {

        this.generarCode();
        this.getCaracteristicaVehiculo();
        this.getTipoVehiculo();
        this.getDetalleCracteristica(this.props.match.params.id);

        axios.get('' + this.props.match.params.id + '').then(
            response => {
                this.setState({
                    codigoVehiculo: response.data.data.codvehiculo,
                    placaVehiculo: response.data.data.placa,
                    chasisVehiculo: response.data.data.chasis,
                    idCliente: response.data.data.fkidcliente,
                    tipoVehiculo: response.data.data.tipopartpublic,
                    valueTreeFamilyTipoCard: response.data.data.fkidvehiculotipo,
                    notaVehiculo: (response.data.data.notas == undefined)?'':response.data.data.notas,
                    descripcionVehiculo: (response.data.data.descripcion == undefined)?'':response.data.data.descripcion,
                    nombreCliente: response.data.data.nombre + ' ' + response.data.data.apellido,
                    codigoCliente: response.data.data.codcliente
                });  
                this.setState({
                    arrayImage: response.data.foto
                });
                
            }
        ).catch(
            error => {
                console.log(error);     
            }
        );
        this.getCliente(1, this.state.buscarCliente);
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
                this.cerrarModalImage();
            }
            if (e.key === 'ArrowRight') {
                this.onChangeNext();
            }
            if(e.key === 'ArrowLeft') {
                this.onChangePreview();
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleEventKeyPress.bind(this));
    }

    getDetalleCracteristica(id) {
        axios.get('/commerce/admin/getDetalleCaracteristica/' + id + '').then(
            resultado => {
                if(resultado.data.ok){
                    this.setState({
                        arrayDetalle: resultado.data.data
                });

                if (resultado.data.data.length > 0) {
                    resultado.data.data.map(
                        resultado => {
                            this.state.items.push(resultado.idvehiculocaracdetalle);
                            this.state.arrayCaracteristica.push(resultado.fkidvehiculocaracteristica);
                            this.state.arrayDetalleCaracteristica.push(resultado.descripcion);
                        }
                    );
                    for (var i = 0; i < 6; i++){
                        this.state.validacion.push(1);
                    }
            
                    this.setState({
                        items: this.state.items,
                        arrayCaracteristica: this.state.arrayCaracteristica,
                        arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                        validacion: this.state.validacion
                    });
                }else{
                    for (var i = 0; i < 6; i++){
                        if (i < 3){
                            this.state.items.push('');
                            this.state.arrayCaracteristica.push('');
                            this.state.arrayDetalleCaracteristica.push('');
                        }
                        this.state.validacion.push(1);
                    }
            
                    this.setState({
                        items: this.state.items,
                        arrayCaracteristica: this.state.arrayCaracteristica,
                        arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                        validacion: this.state.validacion
                    });
                }
            }

        }).catch(error => {
            console.log(error)
        });
    }

    getTipoVehiculo() {
        axios.get('/commerce/admin/getTipoVehiculo').then(resultado => {
            if(resultado.data.ok){
                this.setState({
                    arrayPadreVehiculo: resultado.data.data
                });
                var array = resultado.data.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrevehiculo == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idvehiculotipo
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolTipoVehiculo(array_aux);
                this.setState({
                    arrayTipoVehiculo: array_aux
                });
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
        var array =  this.state.arrayPadreVehiculo;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idvehiculotipo
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    getCaracteristicaVehiculo() {
        axios.get('/commerce/admin/getCaracteristicaVehiculo').then(resultado => {
            if(resultado.data.ok){
                this.setState({
                    caracteristicaVehiculo: resultado.data.data
                });
            }

        }).catch(error => {
            console.log(error)
        });
    }

    getCliente(page, buscar) {
        var url = '/commerce/admin/getCliente?page=' + page + '&buscar=' + buscar + '';
        axios.get(url).then(resultado => {
            this.setState({
                clientes: resultado.data.cliente.data,
                pagination: resultado.data.pagination
            });
        }).catch(error => {
            console.log(error)
        });
    }

    onChangeIsActivedPaginate() {
        return this.state.pagination.current_page;
    }

    onChangePagesNumber() {
        if (!this.state.pagination.to){
            return [];
        }
        var from = this.state.pagination.current_page - this.state.offset;

        if (from < 1){
            from = 1;
        }

        var to = from + (this.state.offset * 2);

        if (to >=this.state.pagination.last_page){
            to = this.state.pagination.last_page;
        }

        var pageArray = [];

        while (from <= to){
            pageArray.push(from);
            from++;
        }
        return pageArray;
    }

    cambiarPagina(page, buscar) {
        this.state.pagination.current_page = page;
        this.setState({
            pagination: this.state.pagination
        });
        this.getCliente(page,  buscar);
    }

    handleAddRow() {
        this.state.items.push('');
        this.state.arrayCaracteristica.push('');
        this.state.arrayDetalleCaracteristica.push('');
        this.setState({
            items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    handleRemoveRow(indice) {

        if (this.state.items[indice] != ''){
            this.state.arrayDeleteCaracteristica.push(this.state.items[indice]);
            this.setState({
                arrayDeleteCaracteristica: this.state.arrayDeleteCaracteristica
            });
        }

        this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            items: this.state.items,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            arrayCaracteristica: this.state.arrayCaracteristica,
        });
    }

    cerrarModal() {
        this.setState({
            modal: 'none'
        })
    }

    abrirModal(bandera) {
        this.setState({
            modal: 'block',
            bandera: bandera
        })
    }

    aumentarCaracteres() {
        this.setState({
            nroCracteres: this.state.nroCracteres + 1
        })
    }

    decrementarCaracteres() {
        if (this.state.nroCracteres > 1) {
            this.setState({
                nroCracteres: this.state.nroCracteres - 1
            })
        }
    }

    onChangeNroCracteres(e) {
        this.setState({
            nroCracteres: e.target.value
        })
    }

    evaluarGenerationCode(bandera) {
        if (bandera === 1){
            this.state.configuracion.numeros = !this.state.configuracion.numeros;
            this.setState({
                configuracion: this.state.configuracion
            })
        }
        if (bandera === 2){
            this.state.configuracion.minusculas = !this.state.configuracion.minusculas;
            this.setState({
                configuracion: this.state.configuracion
            })
        }
    }

    generarCode() {
        var caracterFinales = '';
        var claveCodigo = '';
        for (var propiedad in this.state.configuracion){
            if (this.state.configuracion[propiedad] == true){
                caracterFinales = caracterFinales + this.state.caracteres[propiedad] + ' ';
            }
        }
        caracterFinales = caracterFinales.trim();
        caracterFinales = caracterFinales.split(' ');
        for (var i = 0; i < this.state.nroCracteres; i++) {
            claveCodigo = claveCodigo + caracterFinales[Math.floor(Math.random() * caracterFinales.length)];
        }
        this.setState({
            codigoGenerado: claveCodigo
        });
    }

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return(
                <div className="card-body-content" style={{'background': (this.state.bandera === 1)?'#212139':'#fff'}}>
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Generador de Codigo </h1>
                    </div>
                    <div className="pull-right-content">
                        <i className="fa fa-times" onClick={this.cerrarModal.bind(this)}> </i>
                    </div>
                    <div className="form-group-content">
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content label-generation text-center-content">
                                Numero de Caracteres
                            </label>
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content nroCaracteres">
                                <div>
                                    <button className="btn-generation" onClick={this.decrementarCaracteres.bind(this)}>
                                        <i className="fa fa-minus"> </i>
                                    </button>
                                </div>
                                <div>
                                    <input type="text" className="input-generation" readOnly 
                                        value={this.state.nroCracteres} onChange={this.onChangeNroCracteres.bind(this)}/>
                                </div>
                                <div>
                                    <button className="btn-generation" onClick={this.aumentarCaracteres.bind(this)}>
                                        <i className="fa fa-plus"> </i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content label-generation text-center-content">
                                ¿ Incluir Numeros ?
                            </label>
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                <button className={(this.state.configuracion.numeros)?'btn-generation':'btn-generation false'} 
                                    onClick={this.evaluarGenerationCode.bind(this, 1)}>
                                    <i className={(this.state.configuracion.numeros)?'fa fa-check':'fa fa-times'}> </i>
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content label-generation text-center-content">
                                ¿ Incluir Minisculas ?
                            </label>
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                <button className={(this.state.configuracion.minusculas)?'btn-generation':'btn-generation false'}
                                    onClick={this.evaluarGenerationCode.bind(this, 2)}>
                                    <i className={(this.state.configuracion.minusculas)?'fa fa-check':'fa fa-times'}> </i>
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                            <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-4-content fila-generation">
                                <button className="btn-generation btn-generation-generar" onClick={this.generarCode.bind(this)}> Generar 
                                    <i className="fa fa-lock"></i>
                                </button>
                            </div>

                            <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content"> </div>
                            
                            <div className="col-lg-7-content col-md-7-content col-sm-7-content col-xs-7-content">
                                <input type="text" className="input-generation input-generar"
                                    readOnly value={this.state.codigoGenerado} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    onChangeCodigoVehiculo(e) {
        this.state.validacion[0] = 1;
        this.setState({
            codigoVehiculo: e.target.value,
            validacion: this.state.validacion
        });
    }

    onChangePlacaVehiculo(e) {
        this.state.validacion[1] = 1;
        this.setState({
            placaVehiculo: e.target.value,
            validacion: this.state.validacion
        });
    }

    onChangeChasisVehiculo(e) {
        this.state.validacion[2] = 1;
        this.setState({
            chasisVehiculo: e.target.value,
            validacion: this.state.validacion,
            mensaje: 'Chasis*'
        });
    }

    onChangeTipoVehiculo(e) {
        this.state.validacion[3] = 1;
        this.setState({
            tipoVehiculo: e.target.value,
            validacion: this.state.validacion 
        });
    }

    onChangeIdCliente(e) {
        this.setState({
            idCliente: e.target.value
        })
    }

    onchangeSeleccionCliente(id, nombre, apellido, codigo) {
        this.state.validacion[4] = 1;
        this.setState({
            idCliente: id,
            nombreCliente: nombre + ' ' + apellido,
            validacion: this.state.validacion,
            codigoCliente: codigo
        });
        if (!this.state.seleccionClienteNombre) {
            this.setState({
                seleccionClienteNombre: !this.state.seleccionClienteNombre,
                buscarCliente: ''
            });
        }
        if (!this.state.seleccionClienteID) {
            this.setState({
                seleccionClienteID: !this.state.seleccionClienteID,
                buscarCliente: ''
            });
        }
        this.getCliente(1, '');
    }

    cerrarOpcionSelect() {
        if (!this.state.seleccionClienteNombre) {
            this.setState({
                seleccionClienteNombre: !this.state.seleccionClienteNombre,
                buscarCliente: ''
            })
        }
        if (!this.state.seleccionClienteID) {
            this.setState({
                seleccionClienteID: !this.state.seleccionClienteID,
                buscarCliente: ''
            })
        }
    }

    abrirSeleccionCliente(bandera) {
        if (bandera === 1){
            this.setState({
                seleccionClienteID: !this.state.seleccionClienteID,
                buscarCliente: ''
            });
            if (!this.state.seleccionClienteNombre) {
                this.setState({
                    seleccionClienteNombre: !this.state.seleccionClienteNombre,
                    buscarCliente: ''
                });
            }
        }else{
            this.setState({
                seleccionClienteNombre: !this.state.seleccionClienteNombre,
                buscarCliente: ''
            });
            if (!this.state.seleccionClienteID) {
                this.setState({
                    seleccionClienteID: !this.state.seleccionClienteID,
                    buscarCliente: ''
                });
            }
        }
    }

    onChangeBuscar(e) {
        this.setState({
            buscarCliente: e.target.value
        });
        this.getCliente(1, e.target.value)
    }

    deleteSeleccionCliente() {
        this.setState({
            nombreCliente: '',
            idCliente: 0
        })
    }

    onChangeArrayCarracteristica(e) {
        this.state.arrayCaracteristica[e.target.id] = e.target.value;
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
        });
    }

    onChangeArrayDetalleCaracteristica(e) {
        this.state.arrayDetalleCaracteristica[e.target.id] = e.target.value;
        this.setState({
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica
        });
    }

    onChangeImage(e) {
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                var longitud = this.state.arrayImage.length;
                const image = {
                    idvehiculofoto: 0,
                    foto: e.target.result
                };
                this.state.arrayImage.push(image);
                this.setState({
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

    handleRemoveImage() {
        const newImage = this.state.arrayImage;
        if (this.state.arrayImage[this.state.indice].idvehiculofoto != 0) {
            this.state.arrayImageRemove.push(this.state.arrayImage[this.state.indice].idvehiculofoto);
        }

        newImage.splice(this.state.indice, 1);

        if (this.state.indice === (this.state.arrayImage.length)){
            this.setState({
                indice: 0
            });
        }
        this.setState({
            arrayImage: newImage,
            arrayImageRemove: this.state.arrayImageRemove
        });

    }

    onChangeNotaVehiculo(e) {
        this.setState({
            notaVehiculo: e.target.value
        });
    }

    onchangeDescripcionVehiculo(e) {
        this.setState({
            descripcionVehiculo: e.target.value
        });
    }

    onChangeTreeFamilyTipoCard(value) {
        this.state.validacion[5] = 1;
        this.setState({
            valueTreeFamilyTipoCard: value,
            validacion: this.state.validacion
        });
    }

    regresarListado() {
        this.setState({
            redirect: !this.state.redirect
        })
    }

    cerrarModalImage() {
        this.setState({
            modalImage: 'none',
            tecla: 0
        })
    }

    abrirModalImage() {
        this.setState({
            modalImage: 'block',
            tecla: 1
        })
    }

    onChangeModalImage() {
        return (
            <div className="content-img">
                <i className="fa fa-times fa-delete-image" onClick={this.cerrarModalImage.bind(this)}> </i>
                {(this.state.arrayImage.length === 0)?'':
                    <img src={this.state.arrayImage[this.state.indice].foto}
                        alt="none" className="img-principal" 
                        style={{'objectFit': 'fill', 'borderRadius': '8px'}} />
                }
                {(this.state.arrayImage.length > 1)?
                <div className="pull-left-content">
                    <i onClick={this.onChangePreview.bind(this)}
                        className="fa-left-content fa fa-angle-double-left"> </i>
                </div>:''
                }
                {(this.state.arrayImage.length > 1)?
                    <div className="pull-right-content">
                        <i onClick={this.onChangeNext.bind(this)}
                            className="fa-right-content fa fa-angle-double-right"> </i>
                    </div>:''
                }
            </div>
        );
    }

    onSubmit(e) {
        e.preventDefault();

        var newArray = [];

        this.state.arrayDetalle.map(
            resultado => {
                newArray.push(resultado.iddetallevehicarac);
            }
        );

        console.log(newArray);
        console.log(this.state.items);
        console.log(this.state.arrayDeleteCaracteristica);
        console.log(this.state.arrayCaracteristica);
        console.log(this.state.arrayDetalleCaracteristica);
        //console.log(this.state.arrayImage);

        if ((this.state.codigoVehiculo.length > 0) && (this.state.placaVehiculo.length > 0) && 
            (this.state.chasisVehiculo.length > 0) && (this.state.tipoVehiculo.length > 0) && 
            (this.state.idCliente > 0) && (this.state.valueTreeFamilyTipoCard > 0)){
            
            const formData = new FormData();
            
            formData.append('idvehiculo', this.props.match.params.id);
            formData.append('codigoVehiculo', this.state.codigoVehiculo);
            formData.append('placaVehiculo', this.state.placaVehiculo);
            formData.append('chasisVehiculo', this.state.chasisVehiculo);
            formData.append('tipoVehiculo', this.state.tipoVehiculo);
            formData.append('idCliente', this.state.idCliente);
            formData.append('notaVehiculo', this.state.notaVehiculo);
            formData.append('descripcionVehiculo', this.state.descripcionVehiculo);
            formData.append('tipo', this.state.valueTreeFamilyTipoCard);

            formData.append('imagenVehiculo', JSON.stringify(this.state.arrayImage));

            formData.append('caracteristica', JSON.stringify(this.state.arrayCaracteristica));
            formData.append('detalleCaracteristica', JSON.stringify(this.state.arrayDetalleCaracteristica));
            formData.append('items', JSON.stringify(this.state.items));

            formData.append('arrayDelete', JSON.stringify(this.state.arrayDeleteCaracteristica));

            formData.append('array', JSON.stringify(newArray));

            formData.append('ImageDelete', JSON.stringify(this.state.arrayImageRemove));

            axios.post('/commerce/admin/updateVehiculo', formData).then(
                (response) => {
                    if (response.data.response === 1){
                        this.regresarListado();
                    }
                    if (response.data.response === 0) {
                        console.log(response.data.data);
                    }
                    if (response.data.response === 2) {
                        console.log(response.data.data);
                        this.state.validacion[2] = 2;
                        this.setState({
                            mensaje: response.data.data,
                            validacion: this.state.validacion
                        });
                    }
            }).catch(
                error => {
                    console.log(error);
                }
            )
        }else {
            if (this.state.codigoVehiculo.length === 0) {
                this.state.validacion[0] = 0;
            } 
            if (this.state.placaVehiculo.length === 0) {
                this.state.validacion[1] = 0;
            } 
            if (this.state.chasisVehiculo.length === 0) {
                this.state.validacion[2] = 0;
            } 
            if (this.state.tipoVehiculo.length === 0) {
                this.state.validacion[3] = 0;
            } 
            if (this.state.idCliente === 0) {
                this.state.validacion[4] = 0;
            }
            
            if (this.state.valueTreeFamilyTipoCard === 0) {
                this.state.validacion[5] = 0;
            } 
    
            this.setState({
                validacion: this.state.validacion
            });
        }

    }

    render() {

        const componentModalShow = this.onChangeModalShow();

        const componentImage = this.onChangeModalImage();

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/indexVehiculo"/>)
        }

        return (
            
            <div className="row-content" onClick={this.cerrarOpcionSelect.bind(this)}>

                <div id="capaModal" onClick={this.cerrarModal.bind(this)}
                    style={{'display': this.state.modal}}
                    className="divModal">
                </div>
                <div id="capaFormulario"
                    style={{'display': this.state.modal,
                            'background': (this.state.bandera === 1)?'#212139':'#fff'}}
                     className="divFormulario">
                     {componentModalShow}
                </div>

                <div className="divModalImagen" onClick={this.cerrarModalImage.bind(this)}
                    style={{'display': this.state.modalImage}}>
                     
                </div>
                <div className="divFormularioImagen" style={{'display': this.state.modalImage}}>
                     {componentImage}
                </div>

                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Actualizar Vehiculo </h1>
                    </div>
                </div>

                <div className="card-body-content">
                    <form className="form-content" onSubmit={this.onSubmit.bind(this)}
                            encType="multipart/form-data">
                        <div className="form-group-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <input type="text" 
                                        value={this.state.codigoVehiculo} onChange={this.onChangeCodigoVehiculo.bind(this)}
                                        className={(this.state.validacion[0] === 1)?'form-control-content':'form-control-content error'} 
                                        placeholder=" Ingresar Codigo"/>
                                    <i className="fa fa-barcode fa-content" 
                                        onClick={this.abrirModal.bind(this, 1)}> </i>
                                    <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Codigo*</label>
                                </div>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <input type="text" value={this.state.placaVehiculo} onChange={this.onChangePlacaVehiculo.bind(this)}
                                        className={(this.state.validacion[1] === 1)?'form-control-content':'form-control-content error'} 
                                        placeholder=" Ingresar Placa"/>
                                    <label className={(this.state.validacion[1] === 1)?'label-group-content':'label-group-content error'}>Placa*</label>
                                </div>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <input type="text" value={this.state.chasisVehiculo} onChange={this.onChangeChasisVehiculo.bind(this)}
                                        className={(this.state.validacion[2] === 1)?'form-control-content':(this.state.validacion[2] === 0)?'form-control-content error':'form-control-content warning'} 
                                        placeholder=" Ingresar Chasis"/>
                                    <label className={(this.state.validacion[2] === 1)?'label-group-content':(this.state.validacion[2] === 0)?'label-group-content error':'label-group-content warning'}>{this.state.mensaje}</label>
                                </div>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <select value={this.state.tipoVehiculo} 
                                        onChange={this.onChangeTipoVehiculo.bind(this)}
                                        className={(this.state.validacion[3] === 1)?'form-control-content':'form-control-content error'}>
                                        <option value=""> Seleccionar </option>
                                        <option value="R"> Privado </option>
                                        <option value="P"> Publico </option>
                                    </select>
                                    <label className={(this.state.validacion[3] === 1)?'label-group-content':'label-group-content error'}>Tipo*</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-1-content col-md-1-content col-sm-6-content col-xs-12-content">
                                <div className="text-center-content" style={{'transition': 'all .4s ease'}}>
                                    {(this.state.idCliente === 0)?
                                        <button type="button" className="btn-content btn-sm-content btn-success-content">
                                            <i className="fa fa-plus"> </i>
                                        </button>:
                                        <button type="button" className="btn-content btn-sm-content btn-primary-content">
                                            <i className="fa fa-eye"> </i>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <div style={{'transition': 'all .4s ease'}} onClick={this.abrirSeleccionCliente.bind(this, 1)}>
                                        <input type="text" readOnly style={{'cursor': 'pointer', 'textAlign': 'center'}}
                                            className={(this.state.validacion[4] === 1)?'form-control-content':'form-control-content error'}
                                            onChange={this.onChangeIdCliente.bind(this)}
                                            value={(this.state.codigoCliente === '')?'Seleccionar':this.state.codigoCliente} />
                                        <i className="fa fa-caret-down fa-content"> </i>

                                        <label className={(this.state.validacion[4] === 1)?'label-group-content':'label-group-content error'}>Cod Cliente*</label>
                                    </div>
                                    {(this.state.idCliente === 0)?'':
                                        <i className="fa fa-times fa-content" onClick={this.deleteSeleccionCliente.bind(this)} style={{'right': '20px'}}> </i>
                                    }
                                    <div className="menu-content" style={{'display': (this.state.seleccionClienteID)?'none':'block'}}>
                                        <div className="sub-menu-content">
                                            <input type="text" maxLength="20" ref={function(input) {if (input != null) {input.focus();}}}
                                                onChange={this.onChangeBuscar.bind(this)}
                                                value={this.state.buscarCliente}
                                                className="form-control-outline-content" />
                                            <i className="fa fa-search fa-content" style={{'top': '2px'}}> </i>
                                        </div>
                                        {this.state.clientes.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice} className="sub-menu-content">
                                                        <input type="text" className={(this.state.idCliente == resultado.idcliente)?'input-content active':'input-content'} 
                                                            onClick={this.onchangeSeleccionCliente.bind(this, resultado.idcliente, resultado.nombre, resultado.apellido, resultado.codcliente)}
                                                             id={resultado.idcliente} readOnly value={resultado.codcliente} />
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div> 
                                </div>
                            </div>
                            <div className="col-lg-5-content col-md-5-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <div style={{'transition': 'all .4s ease', 'width': '100%'}} onClick={this.abrirSeleccionCliente.bind(this, 2)}>
                                        <input type="text" readOnly style={{'cursor': 'pointer', 'textAlign': 'center'}}
                                            className={(this.state.validacion[4] === 1)?'form-control-content':'form-control-content error'} 
                                            onChange={this.onChangeIdCliente.bind(this)}
                                            value={(this.state.idCliente === 0)?'Seleccionar...':this.state.nombreCliente} />
                                        <i className="fa fa-caret-down fa-content"> </i>
                                        <label className={(this.state.validacion[4] === 1)?'label-group-content':'label-group-content error'}>Nombre Cliente*</label>
                                    </div>
                                    {(this.state.idCliente === 0)?'':
                                        <i className="fa fa-times fa-content" onClick={this.deleteSeleccionCliente.bind(this)} style={{'right': '20px'}}> </i>
                                    }
                                    <div className="menu-content" 
                                        style={{'display': (this.state.seleccionClienteNombre)?'none':'block'}}>
                                        <div className="sub-menu-content">
                                            <input type="text" maxLength="20" ref={function(input) {if (input != null) {input.focus();}}}
                                                onChange={this.onChangeBuscar.bind(this)}
                                                value={this.state.buscarCliente} className="form-control-outline-content" />
                                            <i className="fa fa-search fa-content" style={{'top': '2px'}}> </i>
                                        </div>
                                        {this.state.clientes.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice} className="sub-menu-content">
                                                        <input type="text" className={(this.state.idCliente == resultado.idcliente)?'input-content active':'input-content'} 
                                                            onClick={this.onchangeSeleccionCliente.bind(this, resultado.idcliente, resultado.nombre, resultado.apellido, resultado.codcliente)}
                                                             id={resultado.idcliente} readOnly value={resultado.nombre + ' ' + resultado.apellido} />
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div> 
                                </div>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content">
                                <TreeSelect
                                    value={(this.state.valueTreeFamilyTipoCard === 0)?'Seleccionar':this.state.valueTreeFamilyTipoCard}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={this.state.arrayTipoVehiculo}
                                    allowClear
                                    className={(this.state.validacion[5] === 1)?'':'tree-error'}
                                    onChange={this.onChangeTreeFamilyTipoCard.bind(this)}
                                />
                                <label className={(this.state.validacion[5] === 1)?'label-group-content':'label-group-content error'}>Vehiculo*</label>
                            </div>
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-12-content">
                                <div className="card-caracteristica">
                                    <div className="pull-left-content">
                                        <h1 className="title-logo-content"> Caracteristica </h1>
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
                                                                value={this.state.arrayCaracteristica[indice]}
                                                                onChange={this.onChangeArrayCarracteristica.bind(this)}>
                                                                <option value="">Seleccionar</option>

                                                                {this.state.caracteristicaVehiculo.map(
                                                                    (element, i) => {
                                                                        return (
                                                                            <option key={i} value={element.idvehiculocaracteristica}>
                                                                                {element.caracteristica}
                                                                            </option>
                                                                        )
                                                                    }
                                                                )}

                                                            </select>
                                                        </div>
                                                        <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                                            <input type="text"  id={indice}
                                                                    onChange={this.onChangeArrayDetalleCaracteristica.bind(this)}
                                                                    value={this.state.arrayDetalleCaracteristica[indice]}
                                                                    placeholder=" Ingresar detalles ..."
                                                                    className="form-control-content"
                                                            />
                                                        </div>
                                                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content">
                                                            <div className="text-center-content">
                                                                <i onClick={this.handleRemoveRow.bind(this, indice)}
                                                                    className="fa fa-times btn-content btn-danger-content"> </i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-12-content">
                                <div className="card-caracteristica" style={{'border': '1px solid transparent'}}>
                                    <div className="pull-left-content">
                                        <i className="styleImg fa fa-upload img-izq">
                                            <input type="file" className="img-content"
                                                onChange={this.onChangeImage.bind(this)} />
                                        </i>
                                    </div>
                                    {(this.state.arrayImage.length > 0)?
                                        <div className="pull-right-content">
                                            <i onClick={this.handleRemoveImage.bind(this)}
                                                className="styleImg fa fa-times img-der"> </i>
                                        </div>:''
                                    }
                                    <div className="caja-img">
                                        {(this.state.arrayImage.length === 0)?
                                            <img src="/images/default.jpg" alt="none" className="img-model" />
                                            :
                                            <img style={{'cursor': 'pointer'}} onClick={this.abrirModalImage.bind(this)}
                                                src={this.state.arrayImage[this.state.indice].foto}
                                                alt="none" className="img-model" />
                                            
                                        }
                                    </div>
                                    {(this.state.arrayImage.length > 1)?
                                        <div className="pull-left-content">
                                            <i onClick={this.onChangePreview.bind(this)}
                                                className="fa-left-content fa fa-angle-double-left left-img"> </i>
                                        </div>:''
                                    }
                                    {(this.state.arrayImage.length > 1)?
                                        <div className="pull-right-content">
                                            <i onClick={this.onChangeNext.bind(this)}
                                                className="fa-right-content fa fa-angle-double-right right-img"> </i>
                                        </div>:''
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <textarea value={this.state.descripcionVehiculo}
                                    onChange={this.onchangeDescripcionVehiculo.bind(this)}
                                    className="textarea-content">
                                </textarea>
                                <label className="label-group-content">Descripcion</label>
                            </div>
                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <textarea value={this.state.notaVehiculo}
                                    onChange={this.onChangeNotaVehiculo.bind(this)}
                                    className="textarea-content">
                                </textarea>
                                <label className="label-group-content">Notas</label>
                            </div>
                        </div>
                        <div className="form-group-content">
                            <div className="text-center-content">
                                <button type="submit" className="btn-content btn-sm-content btn-success-content"
                                    style={{'marginRight': '20px'}}>
                                    Editar
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




