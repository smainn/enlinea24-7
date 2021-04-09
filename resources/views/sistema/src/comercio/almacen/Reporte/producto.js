
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Spin, Select, TreeSelect, Icon } from 'antd';

import 'antd/dist/antd.css';
import TextArea from '../../../componentes/textarea';
import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Select from '../../../componentes/data/select';
import C_Input from '../../../componentes/data/input';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';
import C_TreeSelect from '../../../componentes/data/treeselect';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';

const {Option} = Select;

import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, PDFDownloadLink, Link, Font } from '@react-pdf/renderer';
import Confirmation from '../../../componentes/confirmation';

export default class Reporte_Producto extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,

            visible_reporte: false,

            loading: false,
            inputInicio: true,
            clienteesabogado: true,

            tipoproducto: '',
            descripcion: '',

            arrayFamilia: [],
            arrayArbolFamilia: [],
            familia: '',

            arrayUnidadMedida: [],
            medida: '',

            arrayMoneda: [],
            moneda: '',

            operacioncosto: '',
            costoinicio: '',
            costofin: '',

            operacionprecio: '',
            precioinicio: '',
            preciofin: '',

            operacionstock: '',
            stockinicio: '',
            stockfin: '',

            palabraclave: '',
            observacion: '',

            arrayProductoCaracteristica: [],
            cantidadArrayProductoCaracteristica: 0,

            items: [],

            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],
            noSesion: false,

            ordenacion: 1,

            array_result: {
                producto: [],
                fecha: '',
                hora: '',
                logo: '',
                esabogado: false,
                codigospropios: false,
            },
        }
    }

    componentDidMount() {

        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', ws.wsproductoreporte)
        .then(result => {
            if (result.response == 1) {
                
                if (result.data.length > 3) {
                    this.state.items = [0, 0, 0];
                    this.state.arrayCaracteristica = ['', '', ''];
                    this.state.arrayDetalleCaracteristica = ['', '', ''];
                }else {
                    for (var pos = 0; pos < result.data.length; pos++) {
                        this.state.items.push(0);
                        this.state.arrayCaracteristica.push('');
                        this.state.arrayDetalleCaracteristica.push('');
                    }
                }

                this.setState({

                    arrayFamilia: result.familia,
                    arrayUnidadMedida: result.unidad,
                    arrayMoneda: result.moneda,
                    arrayProductoCaracteristica: result.data,
                    cantidadArrayProductoCaracteristica: result.data.length,

                    items: this.state.items,
                    arrayCaracteristica: this.state.arrayCaracteristica,
                    arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                    clienteesabogado: result.config.clienteesabogado,
                });

                var array = result.familia;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrefamilia == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idfamilia
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolFamilia(array_aux);
                this.setState({
                    arrayArbolFamilia: array_aux
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);                
            }

        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    arbolFamilia(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].value);
            
            data[i].children = hijos;
            
            this.arbolFamilia(hijos);
        }
    }

    hijosFamilia(idpadre) {
        var array =  this.state.arrayFamilia;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrefamilia === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idfamilia
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    regresarIndex() {
        this.setState({
            redirect: true,
        });
    }

    onChangeTipoProducto(event) {
        this.setState({
            tipoproducto: event,
        });
    }

    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
        });
    }

    onChangeFamilia(event) {
        if (typeof event === 'undefined') {
            this.setState({
                familia: '',
            });
        }else {
            this.setState({
                familia: event,
            });
        }
    }

    onChangeUnidadMedida(event) {
        this.setState({
            medida: event,
        });
    }

    onChangeMoneda(event) {
        this.setState({
            moneda: event,
        });
    }

    onChangeOperacionCosto(event) {
        this.setState({
            operacioncosto: event.target.value,
            costofin: '',
        });
        if (event.target.value == '') {
            this.setState({
                costoinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado costo fin');
        }
    }

    onChangeCostoInicio(event) {
        if (!isNaN(event)) {
            this.setState({
                costoinicio: event,
            });
        }
    }

    onChangeCostoFin(event) {
        if (this.state.operacioncosto == '!') {
            if (!isNaN(event)) {
                this.setState({
                    costofin: event,
                });
            }
        }
    }

    onChangeOperacionPrecio(event) {
        this.setState({
            operacionprecio: event.target.value,
            preciofin: ''
        });
        if (event.target.value == '') {
            this.setState({
                precioinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado precio fin');
        }
    }

    onChangePrecioInicio(event) {
        if (!isNaN(event)) {
            this.setState({
                precioinicio: event,
            });
        }
    }

    onChangePrecioFin(event) {
        if (this.state.operacionprecio == '!') {
            if (!isNaN(event)) {
                this.setState({
                    preciofin: event,
                });
            }
        }
    }

    onChangeOperacionStock(event) {
        this.setState({
            operacionstock: event.target.value,
            stockfin: ''
        });
        if (event.target.value == '') {
            this.setState({
                stockinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado stock fin');
        }
    }

    onChangeStockInicio(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                stockinicio: event.target.value,
            });
        }
    }

    onChangeStockFin(event) {
        if (this.state.operacionstock == '!') {
            if (!isNaN(event)) {
                this.setState({
                    stockfin: event,
                });
            }
        }
    }

    onchangePalabraClave(event) {
        this.setState({
            palabraclave: event,
        });
    }

    onChangeObservacion(event) {
        this.setState({
            observacion: event,
        });
    }

    onChangeArrayDetalleCaracteristica(posicion, event) {
        this.state.arrayDetalleCaracteristica[posicion] = event.target.value;
        this.setState({
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    onChangeArrayCarracteristica(posicion, event) {
        this.state.arrayCaracteristica[posicion] = event.target.value;
        this.state.items[posicion] = event.target.value;
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
            items: this.state.items,
        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    handleAddRow() {
        if (this.state.items.length < this.state.cantidadArrayProductoCaracteristica) {
            this.state.items.push(0);
            this.state.arrayCaracteristica.push('');
            this.state.arrayDetalleCaracteristica.push('');
            this.setState({
                items: this.state.items,
                arrayCaracteristica: this.state.arrayCaracteristica,
                arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            });
        }
        if (this.state.items. length === this.state.cantidadArrayProductoCaracteristica) {
            message.success('cantidad completa de caracteristica');
        }
    }

    handleRemoveRow(indice) {
        this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    componentCaracteristica(posicion) {
        var arrayCaracteristica = [];

        this.state.arrayProductoCaracteristica.map(
            (resultado, indice) => {
                var bandera = 0;
                for (var i = 0; i < this.state.items.length; i++) {
                    if (this.state.items[i] != 0) {
                        if (i != posicion) {
                            if (this.state.items[i] != 0) {
                                if (resultado.idproduccaracteristica == this.state.items[i]) {
                                    bandera = 1;
                                }
                            }
                        }
                    }
                }
                if (bandera == 0) {
                    arrayCaracteristica.push(
                        <option key={indice} value={resultado.idproduccaracteristica}>
                            {resultado.caracteristica}
                        </option>
                    );
                }
            }
        );
        return arrayCaracteristica;
    }

    limpiarDatos() {
        this.setState({
            tipoproducto: '',
            descripcion: '',
            familia: '',
            medida: '',
            moneda: '',

            operacioncosto: '',
            costoinicio: '',
            costofin: '',

            operacionprecio: '',
            precioinicio: '',
            preciofin: '',

            operacionstock: '',
            stockinicio: '',
            stockfin: '',

            palabraclave: '',
            observacion: '',
        });
    }

    onSubmitReporte(event) {
        event.preventDefault();
        this.setState({ loading: true, });
        let obj = {
            tipoproducto: this.state.tipoproducto,
            descripcion: this.state.descripcion,
            familia: this.state.familia,
            medida: this.state.medida,
            moneda: this.state.moneda,
            operacioncosto: this.state.operacioncosto,
            costoinicio: this.state.costoinicio,
            costofin: this.state.costofin,
            operacionprecio: this.state.operacionprecio,
            precioinicio: this.state.precioinicio,
            preciofin: this.state.preciofin,
            operacionstock: this.state.operacionstock,
            stockinicio: this.state.stockinicio,
            stockfin: this.state.stockfin,
            palabraclave: this.state.palabraclave,
            observacion: this.state.observacion,
            ordenacion: this.state.ordenacion,
            arrayCaracteristica: JSON.stringify( this.state.arrayCaracteristica ), 
            arrayDetalleCaracteristica: JSON.stringify( this.state.arrayDetalleCaracteristica ), 
        };
        httpRequest('post', ws.wsproductoreporte_generar, obj)
        .then(result => {
            console.log(result);                
            if (result.response == 1) {
                
                this.setState({
                    array_result: result,
                }, () => {
                        this.setState({
                            visible_reporte: true,
                            loading: false,
                        })
                });

                return;

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Hubo error de conexion.')               
            }
            this.setState({ loading: false, });

        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({ loading: false, });
        });
    }

    render() {

        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio} />)
        }

        if (this.state.redirect){
            return (<Redirect to={routes.producto_index}/>)
        }

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        
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

        // Font.register({ family: 'Roboto' });


        const styles = StyleSheet.create({
            body: {
                paddingHorizontal: 20,
                paddingVertical: 35,
            },
            section: {
                margin: 10, padding: 10, flexGrow: 1,
            },
            head: {
                display: 'flex', flexDirection: 'row',
                paddingBottom: 5,
            },
            thead: {
                color: 'black', fontWeight: 'bold', fontSize: 10,
            },
            tbody: {
                color: 'black', fontSize: 8, height: 'auto',
            },
            borderwidthColor: {
                borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
                borderRightWidth: 1, borderRightColor: '#e8e8e8',
                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                borderTopWidth: 1, borderTopColor: '#e8e8e8',
            },
        });


        let width = this.state.array_result.esabogado ? '55%' : '25%';
        let esabogadoreport = this.state.array_result.esabogado;


        const MyDoc = (
            <Document title={'REPORTE PRODUCTO'}>
                <Page size="A4" orientation='landscape' style={styles.body}>
                    <Text style={{fontSize: 13, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** REPORTE PRODUCTO **'}
                    </Text>
                    <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
                        {this.state.array_result.fecha}
                    </Text>
                    <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
                        {this.state.array_result.hora}
                    </Text>

                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                        <View style={{width: '12%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ID
                            </Text>
                        </View>
                        <View style={{width: width, padding: 5, }}>
                            <Text style={styles.thead}>
                                NOMBRE
                            </Text>
                        </View>
                        <View style={{width: '13%', padding: 5, }}>
                            <Text style={styles.thead}>
                                FAMILIA
                            </Text>
                        </View>
                        { esabogadoreport ? null : 
                            <View style={{width: '10%', padding: 5, }}>
                                <Text style={styles.thead}>
                                    Und. Med.
                                </Text>
                            </View> 
                        }
                        { esabogadoreport ? null : 
                            <View style={{width: '10%', padding: 5, }}>
                                <Text style={styles.thead}>
                                    Stock Actual
                                </Text>
                            </View>
                        }
                        { esabogadoreport ? null : 
                            <View style={{width: '10%', padding: 5, }}>
                                <Text style={styles.thead}>
                                    Stock Max
                                </Text>
                            </View>
                        }
                        { esabogadoreport ? null : 
                            <View style={{width: '10%', padding: 5, }}>
                                <Text style={styles.thead}>
                                    Stock Min
                                </Text>
                            </View>
                        }
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                Precio
                            </Text>
                        </View>
                    </View>

                    {this.state.array_result.producto.map(
                        (data, key) =>  { 
                            return (
                                <View key={key} style={ [styles.head,  ] }>
                                    <View style={[{width: '12%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { this.state.array_result.codigospropios ? 
                                                data.codigo == null ? data.idproducto : data.codigo : data.idproducto 
                                            }
                                        </Text>
                                    </View>
                                    <View style={[{width: width, padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            {data.producto}
                                        </Text>
                                    </View>
                                    <View style={[{width: '13%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            {data.familia}
                                        </Text>
                                    </View>
                                    { esabogadoreport ? null : 
                                        <View style={[{width: '10%', padding: 5, }, ]}>
                                            <Text style={styles.tbody}>
                                                {data.medida}
                                            </Text>
                                        </View>
                                    }
                                    { esabogadoreport ? null : 
                                        <View style={[{width: '10%', padding: 5, }, ]}>
                                            <Text style={styles.tbody}>
                                                {data.stock}
                                            </Text>
                                        </View>
                                    }
                                    { esabogadoreport ? null : 
                                        <View style={[{width: '10%', padding: 5, }, ]}>
                                            <Text style={styles.tbody}>
                                                {data.stockmaximo}
                                            </Text>
                                        </View>
                                    }
                                    { esabogadoreport ? null : 
                                        <View style={[{width: '10%', padding: 5, }, ]}>
                                            <Text style={styles.tbody}>
                                                {data.stockminimo}
                                            </Text>
                                        </View> 
                                    }
                                    <View style={[{width: '10%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.precio).toFixed(2) }
                                        </Text>
                                    </View>
                                </View>
                            );
                        }
                    )}

                    <Text style={{left: 0, right: 25, color: 'grey', bottom: 15, 
                            position: 'absolute', textAlign: 'right', fontSize: 10, 
                        }}
                        render={ ({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed
                    />
                    <Text style={{left: 25, color: 'grey', bottom: 15, 
                            position: 'absolute', textAlign: 'right', fontSize: 10, 
                        }}
                        render={ ({ pageNumber, totalPages }) => (
                            `${ 'usuario' }`
                        )} fixed
                    />
                </Page>
            </Document>
        );


        return (
            <div className="rows">

                <Modal visible={this.state.visible_reporte} 
                    footer={null} title={null}
                    bodyStyle={{padding: 10, paddingTop: 6, position: 'relative',}}
                    width={'90%'}
                    style={{top: 20, }}
                    onCancel={() => this.setState({ visible_pdf: false, visible_reporte: false, })}
                >
                    <Icon type="close" onClick={() => this.setState({ visible_pdf: false, visible_reporte: false, })}
                        style={{ fontSize: 20, position: 'fixed', right: 20, top: 10, cursor: 'pointer', 
                        background: '#E4E4E4', padding: 4, borderRadius: 50 }} 
                    />
                    <PDFViewer style={{width: '100%', height: 650,}}>
                        {MyDoc}
                    </PDFViewer>
                </Modal>

                <Confirmation
                    visible={this.state.loading}
                    title='GENERANDO INFORMACION'
                    loading={true}
                    zIndex={800}
                />

                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Producto</h1>
                    </div>

                    <form onSubmit={this.onSubmitReporte.bind(this)} action={routes.producto_reporte_generar} target="_blank" method="post">
                        
                        <input type="hidden" value={_token} name="_token" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />
                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={this.state.clienteesabogado} name="esabogado" />
                        
                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{paddingBottom: 0}}>
                                <C_Select
                                    value={this.state.tipoproducto}
                                    title='Tipo Producto'
                                    onChange={this.onChangeTipoProducto.bind(this)}
                                    className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal"
                                    component={[
                                        <Option key={0} value={''}>{'Seleccionar ... '}</Option>,
                                        <Option key={1} value={'P'}>{'Producto'}</Option>,
                                        <Option key={1} value={'S'}>{'Servicio'}</Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.tipoproducto} name='tipoproducto' />

                                <C_Input 
                                    value={this.state.descripcion}
                                    className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12 pt-normal'
                                    title='Descripcion'
                                    onChange={this.onChangeDescripcion.bind(this)}
                                />
                                <input type='hidden' value={this.state.descripcion} name='descripcion' />
                                
                                <C_TreeSelect 
                                    title='Familia'
                                    treeData={this.state.arrayArbolFamilia}
                                    allowClear={true}
                                    value={(this.state.familia == '')?'Seleccionar':this.state.familia}
                                    onChange={this.onChangeFamilia.bind(this)}
                                />
                                <input type='hidden' value={this.state.familia} name='familia' />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'paddingTop': 0}}>
                                <div className="cols-lg-3 cols-md-3"></div>
                                
                                <C_Select
                                    value={this.state.medida}
                                    title='Unidad Medida'
                                    onChange={this.onChangeUnidadMedida.bind(this)}
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                    component={
                                        this.state.arrayUnidadMedida.map(
                                            (data, key) => ((key == 0)?
                                                [
                                                    <Option key={-1} value={''}>
                                                        {'Seleccionar ... '}
                                                    </Option>,
                                                    <Option key={key} value={data.idunidadmedida}>
                                                        {data.descripcion}
                                                    </Option>
                                                ]:
                                                    <Option key={key} value={data.idunidadmedida}>
                                                        {data.descripcion}
                                                    </Option>
                                            )
                                        )
                                    }
                                />
                                <input type='hidden' value={this.state.medida} name='normal' />

                                <C_Select
                                    value={this.state.moneda}
                                    title='Moneda'
                                    onChange={this.onChangeMoneda.bind(this)}
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                    component={
                                        this.state.arrayMoneda.map(
                                            (data, key) => ((key == 0)?
                                                [
                                                    <Option key={-1} value={''}>
                                                        {'Seleccionar ... '}
                                                    </Option>,
                                                    <Option key={key} value={data.idmoneda}>
                                                        {data.descripcion}
                                                    </Option>
                                                ]:
                                                    <Option key={key} value={data.idmoneda}>
                                                        {data.descripcion}
                                                    </Option>
                                            )
                                        )
                                    }
                                />
                                <input type='hidden' value={this.state.moneda} name='moneda' />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Costo - Desde'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12 pt-normal">

                                    <div className="inputs-groups">
                                        <select className={`forms-control ${colors}`}
                                            value={this.state.operacioncosto}
                                            onChange={this.onChangeOperacionCosto.bind(this)}
                                            name="operacioncosto">
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className={`lbls-input active ${colors}`}>Opcion</label>
                                    </div>
                                </div>

                                <C_Input 
                                    value={this.state.costoinicio}
                                    readOnly={(this.state.operacioncosto != '')?false:true}
                                    onChange={this.onChangeCostoInicio.bind(this)}
                                    title='Costo Inicio'
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.costoinicio} name='costoinicio' />

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value=' Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <C_Input 
                                    value={this.state.costofin}
                                    readOnly={(this.state.operacioncosto == '!')?false:true}
                                    onChange={this.onChangeCostoFin.bind(this)}
                                    title='Costo Fin'
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.costofin} name='costofin' />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Precio - Desde'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12 pt-normal">
                                    <div className="inputs-groups">
                                        <select className={`forms-control ${colors}`}
                                            value={this.state.operacionprecio}
                                            onChange={this.onChangeOperacionPrecio.bind(this)}
                                            name="operacionprecio">
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className={`lbls-input active ${colors}`}>Opcion</label>
                                    </div>
                                </div>

                                <C_Input 
                                    value={this.state.precioinicio}
                                    readOnly={(this.state.operacionprecio != '')?false:true}
                                    onChange={this.onChangePrecioInicio.bind(this)}
                                    title='Precio Inicio'
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.precioinicio} name='precioinicio' />

                                <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value=' Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <C_Input 
                                    value={this.state.preciofin}
                                    readOnly={(this.state.operacionprecio == '!')?false:true}
                                    onChange={this.onChangePrecioFin.bind(this)}
                                    title='Precio Fin'
                                    className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.preciofin} name='preciofin' />

                            </div>

                            {(this.state.clienteesabogado)?null:

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='Stock - Desde'
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12 pt-normal">
                                        <div className="inputs-groups">
                                            <select className={`forms-control ${colors}`}
                                                value={this.state.operacionstock}
                                                onChange={this.onChangeOperacionStock.bind(this)}
                                                name="operacionstock">
                                                <option value="">Seleccionar...</option>
                                                <option value="<">{'Menor'}</option>
                                                <option value="<=">{'Menor igual'}</option>
                                                <option value=">">{'Mayor'}</option>
                                                <option value=">=">{'Mayor igual'}</option>
                                                <option value="<>">{'Diferente'}</option>
                                                <option value="=">{'Igual'}</option>
                                                <option value="!">{'Entre'}</option>
                                            </select>
                                            <label className={`lbls-input active ${colors}`}>Opcion</label>
                                        </div>
                                    </div>

                                    <C_Input 
                                        value={this.state.stockinicio}
                                        readOnly={(this.state.operacionstock != '')?false:true}
                                        onChange={this.onChangeStockInicio.bind(this)}
                                        title='Stock Inicio'
                                        className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                    />
                                    <input type='hidden' value={this.state.stockinicio} name='stockinicio' />

                                    <div className="cols-lg-2 cols-md-2 cols-sm-6 col-xs-12 pt-normal">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value=' Hasta '
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <C_Input 
                                        value={this.state.stockfin}
                                        readOnly={(this.state.operacionstock == '!')?false:true}
                                        onChange={this.onChangeStockFin.bind(this)}
                                        title='Stock Fin'
                                        className='cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 pt-normal'
                                    />
                                    <input type='hidden' value={this.state.stockfin} name='stockfin' />

                                </div>
                            }

                        </div>

                        <div className="forms-groups">
                            <div className="pulls-left">
                                <label>Caracteristicas:</label>
                            </div>
                        </div>

                        <div className="forms-groups">

                            <div className="cols-lg-3 cols-md-3 "></div>

                            <div className="cols-lg-6 cols-md-8 cols-sm-12 cols-xs-12">
                            
                                <div className="card-caracteristica">

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Referencia </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Valor </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="pulls-right">
                                            {(this.state.items.length === this.state.cantidadArrayProductoCaracteristica)?'':
                                                <C_Button onClick={this.handleAddRow.bind(this)}
                                                    type='primary' size='small'
                                                    title={<i className='fa fa-plus'></i>}
                                                    style={{'marginTop': '15px', 'padding': '3px'}}
                                                />
                                            }
                                        </div>
                                    </div>

                                    <div className="caja-content">
                                        {this.state.items.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice}>
                                                        <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                                            <select className={`forms-control ${colors}`}
                                                                style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                                                value={this.state.arrayCaracteristica[indice]}
                                                                onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                                >
                                                                <option value={0}>Seleccionar</option>

                                                                {this.componentCaracteristica(indice)}

                                                            </select>
                                                        </div>
                                                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                                            <input type="text"  
                                                                placeholder=" Ingresar detalles ..."
                                                                className={`forms-control ${colors}`}
                                                                value={this.state.arrayDetalleCaracteristica[indice]}  
                                                                onChange={this.onChangeArrayDetalleCaracteristica.bind(this, indice)}      
                                                            />
                                                        </div>

                                                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content"
                                                                style={{'marginLeft': '-7px'}}>
                                                                <div className="txts-center">
                                                                    <C_Button onClick={this.handleRemoveRow.bind(this, indice)}
                                                                        type='danger' size='small'
                                                                        title={<i className='fa fa-times'></i>}
                                                                        style={{'marginTop': '2px'}}
                                                                    />
                                                                </div>
                                                        </div>
                                                        
                                                    </div>
                                                );
                                            }
                                        )}
                                        <input type="hidden" value={this.state.arrayCaracteristica} 
                                            name="arrayCaracteristica" />
                                        <input type="hidden" value={this.state.arrayDetalleCaracteristica} 
                                            name="arrayDetalleCaracteristica" />
                                    </div>
                                </div>

                            </div>

                            <div className="cols-lg-3 cols-md-2"></div>

                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                            <div className="cols-lg-3 cols-md-3"></div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <div className="inputs-groups" >
                                    <select name="ordenacion" id="ordenar"
                                        className={`forms-control ${colors}`}
                                        style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                        value={this.state.ordenacion}
                                        onChange={ (event) => {
                                            this.setState({ ordenacion: event.target.value, })
                                        } }
                                    >
                                        <option value={1}> Id Producto </option>
                                        <option value={2}> Descripcion </option>
                                        <option value={3}> Familia </option>
                                        <option value={4}> Unidad medida </option>
                                        <option value={5}> Stock actual </option>
                                        <option value={6}> Precio unitario </option>
                                    </select>
                                    <label htmlFor="ordenar"
                                        className={`lbls-input active ${colors}`}>
                                        Ordenar Por
                                    </label>
                                </div>
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <div className="inputs-groups" >
                                    <select name="exportar" id="exportar"
                                        className={`forms-control ${colors}`}
                                        style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                        <option value="N"> Seleccionar </option>
                                        <option value="P"> PDF </option>
                                        <option value="E"> ExCel </option>
                                    </select>
                                    <label htmlFor="exportar"
                                        className={`lbls-input active ${colors}`}>
                                        Exportar A
                                    </label>
                                </div>
                            </div>
                        
                        </div>

                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-xs-12">
                                <C_TextArea 
                                    title="Palabras Clave"
                                    value={this.state.palabraclave}
                                    onChange={this.onchangePalabraClave.bind(this)}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.palabraclave} name='palabraclave' />
                            
                                <C_TextArea 
                                    title="Observaciones"
                                    value={this.state.observacion}
                                    onChange={this.onChangeObservacion.bind(this)}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                                />
                                <input type='hidden' value={this.state.observacion} name='observacion' />
                            </div>
                        </div>

                        <div className="forms-groups"
                            style={{'marginBottom': '-10px'}}>
                            <div className="txts-center">
                                <C_Button onClick={this.limpiarDatos.bind(this)} 
                                    type='primary' title='Limpiar'
                                />
                                <C_Button 
                                    type='primary' title='Generar'
                                    submit={true}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}