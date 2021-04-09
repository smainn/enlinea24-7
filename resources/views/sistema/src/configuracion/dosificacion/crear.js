
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { message, Select } from 'antd';
import "antd/dist/antd.css"; 
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';
import { Redirect, withRouter } from 'react-router-dom';
import routes from '../../utils/routes';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import { dateToString, convertDmyToYmd, stringToDate } from '../../utils/toolsDate';
import C_DatePicker from '../../componentes/data/date';
import strings from '../../utils/strings';
import ws from '../../utils/webservices';
import C_Select from '../../componentes/data/select';
import C_TextArea from '../../componentes/data/textarea';
import Confirmation from '../../componentes/confirmation';

const {Option} = Select;

let dateNow = new Date();

class Crear_Dosificacion extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible_cancel: false,
            visible_submit: false,
            loading: false,

            nrotramite: '',

            fecha_activacion: dateToString(dateNow, 'f2'),
            nroautorizacion: '',
            idsucursal: '',
            nit: '',
            idactividadeconomica: '',
            sfcsistema: '',
            fecha_limite: '',
            llave: '',
            descripcion: '',

            nrofacturainicial: 1,
            nrofacturasiguiente: 1,

            titulo: 'FACTURA',
            subtitulo: '',
            leyendauno: '',
            leyendados: '',
            estado: 'E',

            tipopapel: 'S',
            plantillafactura: 'P',

            validar_nrotramite: 1,
            validar_titulo: 1,
            validar_nroautorizacion: 1,
            validar_sfcsistema: 1,
            validar_llave: 1,
            validar_nrofacturainicial: 1,
            validar_nrofacturasiguiente: 1,
            validar_leyendauno: 1,
            validar_leyendados: 1,

            array_sucursal: [],
            array_actividadeconomica: [],

            noSesion: false,
        }
    }
    componentDidMount() {
        httpRequest('get', ws.wsdosificacion + '/create')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_sucursal: result.sucursal,
                    idsucursal: (result.sucursal.length > 0)?result.sucursal[0].idsucursal:'',
                    nit: (result.sucursal.length > 0)?result.sucursal[0].nit:'',

                    array_actividadeconomica: result.actividadeconomica,
                    idactividadeconomica: (result.actividadeconomica.length > 0)?result.actividadeconomica[0].idfacactividadeconomica:'',
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            if (result.response == -1) {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        });
    }
    onChangeNroTramite(value) {
        this.setState({
            nrotramite: value,
            validar_nrotramite: 1,
        });
    }
    onChangeFechaActivacion(date) {
        this.setState({
            fecha_activacion: date,
        });
    }
    onChangeEstado(value) {
        this.setState({
            estado: value,
        });
    }
    onChangeNroAutorizacion(value) {
        if (!isNaN(value)) {
            this.setState({
                nroautorizacion: value,
                validar_nroautorizacion: 1,
            });
        }
    }
    onChangeIDSucursal(value) {
        var nit = '';
        for (let i = 0; i < this.state.array_sucursal.length; i++) {
            if (this.state.array_sucursal[i].idsucursal == value) {
                nit = this.state.array_sucursal[i].nit;
                break;
            }
        }
        this.setState({
            idsucursal: value,
            nit: nit,
        });
    }
    onChangeDescripcion(value) {
        this.setState({
            descripcion: value,
        });
    }
    onChangeIDActividadEconomica(value) {
        this.setState({
            idactividadeconomica: value,
        });
    }
    onChangeSFCSistema(value) {
        this.setState({
            sfcsistema: value,
            validar_sfcsistema: 1,
        });
    }
    onChangeFechaLimite(date) {
        if (convertDmyToYmd(date) >= convertDmyToYmd(this.state.fecha_activacion)) {
            this.setState({
                fecha_limite: date,
            });
        }else {
            message.warning('Fecha invalida');
        }
    }
    onChangeLlave(value) {
        this.setState({
            llave: value,
            validar_llave: 1,
        });
    }
    onChangeNroFacturaInicial(value) {
        if (!isNaN(value)) {
            this.setState({
                nrofacturainicial: value,
                validar_nrofacturainicial: 1,
            });
        }
    }
    onChangeNroFacturaSiguiente(value) {
        if (!isNaN(value)) {
            this.setState({
                nrofacturasiguiente: value,
                validar_nrofacturasiguiente: 1,
            });
        }
    }
    onChangeTitulo(value) {
        this.setState({
            titulo: value,
            validar_titulo: 1,
        });
    }
    onChangeSubTitulo(value) {
        this.setState({
            subtitulo: value,
        });
    }
    onChangeLeyendaUno(value) {
        this.setState({
            leyendauno: value,
            validar_leyendauno: 1,
        });
    }
    onChangeLeyendaDos(value) {
        this.setState({
            leyendados: value,
            validar_leyendados: 1,
        });
    }
    onChangeTipoPapel(value) {
        this.setState({
            tipopapel: value,
        });
    }
    onChangePlantillaFactura(value) {
        this.setState({
            plantillafactura: value,
        });
    }
    componentSucursal() {
        var array = [];
        for (let i = 0; i < this.state.array_sucursal.length; i++) {
            var data = this.state.array_sucursal[i];
            array.push(
                <Option key={i} value={data.idsucursal}> 
                    {(data.nombrecomercial == null)?data.razonsocial:data.nombrecomercial} 
                </Option>
            );
        }
        return array;
    }
    componentActividadEconomica() {
        var array = [];
        for (let i = 0; i < this.state.array_actividadeconomica.length; i++) {
            var data = this.state.array_actividadeconomica[i];
            array.push(
                <Option key={i} value={data.idfacactividadeconomica}> 
                    {data.descripcion} 
                </Option>
            );
        }
        return array;
    }
    onClose() {
        this.setState({
            visible_cancel: false,
            visible_submit: false,
            loading: false,
        });
    }
    onSalir() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 400);
    }
    onValidar() {
        if (this.state.nrotramite.toString().trim().length == 0) {
            message.error('Favor de ingresar nro tramite');
            this.setState({
                validar_nrotramite: 0,
            });
            return;
        } 
        if (this.state.idsucursal.toString().trim().length == 0) {
            message.error('Favor de ingresar Sucursal');
            return;
        } 
        if (this.state.titulo.toString().trim().length == 0) {
            message.error('Favor de ingresar Titulo');
            this.setState({
                validar_titulo: 0,
            });
            return;
        } 
        if (this.state.nroautorizacion.toString().trim().length == 0) {
            message.error('Favor de ingresar nro Autorizacion');
            this.setState({
                validar_nroautorizacion: 0,
            });
            return;
        }
        if (this.state.idactividadeconomica.toString().trim().length == 0) {
            message.error('Favor de ingresar Actividad Economica');
            return;
        }
        if (this.state.sfcsistema.toString().trim().length == 0) {
            message.error('Favor de ingresar SFC Sistema');
            this.setState({
                validar_sfcsistema: 0,
            });
            return;
        }
        if (this.state.fecha_limite.toString().trim().length == 0) {
            message.error('Favor de ingresar Fecha Limite');
            return;
        }
        if (this.state.llave.toString().trim().length == 0) {
            message.error('Favor de ingresar Llave');
            this.setState({
                validar_llave: 0,
            });
            return;
        }
        if (this.state.nrofacturainicial.toString().trim().length == 0) {
            message.error('Favor de ingresar Llave');
            this.setState({
                validar_nrofacturainicial: 0,
            });
            return;
        }
        if (this.state.nrofacturasiguiente.toString().trim().length == 0) {
            message.error('Favor de ingresar Llave');
            this.setState({
                validar_nrofacturasiguiente: 0,
            });
            return;
        }
        if (this.state.leyendauno.toString().trim().length == 0) {
            message.error('Favor de ingresar Leyenda Uno');
            this.setState({
                validar_leyendauno: 0,
            });
            return;
        }
        if (this.state.leyendados.toString().trim().length == 0) {
            message.error('Favor de ingresar Leyenda Dos');
            this.setState({
                validar_leyendados: 0,
            });
            return;
        }
        setTimeout(() => {
            this.setState({
                visible_submit: true,
            });
        }, 300);
    }
    onSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        var body = {
            numerotramite: this.state.nrotramite,
            fechaactivacion: convertDmyToYmd(this.state.fecha_activacion),
            numeroautorizacion: this.state.nroautorizacion,
            fkidsucursal: this.state.idsucursal,
            descripcion: this.state.descripcion,
            fkidfacactividadeconomica: this.state.idactividadeconomica,
            nombresfcmarca: this.state.sfcsistema,
            fechalimiteemision: convertDmyToYmd(this.state.fecha_limite),
            llave: this.state.llave,
            numfacturainicial: this.state.nrofacturainicial,
            numfacturasiguiente: this.state.nrofacturasiguiente,
            titulo: this.state.titulo,
            subtitulo: this.state.subtitulo,
            tipofactura: this.state.tipopapel,
            plantillafacturaurl: this.state.plantillafactura,
            leyenda1piefactura: this.state.leyendauno,
            leyenda2piefactura: this.state.leyendados,
            nit: this.state.nit,
            estado: this.state.estado,
        };
        httpRequest('post', ws.wsdosificacion + '/store', body)
        .then(result => {
            if(result.response == 1){
                
                message.success('Se Registro Correctamente');

                this.props.history.goBack();
                
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
    render(){
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.visible_cancel}
                    loading={this.state.loading}
                    title="Cancelar Registros"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de cancelar el registro de dosificacion?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    }
                />
                <Confirmation
                    visible={this.state.visible_submit}
                    loading={this.state.loading}
                    onCancel={this.onClose.bind(this)}
                    title='Registrar Dosificacion'
                    onClick={this.onSubmit.bind(this)}
                    content='¿Estas seguro de guardar datos...?'
                />
                <div className="cards" style={{'padding': 0}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">1. Registrar nueva dosificación de facturas </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <C_Input
                            title='Nro Tramite'
                            value={this.state.nrotramite}
                            onChange={this.onChangeNroTramite.bind(this)}
                            validar={this.state.validar_nrotramite}
                        />
                        <C_DatePicker
                            onChange={this.onChangeFechaActivacion.bind(this)}
                            value={this.state.fecha_activacion}
                            title={'Fecha de Activacion'}
                        />
                        <C_Input
                            title='Nro Autorizacion'
                            value={this.state.nroautorizacion}
                            onChange={this.onChangeNroAutorizacion.bind(this)}
                            validar={this.state.validar_nroautorizacion}
                        />
                        <C_Select 
                            title='Sucursal*'
                            value={this.state.idsucursal}
                            onChange={this.onChangeIDSucursal.bind(this)}
                            component={this.componentSucursal()}
                        />
                    </div>
                    <div className="forms-groups">
                        <C_Input
                            value={this.state.descripcion}
                            title='Caracteristica'
                            onChange={this.onChangeDescripcion.bind(this)}
                            className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal'
                        />
                    </div>
                    <div className="forms-groups">
                        <C_Select 
                            title='Actividad Economica'
                            value={this.state.idactividadeconomica}
                            onChange={this.onChangeIDActividadEconomica.bind(this)}
                            component={this.componentActividadEconomica()}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                        />
                        <C_Input
                            title='SFC Sistema'
                            value={this.state.sfcsistema}
                            onChange={this.onChangeSFCSistema.bind(this)}
                            validar={this.state.validar_sfcsistema}
                        />
                        <C_DatePicker
                            onChange={this.onChangeFechaLimite.bind(this)}
                            value={this.state.fecha_limite}
                            title={'Fecha Limite'}
                        />
                    </div>
                    <div className="forms-groups">
                        <C_TextArea 
                            className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            title='LLave'
                            value={this.state.llave}
                            onChange={this.onChangeLlave.bind(this)}
                            style={{height: 60,}}
                            validar={this.state.validar_llave}
                        />
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-1 cols-md-1'></div>
                        <C_Select 
                            title='Estado'
                            value={this.state.estado}
                            onChange={this.onChangeEstado.bind(this)}
                            component={[
                                <Option key='0' value='E'>Sin definir</Option>,
                                <Option key='1' value='A'>Activo</Option>,
                            ]}
                        />
                        <C_Input
                            title='Nro factura Inicial'
                            value={this.state.nrofacturainicial}
                            onChange={this.onChangeNroFacturaInicial.bind(this)}
                            validar={this.state.validar_nrofacturainicial}
                        />
                        <C_Input
                            title='Nro factura Siguiente'
                            value={this.state.nrofacturasiguiente}
                            onChange={this.onChangeNroFacturaSiguiente.bind(this)}
                            validar={this.state.validar_nrofacturasiguiente}
                        />
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">2. Parámetros de factura</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <C_Input
                            title='Titulo'
                            value={this.state.titulo}
                            onChange={this.onChangeTitulo.bind(this)}
                            validar={this.state.validar_titulo}
                        />
                        <C_Input
                            title='Sub Titulo'
                            value={this.state.subtitulo}
                            onChange={this.onChangeSubTitulo.bind(this)}
                        />
                        <C_Select 
                            title='Tipo Papel'
                            value={this.state.tipopapel}
                            onChange={this.onChangeTipoPapel.bind(this)}
                            component={[
                                <Option key={0} value={'S'}> {'EStandar'} </Option>,
                                <Option key={1} value={'R'}> {'Rollo'} </Option>,
                            ]}
                        />
                        <C_Select 
                            title='Plantilla de Factura'
                            value={this.state.plantillafactura}
                            onChange={this.onChangePlantillaFactura.bind(this)}
                            component={[
                                <Option key={0} value={'P'}> {'Por Defecto'} </Option>,
                            ]}
                        />
                    </div>
                    <div className="forms-groups">
                        <C_TextArea 
                            title='Leyenda de Pie 1'
                            value={this.state.leyendauno}
                            onChange={this.onChangeLeyendaUno.bind(this)}
                            style={{height: 60,}}
                            validar={this.state.validar_leyendauno}
                        />
                        <C_TextArea 
                            title='Leyenda de Pie 2'
                            value={this.state.leyendados}
                            onChange={this.onChangeLeyendaDos.bind(this)}
                            style={{height: 60,}}
                            validar={this.state.validar_leyendados}
                        />
                    </div>
                    <div className="forms-groups" style={{textAlign: 'center',}}>
                        <C_Button
                            title={'Aceptar'}
                            type='danger'
                            onClick={this.onValidar.bind(this)}
                        />
                        <C_Button
                            title={'Cancelar'}
                            type='primary'
                            onClick={() => this.setState({ visible_cancel: true, })}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Crear_Dosificacion.propTypes = {
    style: PropTypes.object,
}

Crear_Dosificacion.defaultProps = {
    style: {},
}

export default withRouter(Crear_Dosificacion);
