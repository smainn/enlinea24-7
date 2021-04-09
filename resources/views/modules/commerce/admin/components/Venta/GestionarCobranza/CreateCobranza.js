
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, DatePicker, Select } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString, hourToString } from '../../../tools/toolsDate';
import { wscobranza, wssearchventaidcod } from '../../../WS/webservices';
const Option = Select.Option;
let dateNow = new Date();
export default class CreateCobranza extends Component{

    constructor(){
        super();
        this.state = {
            codcobro: '',
            fecha: dateToString(dateNow),
            hora: hourToString(dateNow),
            notas: '',

            cliente: '',
            montototal: 0,
            resultVentas: [],
            valSearchIdCod: undefined,
            timeoutSearchCod: null,

            redirect: false,
        }

        this.onChangeCobro = this.onChangeCobro.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeHora = this.onChangeHora.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onSearchVentaIdCod = this.onSearchVentaIdCod.bind(this);
        
    }

    onChangeCobro(e) {
        this.setState({ codcobro: e.target.value });
    }

    onChangeFecha(date,dateString) {
        this.setState({ fecha: dateString });
    }

    onChangeHora(date,dateString) {
        this.setState({ hora: dateString });
    }

    onChangeNotas(e) {
        this.setState({ notas: e.target.value });
    }

    storeCobranza(e) {
        //if(!this.confirmStore()) return;

        let body = {

        };

        console.log("BODY ",body);

        
        axios.post(wscobranza, body)
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

    searchVentaIdCod(value) {
        if (value.length > 0) {
            axios.get(wssearchventaidcod + '/' + value)
            .then((resp) => {
                let result = resp.data;
                console.log('RESULT SEARCH VENTA ', result);
                if (result.response > 0) {
                    this.setState({
                        resultVentas: result.data
                    });
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            /*
            this.setState({
                resultProveCod: []
            });
            */
        }
    }

    onSearchVentaIdCod(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(this.searchVentaIdCod(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    onChangeSearchVenta(value) {
        let array = this.state.resultVentas;
        let fullname = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i].idventa == value || array[i].codventa) {
                fullname = array[i].cliente.nombre + ' ' + array[i].cliente.apellido;
                break;
            }
        }
        let cliente = value + ' ' + fullname;
        this.setState({ 
            valSearchIdCod: value,
            cliente: cliente
        });
    }

    showConfirmStore(this2) {
        //e.preventDefault();
        Modal.confirm({
            title: 'Guardar Cobranza',
            content: '¿Esta seguro de registrar el cobro?',
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

    }

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/cobranza/index/"/>
            )
        }

        return (
            <div>
                
                <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Cobro </h1>
                        </div>
                </div>
        
                    <div className="col-lg-12-content">
                        
                        <div className="col-lg-3-content">
                            <input 
                                id="codvendedor" 
                                type="text"
                                value={this.state.codcobro}
                                placeholder="Codigo"
                                onChange={this.onChangeCobro}
                                className="form-control-content" 
                                />
                            <label 
                                htmlFor="codigo" 
                                className="label-content"> Codigo Cobro 
                            </label>
                        </div>

                        <div className="col-lg-3-content"
                            style={{backgroundColor: 'red'}}>
                            <Select
                                showSearch
                                value={this.state.valSearchIdCod}
                                placeholder={"Buscar proveedor por Id o Codigo"}
                                style={{ width: '100%' }}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchVentaIdCod}
                                onChange={this.onChangeSearchVenta}
                                notFoundContent={null}
                                allowClear={true}
                            >
                                {this.state.resultVentas.map((item, key) => (
                                    <Option 
                                        key={key} value={item.codventa}>
                                        {item.codventa}
                                    </Option>
                                ))}
                            </Select>
                            <label 
                                htmlFor="searchventa" 
                                className="label-content">
                                Codigo venta
                            </label>
                        </div>

                        <div className="col-lg-3-content"
                        style={{backgroundColor: 'green'}}
                        >
                            <DatePicker 
                                format='YYYY-MM-DD'
                                placeholder="Selecciona la Fecha"
                                style={{ width: '100%' }}
                                defaultValue={moment(this.state.fecha, 'YYYY-MM-DD')}
                                onChange={this.onChangeFecha} 
                            />
                            <label 
                                htmlFor="fecha" 
                                className="label-content">
                                Fecha Cobro
                            </label>
                        </div>
                        
                        <div className="col-lg-3-content"
                        style={{backgroundColor: 'yellow'}}
                        >
                            <DatePicker
                                showTime
                                mode='time'
                                format='HH:mm:ss'
                                placeholder="Selecciona la hora"
                                defaulValue={moment(this.state.hora,'HH:mm:ss')}
                                onChange={this.onChangeHora}
                                onOk={this.onOk}
                                style={{ width: '100%' }}
                            />
                            <label 
                                htmlFor="hora" 
                                className="label-content">
                                Hora
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-12-content">
                        <div className="col-lg-3-content">
                            <input 
                                id="cliente" 
                                type="text"
                                value={this.state.cliente}
                                placeholder="Cliente"
                                className="form-control-content" 
                                />
                            <label 
                                htmlFor="cliente" 
                                className="label-content">
                                Cliente 
                            </label>
                        </div>
                        
                        <div className="col-lg-3-content">
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
                                className="label-content">
                                apellido 
                            </label>
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
            </div>
        );
    }
}


