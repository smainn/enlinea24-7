
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { message, Select, Modal, Icon, notification } from 'antd';
import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import routes from '../../utils/routes';
import C_Input from '../../componentes/data/input';
import C_DatePicker from '../../componentes/data/date';
import C_Select from '../../componentes/data/select';
import keysStorage from '../../utils/keysStorage';
import { dateToString, hourToString, convertDmyToYmd, cambiarFormato, fullHourToString, format_fecha_print } from '../../utils/toolsDate';
import C_Button from '../../componentes/data/button';
import Confirmation from '../../componentes/confirmation';
const { Option } = Select;

import ReactToPrint, { PrintContextConsumer } from "react-to-print";

import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, PDFDownloadLink, Link } from '@react-pdf/renderer';

class ComponentToPrint extends React.Component {
    render() {
        var head = {padding: 10,  font: '500 14px Roboto',};
        var body = { paddingLeft: 10, 
            paddingTop: 8, paddingRight: 3, paddingBottom: 5, font: '300 13px Roboto'
        };
        var usuario = JSON.parse(readData(keysStorage.user));
        if (typeof usuario != 'undefined' && usuario != null) {
            usuario = usuario.apellido == null ? usuario.nombre : usuario.nombre + ' ' + usuario.apellido;
        }else {
            usuario = '';
        }
        return (
            <table style={{width: '100%', paddingTop: 40, paddingBottom: 40,  }}>
                <caption>
                    <div style={{position: 'absolute', width:'100%', display: 'flex', justifyContent: 'space-between', top: 10,}}>
                        <div>
                            <img src={this.props.config == null ? '' : this.props.config.logoreporte} alt='none' 
                                style={{width: 90, height: 40, position: 'relative', top: -10, left: 10,  }}
                            />
                        </div>
                        <div style={{fontSize: 17,}}>** LOG DEL SISTEMA **</div>
                        <div>
                            <p style={{fontSize: 12, fontWeight: 'normal', position: 'relative', top: -4, }}>{cambiarFormato()}</p>
                            <p style={{fontSize: 12, fontWeight: 'normal', position: 'relative', top: -17, left: 10,  }}>{fullHourToString()}</p>
                        </div>
                    </div>
                </caption>
                <tbody>
                    <tr>
                        <th style={head}> ID </th>
                        <th style={head}> Fecha </th>
                        <th style={head}> Hora </th>
                        <th style={head}> ID USER </th>
                        <th style={head}> USUARIO </th>
                        <th style={head}> ACCION </th>
                        <th style={head}> IP </th>
                    </tr>
                </tbody>
                {/* <tfoot>
                    <tr>
                        <th style={{border: 'none', position: 'relative', top: -1, }}>
                            {usuario}
                        </th>
                    </tr>
                </tfoot> */}
                <tbody>
                    
                    {this.props.array_result.map(
                        (data, key) => (
                            <tr key={key}>
                                <td style={body}>
                                    {data.idlog}
                                </td>
                                <td style={body}>
                                    {data.fechacliente}
                                </td>
                                <td style={body}>
                                    {data.horacliente}
                                </td>
                                <td style={body}>
                                    {data.idusr}
                                </td>
                                <td style={body}>
                                    {data.loginusr}
                                </td>
                                <td style={body}>
                                    {data.accionhecha}
                                </td>
                                <td style={body}>
                                    {data.ipcliente}
                                </td>
                            </tr>
                        )
                    )}
                    
                </tbody>
            </table>
        );
    }
}

// class ComponentToPDFView extends React.Component {
    
//     render() {
//         const styles = StyleSheet.create({
//             body: {
//                 paddingTop: 35,
//                 paddingBottom: 40,
//                 paddingHorizontal: 20,
//             },
//             section: {
//                 margin: 10,
//                 padding: 10,
//                 flexGrow: 1,
//             },
//             thead: {
//                 color: 'black',
//                 fontWeight: 'bold',
//                 fontSize: 10,
//             },
//             tbody: {
//                 color: 'black',
//                 fontSize: 8,
//                 height: 'auto',
//             },
//         });
//         var usuario = JSON.parse(readData(keysStorage.user));
//         if (typeof usuario != 'undefined' && usuario != null) {
//             usuario = usuario.apellido == null ? usuario.nombre : usuario.nombre + ' ' + usuario.apellido;
//         }else {
//             usuario = '';
//         }
//         return (
//             <PDFViewer style={{width: '100%', height: 600}}>
//                 <Document title={'REPORTE LOG DEL SISTEMA'}>
//                     <Page size="A4" orientation='landscape' style={styles.body} >

