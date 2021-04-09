
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Select } from 'antd';

import 'antd/dist/antd.css';
import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { convertDmyToYmd, convertYmdToDmy, dateToString } from '../../../utils/toolsDate';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';

const {Option} = Select;

import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, PDFDownloadLink, Link, Font } from '@react-pdf/renderer';
import Confirmation from '../../../componentes/confirmation';
import C_DatePicker from '../../../componentes/data/date';
import ImportarKardexProductoXLSX from './xlsx/kardexproductoxlsx';

const styles = StyleSheet.create({
    body: {
        paddingHorizontal: 8,
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
        color: 'black', fontWeight: 'bold', fontSize: 6,
    },
    tbody: {
        color: 'black', fontSize: 7, height: 'auto',
    },
    borderwidthColor: {
        borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
        borderRightWidth: 1, borderRightColor: '#e8e8e8',
        borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
        borderTopWidth: 1, borderTopColor: '#e8e8e8',
    },
});

export default class Reporte_kardexProducto extends Component{

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            initState: false,

            array_sucursal: [],
            array_almacen: [],
            array_producto: [],

            obj_result: {
                compra: [],
                ingresoproducto: [],
                salidaproducto: [],
                traspasoproducto: [],
                venta: [],
                detalle: [],
                fecha: '',
                hora: '',
                usuario: '',
            },

            idsucursal: "",
            idalmacen: "",
            idproducto: "",
            nameproducto: "",

            fechainicio: this.fechaInicio(),
            fechafinal: this.fechaFinal(),

            ordenar: 1,
            exportar: "N",

            timeoutSearch: undefined,

