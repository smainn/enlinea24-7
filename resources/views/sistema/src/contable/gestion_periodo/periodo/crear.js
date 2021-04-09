
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
import { cambiarFormato, convertDmyToYmd, convertYmdToDmy } from '../../../utils/toolsDate';

class CreatePeriodo extends Component {
    constructor(props){
        super(props)
        this.state = {
            gestion: '',

            descripcion: '',
            fechainicio: '',
            fechafin: '',

            fechafinal: '',
            fechainicial: '',

            visible: false,
            bandera: 0,
            loading: false,

            noSesion: false,
        }

    }
    fechainicio(date) {
        //console.log(new Date(2020, 2, 0).getDate());
        var array = date.split('-');
        var dia = parseInt(array[2]);
        var mes = parseInt(array[1]);
        var year = parseInt(array[0]);
        var ultimodia = new Date(year, mes, 0).getDate();

        var fecha = '';
        if (dia == ultimodia) {
            dia = 1;
            mes = mes + 1;
            if (mes > 12) {
                mes = 1
                year = year + 1;
            }
        }else {
            dia = dia + 1;
        }
        dia = (dia.toString().length == 1)?'0'+dia:dia;
        mes = (mes.toString().length == 1)?'0'+mes:mes;
        fecha = dia + '-' + mes + '-' + year;

        return fecha;
    }
    componentDidMount(){
        httpRequest('get', ws.wsgestionperiodo + '/show_gestion/' + this.props.match.params.id).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        gestion: response.data.descripcion,
                        fechainicial: convertYmdToDmy(response.data.fechaini),
                        fechainicio: (response.detalle == null)?
                            convertYmdToDmy(response.data.fechaini):this.fechainicio(response.detalle.fechafin),
                        fechafinal: convertYmdToDmy(response.data.fechafin),
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
        if (convertDmyToYmd(event) <= convertDmyToYmd(this.state.fechafinal)) {
            if (convertDmyToYmd(event) >= convertDmyToYmd(this.state.fechainicio)) {
                this.setState({
                    fechafin: event,
                });
            }else {
                message.warning('Fecha Invalida!!!');
            }
        }else {
            message.warning('Fecha limite sobrepasado!!!');
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
            idgestion: this.props.match.params.id,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsgestionperiodo + '/store_periodo', objeto).then(
            response => {
                if (response.response == 1) {
                    message.success('Exito en generar periodo!!!');
                    this.props.history.goBack();
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
                            <label>¿Estas seguro de agregar un nuevo periodo?</label>
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
            );
        }
        return (
            <div className="rows">
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title" style={{padding: 0,}}>
                            Nuevo Periodo 
                        </h1>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{paddingTop: 0}}
                    >
                        <div className='txts-center'>
                            <h1 className="lbls-title" style={{padding: 0,}}>
                                Gestion {this.state.gestion} 
                            </h1>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{paddingTop: 0}}
                    >
                        <div className='txts-center'>
                            <h1 className="lbls-title" style={{padding: 0, fontSize: 15}}>
                                {cambiarFormato(this.state.fechainicial)} - {cambiarFormato(this.state.fechafinal)}
                            </h1>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <C_Input 
                            value={this.state.descripcion}
                            onChange={this.onChangeDescripcion.bind(this)}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                            title='Descripcion'
                        />
                        <C_DatePicker 
                            value={this.state.fechainicio}
                            onChange={this.onChangeFechaInicio.bind(this)}
                            title='Fecha Inicio'
                            readOnly={true}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal'
                        />
                        <C_DatePicker 
                            value={this.state.fechafin}
                            onChange={this.onChangeFechaFin.bind(this)}
                            title='Fecha Final'
                            readOnly={(this.state.fechainicio == '')?true:false}
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

export default withRouter(CreatePeriodo);

