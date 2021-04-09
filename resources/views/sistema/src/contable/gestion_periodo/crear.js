
import React, { Component } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../utils/routes';
import C_Input from '../../componentes/data/input';
import C_DatePicker from '../../componentes/data/date';

import { message } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { convertDmyToYmd } from '../../utils/toolsDate';

class CreateGestionPeriodo extends Component {
    constructor(props){
        super(props)
        this.state = {
            descripcion: '',
            fechainicio: '',
            fechafin: '',

            validardescripcion: 1,
            validarfechainicio: 1,
            validarfechafin: 1,

            visible: false,
            bandera: 0,
            loading: false,

            noSesion: false,
        }

    }

    componentDidMount(){
    }

    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
            validardescripcion: 1,
        });
    }
    onChangeFechaInicio(event) {
        this.setState({
            fechainicio: event,
            validarfechainicio: 1,
        });
        if (event == '') {
            this.setState({
                fechafin: '',
            });
        }
    }
    onChangeFechaFin(event) {
        if (event > this.state.fechainicio) {
            this.setState({
                fechafin: event,
                validarfechafin: 1,
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
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({
                    validardescripcion: 0,
                });
            }
            if (this.state.fechainicio == '') {
                this.setState({
                    validarfechainicio: 0,
                });
            }
            if (this.state.fechafin == '') {
                this.setState({
                    validarfechafin: 0,
                });
            }
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
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafin: convertDmyToYmd(this.state.fechafin),
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/store', objeto).then(
            response => {
                if (response.response == 1) {
                    message.success('Exito en generar gestion!!!');
                    this.props.history.goBack();
                }
                if (response.response == 0) {
                    message.error(response.message);
                    this.setState({
                        validardescripcion: 0,
                    });
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
                        <h1 className="lbls-title">Nueva Gestión y periodos </h1>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <C_Input 
                            value={this.state.descripcion}
                            onChange={this.onChangeDescripcion.bind(this)}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            title='Descripcion'
                            validar={this.state.validardescripcion}
                        />
                        <C_DatePicker 
                            value={this.state.fechainicio}
                            onChange={this.onChangeFechaInicio.bind(this)}
                            title='Fecha Inicio'
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            validar={this.state.validarfechainicio}
                        />
                        <C_DatePicker 
                            value={this.state.fechafin}
                            onChange={this.onChangeFechaFin.bind(this)}
                            title='Fecha Final'
                            readOnly={(this.state.fechainicio == '')?true:false}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            validar={this.state.validarfechafin}
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

export default withRouter(CreateGestionPeriodo);