            noSesion: false,
        }
    }

    fechaInicio() {
        let date = new Date();
        let year = date.getFullYear();
        return "01-01-" + year;
    }
    fechaFinal() {
        return dateToString( new Date, 'f2' );
    }

    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest( 'get', ws.wskardexproductoreporte) 
        .then(result => {
            console.log(result);
            if (result.response == 1) {
                this.setState({
                    array_sucursal: result.sucursal,
                    array_almacen: result.almacen,
                    array_producto: result.producto,

                    idsucursal: result.idsucursal,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);                
            }
            this.setState({
                initState: true,
            });
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                initState: true,
            });
        });
    }
    get_almacen(idsucursal) {
        httpRequest( 'post', ws.wssucursal_getalmacen, {
            idsucursal: idsucursal,
        }) 
        .then(result => {
            console.log(result);
            if (result.response == 1) {
                this.setState({
                    array_almacen: result.almacen,
                    idalmacen: "",
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
    };
    onChangeIDSucursal(value) {
        this.setState({
            idsucursal: value,
        }, () => {
            this.get_almacen(value);
        } );
    }
    onChangeIDAlmacen(value) {
        this.setState({
            idalmacen: value,
        });
    }
    onchangeIDProducto(value) {
        this.setState({
            idproducto: value,
        });
        for (let index = 0; index < this.state.array_producto.length; index++) {
            const data = this.state.array_producto[index];
            if ( data.idproducto == value ) {
                this.setState({
                    nameproducto: data.descripcion,
                });
                break;
            }
        }
    }
    onChangeFechaInicio(date) {
        if (date == '' || this.state.fechafinal == '') {
            this.setState({
                fechafinal: '', fechainicio: date,
            });
        }else {
            if (date <= this.state.fechafinal) {
                this.setState({ fechainicio: date, });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
    }
    onChangeFechaFinal(event) {
        if (event == '') {
            this.setState({ fechafinal: '', });
        }else {
            if (event >= this.state.fechainicio) {
                this.setState({ fechafinal: event, });
            }else {
                message.error('Fecha Final no puede ser menor que la Fecha Inicio');
            }
        }
    }
    onSubmitReporte(event) {
        event.preventDefault();

        if ( this.state.idproducto == "" ) {
            message.warning("Debe seleccionar un producto");
            return;
        }
        
        this.setState({ loading: true, });

        let user = JSON.parse(readData(keysStorage.user));
        let usuario = ((user == null) || (typeof user == 'undefined' )) ? 
            "" : (user.apellido == null)? user.nombre: user.nombre + ' ' + user.apellido;

        let obj = {
            idsucursal: this.state.idsucursal,
            idalmacen: this.state.idalmacen,
            idproducto: this.state.idproducto,
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafinal: convertDmyToYmd(this.state.fechafinal),
            ordenar: this.state.ordenar,
            exportar: this.state.exportar,
            usuario: usuario,
        };
        httpRequest('post', ws.wskardexproducto_generar, obj)
        .then(result => {
            console.log(result);   
            this.setState({ loading: false, });             
            if (result.response == 1) {
                this.setState({
                    obj_result: result,
                }, () => {
                    if ( this.state.exportar == 'P' )  {
                        setTimeout(() => {
                            document.getElementById('kardexproducto_pdf').click();
                        }, 3000);
                        return;
                    }
                    if ( this.state.exportar == 'E' )  {
                        setTimeout(() => {
                            document.getElementById('buttonkardexproducto_xlsx').click();
                        }, 1500);
                        return;
                    }
                    setTimeout(() => {
                        setTimeout(() => {
                            document.getElementById('kardexproducto_pdfview').click();
                        }, 2000);
                    }, 1000);
                } );
                return;

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Hubo error de conexion.')               
            }

        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({ loading: false, });
        });
    }

    limpiarDatos() {
        this.setState({
            array_sucursal: [],
            array_almacen: [],
            array_producto: [],

            idsucursal: "",
            idalmacen: "",
            idproducto: "",
            nameproducto: "",

            fechainicio: this.fechaInicio(),
            fechafinal: this.fechaFinal(),

            ordenar: 1,
            exportar: "N",
        });
        this.get_data();
    }

    onComponentSucursal() {
        let array = [];
        for (let index = 0; index < this.state.array_sucursal.length; index++) {
            let data = this.state.array_sucursal[index];
            array.push(
                <Option key={index} value={data.idsucursal}>
                    { data.nombrecomercial == null ? data.razonsocial == null ? 'S/Nombre' : data.razonsocial : data.nombrecomercial }
                </Option>
            );
        };
        return array;
    }
    onComponentAlmacen() {
        let array = [];
        for (let index = 0; index < this.state.array_almacen.length; index++) {
            let data = this.state.array_almacen[index];
            array.push(
                <Option key={index} value={data.idalmacen}>
                    { data.descripcion }
                </Option>
            );
        };
        return array;
    }
    existeProducto(array_producto) {
        if ( this.state.idproducto == "" ) return false;
        for (let index = 0; index < array_producto.length; index++) {
            let data = array_producto[index];
            if ( data.idproducto == this.state.idproducto ) return true;
        }
        return false;
    }
    traer_producto() {
        for (let index = 0; index < this.state.array_producto.length; index++) {
            let data = this.state.array_producto[index];
            if ( data.idproducto == this.state.idproducto ) {
                return data;
            }
        }
        return {
            idproducto: "",
            codproducto: "",
            descripcion: ""
        };
    }
    searchProductoIDCOD(value) {
        httpRequest( 'post', ws.wsproducto + '/searchByIdCod', {
            searchByIdCod: value,
        }) 
        .then(result => {
            console.log(result);
            if (result.response == 1) {
                if ( !this.existeProducto(result.producto) ) {
                    let producto = this.traer_producto();
                    result.producto.push(producto);
                }
                this.setState({
                    array_producto: result.producto,
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
    onSearchProductoIDCOD(value) {
        let search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoIDCOD( search ), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchProductoDescripcion(value) {
        httpRequest( 'post', ws.wsproducto + '/searchByDescripcion', {
            searchByDescripcion: value,
        }) 
        .then(result => {
            console.log(result);
            if (result.response == 1) {
                if ( !this.existeProducto(result.producto) ) {
                    let producto = this.traer_producto();
                    result.producto.push(producto);
                }
                this.setState({
                    array_producto: result.producto,
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
    onSearchProductoDescripcion(value) {
        let search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoDescripcion( search ), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onDeleteProductoID() {
        this.setState({
            idproducto: "",
            nameproducto: "",
        });
    }
    onComponentIDCODProducto() {
        let array = [];
        for (let index = 0; index < this.state.array_producto.length; index++) {
            let data = this.state.array_producto[index];
            array.push(
                <Option key={index} value={data.idproducto}>
                    { data.idproducto }
                </Option>
            );
        };
        return array;
    }
    componentDescripcionProducto() {
        let array = [];
        for (let index = 0; index < this.state.array_producto.length; index++) {
            let data = this.state.array_producto[index];
            array.push(
                <Option key={index} value={data.idproducto}>
                    { data.descripcion }
                </Option>
            );
        };
        return array;
    }

    onModalReporte() {
        // if ( !this.state.visible_reporte ) return null;
        if ( this.state.exportar != 'N' ) return null;
        let saldoStcok = 0;
        const MyDoc = (
            <Document title={'REPORTE KARDEX DE PRODUCTO'}>
                <Page size="A4" style={styles.body}>
                    <Text style={{width: '100%', fontSize: 12, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** KARDEX DE PRODUCTO **'}
                    </Text>
                    <View style={{ width: '100%', position: 'relative', }}>
                        <Text style={{ right: 25, position: 'absolute', top: -6, fontSize: 7, }}>
                            {this.state.obj_result.fecha}
                        </Text>
                        <Text style={{ right: 30, position: 'absolute', top: 2, fontSize: 7, }}>
                            {this.state.obj_result.hora}
                        </Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', }}>
                        <View style={{ width: '10%', fontSize: 9 }}>
                            <Text>Criterio: </Text>
                        </View>
                        <View style={{ width: '20%', fontSize: 9 }}>
                            <Text>Producto:  { this.state.nameproducto } </Text>
                        </View>
                        <View style={{ width: '40%', fontSize: 9 }}>
                            <Text> Fecha:  { this.state.fechainicio }  -  {this.state.fechafinal} </Text>
                        </View>
                    </View>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', marginTop: 10,}] }>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                FECHA
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 5, }}>
                            <Text style={styles.thead}>
                                TIPO TRANSAC
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ID TRANSAC
                            </Text>
                        </View>
                        <View style={{width: '20%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ALMACÉN
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                COSTO UNIT
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                PRECIO UNIT
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                CANTIDAD
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                SALDO STOCK
                            </Text>
                        </View>
                    </View>
                    {this.state.obj_result.detalle.map(
                        (data, key) =>  {
                            if ( data.tipotransac == 'Venta' || data.tipotransac == 'Salida' ) {
                                saldoStcok = saldoStcok - data.cantidad*1;
                            }
                            if ( data.tipotransac == 'Compra' || data.tipotransac == 'Ingreso' ) {
                                saldoStcok = saldoStcok + data.cantidad*1;
                            }
                            if ( data.tipotransac == 'Traspaso' ) {
                                if ( data.idalmacen == data.fkidalmacen_sale ) {
                                    saldoStcok = saldoStcok - data.cantidad*1;
                                } else {
                                    if ( data.idalmacen == data.fkidalmacen_entra ) {
                                        saldoStcok = saldoStcok + data.cantidad*1;
                                    }
                                }
                            }
                            return (
                                <View key={key} style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',} ] }>
                                    <View style={[{width: '10%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.fechatransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '20%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.tipotransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.idtransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '20%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.almacen }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.costounit).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.preciounit).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.cantidad }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { saldoStcok }
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
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
                            `${ this.state.obj_result.usuario }`
                        )} fixed
                    />
                </Page>
            </Document>
        );
        return(
            <PDFDownloadLink document={ MyDoc } fileName='kardexproducto.pdf' >
                { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a href={url} style={{ display: 'none' }} id="kardexproducto_pdfview" target='_blank'>insertar</a> ) }
            </PDFDownloadLink>
        );
    }
    onDownloadReporte() {
        if ( this.state.exportar != 'P' ) return null;
        let saldoStcok = 0;
        const MyDoc = (
            <Document title={'REPORTE KARDEX DE PRODUCTO'}>
                <Page size="A4" style={styles.body}>
                    <Text style={{width: '100%', fontSize: 12, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** KARDEX DE PRODUCTO **'}
                    </Text>
                    <View style={{ width: '100%', position: 'relative', }}>
                        <Text style={{ right: 25, position: 'absolute', top: -6, fontSize: 7, }}>
                            {this.state.obj_result.fecha}
                        </Text>
                        <Text style={{ right: 30, position: 'absolute', top: 2, fontSize: 7, }}>
                            {this.state.obj_result.hora}
                        </Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', }}>
                        <View style={{ width: '10%', fontSize: 9 }}>
                            <Text>Criterio: </Text>
                        </View>
                        <View style={{ width: '20%', fontSize: 9 }}>
                            <Text>Producto:  { this.state.nameproducto } </Text>
                        </View>
                        <View style={{ width: '40%', fontSize: 9 }}>
                            <Text> Fecha:  { this.state.fechainicio }  -  {this.state.fechafinal} </Text>
                        </View>
                    </View>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8', marginTop: 10,}] }>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                FECHA
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 5, }}>
                            <Text style={styles.thead}>
                                TIPO TRANSAC
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ID TRANSAC
                            </Text>
                        </View>
                        <View style={{width: '20%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ALMACÉN
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                COSTO UNIT
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                PRECIO UNIT
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                CANTIDAD
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                SALDO STOCK
                            </Text>
                        </View>
                    </View>
                    {this.state.obj_result.detalle.map(
                        (data, key) =>  {
                            if ( data.tipotransac == 'Venta' || data.tipotransac == 'Salida' ) {
                                saldoStcok = saldoStcok - data.cantidad*1;
                            }
                            if ( data.tipotransac == 'Compra' || data.tipotransac == 'Ingreso' ) {
                                saldoStcok = saldoStcok + data.cantidad*1;
                            }
                            if ( data.tipotransac == 'Traspaso' ) {
                                if ( data.idalmacen == data.fkidalmacen_sale ) {
                                    saldoStcok = saldoStcok - data.cantidad*1;
                                } else {
                                    if ( data.idalmacen == data.fkidalmacen_entra ) {
                                        saldoStcok = saldoStcok + data.cantidad*1;
                                    }
                                }
                            }
                            return (
                                <View key={key} style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',} ] }>
                                    <View style={[{width: '10%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.fechatransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '20%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.tipotransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.idtransac }
                                        </Text>
                                    </View>
                                    <View style={[{width: '20%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.almacen }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.costounit).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.preciounit).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.cantidad }
                                        </Text>
                                    </View>
                                    <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { saldoStcok }
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
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
                            `${ this.state.obj_result.usuario }`
                        )} fixed
                    />
                </Page>
            </Document>
        );
        return(
            <PDFDownloadLink document={ MyDoc } fileName='libroventa.pdf' >
                { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a style={{ display: 'none' }} id="kardexproducto_pdf" target='_blank'>insertar</a> ) }
            </PDFDownloadLink>
        );
    }
    componentGenerateXLSX() {
        return (
            <ImportarKardexProductoXLSX
                data={ this.state.obj_result}
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            return (<Redirect to={routes.inicio} />)
        }
        if ( !this.state.initState ) return null;
        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.loading}
                    title='GENERANDO INFORMACION'
                    loading={true}
                    zIndex={800}
                />

                { this.onModalReporte() }
                { this.onDownloadReporte() }
                { this.componentGenerateXLSX() }

                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Kardex de Producto</h1>
                    </div>
                    <form onSubmit={this.onSubmitReporte.bind(this)} action={routes.producto_reporte_generar} target="_blank" method="post">

                        <div className="forms-groups">
                            <C_Select
                                value={this.state.idsucursal}
                                title='Sucursal'
                                onChange={this.onChangeIDSucursal.bind(this)}
                                component={ this.onComponentSucursal() }
                            />
                            <C_Select
                                value={this.state.idalmacen}
                                title='Almacen'
                                onChange={this.onChangeIDAlmacen.bind(this)}
                                component={ this.onComponentAlmacen() }
                            />
                        </div>

                        <div className="forms-groups">
                            <C_Select
                                showSearch={true}
                                value={this.state.idproducto}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchProductoIDCOD.bind(this)}
                                onChange={this.onchangeIDProducto.bind(this)}
                                component={ this.onComponentIDCODProducto() }
                                allowDelete={ (this.state.idproducto == '') ? false : true }
                                onDelete={this.onDeleteProductoID.bind(this)}
                                title='ID Producto'
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idproducto}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchProductoDescripcion.bind(this)}
                                onChange={this.onchangeIDProducto.bind(this)}
                                component={ this.componentDescripcionProducto() }
                                allowDelete={ (this.state.idproducto == '') ? false : true }
                                onDelete={this.onDeleteProductoID.bind(this)}
                                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                title='Producto'
                            />
                        </div>

                        <div className="forms-groups">
                            <div className='cols-lg-3 cols-md-3'></div>
                            <C_DatePicker 
                                allowClear={false}
                                value={this.state.fechainicio}
                                onChange={this.onChangeFechaInicio.bind(this)}
                                title="Fecha Inicio"
                            />
                            <C_DatePicker 
                                allowClear={false}
                                value={this.state.fechafinal}
                                onChange={this.onChangeFechaFinal.bind(this)}
                                title="Fecha Final"
                                readOnly={ this.state.fechainicio == '' ? true: false }
                            />
                        </div>

                        <div className="forms-groups">
                            <C_Select 
                                value={this.state.ordenar}
                                title='Ordenar Por'
                                onChange={(value) => this.setState({ordenar: value,})}
                                component={[
                                    <Option key={0} value={1}> ALMACEN </Option>,
                                    <Option key={1} value={2}> FECHA </Option>,
                                    <Option key={2} value={3}> CANTIDAD </Option>,
                                    <Option key={3} value={4}> COSTO UNITARIO </Option>,
                                    <Option key={4} value={5}> PRECIO UNITARIO </Option>,
                                ]}
                            />
                            <C_Select 
                                value={this.state.exportar}
                                onChange={(value) => this.setState({exportar: value,})}
                                title='Exportar'
                                component={[
                                    <Option key={0} value="N"> Seleccionar </Option>,
                                    <Option key={1} value="P"> PDF </Option>,
                                    <Option key={2} value="E"> ExCel </Option>
                                ]}
                            />
                        </div>

                        <div className="forms-groups"
                            style={{'marginBottom': '-10px'}}>
                            <div className="txts-center">
                                <C_Button onClick={this.limpiarDatos.bind(this)} 
                                    type='danger' title='Limpiar'
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