
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import { message } from 'antd';
import { Select } from 'antd';
const {Option} = Select;
import 'antd/dist/antd.css';

import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import CDatePicker from '../../../componentes/datepicker';
import CSelect from '../../../componentes/select2';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Button from '../../../componentes/data/button';
import C_Select from '../../../componentes/data/select';
import ws from '../../../utils/webservices';

export default class Reporte_Venta_Historico_Vehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            fkidgrupo: 0,

            redirect: false,

            fechaInicio: '',
            fechaFinal: '',
            idvehiculo: undefined,

            placa: '',
            cliente: '',

            arrayplaca: [],

            exportar: 'N',
            ordenar: 0,

            noSeseion: false,
            configCodigo: false
        }
    }

    componentDidMount() {
        var value = (typeof this.state.idvehiculo == 'undefined')?'':this.state.idvehiculo;

        let key = JSON.parse(readData(keysStorage.user));
        var idgrupo = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        this.setState({
            fkidgrupo: (idgrupo == null)?0:idgrupo,
        });

        this.getPlaca(1, value);
    }

    getPlaca(page, value) {
        var url = ws.wsventareporhistorico + '?page=' + page + '&buscar=' + value;
        httpRequest('get', url)
        .then(result => {
            if (result.response === 1) {
                this.setState({
                    arrayplaca: result.data.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSeseion: true })
            } else {
                console.log(result);
            }
        }).catch(
            error => console.log(error)
        );
    }

    onSearchPlaca(event) {
        setTimeout(() => {
            this.getPlaca(1, event);
        }, 400);
    }

    onChangePlaca(event) {
        let placa = '';
        let cliente = '';

        for (let i = 0; i < this.state.arrayplaca.length; i++) {
            if (this.state.arrayplaca[i].idvehiculo == event) {
                placa = this.state.arrayplaca[i].placa;
                let apellido = this.state.arrayplaca[i].apellido;
                let nombre = this.state.arrayplaca[i].nombre;
                cliente = (apellido == null)?nombre:nombre + ' ' + apellido;
                break;
            }
        }

        this.setState({
            idvehiculo: event,
            placa: placa,
            cliente: cliente,
        });
    }

    onDeletePlaca() {
        this.setState({
            idvehiculo: undefined,
            placa: '',
            cliente: '',
        });
    }

    onChangeFechaInicio(date, dateString) {
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
                fechaInicio: '',
            });
        }else {
            this.setState({
                fechaInicio: dateString,
            });
        }
    }
    onChangeFechaFinal(date, dateString) {
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
            });
        }else {
            if (dateString >= this.state.fechaInicio) {
                this.setState({
                    fechaFinal: dateString,
                });
            }else {
                message.error('Fecha incorrecta');
            }
        }
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }
    onChangeOrdenar(event) {
        this.setState({
            ordenar: event,
        });
    }

    back() {
        this.setState({
            redirect: true,
        });
    }

    limpiarDatos() {
        this.setState({

            fechaInicio: '',
            fechaFinal: '',
            placa: '',
            idvehiculo: undefined,

            exportar: 'N',
            ordenar: 0,
        });
    }

    componentArrayPlaca() {
        let array = [];
        let data = this.state.arrayplaca;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(
                <Option 
                    key={i} value={data[i].idvehiculo}>
                    {data[i].placa}
                </Option>
            );
        }
        return array;
    }

    onMessage() {
        message.error('Favor de seleccionar placa');
    }

    render() {

        const componentArrayPlaca = this.componentArrayPlaca();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSeseion){
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to={routes.venta_index} />)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte de histórico de ventas por vehículo</h1>
                    </div>

                    <form action={routes.reporte_venta_historico_generar} target="_blank" method="post">
                        
                        <input type="hidden" value={_token} name="_token" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />

                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={this.state.cliente} name="cliente" />
                        <input type="hidden" value={this.state.placa} name="placa" />

                        <input type="hidden" value={idusuario} name="idusuario" />
                        <input type="hidden" value={this.state.fkidgrupo} name="fkidgrupo" />

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-4 cols-md-4"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <CSelect
                                    showSearch={true}
                                    value={this.state.idvehiculo}
                                    placeholder={"Buscar por placa"}
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchPlaca.bind(this)}
                                    onChange={this.onChangePlaca.bind(this)}
                                    notFoundContent={null}
                                    component={componentArrayPlaca}
                                    title="Placa Vehiculo"
                                    onDelete={this.onDeletePlaca.bind(this)}
                                    allowDelete={true}
                                />
                                <input type="hidden" name="idvehiculo" 
                                    value={(typeof this.state.idvehiculo == 'undefined'?'':this.state.idvehiculo)} 
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <CDatePicker
                                    allowClear={true}
                                    value={this.state.fechaInicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Fecha Inicio"
                                />
                                <input type="hidden" value={this.state.fechaInicio} name="fechaInicio" />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <CDatePicker
                                    allowClear={true}
                                    value={this.state.fechaFinal}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title="Fecha Final"
                                    readOnly={
                                        (this.state.fechaInicio == '')?true:false
                                    }
                                />
                                <input type="hidden" value={this.state.fechaFinal} name="fechaFinal" />  
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Select
                                value={this.state.exportar}
                                onChange={this.onChangeExportar.bind(this)}
                                title='Exportar'
                                component={[
                                    <Option key={0} value="N"> Seleccionar </Option>,
                                    <Option key={1} value="P"> PDF </Option>,
                                    <Option key={2} value="E"> ExCel </Option>
                                ]}
                            />
                            <input type="hidden" name="exportar" value={this.state.exportar} />
                            
                            <C_Select 
                                value={this.state.ordenar}
                                title='Ordenar Por'
                                onChange={this.onChangeOrdenar.bind(this)}
                                component={[
                                    <Option key={0} value={0}> ID Venta </Option>,
                                    <Option key={1} value={1}> Fecha </Option>,
                                    <Option key={2} value={2}> Id Prod/Serv </Option>,
                                    <Option key={3} value={3}> Producto/Servicio </Option>,
                                    <Option key={4} value={4}> Cantidad </Option>,
                                    <Option key={5} value={5}> Precio Unitario </Option>,
                                ]}
                            />
                            <input type="hidden" name="ordenar" value={this.state.ordenar} /> 
                        </div>

                        <div className="form-group-content"
                            style={{'marginBottom': '-10px'}}>
                            <div className="txts-center">
                                <C_Button
                                    title='Limpiar'
                                    type='primary'
                                    onClick={this.limpiarDatos.bind(this)}
                                />
                                {(typeof this.state.idvehiculo == 'undefined')?
                                    <C_Button
                                        title='Generar'
                                        type='primary'
                                        onClick={this.onMessage.bind(this)}
                                    />
                                    :
                                    <C_Button
                                        title='Generar'
                                        type='primary'
                                        submit={true}
                                    />
                                }
                                
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}