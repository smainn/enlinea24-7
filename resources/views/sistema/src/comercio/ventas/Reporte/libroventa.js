
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Spin, Select, TreeSelect, Icon } from 'antd';

import 'antd/dist/antd.css';
import TextArea from '../../../componentes/textarea';
import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString, convertDmyToYmd, cambiarFormato } from '../../../utils/toolsDate';
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
import C_DatePicker from '../../../componentes/data/date';
import ImportarLibroVentaXLSX from './xlsx/libroventaxlsx';

export default class Reporte_LibroVenta extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible_reporte: false,
            download: false,
            loading: false,
            fechainicio: this.fechaInicio(),
            fechafinal: this.fechaFinal(),
            ordenar: 1,
            exportar: 'N',
            noSesion: false,
            obj_result: {
                libroventa: [],
                fecha: '',
                hora: '',
                usuario: '',
                configCliente: null,
            },
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
        httpRequest( 'get', ws.wskardexproductoreporte) 
        .then(result => {
            console.log(result);
            if (result.response == 1) {
                
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

    limpiarDatos() {
        this.setState({
            fechainicio: this.fechaInicio(),
            fechafinal: this.fechaFinal(),
            ordenar: 1,
            exportar: 'N',
        });
    }

    onSubmitReporte(event) {
        event.preventDefault();
        this.setState({ loading: true, });

        let user = JSON.parse(readData(keysStorage.user));
        let usuario = ((user == null) || (typeof user == 'undefined' )) ? 
            "" : (user.apellido == null)? user.nombre: user.nombre + ' ' + user.apellido;

        let obj = {
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafinal: convertDmyToYmd(this.state.fechafinal),
            ordenar: this.state.ordenar,
            exportar: this.state.exportar,
            usuario: usuario,
        };
        httpRequest('post', ws.wslibroventa_generar, obj)
        .then(result => {
            console.log(result);   
            this.setState({ loading: false, });             
            if (result.response == 1) {
                this.setState({
                    obj_result: result,
                }, () => {
                    if ( this.state.exportar == 'P' )  {
                        setTimeout(() => {
                            document.getElementById('generate_pdf').click();
                        }, 3000);
                        return;
                    }
                    if ( this.state.exportar == 'E' )  {
                        setTimeout(() => {
                            document.getElementById('buttonlibroventa_xlsx').click();
                        }, 1500);
                        return;
                    }
                    setTimeout(() => {
                        // this.setState({
                        //     visible_reporte: true,
                        // });
                        setTimeout(() => {
                            document.getElementById('generate_pdfview').click();
                        }, 3000);
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

    onModalReporte() {
        // if ( !this.state.visible_reporte ) return null;
        if ( this.state.exportar != 'N' ) return null;
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
                color: 'black', fontSize: 5, height: 'auto',
            },
            borderwidthColor: {
                borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
                borderRightWidth: 1, borderRightColor: '#e8e8e8',
                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                borderTopWidth: 1, borderTopColor: '#e8e8e8',
            },
        });
        let importetotalventa = 0;
        let importeice_ie_otronoiva = 0;
        let exportoperacionextensas = 0;
        let ventagrabadatasacero = 0;
        let subtotal = 0;
        let descuentosbonificarebajasujetaiva = 0;
        let importebasecreditofiscal = 0;
        let debitofiscal = 0;
        const MyDoc = (
            <Document title={'REPORTE LIBRO DE VENTA'}>
                <Page size="A4" orientation='landscape' style={styles.body}>
                    <Text style={{fontSize: 12, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** REPORTE LIBRO DE VENTA **'}
                    </Text>
                    <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
                        {this.state.obj_result.fecha}
                    </Text>
                    <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
                        {this.state.obj_result.hora}
                    </Text>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                        <View style={{width: '4%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ESP
                            </Text>
                        </View>
                        <View style={{width: '3%', padding: 5, }}>
                            <Text style={styles.thead}>
                                N°
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                FECHA DE LA FACTURA
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                N° DE FACTURA
                            </Text>
                        </View>
                        <View style={{width: '8%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                N° DE AUTORIZACIÓN
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ESTADO
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                NIT/CI CLIENTE
                            </Text>
                        </View>
                        <View style={{width: '9%', padding: 5, }}>
                            <Text style={styles.thead}>
                                NOMBRE O RAZON SOCIAL
                            </Text>
                        </View>

                        <View style={{width: '7%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE TOTAL DE VENTA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE ICE / IEHD / IPJ / TASAS / OTROS NO SUJETOS AL IVA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                EXPORTACIONES Y OPERACIONES EXTENSAS
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                VENTAS GRABADAS A TASA CERO
                            </Text>
                        </View>
                        <View style={{width: '7%', padding: 5, }}>
                            <Text style={styles.thead}>
                                SUBTOTAL
                            </Text>
                        </View>

                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                DESCUENTOS, BONIFICACIONES Y REBAJAS SUJETAS A IVA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE BASE PARA DEBITO FISCAL
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                DEBITO FISCAL
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                CÓDIGO CONTROL
                            </Text>
                        </View>
                    </View>
                    {this.state.obj_result.libroventa.map(
                        (data, key) =>  { 
                            importetotalventa += data.importetotalventa * 1;
                            importeice_ie_otronoiva += data.importeice_ie_otronoiva * 1;
                            exportoperacionextensas += data.exportoperacionextensas * 1;
                            ventagrabadatasacero += data.ventagrabadatasacero * 1;
                            subtotal += data.subtotal * 1;
                            descuentosbonificarebajasujetaiva += data.descuentosbonificarebajasujetaiva * 1;
                            importebasecreditofiscal += data.importebasecreditofiscal * 1;
                            debitofiscal += data.debitofiscal * 1;
                            return (
                                <View key={key} style={ [styles.head,  ] }>
                                    <View style={[{width: '4%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.especificacion }
                                        </Text>
                                    </View>
                                    <View style={[{width: '3%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nro }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { cambiarFormato(data.fechafactura) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nrofactura }
                                        </Text>
                                    </View>
                                    <View style={[{width: '8%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nroautorizacion }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.estado }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nitcliente == "0" ? "S/NIT" : data.nitcliente }
                                        </Text>
                                    </View>
                                    <View style={[{width: '9%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nombrerazonsocial }
                                        </Text>
                                    </View>
                                    <View style={[{width: '7%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importetotalventa).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importeice_ie_otronoiva).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.exportoperacionextensas).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.ventagrabadatasacero).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.subtotal).toFixed(2) }
                                        </Text>
                                    </View>

                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.descuentosbonificarebajasujetaiva).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importebasecreditofiscal).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.debitofiscal).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.codigocontrol }
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                    <View style={ [styles.head, { borderTopWidth: 1, borderTopColor: '#e8e8e8' }  ] }>
                        <View style={[{width: '44%', padding: 5, }, ]}></View>
                        <View style={[{width: '7%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importetotalventa).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importeice_ie_otronoiva).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(exportoperacionextensas).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(ventagrabadatasacero).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(subtotal).toFixed(2) }
                            </Text>
                        </View>

                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(descuentosbonificarebajasujetaiva).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importebasecreditofiscal).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(debitofiscal).toFixed(2) }
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        );
        return(
            <PDFDownloadLink document={ MyDoc } fileName='libroventa.pdf' >
                { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a href={url} style={{ display: 'none' }} id="generate_pdfview" target='_blank'>insertar</a> ) }
            </PDFDownloadLink>
        );
        // return (
        //     <Modal visible={this.state.visible_reporte} 
        //         footer={null} title={null}
        //         bodyStyle={{padding: 10, paddingTop: 6, position: 'relative',}}
        //         width={'98%'} 
        //         style={{top: 20, }} bodyStyle={{ padding: 5, paddingBottom: 10, }}
        //         onCancel={() => this.setState({ visible_reporte: false, })}
        //     >
        //         <div className="forms-groups" style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, }}>
        //             <Icon type="close" onClick={() => this.setState({ visible_reporte: false, })}
        //                 style={{ fontSize: 20, cursor: 'pointer', 
        //                 background: '#E4E4E4', padding: 4, borderRadius: 50 }} 
        //             />
        //         </div>
        //         <PDFViewer style={{width: '100%', height: 650,}}>
        //             {MyDoc}
        //         </PDFViewer>
        //     </Modal>
        // );
    }

    onDownloadReporte() {
        if ( this.state.exportar != 'P' ) return null;
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
                color: 'black', fontSize: 5, height: 'auto',
            },
            borderwidthColor: {
                borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
                borderRightWidth: 1, borderRightColor: '#e8e8e8',
                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                borderTopWidth: 1, borderTopColor: '#e8e8e8',
            },
        });
        let importetotalventa = 0;
        let importeice_ie_otronoiva = 0;
        let exportoperacionextensas = 0;
        let ventagrabadatasacero = 0;
        let subtotal = 0;
        let descuentosbonificarebajasujetaiva = 0;
        let importebasecreditofiscal = 0;
        let debitofiscal = 0;
        const MyDoc = (
            <Document title={'REPORTE LIBRO DE VENTA'}>
                <Page size="A4" orientation='landscape' style={styles.body}>
                    <Text style={{fontSize: 12, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** REPORTE LIBRO DE VENTA **'}
                    </Text>
                    <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
                        {this.state.obj_result.fecha}
                    </Text>
                    <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
                        {this.state.obj_result.hora}
                    </Text>
                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                        <View style={{width: '4%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ESP
                            </Text>
                        </View>
                        <View style={{width: '3%', padding: 5, }}>
                            <Text style={styles.thead}>
                                N°
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                FECHA DE LA FACTURA
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                N° DE FACTURA
                            </Text>
                        </View>
                        <View style={{width: '8%', padding: 5, textAlign: 'center' }}>
                            <Text style={styles.thead}>
                                N° DE AUTORIZACIÓN
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ESTADO
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                NIT/CI CLIENTE
                            </Text>
                        </View>
                        <View style={{width: '9%', padding: 5, }}>
                            <Text style={styles.thead}>
                                NOMBRE O RAZON SOCIAL
                            </Text>
                        </View>

                        <View style={{width: '7%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE TOTAL DE VENTA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE ICE / IEHD / IPJ / TASAS / OTROS NO SUJETOS AL IVA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                EXPORTACIONES Y OPERACIONES EXTENSAS
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                VENTAS GRABADAS A TASA CERO
                            </Text>
                        </View>
                        <View style={{width: '7%', padding: 5, }}>
                            <Text style={styles.thead}>
                                SUBTOTAL
                            </Text>
                        </View>

                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                DESCUENTOS, BONIFICACIONES Y REBAJAS SUJETAS A IVA
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IMPORTE BASE PARA DEBITO FISCAL
                            </Text>
                        </View>
                        <View style={{width: '6%', padding: 5, }}>
                            <Text style={styles.thead}>
                                DEBITO FISCAL
                            </Text>
                        </View>
                        <View style={{width: '5%', padding: 5, }}>
                            <Text style={styles.thead}>
                                CÓDIGO CONTROL
                            </Text>
                        </View>
                    </View>
                    {this.state.obj_result.libroventa.map(
                        (data, key) =>  { 
                            importetotalventa += data.importetotalventa * 1;
                            importeice_ie_otronoiva += data.importeice_ie_otronoiva * 1;
                            exportoperacionextensas += data.exportoperacionextensas * 1;
                            ventagrabadatasacero += data.ventagrabadatasacero * 1;
                            subtotal += data.subtotal * 1;
                            descuentosbonificarebajasujetaiva += data.descuentosbonificarebajasujetaiva * 1;
                            importebasecreditofiscal += data.importebasecreditofiscal * 1;
                            debitofiscal += data.debitofiscal * 1;
                            return (
                                <View key={key} style={ [styles.head,  ] }>
                                    <View style={[{width: '4%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.especificacion }
                                        </Text>
                                    </View>
                                    <View style={[{width: '3%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nro }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { cambiarFormato(data.fechafactura) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nrofactura }
                                        </Text>
                                    </View>
                                    <View style={[{width: '8%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nroautorizacion }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.estado }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nitcliente == "0" ? "S/NIT" : data.nitcliente }
                                        </Text>
                                    </View>
                                    <View style={[{width: '9%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.nombrerazonsocial }
                                        </Text>
                                    </View>
                                    <View style={[{width: '7%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importetotalventa).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importeice_ie_otronoiva).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.exportoperacionextensas).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.ventagrabadatasacero).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.subtotal).toFixed(2) }
                                        </Text>
                                    </View>

                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.descuentosbonificarebajasujetaiva).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.importebasecreditofiscal).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                                        <Text style={styles.tbody}>
                                            { parseFloat(data.debitofiscal).toFixed(2) }
                                        </Text>
                                    </View>
                                    <View style={[{width: '5%', padding: 5, }, ]}>
                                        <Text style={styles.tbody}>
                                            { data.codigocontrol }
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                    <View style={ [styles.head, { borderTopWidth: 1, borderTopColor: '#e8e8e8' }  ] }>
                        <View style={[{width: '44%', padding: 5, }, ]}></View>
                        <View style={[{width: '7%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importetotalventa).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importeice_ie_otronoiva).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(exportoperacionextensas).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(ventagrabadatasacero).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(subtotal).toFixed(2) }
                            </Text>
                        </View>

                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(descuentosbonificarebajasujetaiva).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '6%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(importebasecreditofiscal).toFixed(2) }
                            </Text>
                        </View>
                        <View style={[{width: '10%', padding: 5, textAlign: 'right', }, ]}>
                            <Text style={styles.tbody}>
                                { parseFloat(debitofiscal).toFixed(2) }
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        );
        return(
            <PDFDownloadLink document={ MyDoc } fileName='libroventa.pdf' >
                { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a style={{ display: 'none' }} id="generate_pdf" target='_blank'>insertar</a> ) }
            </PDFDownloadLink>
        );
    }

    componentGenerateXLSX() {
        return (
            <ImportarLibroVentaXLSX
                data={ this.state.obj_result}
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.loading}
                    title='GENERANDO INFORMACION'
                    loading={true} zIndex={800}
                />
                { this.onModalReporte() }
                { this.onDownloadReporte() }
                { this.componentGenerateXLSX() }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Libro de Ventas</h1>
                    </div>
                    <form onSubmit={this.onSubmitReporte.bind(this)} action={routes.producto_reporte_generar} target="_blank" method="post">
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
                                    <Option key={0} value={1}> ID LIBRO VENTA </Option>,
                                    <Option key={1} value={2}> FECHA </Option>,
                                    <Option key={2} value={3}> NIT CLIENTE </Option>,
                                    <Option key={3} value={4}> CLIENTE </Option>,
                                    <Option key={4} value={5}> NRO AUTORIZACION </Option>,
                                    <Option key={5} value={6}> TOTAL VENTA </Option>,
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