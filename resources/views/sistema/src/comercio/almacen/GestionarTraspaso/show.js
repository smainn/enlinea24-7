
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link } from 'react-router-dom';
import { message, Modal, Select, Icon } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, hourToString, convertYmdToDmy } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';

import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';


const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
let dateIni = new Date();
let dateFin = new Date();
dateFin.setMonth(dateFin.getMonth() + 1);


export default class ShowTraspasoProducto extends Component{

    constructor(props){
        super(props);
        this.state = {

            codigo: '',
            tipotraspaso: '',
            fecha: dateToString(),
            hora: hourToString(),
            almacensalida: '',
            almacenentrada: '',
            productos: [],
            nota: '',

            redirect: false,
            noSesion: false,
            configCodigo: false,
        }
        
        this.permisions = {
            codigo: readPermisions(keys.traspaso_input_codigo),
            tipo: readPermisions(keys.traspaso_select_tipo),
            fecha: readPermisions(keys.traspaso_fecha),
            almacen_salida: readPermisions(keys.traspaso_sale_almacen),
            almacen_entrada: readPermisions(keys.traspaso_entra_almacen),
            notas: readPermisions(keys.traspaso_textarea_notas),
            t_cantidad: readPermisions(keys.traspaso_column_cantidad)
        }
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios,
                })
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    fechaTraspaso(value) {
        var array = value.split(' ');
        return convertYmdToDmy(array[0]);
    }
    horaTraspaso(value) {
        var array = value.split(' ');
        return array[1];
    }
    getTraspasoProducto() {
        var id = this.props.match.params.id;
        httpRequest('get', ws.wstraspasoshow + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                var detalle = result.detalle;
                var i = 0;
                var array = [];
                while (i < detalle.length) {
                    var objeto = {
                        codigo: detalle[i].codproducto,
                        producto: detalle[i].producto,
                        stockactualsalida: '',
                        stockactualentrante: '',
                        cantidad: detalle[i].cantidad,
                    }
                    if (detalle[i].fkidalmacen == result.data.fkidalmacen_sale) {
                        objeto.stockactualsalida = detalle[i].stock;
                    }else{
                        objeto.stockactualentrante = detalle[i].stock;
                    }

                    if (detalle[i + 1].fkidalmacen == result.data.fkidalmacen_sale) {
                        objeto.stockactualsalida = detalle[i + 1].stock;
                    }else{
                        objeto.stockactualentrante = detalle[i + 1].stock;
                    }
                    array.push(objeto);
                    i = i + 2;
                }
                this.setState({
                    codigo: result.data.codtraspaso,
                    tipotraspaso: result.data.tipo,
                    fecha: this.fechaTraspaso(result.data.fechahora),
                    hora: this.horaTraspaso(result.data.fechahora),
                    almacensalida: result.data.almacen_salida,
                    almacenentrada: result.data.almacen_entra,
                    nota: result.data.notas,
                    productos: array,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getTraspasoProducto();
    }

    redirect() {
        this.setState({ redirect: true});
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.traspaso_producto_index} />
            )
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Datos del Traspaso de Producto</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.codigo}
                                title='Codigo Traspaso'
                                configAllowed={this.state.configCodigo}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                            />

                            <C_Select
                                value={(this.state.tipotraspaso == '')?undefined:this.state.tipotraspaso}
                                readOnly={true}
                                component={[
                                    <Option 
                                        key={0} value={this.state.tipotraspaso}>
                                        {this.state.tipotraspaso}
                                    </Option>
                                ]}
                                title="Tipo Traspaso"
                                permisions={this.permisions.tipo}
                            />
                            <C_DatePicker 
                                value={this.state.fecha}
                                readOnly={true}
                                title="Fecha"
                                permisions={this.permisions.fecha}
                            />
                            <C_DatePicker 
                                value={this.state.hora}
                                readOnly={true}
                                title="Hora"
                                mode='time'
                                format='HH:mm:ss'
                                permisions={this.permisions.fecha}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Select
                                value={this.state.almacensalida}
                                readOnly={true}
                                component={[
                                    <Option 
                                        key={0} value={this.state.almacensalida}>
                                        {this.state.almacensalida}
                                    </Option>
                                ]}
                                title="Almacen Salida"
                                permisions={this.permisions.almacen_salida}
                            />
                            <C_Select
                                value={this.state.almacenentrada}
                                readOnly={true}
                                component={[
                                    <Option 
                                        key={0} value={this.state.almacenentrada}>
                                        {this.state.almacenentrada}
                                    </Option>
                                ]}
                                title="Almacen Entrante"
                                permisions={this.permisions.almacen_entrada}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                title='Nota'
                                value={this.state.nota}
                                className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                readOnly={true}
                                permisions={this.permisions.notas}
                            />
                        </div>
                        <div className="row-title">
                            Detalle de Productos de Almacen
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="table-content">
                                <table className="table-responsive-content">
                                    <thead>
                                        <tr style={{background: '#fafafa'}} className="row-header">
                                            <th colSpan='3'>
                                                    Productos
                                            </th>
                                            <th>
                                                Almacen-Salida
                                            </th>
                                            <th>
                                                Almacen-Entrante
                                            </th>
                                            <th style={{'textAlign': 'right'}}>

                                            </th>
                                        </tr>
                                        <tr style={{background: '#fafafa'}} className="row-header">
                                            <th>Nro</th>
                                            <th>Codigo</th>
                                            <th>Descripcion</th>
                                            <th>Stock Actual</th>
                                            <th>Stock Actual</th>
                                            <th>Cantidad a Traspasar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.productos.map(
                                            (data, key) => (
                                                <tr key={key}>
                                                    <th>
                                                        <label className="col-show">Nro: </label>
                                                        {key + 1}
                                                    </th>
                                                    <th>
                                                        <label className="col-show">Codigo Producto: </label>
                                                        <C_Select
                                                            value={
                                                                (data.codigo == '')?
                                                                    undefined: 
                                                                    data.codigo
                                                            }
                                                            placeholder={"Buscar por codigo"}
                                                            component={[
                                                                <Option key={0} value={data.codigo}>
                                                                    {data.codigo}
                                                                </Option>
                                                            ]}
                                                            className=''
                                                            readOnly={true}
                                                        />
                                                    </th>
                                                    <th>
                                                        <label className="col-show"> Producto: </label>
                                                        <C_Select
                                                            value={
                                                                (data.producto == '')?
                                                                    undefined: 
                                                                    data.producto
                                                            }
                                                            placeholder={"Buscar por nombre"}
                                                            component={[
                                                                <Option 
                                                                    key={0} value={data.producto}>
                                                                    {data.producto}
                                                                </Option>
                                                            ]}
                                                            readOnly={true}
                                                            className=''
                                                        />
                                                    </th>
                                                    <th>
                                                        <label className="col-show"> Stock Actual: </label>
                                                        <C_Input 
                                                            readOnly={true}
                                                            className='columna-table'
                                                            value={data.stockactualsalida}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </th>
                                                    <th>
                                                        <label className="col-show"> Stock Actual: </label>
                                                        <C_Input 
                                                            readOnly={true}
                                                            className='columna-table'
                                                            value={data.stockactualentrante}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </th>
                                                    <th style={{position: 'relative'}}>
                                                        <label className="col-show"> Cantidad: </label>
                                                        <C_Input 
                                                            readOnly={true}
                                                            className='columna-table'
                                                            value={data.cantidad}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </th>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button onClick={this.redirect.bind(this)}
                                    type='primary' title='Aceptar'
                                />
                            </div>
                        </div>
                
                    </div>

                </div>
            </div>
        );
    }
}


