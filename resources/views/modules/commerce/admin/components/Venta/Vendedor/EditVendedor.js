
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString } from '../../../tools/toolsDate';

const URL_GET_COMSION_VENTA = '/commerce/api/comisionventa';
const URL_GET_REFERENCIAS = '/commerce/api/referenciacontacto';
const URL_UPDATE_VENDEDOR = '/commerce/api/vendedor/';
const URL_EDIT_VENDEDOR = '/commerce/api/vendedor/';

let dateReference = new Date();
dateReference.setFullYear(dateReference.getFullYear() - 18);
export default class EditVendedor extends Component{

    constructor(){
        super();
        this.state = {
            idvendedor: 0,
            codvendedor: '',
            nombre: '',
            apellido: '',
            sexo: 'N',
            nit: '',
            fechanac: '',
            idcomision: 0,
            notas: '',
            foto: '',
            estado: 'A',
            nameFoto: '',
            comisionventa: [],
            referencias: [],
            idsReferencias: [],
            dataReferencias: [],
            idsRefActuales: [],
            dataValues: [],
            dataReferenciasNew: [],
            dataValuesNew: [],
            idsEliminados: [],
            indexNew: [],
            eliminarImagen: false,
            redirect: false,
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
        this.state.dataReferencias[index].idrc = parseInt(valor);
        this.setState({
            dataReferencias: this.state.dataReferencias
        });

    }

    handleInputD(e) {
        let index = e.target.id;
        let valor = e.target.value;
        if (this.state.dataReferencias[index].idrc == 0) return;
        this.state.dataReferencias[index].valor = valor;

        this.setState({
            dataReferencias: this.state.dataReferencias
        });
       
    }

    handleNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    handleFechaNac(date, dateString) {

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
    
    handleEstado(e) {
        this.setState({
            estado: e.target.value
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
                    alt="none" className="img-principal" />
            )
        }
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
            console.log(e.target.files[0]);
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

    getVendedor() {

        const URL_UPDATE_VENDEDOR1 = URL_EDIT_VENDEDOR + this.props.match.params.id + "/edit";
        axios.get(URL_UPDATE_VENDEDOR1)
        .then((resp) => {
            let result = resp.data;
            console.log('VENDEDOR ',result);
            if (result.response > 0) {

                let array = [];
                let idsActuales = [];
                let longitud = result.referencias.length;
                for (let i = 0; i < longitud; i++) {
                    let object = {
                        idvc: result.referencias[i].idvendedorcontactarlo,
                        valor: result.referencias[i].valor,
                        idrc: result.referencias[i].idrefcontacto,
                    };
                    idsActuales.push(result.referencias[i].idvendedorcontactarlo);
                    array.push(object);

                }

                console.log('REFERENCIAS ', array);
                
                let vendedor = result.vendedor;
                this.setState({
                    idvendedor: vendedor.idvendedor,
                    codvendedor: vendedor.codvendedor,
                    nombre: vendedor.nombre,
                    apellido: vendedor.apellido,
                    foto: vendedor.foto,
                    sexo: vendedor.sexo,
                    fechanac: vendedor.fechanac,
                    idcomision: vendedor.fkidcomisionventa,
                    estado: vendedor.estado,
                    notas: vendedor.notas,
                    nit: vendedor.nit,
                    dataReferencias: array,
                    idsRefActuales: idsActuales
                });
            }
            
        })
        .catch((error) => {
            console.log(error);
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

        console.log('VALORES DE ACTUALIZADOS Y NUEVOS');
        console.log('DATA REF ', dataRef);
        console.log('DATA REF NEW ', dataRefNew);
        console.log('VALUE ', dataVal);
        console.log('VALUE NEW ', dataValNew);
    }

    validarDatos() {
        
        if (this.state.fechanac != '') {
            let date = stringToDate(this.state.fechanac);
            let aux = new Date();
            aux.setFullYear(aux.getFullYear() - 18);
            aux.getDate(aux.getDate() - 1);
            if (aux < date) {
                message.error('El vendedor debe ser mayor de edad');
                return false;
            }
        }
        return true;
    }

    updateVendedor(e) {

        e.preventDefault();
        if (!this.validarDatos()) return;

        let dataValues = [];
        let dataReferencias = [];
        let dataValuesNew = [];
        let dataReferenciasNew = [];
        this.getReferencias(dataReferencias, dataValues, dataReferenciasNew, dataValuesNew);
        let body = {
            "nombre": this.state.nombre,
            "apellido": this.state.apellido,
            "nit": this.state.nit,
            "sexo": this.state.sexo,
            "fechanac": this.state.fechanac,
            "idcomision": this.state.idcomision,
            "estado": this.state.estado,
            "notas": this.state.notas,
            "foto": this.state.foto,
            "namefoto": this.state.nameFoto,
            "dataValues": JSON.stringify(dataValues),
            "dataReferencias": JSON.stringify(dataReferencias),
            "dataValuesNew": JSON.stringify(dataValuesNew),
            "dataReferenciasNew": JSON.stringify(dataReferenciasNew),
            "idsEliminados": JSON.stringify(this.state.idsEliminados),
            "idsActualizar": JSON.stringify(this.state.idsRefActuales),
            "eliminarImagen": this.state.eliminarImagen
        };

        console.log("BODY ",body);

        const URL = URL_UPDATE_VENDEDOR + this.state.idvendedor;
        axios.put(URL, body)
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
        let array = this.state.dataReferencias;
        if (array[index].idvc > 0) {
            this.state.idsEliminados.push(array[index].idvc);
            let position = this.state.idsRefActuales.indexOf(array[index].idvc);
            if (position >= 0) {
                this.state.idsRefActuales.splice(position, 1);
            }
        }

        this.state.dataReferencias.splice(index, 1);
        this.setState({
            dataReferencias: this.state.dataReferencias,
            idsEliminados: this.state.idsEliminados,
            idsActuales: this.state.idsActuales
        });
    }

    getComisionVenta() {

        axios.get(URL_GET_COMSION_VENTA)
        .then((resp) => {
            let result = resp.data;
            //console.log(result);
            if (result.response > 0) {
                this.setState({
                    comisionventa: result.data
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

                this.setState({
                    referencias: result.data,
                    dataReferencias: this.state.dataReferencias,
                    dataValues: this.state.dataValues
                });
            }
        })
        .catch((error) => {
            console.log(error);
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
            dataReferencias: this.state.dataReferencias
        });
    }

    componentDidMount() {
        this.getComisionVenta();
        this.getReferenciaContactos();

        this.getVendedor();
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
        const fechanac = this.state.fechanac;

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
                    onSubmit={this.updateVendedor}>
        
                    <div className="form-group-content col-lg-12-content">

                        <div className="form-group-content col-lg-9-content">

                            <div className="form-group-content col-lg-12-content">

                                <div className="input-group-content col-lg-4-content">

                                    <input 
                                        id="codvendedor" 
                                        type="text"
                                        value={this.state.codvendedor}
                                        placeholder="Codigo"
                                        className="form-control-content cursor-not-allowed"
                                        readOnly
                                    />
                                    <label 
                                        htmlFor="codvendedor" 
                                        className="label-content"> Codigo Vendedor 
                                    </label>

                                </div>

                                <div className="input-group-content col-lg-4-content">

                                    <select 
                                        id="idcomision" 
                                        name="idcomision"
                                        value={this.state.idcomision}
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
                            
                            <div className="form-group-content col-lg-12-content">

                                <div className="input-group-content col-lg-4-content">

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

                                <div className="input-group-content col-lg-4-content">

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

                                <div className="input-group-content col-lg-4-content">

                                    <select
                                        id="sexo"
                                        value={this.state.sexo}
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
                                <div className="col-lg-12-content">
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        onChange={this.handleFechaNac}
                                        //defaultValue={moment(this.state.fechanac, 'YYYY-MM-DD')}
                                        placeholder={this.state.fechanac}
                                        //value={moment(this.state.fechanac, 'YYYY-MM-DD')}
                                    />
                                </div>
                                <div className="col-lg-12-content">
                                    <label 
                                        htmlFor="fechanac" 
                                        className="label-content"
                                    > 
                                        Fecha Nacimiento 
                                    </label>
                                </div>
                                
                            </div>

                            

                            <div className="col-lg-3-content">

                                <div className="text-center-content">
                                    <select 
                                        id="estado" 
                                        name="estado"
                                        value={this.state.estado}
                                        className="form-control-content"
                                        onChange={this.handleEstado}>
                                        
                                        <option value="A">Activo</option>
                                        <option value="N">No Activo</option>

                                    </select>

                                    <label 
                                        htmlFor="estado" 
                                        className="label-content">
                                        Estado
                                    </label>
                                </div>
                                
                            </div>   

                        </div>

                        <div className="form-group-content col-lg-3-content">

                            <div className="col-lg-12-content">

                                <div className="pull-left-content">
                                    <i className="styleImg fa fa-upload">
                                        <input type="file" className="img-content"
                                            onChange={this.selectImg}/>
                                    </i>
                                </div>

                                <div className="pull-right-content">
                                        
                                    {iconDelete}
                                        
                                </div>

                                <div className="caja-img caja-altura">
                                    
                                    {componentImg}

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
  
                                <div 
                                    className="pull-right-content"
                                    style={{
                                        marginTop: 10,
                                        marginRight: 10
                                    }}>
                                    <i 
                                        className="fa fa-plus btn-content btn-secondary-content" 
                                        onClick={() => this.addRowReferencias()}> 
                                    </i>
                                </div>

                                <div className="caja-content caja-content-adl">
                                    
                                    {
                                        this.state.dataReferencias.map((item,key) => (
                                            <div key={key}>
                                                <div className="col-lg-4-content col-md-3-content col-sm-3-content col-xs-3-content">
                                                    <select  
                                                        id={key} 
                                                        key={key}
                                                        value={this.state.dataReferencias[key].idrc}
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
                                                        value={this.state.dataReferencias[key].valor} 
                                                        className="form-control-content"
                                                        onChange={this.handleInputD}
                                                    />
                                                </div>

                                                <div className="col-lg-2-content col-md-1-content text-center-content">
                                                    <i 
                                                        className="fa fa-remove btn-content btn-danger-content"
                                                        style={{}} 
                                                        key={key}
                                                        onClick={() => this.removeRowReferencia(key)}> 
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


