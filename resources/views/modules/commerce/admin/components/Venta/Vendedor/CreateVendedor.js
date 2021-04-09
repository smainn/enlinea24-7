
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString } from '../../../tools/toolsDate';

const URL_GET_COMSION_VENTA = '/commerce/api/comisionventa';
const URL_GET_REFERENCIAS = '/commerce/api/referenciacontacto';
const URL_STORE_VENDEDOR = '/commerce/api/vendedor';

let dateReference = new Date();
dateReference.setFullYear(dateReference.getFullYear() - 18);
export default class CreateVendedor extends Component{

    constructor(){
        super();
        this.state = {
            codvendedor: '',
            nombre: '',
            apellido: '',
            sexo: 'N',
            nit: '',
            fechanac: dateToString(dateReference),
            idcomision: 0,
            notas: '',
            foto: '',
            nameFoto: '',
            comisionventa: [],
            referencias: [],
            dataRefencias: [],
            dataValues: [],
            redirect: false,
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
    }

    handleCodVendedor(e) {
        this.setState({
            codvendedor: e.target.value
        });
    }

    handleNombre(e) {
        this.setState({
            nombre: e.target.value
        });
    }

    handleApellido(e) {
        this.setState({
            apellido: e.target.value
        });
    }

    handleNit(e) {
        this.setState({
            nit: e.target.value
        });
    }

    handleSexo(e) {
        this.setState({
            sexo: e.target.value
        });
    }

    handleComision(e) {
        console.log(e.target.value);
        this.setState({
            idcomision: e.target.value
        });
    }

    handleRefencias(e) {
        
        let index = e.target.id;
        let valor = e.target.value;
        console.log('index',index);
        console.log('valor',valor);
        if (valor == 0) {
            this.state.dataValues[index] = "";
        }
        this.state.dataRefencias[index] = parseInt(valor);
        console.log('REFERENCIAS ',this.state.dataRefencias);
        console.log('VALUES ',this.state.dataValues);
        this.setState({
            dataRefencias: this.state.dataRefencias
        });

    }
    
    handleInputD(e) {

        console.log('TARGET ', e.target);
        console.log('INDEX (id)', e.target.id);
        console.log('VALOR (value)', e.target.value);
        let index = e.target.id;
        let valor = e.target.value;
        if (this.state.dataRefencias[index] == 0) return;

        this .state.dataValues[index] = valor;

        console.log('REFERENCIAS ',this.state.dataRefencias);
        console.log('VALUES ',this.state.dataValues);
        this.setState({
            dataValues: this.state.dataValues
        });
       
    }

    handleNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    handleFechaNac(date, dateString) {
        console.log('DATE ', date); 
        console.log('DATE STRING', dateString);
        let dateReference = new Date();
        dateReference.setFullYear(dateReference.getFullYear() - 18);
        dateReference.getDate(dateReference.getDate() - 1);
        let dateNac = stringToDate(dateString);
        if (dateReference < dateNac) {
            message.error('El vendedor debe ser mayor de edad');
        } else {
            this.setState({
                fechanac: dateString
            });
        }

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
                    style={{'cursor': 'pointer'}}
                    src={this.state.foto}
                    alt="none" className="img-principal" />
            )
        }
    }

    removeImg() {
        this.setState({
            foto: ''
        });
    }

    iconDelete() {
        
        if (this.state.foto !== '') {
            return (
                <i 
                    className="styleImg fa fa-times"
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
        console.log(e.target.files[0]);
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
            console.log("result ",e.target);
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

        console.log("REFEREN ",arrayRef);
        console.log("VALUES ",arrayVal);
    }

    async confirmStore() {
        return await Modal.confirm({
                        title: 'Guardar Vendedor',
                        content: '¿Esta seguro de registrar al vendedor?',
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
    storeVendedor(e) {
        //if(!this.confirmStore()) return;
        e.preventDefault();
        
        let dataValues = [];
        let dataReferencias = [];
        this.getIndexSeleccionadosReferencias(dataReferencias, dataValues);

        let body = {
            "codvendedor": this.state.codvendedor,
            "nombre": this.state.nombre,
            "apellido": this.state.apellido,
            "nit": this.state.nit,
            "sexo": this.state.sexo,
            "fechanac": this.state.fechanac,
            "idcomision": this.state.idcomision,
            "notas": this.state.notas,
            "foto": this.state.foto,
            "namefoto": this.state.nameFoto,
            "dataValues": JSON.stringify(dataValues),
            "dataReferencias": JSON.stringify(dataReferencias)
        };

        console.log("BODY ",body);

        
        axios.post(URL_STORE_VENDEDOR, body)
        .then((resp) => {
            let result = resp.data;
            console.log(result);
            if (result.response > 0) {
                message.success(result.message);
                this.setState({redirect: true});
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    removeRowReferencia(index) {

        console.log(index);
        this.state.dataRefencias.splice(index, 1);
        this.state.dataValues.splice(index, 1);
        this.setState({
            dataRefencias: this.state.dataRefencias,
            dataValues: this.state.dataValues
        });
    }

    getComisionVenta() {

        axios.get(URL_GET_COMSION_VENTA)
        .then((resp) => {
            let result = resp.data;
            //console.log(result);
            if (result.response > 0 && result.data.length > 0) {
                let id = result.data[0].idcomisionventa;
                this.setState({
                    comisionventa: result.data,
                    idcomision: id
                });
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getReferenciaContactos() {

        axios.get(URL_GET_REFERENCIAS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                console.log('REF ',result.data);
                let total = 3;
                for (let i = 0;i < total; i++) {
                    this.state.dataRefencias.push(0);
                    this.state.dataValues.push("");
                }

                this.setState({
                    referencias: result.data,
                    dataRefencias: this.state.dataRefencias,
                    dataValues: this.state.dataValues
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    addRowReferencia() {
        this.state.dataRefencias.push(0);
        this.state.dataValues.push("");
        this.setState({
            dataRefencias: this.state.dataRefencias,
            dataValues: this.state.dataValues
        });
    }

    showConfirmStore(this2) {
        //e.preventDefault();
        Modal.confirm({
            title: 'Guardar Vendedor',
            content: '¿Esta seguro de registrar al vendedor?',
            onOk() {
                console.log('OK');
                //this2.storeVendedor();
            },
            onCancel() {
                console.log('Cancel');
                return false;
            },
        });
    }

    componentDidMount() {
        this.getComisionVenta();
        this.getReferenciaContactos();
    }

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/vendedor/indexVendedor/"/>
            )
        }
        const iconDelete = this.iconDelete();
        const iconZoom = this.iconZoom();
        const componentImg = this.componentImg();

        return (
            <div>
                
                <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Vendedor </h1>
                        </div>
                </div>

                <form 
                    id="form_register"
                    className="formulario-content" 
                    encType="multipart/form-data"
                    onSubmit={this.storeVendedor}>
        
                    <div className="form-group-content col-lg-12-content">

                        <div className="col-lg-9-content">

                            <div className="col-lg-12-content">

                                <div className="col-lg-4-content">

                                    <input 
                                        id="codvendedor" 
                                        type="text"
                                        value={this.state.codvendedor}
                                        placeholder="Codigo"
                                        onChange={this.handleCodVendedor}
                                        className="form-control-content" 
                                        />
                                    <label 
                                        htmlFor="codigo" 
                                        className="label-content"> Codigo Vendedor 
                                    </label>

                                </div>

                                <div className="input-group-content col-lg-4-content">
                                    <select 
                                        id="idcomision" 
                                        name="idcomision"
                                        className="form-control-content"
                                        onChange={this.handleComision}>
                                            {
                                                this.state.comisionventa.map((item,key) => (
                                                    <option 
                                                        key={key} 
                                                        id={item.idcomisionventa} 
                                                        value={item.idcomisionventa}
                                                        >
                                                        {item.descripcion}
                                                    </option>
                                                ))
                                            }
                                    </select>
                                    <label 
                                        htmlFor="idcomision" 
                                        className="label-content">
                                        Comision Venta
                                    </label>
                                </div>
                                
                                <div className="input-group-content col-lg-4-content">

                                    <input 
                                        id="codigo" 
                                        type="text"
                                        value={this.state.nit}
                                        placeholder="Nit/Ci"
                                        onChange={this.handleNit}
                                        className="form-control-content" 
                                        />
                                    <label 
                                        htmlFor="codigo" 
                                        className="label-content"> Nit/Ci 
                                    </label>
                                </div>

                            </div>

                            
                            <div className="col-lg-12-content">

                                <div className="col-lg-4-content">

                                    <input 
                                        id="nombre" 
                                        type="text"
                                        value={this.state.nombre}
                                        placeholder="Nombre"
                                        onChange={this.handleNombre}
                                        className="form-control-content" 
                                        />
                                    <label 
                                        htmlFor="nombre" 
                                        className="label-content"> Nombre 
                                    </label>

                                </div>
                                
                                <div className="col-lg-4-content">

                                    <input 
                                        id="apellido" 
                                        type="text"
                                        value={this.state.apellido}
                                        placeholder="Apellido"
                                        onChange={this.handleApellido}
                                        className="form-control-content" 
                                        />
                                    <label 
                                        htmlFor="apellido" 
                                        className="label-content"> apellido 
                                    </label>

                                </div>
                                
                                <div className="col-lg-4-content">

                                    <select
                                        id="sexo"
                                        className="form-control-content"
                                        onChange={this.handleSexo}>
                                        <option value="N"> Ninguno </option>
                                        <option value="M"> Masculino </option>
                                        <option value="F"> Femenino </option>
                                    </select>

                                    <label 
                                        htmlFor="sexo" 
                                        className="label-content">
                                        Sexo 
                                    </label>

                                </div>

                            </div>

                            <div className="input-group-content col-lg-4-content">
                                {
                                    /**<DatePicker 
                                    style={{
                                        //marginLeft: 20,
                                        width: '65%'
                                    }}
                                    defaultValue={this.state.fechanac}
                                    placeholder={"Seleecione una fecha"}
                                    onChange={this.handleFechaNac} /> 

                                    
                                    <input 
                                        id="fechanac" 
                                        type="date"
                                        value={this.state.fechanac}
                                        placeholder="Fecha Nacimiento"
                                        onChange={this.handleFechaNac}
                                        className="form-control-content" 
                                    />
                                    <label 
                                        htmlFor="fechanac" 
                                        className="label-content"> Fecha Nacimiento 
                                    </label>
                                    */
                                }
                                <div className="col-lg-12-content">
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        onChange={this.handleFechaNac}
                                        //value={moment(this.state.fechanac, 'YYYY-MM-DD')}
                                        style={{
                                            alignContent: 'center'
                                        }}
                                    />
                                </div>
                                <div className="col-lg-12-content">
                                    <label 
                                        htmlFor="fechanac" 
                                        className="label-content"
                                        style={{
                                            alignContent: 'center'
                                        }}
                                    > 
                                        Fecha Nacimiento 
                                    </label>
                                </div>
                            </div>  

                        </div>

                        <div className="col-lg-3-content">
                            <div className="col-lg-12-content">
                                <div className="pull-left-content">
                                    <i className="styleImg fa fa-upload">
                                        <input type="file" className="img-content"
                                            onChange={this.selectImg}/>
                                    </i>
                                </div>

                                <div className="pull-right-content">
                                    { iconDelete }
                                </div>

                                <div className="caja-img caja-altura">
                                    { componentImg }
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="form-group-content col-lg-12-content">
                        
                        <div className="input-group-content col-lg-6-content">

                            <div className="card-caracteristica">
                                <div className="pull-left-content">
                                    <h1 className="title-logo-content"> Referencia para Contactarlo </h1>
                                </div>

                                <div className="pull-right-content">
                                    <i  
                                        className="fa fa-plus btn-content btn-secondary-content"
                                        style={{
                                            marginTop: 10,
                                            marginRight: 10
                                        }} 
                                        onClick={() => this.addRowReferencia()}> 
                                    </i>
                                </div>

                                <div className="caja-content caja-content-adl">

                                    {
                                        this.state.dataRefencias.map((item,key) => (

                                            <div key={key}>
                                                <div className="col-lg-5-content col-md-3-content col-sm-3-content col-xs-3-content">
                                                    <select  
                                                        id={key} 
                                                        key={key}
                                                        value={this.state.dataRefencias[key]}
                                                        className="form-control-content"
                                                        onChange={this.handleRefencias}>

                                                        <option value="0">Seleccione</option>
                                                        {
                                                            this.state.referencias.map((item,key)=>(
                                                                <option 
                                                                    value={item.idreferenciadecontacto}
                                                                    key={key}>
                                                                    {item.descripcion}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className="col-lg-6-content col-md-3-content col-sm-6-content col-xs-6-content">
                                                    <input
                                                        id={key} 
                                                        type="text" 
                                                        placeholder="Ingresar Descripcion"
                                                        value={this.state.dataValues[key]} 
                                                        className="form-control-content"
                                                        onChange={this.handleInputD}/>
                                                </div>

                                                <div className="col-lg-1-content col-md-1-content text-center-content">
                                                    <i 
                                                        className="fa fa-remove btn-content btn-danger-content"
                                                        style={{}} 
                                                        key={key}
                                                        onClick={() => this.removeRowReferencia(key) }> 
                                                    </i>
                                                </div> 

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                        </div>

                        <div className="input-group-content col-lg-6-content">
                                
                            <label 
                                htmlFor="idcomision" 
                                className="label-content">
                                Notas
                            </label>

                            <textarea
                                type="text"
                                className="textarea-content"
                                value={this.state.notas}
                                onChange={this.handleNotas}
                            />

                        </div>

                    </div>
                    
                    <div className="form-group-content">

                        <div className="text-center-content">
                            <button type="submit" className="btn-content btn-success-content">
                                Guardar
                            </button>
                            <button
                                className="btn-content btn-danger-content" 
                                type="button" 
                                onClick={() => this.setState({redirect: true})}>
                                Cancelar
                            </button>
                        </div>

                    </div>

                </form>                            
            </div>
        );
    }
}