//                         <Text style={{fontSize: 15, textAlign: 'center', paddingBottom: 8, paddingTop: 5, }}>
//                             ** LOG DEL SISTEMA **
//                         </Text>

//                         {/* {this.props.config == null ? null :
//                             <Image style={{ left: 30, position: 'absolute', top: 10, width: 80, height: 40, borderRadius: 5, marginVertical: 1, marginHorizontal: 1 }} 
//                                 source={this.props.config == null ? undefined : this.props.config.logoreporte}
//                             />
//                         } */}

//                         <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
//                             {this.props.fecha}
//                         </Text>
//                         <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
//                             {this.props.hora}
//                         </Text>

//                         <View style={{width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', borderWidth: 1, borderColor: 'black',}}>
//                             <View style={{width: '10%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     ID
//                                 </Text>
//                             </View>
//                             <View style={{width: '12%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     FECHA
//                                 </Text>
//                             </View>
//                             <View style={{width: '12%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     HORA
//                                 </Text>
//                             </View>
//                             <View style={{width: '10%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     ID USER
//                                 </Text>
//                             </View>
//                             <View style={{width: '15%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     USUARIO
//                                 </Text>
//                             </View>
//                             <View style={{width: '30%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     ACCION
//                                 </Text>
//                             </View>
//                             <View style={{width: '11%', padding: 5, }}>
//                                 <Text style={styles.thead}>
//                                     IP
//                                 </Text>
//                             </View>
//                         </View>
//                         {this.props.array_result.map(
//                             (data, key) => (
//                                 <View key={key} style={{width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', }}>
//                                     <View style={{width: '10%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.idlog}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '12%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.fechacliente}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '12%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.horacliente}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '10%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.idusr}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '15%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.loginusr}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '30%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.accionhecha}
//                                         </Text>
//                                     </View>
//                                     <View style={{width: '11%', padding: 5, }}>
//                                         <Text style={styles.tbody}>
//                                             {data.ipcliente}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             )
//                         )}

//                         <Text style={{left: 0, right: 20, color: 'grey', bottom: 10, 
//                                 position: 'absolute', textAlign: 'right', fontSize: 10, 
//                             }}
//                             render={ ({ pageNumber, totalPages }) => (
//                                 `${pageNumber} / ${totalPages}`
//                             )} fixed
//                         />
//                         <Text style={{left: 20, color: 'grey', bottom: 10, 
//                                 position: 'absolute', textAlign: 'right', fontSize: 10, 
//                             }}
//                             render={ ({ pageNumber, totalPages }) => (
//                                 `${usuario}`
//                             )} fixed
//                         />
//                     </Page>
//                 </Document>
                
//             </PDFViewer>
//         );
//     }
// };

class Log_Del_Sistema extends Component{

    constructor(props) {
        super(props);

        this.state = {
            visible: false, 
            visible_reporte: false, 
            visible_pdf: false,
            loading: false,

            array_usuario: [],
            timeoutSearch: undefined,

            idusuario: '',
            fechainicio: '',
            fechafinal: '',

            ordenarPor: 1,
            exportar: 'N',

            array_result: [],

            fecha_print: cambiarFormato(), 
            hora_print: fullHourToString(),

            config: null,

            redirect: false,
            noSesion: false,
        }
    }

    componentDidMount() {
        this.get_data();
    }

    get_data() {
        httpRequest('get', ws.wslog_reporte + '/create')
        .then(result => {
            if (result.response == 0 || result.response == -1 || result.response == -3) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                console.log(result)
                this.setState({ array_usuario: result.data, config: result.config, });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            //console.log(result)
        }).catch(
            error => console.log(error)
        );
    }

    onChangeLogin(event) {
        this.setState({
            login: event,
        });
    }
    onChangeUsuario(event) {
        this.setState({
            usuario: event,
        });
    }
    onChangeFechaInicio(date) {
        if (date == '') {
            this.setState({
                fechainicio: '',
                fechafinal: '',
            });
        }else {
            this.setState({
                fechainicio: date,
            });
        }
    }
    onChangeFechaFinal(date) {
        if (date == '') {
            this.setState({
                fechafinal: '',
            });
        }else {
            if (date >= this.state.fechainicio) {
                this.setState({
                    fechafinal: date,
                });
            }else {
                message.error('FECHA INCORRECTA');
            }
        }
    }

