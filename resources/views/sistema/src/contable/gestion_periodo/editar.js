
import React, { Component } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../utils/routes';
import C_Input from '../../componentes/data/input';
import C_DatePicker from '../../componentes/data/date';

import { message, Select } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { convertYmdToDmy, convertDmyToYmd } from '../../utils/toolsDate';
import C_Select from '../../componentes/data/select';

const { Option } =Select;

class EditarGestionPeriodo extends Component {
    constructor(props){
        super(props)
        this.state = {
            descripcion: '',
            fechainicio: '',
            fechafin: '',

            estado: 'P',

            periodo: 0,
            tipo: 0,

            visible: false,
            bandera: 0,
            loading: false,

            noSesion: false,
        }

    }

    componentDidMount(){
        this.get_Gestion_Periodo();
    }

    get_Gestion_Periodo() {
        httpRequest('get', ws.wsgestionperiodo + '/editar_gestion/' + this.props.match.params.id).then(
            response => {
                if (response.response == 1) {
                    console.log(response)
                    this.setState({
                        descripcion: response.data.descripcion,
                        fechainicio: convertYmdToDmy(response.data.fechaini),
                        fechafin: convertYmdToDmy(response.data.fechafin),
                        periodo: response.periodo,
                        estado: response.data.estado,
                        tipo: response.tipo,
                    });
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
        });
    }
    onChangeFechaInicio(event) {
        this.setState({
            fechainicio: event,
        });
        if (event == '') {
            this.setState({
                fechafin: '',
            });
        }
    }
    onChangeFechaFin(event) {
        if (convertDmyToYmd(event) > convertDmyToYmd(this.state.fechainicio)) {
            this.setState({
                fechafin: event,
            });
        }else {
            message.warning('Fecha Invalida!!!');
        }
    }
    onBack(event) {
        event.preventDefault();
        this.props.history.goBack();
    }
    onAddData(event) {
        event.preventDefault();
        if ((this.state.descripcion.toString().trim().length > 0) && 
            (this.state.fechainicio != '') && (this.state.fechafin != '')
        ) {
            this.setState({
                visible: true,
                bandera: 1,
            });
        }else {
            message.error('Favor de llenar campo!!!');
        }
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        });
    }
    onSubmit(event) {
        event.preventDefault();
        var objeto = {
            descripcion: this.state.descripcion,
            estado: this.state.estado,
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafin: convertDmyToYmd(this.state.fechafin),
            id: this.props.match.params.id,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/update', objeto).then(
            response => {
                if (response.response == 1) {
                    message.success('Exito en actualizar gestion!!!');
                    this.props.history.goBack();
                }
                if (response.response == 0) {
                    message.error(response.message);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
                this.onClose();
            }
        ).catch(
            error => console.log(error)
        );
    }
    componentConfirmation() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title = "Gestion y Periodo"
                    onCancel={this.onClose.bind(this)}
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de agregar una nueva gestion?</label>
                        </div>
                    }
                    onClick={this.onSubmit.bind(this)}
                />
            );
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }
        return (
            <div className="rows">
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Editar Gestión </h1>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <C_Input 
                            value={this.state.descripcion}
                            onChange={this.onChangeDescripcion.bind(this)}
                            readOnly={
                                ((this.state.periodo > 0) || (this.state.tipo > 0))?
                                    true:false
                            }
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            title='Descripcion'
                        />
                        <C_DatePicker 
                            value={this.state.fechainicio}
                            onChange={this.onChangeFechaInicio.bind(this)}
                            title='Fecha Inicio'
                            readOnly={
                                ((this.state.periodo > 0) || (this.state.tipo > 0))?
                                    true:false
                            }
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                        />
                        <C_DatePicker 
                            value={this.state.fechafin}
                            onChange={this.onChangeFechaFin.bind(this)}
                            title='Fecha Final'
                            readOnly={((this.state.fechainicio == '') || 
                                        (this.state.tipo > 0) || (this.state.periodo > 0))?
                                true:false
                            }
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                        />
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='cols-lg-4 cols-md-4'></div>
                        <C_Select
                            title='Estado'
                            value={this.state.estado}
                            onChange={(value) => this.setState({estado: value,})}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            component={[
                                <Option key='0' value='A'>Activo</Option>,
                                <Option key='1' value='P'>Pendiente</Option>,
                            ]}
                        />
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title='Cancelar'
                                type='danger'
                                onClick={this.onBack.bind(this)}
                            />
                            <C_Button title='Aceptar'
                                type='primary'
                                onClick={this.onAddData.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditarGestionPeriodo);

