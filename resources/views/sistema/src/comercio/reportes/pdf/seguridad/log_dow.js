
import React, { Component } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

export default class Reporte_Log extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loading: false,
            array_data: [],
            title: '',
            fecha: '',
            hora: '',
            usuario: '',
            logo: null,
        }
    }
    componentWillMount() {
        var array_data = document.getElementById('reporte_data').value;
        var title = document.getElementById('reporte_title').value;
        var fecha = document.getElementById('reporte_fecha').value;
        var hora = document.getElementById('reporte_hora').value;
        var usuario = document.getElementById('reporte_usuario').value;
        var logo = document.getElementById('reporte_logo').value;
        console.log(logo);
        document.getElementById('reporte_data').value = '[]';
        document.getElementById('reporte_title').value = '';
        document.getElementById('reporte_fecha').value = '';
        document.getElementById('reporte_hora').value = '';
        document.getElementById('reporte_usuario').value = '';
        document.getElementById('reporte_logo').value = '';

        this.setState({
            array_data: JSON.parse(array_data),
            title: title,
            fecha: fecha,
            hora: hora,
            usuario: usuario,
            loading: true,
            logo: logo,
        });
    }

    render() {
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
                        {this.state.title}
                    </Text>
                    <Text style={{ right: 25, position: 'absolute', top: 20, fontSize: 8, }}>
                        {this.state.fecha}
                    </Text>
                    <Text style={{ right: 30, position: 'absolute', top: 32, fontSize: 8, }}>
                        {this.state.hora}
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

                    {this.state.array_data.map(
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
                            `${this.state.usuario}`
                        )} fixed
                    />
                </Page>
            </Document>
        );

        return (
            <PDFDownloadLink document={ MyDoc } fileName='log.pdf' >
                { ( {blob, url, loading, error} ) => ( loading ? 'LOADING DOCUMENT...' : <a href={url} target='_blank'>insertar</a>) }
            </PDFDownloadLink>
        );
    }
}
