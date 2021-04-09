
import React, { Component } from 'react';
import C_Button from '../../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../../utils/routes';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';

import { message } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../../componentes/confirmation';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import ws from '../../../utils/webservices';
import { convertYmdToDmy, convertDmyToYmd } from '../../../utils/toolsDate';

class EditarPeriodo extends Component {
    constructor(props){
        super(props)
        this.state = {
            descripcion: '',
            fechainicio: '',
            fechafin: '',

            fechainicial: '',

            idperiodo: '',
            comprobante: 0,

            visible: false,
            bandera: 0,
            loading: false,

            noSesion: false,
        }

    }

    componentDidMount(){
        this.get_Periodo();
    }

    get_Periodo() {
        httpRequest('get', ws.wsgestionperiodo + '/editar_periodo/' + this.props.match.params.id).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        descripcion: response.data.descripcion,
                        fechainicio: convertYmdToDmy(response.data.fechaini),
                        fechainicial: response.data.fechaini,
                        fechafin: convertYmdToDmy(response.data.fechafin),
                        comprobante: response.comprobante,
                        idperiodo: response.periodo.idperiodocontable,
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
        if (convertDmyToYmd(event) >= this.state.fechainicial) {
            this.setState({
                fechainicio: event,
            });
            if (event == '') {
                this.setState({
                    fechafin: '',
                });
            }
        }else {
            message.warning('Fecha Invalida!!!');
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
            fechainicio: convertDmyToYmd(this.state.fechainicio),
            fechafin: convertDmyToYmd(this.state.fechafin),
            id: this.props.match.params.id,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/update_periodo', objeto).then(
            response => {
                if (response.response == 1) {
                    message.success('Exito en actualizar periodo!!!');
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
                        <h1 className="lbls-title">Editar Periodo </h1>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <C_Input 
                            value={this.state.descripcion}
                            readOnly={
                                (this.state.comprobante > 0)?
                                    true:false
                            }
                            onChange={this.onChangeDescripcion.bind(this)}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            title='Descripcion'
                        />
                        <C_DatePicker 
                            value={this.state.fechainicio}
                            onChange={this.onChangeFechaInicio.bind(this)}
                            readOnly={
                                ((this.state.comprobante > 0) || 
                                    (this.props.match.params.id != this.state.idperiodo)
                                )?
                                    true:false
                            }
                            title='Fecha Inicio'
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                        />
                        <C_DatePicker 
                            value={this.state.fechafin}
                            onChange={this.onChangeFechaFin.bind(this)}
                            title='Fecha Final'
                            readOnly={
                                ((this.state.fechainicio == '') || 
                                    (this.state.comprobante > 0) ||
                                    (this.props.match.params.id != this.state.idperiodo)
                                )?
                                    true:false
                            }
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
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

export default withRouter(EditarPeriodo);