    onChangeOrdenarPor(event) {
        this.setState({
            ordenarPor: event,
        });
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }
    limpiarDatos() {
        this.setState({
            idusuario: '',

            fechainicio: '',
            fechafinal: '',

            ordenarPor: 1,
            exportar: 'N',
        });
    }

    searchUserByLogin(value) {
        var body = {
            search: value,
        };
        httpRequest('post', ws.wslog_reporte + '/searchUserByLogin', body)
        .then((result) => {
            if (result.response > 0) {
                console.log(result)
                this.setState({ array_usuario: result.data, });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onSearchUserLogin(value) {
        var search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchUserByLogin(search), 700);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    searchUserByUsuario(value) {
        var body = {
            search: value,
        };
        httpRequest('post', ws.wslog_reporte + '/searchUserByUsuario', body)
        .then((result) => {
            if (result.response > 0) {
                console.log(result)
                this.setState({ array_usuario: result.data, });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onSearchUserUsuario(value) {
        var search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchUserByUsuario(search), 700);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    componentLogin() {
        let data = this.state.array_usuario;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idusuario}>
                    {data[i].login}
                </Option>
            );
        }
        return arr;
    }
    componentUsuario() {
        let data = this.state.array_usuario;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idusuario}>
                    {data[i].usuario}
                </Option>
            );
        }
        return arr;
    }

    generar_reporte() {
        // if (this.state.exportar == 'N' || this.state.exportar == 'P') {
        //     document.getElementById('generar_reporte').submit();
        //     // document.getElementById('home').click();
        //     return;
        // }
        this.setState({ visible: true, loading: true,});
        var body = {
            idusuario: this.state.idusuario,
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafinal: convertDmyToYmd(this.state.fechafinal),
            ordenar: this.state.ordenarPor,
            exportar: this.state.exportar,
        };
        httpRequest('post', ws.wslog_reporte + '/generar_data', body)
        .then((result) => {
            if (result.response > 0) {
                console.log(result)
                notification.success({
                    message: 'SUCCESS',
                    description: 'EXITO EN GENERAR INFORMACION.',
                    style: {zIndex: 1100,}
                });
                this.setState(
                    { array_result: result.data, visible: false, },
                    () => {
                        if (this.state.exportar == 'N' || this.state.exportar == 'P') {

                            setTimeout(() => {
                                this.setState( { visible_reporte: true, } );
                                notification.success({
                                    message: 'GENERANDO PDF',
                                    description: 'FAVOR DE ESPERAR CARGANDO PDF.',
                                    style: {zIndex: 1100,}
                                });
                            }, 300);
        
                            //document.getElementById('generar_pdf').click();
        
                            setTimeout(() => {
                                this.setState({ visible_pdf: true,});
                            }, 1000);
                            
        
                        }else {
                            setTimeout(() => {
                                this.setState( { visible_reporte: true, } );
                                notification.success({
                                    message: 'GENERANDO IMPRIMIR',
                                    description: 'FAVOR DE ESPERAR CARGANDO EL IMPRIMIR.',
                                    style: {zIndex: 1100,}
                                });
                            }, 500);
                            setTimeout(() => {
                                document.getElementById('generate_print').click();
                            }, 1000);
                        }
                    } );

                return;
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
            this.setState({visible: false, loading: false,});
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }

        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        const token = readData(keysStorage.token);
        const x_idusuario =  ((key == null) || (typeof key == 'undefined')) ? 0 : key.idusuario;
        const x_grupousuario = ((key == null) || (typeof key == 'undefined')) ? 0 : key.idgrupousuario;
        const x_login = ((key == null) || (typeof key == 'undefined')) ? null : key.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');

        const styles = StyleSheet.create({
            body: {
                paddingTop: 35, paddingBottom: 40,
                paddingHorizontal: 20,
            },
            section: {
                margin: 10, padding: 10, flexGrow: 1,
            },
            head: {
                width: '100%', height: 'auto',
                display: 'flex', flexDirection: 'row',
            },
            thead: {
                color: 'black', fontWeight: 'bold', fontSize: 10,
            },
            tbody: {
                color: 'black', fontSize: 8, height: 'auto',
            },
            borderwidth: {
                borderLeftWidth: 1, borderLeftColor: '#e8e8e8',
                borderRightWidth: 1, borderRightColor: '#e8e8e8',
                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
            },
        });

        const MyDoc = (
            <Document title={'REPORTE LOG DEL SISTEMA'}>
                <Page size="A4" orientation='landscape' style={styles.body}>
                    <Text style={{fontSize: 13, textAlign: 'center', fontWeight: 'bold', paddingBottom: 8, }}>
                        {'** LOG DEL SISTEMA **'}
                    </Text>
                    <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
                        {this.state.fecha_print}
                    </Text>
                    <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
                        {this.state.hora_print}
                    </Text>

                    <View style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}] }>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ID
                            </Text>
                        </View>
                        <View style={{width: '12%', padding: 5, }}>
                            <Text style={styles.thead}>
                                FECHA
                            </Text>
                        </View>
                        <View style={{width: '12%', padding: 5, }}>
                            <Text style={styles.thead}>
                                HORA
                            </Text>
                        </View>
                        <View style={{width: '10%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ID USER
                            </Text>
                        </View>
                        <View style={{width: '15%', padding: 5, }}>
                            <Text style={styles.thead}>
                                USUARIO
                            </Text>
                        </View>
                        <View style={{width: '30%', padding: 5, }}>
                            <Text style={styles.thead}>
                                ACCION
                            </Text>
                        </View>
                        <View style={{width: '11%', padding: 5, }}>
                            <Text style={styles.thead}>
                                IP
                            </Text>
                        </View>
                    </View>

                    {this.state.array_result.map(
                        (data, key) =>  { 
                            return (
                                <View key={key} style={ [styles.head, {borderWidth: 1, borderColor: '#e8e8e8',}, ] }>
                                    <View style={{width: '10%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.idlog}
                                        </Text>
                                    </View>
                                    <View style={{width: '12%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.fechacliente}
                                        </Text>
                                    </View>
                                    <View style={{width: '12%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.horacliente}
                                        </Text>
                                    </View>
                                    <View style={{width: '10%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.idusr}
                                        </Text>
                                    </View>
                                    <View style={{width: '15%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.loginusr}
                                        </Text>
                                    </View>
                                    <View style={{width: '30%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.accionhecha}
                                        </Text>
                                    </View>
                                    <View style={{width: '11%', padding: 5, }}>
                                        <Text style={styles.tbody}>
                                            {data.ipcliente}
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
                            `${ usuario }`
                        )} fixed
                    />
                </Page>
            </Document>
        );

        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.visible}
                    title='GENERANDO INFORMACION'
                    loading={true}
                    zIndex={800}
                />
                <Confirmation
                    visible={this.state.visible_reporte}
                    title='GENERANDO REPORTE'
                    loading={true}
                    zIndex={900}
                />
                <Modal visible={this.state.visible_pdf} 
                    footer={null} title={null}
                    bodyStyle={{padding: 10, paddingTop: 6, position: 'relative',}}
                    width={1000}
                    style={{top: 50, }}
                    onCancel={() => this.setState({ visible_pdf: false, visible_reporte: false, })}
                >
                    <Icon type="close" onClick={() => this.setState({ visible_pdf: false, visible_reporte: false, })}
                        style={{ fontSize: 20, position: 'fixed', right: 20, top: 10, cursor: 'pointer', 
                        background: '#E4E4E4', padding: 4, borderRadius: 50 }} 
                    />
                    {/* <ComponentToPDFView config={this.state.config} array_result={this.state.array_result} 
                        fecha={this.state.fecha_print} hora={this.state.hora_print}
                    /> */}
                    <PDFViewer style={{width: '100%', height: 600}}>
                        {MyDoc}
                    </PDFViewer>

                    {/* <PDFDownloadLink document={ MyDoc } fileName='log.pdf' >
                        { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a href={url} target='_blank'>insertar</a> ) }
                    </PDFDownloadLink> */}
                </Modal>
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">REPORTE LOG DEL SISTEMA</h1>
                    </div>

                    <ReactToPrint bodyClass={'mt_30'} pageStyle={'pt_20'} 
                        onBeforePrint={() => this.setState({visible_reporte: false, })} 
                        content={() => this.componentRef}
                        //trigger={() => <button id='generate_print'>Print this out!</button>}
                    >
                        <PrintContextConsumer >
                            {({ handlePrint }) => (
                                <a style={{display: 'none',}} onClick={handlePrint} id="generate_print">Generar</a>
                            )}
                        </PrintContextConsumer>
                    </ReactToPrint>
                    <div style={{display: 'none'}}>
                        <ComponentToPrint config={this.state.config} array_result={this.state.array_result} ref={el => (this.componentRef = el)} />
                    </div>

                    <a href={routes.log_sistema} target='_blank' style={{display: 'none'}} id='home'></a>

                    <div className="forms-groups">

                        <form style={{display: 'none'}} id='generar_reporte' action={routes.reporte_log_sistema} target="_blank" method="post">

                            <input type="hidden" value={meta[0].getAttribute('content')} name="_token" />
                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />

                            <input type="hidden" value={usuario} name="usuario" />

                            <input type="hidden" value={this.state.idusuario} name="idusuario" />
                            <input type="hidden" value={this.state.fechainicio} name="fechainicio" />
                            <input type="hidden" value={this.state.fechafinal} name="fechafinal" />
                            <input type="hidden" value={this.state.ordenarPor} name="orderby" />
                            <input type="hidden" value={this.state.exportar} name="exportar" />

                        </form>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input
                                value={'Usuario: '}
                                readOnly={true}
                                className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                style={{'border': '2px solid transparent', 'background': 'transparent'}}
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idusuario}
                                placeholder={"Buscar login..."}
                                defaultActiveFirstOption={false}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.onSearchUserLogin.bind(this)}
                                onChange={(value) => this.setState({idusuario: value,}) }
                                component={this.componentLogin()}
                                onDelete={() => this.setState({idusuario: '', }) }
                                allowDelete={this.state.idusuario == '' ? false : true}
                                title="Login"
                                className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idusuario}
                                placeholder={"Buscar usuario..."}
                                defaultActiveFirstOption={false}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.onSearchUserUsuario.bind(this)}
                                onChange={(value) => this.setState({idusuario: value,}) }
                                component={this.componentUsuario()}
                                onDelete={() => this.setState({idusuario: '', }) }
                                allowDelete={this.state.idusuario == '' ? false : true}
                                title="Login"
                                className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{'paddingLeft': 0}}
                        >
                            <C_Input
                                value={'Fecha: '}
                                readOnly={true}
                                className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                style={{'border': '2px solid transparent', 'background': 'transparent'}}
                            />
                            <C_DatePicker 
                                allowClear={true}
                                value={this.state.fechainicio}
                                onChange={this.onChangeFechaInicio.bind(this)}
                                title='Fecha Inicio'
                            />
                            <C_DatePicker
                                allowClear={true}
                                value={this.state.fechafinal}
                                onChange={this.onChangeFechaFinal.bind(this)}
                                title='Fecha Final'
                                readOnly={
                                    (this.state.fechainicio == '')?true:false
                                }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{'paddingLeft': 0}}
                        >
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Select
                                value={this.state.ordenarPor}
                                title='Ordenar Por'
                                onChange={this.onChangeOrdenarPor.bind(this)}
                                component={[
                                    <Option key={0} value={1}> Id Log </Option>,
                                    <Option key={1} value={2}> Id Usuario </Option>,
                                    <Option key={2} value={3}> Login </Option>,
                                    <Option key={3} value={4}> Nombre Usuario </Option>,
                                    <Option key={4} value={5}> Fecha </Option>,
                                ]}
                            />
                            <C_Select 
                                value={this.state.exportar}
                                onChange={this.onChangeExportar.bind(this)}
                                title='Exportar'
                                component={[
                                    <Option key={0} value="N"> SELECCIONAR </Option>,
                                    <Option key={1} value="P"> PDF </Option>,
                                    <Option key={2} value="E"> EXCEL </Option>,
                                    <Option key={3} value="I"> IMPRIMIR </Option>
                                ]}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{'paddingLeft': 0}}
                        >
                            <div className="text-center-content">
                                <C_Button 
                                    title='Limpiar'
                                    type='primary'
                                    onClick={this.limpiarDatos.bind(this)}
                                />
                                <C_Button 
                                    title='Generar'
                                    type='primary'
                                    onClick={this.generar_reporte.bind(this)}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(Log_Del_Sistema);
