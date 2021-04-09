
import React, { Component, Fragment } from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import strings from '../../utils/strings';
import ws from '../../utils/webservices';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import Confirmation from '../../componentes/confirmation';
import { convertYmdToDmy } from '../../utils/toolsDate';

const { Option } = Select;

class IndexCertificacionSIN extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            array_certificacion: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,

            first_data: {
                descripcion: '',
                id: null,
            },

            noSesion: false,
        }
        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                width: 40,
            },
            {
                title: 'Nro Autorizacion',
                dataIndex: 'nroautorizacion',
                key: 'nroautorizacion',
                defaultSortOrder: 'ascend',
            },
            {
                title: 'Factura',
                dataIndex: 'nrofactura',
                key: 'nrofactura',
                defaultSortOrder: 'ascend',
                width: 80,
            },
            {
                title: 'Nit',
                dataIndex: 'nit',
                key: 'nit',
                defaultSortOrder: 'ascend',
                width: 95,
            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
                defaultSortOrder: 'ascend',
                width: 85,
            },
            {
                title: 'Monto',
                dataIndex: 'monto',
                key: 'monto',
                defaultSortOrder: 'ascend',
                width: 110,
            },
            {
                title: 'Llave',
                dataIndex: 'llave',
                key: 'llave',
                defaultSortOrder: 'ascend',
            },
            {
                title: 'Codigo Control',
                dataIndex: 'codigocontrol',
                key: 'codigocontrol',
                defaultSortOrder: 'ascend',
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnEditar(record.codigocontrol)}
                        </Fragment>
                    );
                },
                width: 100
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.facturacion_certificacion_sin_bnt_nuevo),
            //btn_editar: readPermisions(keys.sucursales_btn_editar),
            //btn_eliminar: readPermisions(keys.sucursales_btn_eliminar),
            //nombre: readPermisions(keys.sucursales_input_nombre),
            //direccion: readPermisions(keys.sucursales_input_direccion)
        }
    }
    componentDidMount() {
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wsdosificacion + '/index'+ '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        }).then((result) => {
            if(result.response == 1){
                
                this.setState({
                });

            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    btnEditar(codigo) {
        //if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a onClick={() => {
                    navigator.clipboard.writeText(codigo).then(
                        () => console.log('Texto Copiado')
                    ).catch(
                        error => console.error('No se puede escribir')
                    );
                }}
                    className="btns btns-sm btns-outline-primary"
                >
                    Copiar
                </a>
            );
        //}
        //return null;
    }
    onPaste() {
        navigator.clipboard.readText().then(
            panel => {
                var documento = '';
                var bandera = 0;
                for (let i = 0; i < panel.toString().length; i++) {
                    if (panel[i] != ' ' && panel[i] != '	' && panel[i] != '\n') {
                        documento = documento + panel[i];
                        bandera = 0;
                    }
                    if ((panel[i] == ' ' || panel[i] == '	' || panel[i] == '\n') && bandera == 0) {
                        documento = documento + ' ';
                        bandera = 1;
                    }
                }
                documento = documento.split(' ');
                var array_documento=[];
                for (let index = 0; index < documento.length; index++) {
                    if(documento[index].toString().trim().length > 0){
                        array_documento.push(documento[index]);
                    }                 
                }

                let array_data = [];
                for (let i = 0; i < array_documento.length; i = i + 7) {
                    array_data.push({
                        id: '',
                        nro: array_documento[i],
                        nroautorizacion: array_documento[i + 1],
                        nrofactura: array_documento[i + 2],
                        nit: array_documento[i + 3],
                        fecha: array_documento[i + 4],
                        monto: array_documento[i + 5],
                        llave: array_documento[i + 6],
                        codigocontrol: '',
                    });
                }


                this.setState({
                    array_certificacion: array_data,
                });


            }).catch(
            error => console.log(error)
        );
    }
    generar_codigo() {
        console.log(this.state.array_certificacion)
        if (this.state.array_certificacion.length > 0) {
            httpRequest('post', ws.wscertificacion + '/generar_codigo', {
                certificacion: JSON.stringify(this.state.array_certificacion)
            }).then((result) => {
                if(result.response == 1){//72-4E-E5-C7-1F
                    console.log(result);
                    for (let index = 0; index < result.certificacion.length; index++) {
                        this.state.array_certificacion[index].codigocontrol=result.certificacion[index];
                        
                    }
                    this.setState({
                        array_certificacion:this.state.array_certificacion,
                    });
                }else if(result.response == -2){
                    this.setState({noSesion: true});
                }else{
                    console.log(result);
                    console.log('Ocurrio un error al consultar la base de datos');
                }
            }).catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            });
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">CERTIFICACION DEL SISTEMA</h1>
                    </div>
                    <div className="forms-groups" style={{textAlign: 'center', }}>
                        <C_Button 
                            title={'Nuevo'}
                            type='primary'
                            permisions={this.permisions.btn_nuevo}
                        />
                        <C_Button 
                            title={'Pegar'}
                            type='primary'
                            onClick={this.onPaste.bind(this)}
                        />
                        <C_Button 
                            title={'Generar Codigo'}
                            type='primary'
                            onClick={this.generar_codigo.bind(this)}
                        />
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_certificacion}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                                scroll={{ x: 1000, y: 700 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexCertificacionSIN);
