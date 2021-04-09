
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { message, Select, Modal, notification } from 'antd';
import "antd/dist/antd.css"; 
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';
import { Redirect, withRouter } from 'react-router-dom';
import routes from '../../utils/routes';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import { dateToString, convertDmyToYmd, stringToDate, convertYmdToDmy } from '../../utils/toolsDate';
import C_DatePicker from '../../componentes/data/date';
import strings from '../../utils/strings';
import ws from '../../utils/webservices';
import C_Select from '../../componentes/data/select';
import C_TextArea from '../../componentes/data/textarea';
import Confirmation from '../../componentes/confirmation';

const {Option} = Select;

let dateNow = new Date();

class EditarTipoCambio extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible_cancel: false,
            visible_submit: false,
            loading: false,

            valor: 1,
            fecha: dateToString(dateNow, 'f2'),
            estado: 'A',
            idmonedaingresado: '',
            idmonedacambio: '',

            validar_valor: 1,

            array_moneda: [],

            noSesion: false,
        }
    }
    componentDidMount() {
        httpRequest('get', ws.wstipocambio + '/edit/' + this.props.match.params.id)
        .then((result) => {
            if (result.response == 1) {
                // console.log(result)
                this.setState({
                    //idmonedaingresado: (result.moneda.length > 0) ? result.moneda[0].idmoneda : '',
                    array_moneda: result.moneda,
                    valor: result.tipocambio.valor,
                    fecha: convertYmdToDmy(result.tipocambio.fecha),
                    idmonedaingresado: result.tipocambio.fkidmonedauno,
                    idmonedacambio: result.tipocambio.fkidmonedados,
                    estado: result.tipocambio.estado,
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
    onChangeValor(value) {
        if (!isNaN(value)) {
            this.setState({
                valor: value,
                validar_valor: 1,
            });
        }
    }
    onChangeFecha(date) {
        this.setState({
            fecha: date,
        });
    }
    onChangeEstado(value) {
        this.setState({
            estado: value,
        });
    }
    onChangeMonedaIngresado(value) {
        if (this.state.idmonedacambio == '') {
            this.setState({
                idmonedaingresado: value,
            });
        }else {
            const actualizar = () => {
                this.setState({
                    idmonedaingresado: value,
                    idmonedacambio: '',
                    valor: 1,
                });
            };
            Modal.confirm({
                title: 'Cambio de Moneda',
                content: 'Al cambiar moneda se perderan los registros seleccionados, ¿Desea continuar?',
                onOk() {
                    actualizar();
                },
                onCancel() {
                  console.log('Cancel');
                },
            });
        }
    }
    onChangeMonedaCambio(value) {
        if (value == this.state.idmonedaingresado) {
            notification.error({
                message: 'Advertencia',
                description:
                    'No se puede seleccionar la misma moneda... Favor de ingresar otra moneda',
            });
        }else {
            this.setState({
                idmonedacambio: value,
            });
        }
    }
    componentMoneda() {
        var array = [];
        for (let i = 0; i < this.state.array_moneda.length; i++) {
            var data = this.state.array_moneda[i];
            array.push(
                <Option key={i} value={data.idmoneda}> 
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
        if (this.state.valor.toString().trim().length == 0) {
            message.error('Favor de ingresar valor');
            this.setState({
                validar_valor: 0,
            });
            return;
        }
        if (this.state.valor.toString().trim().length > 0) {
            if (parseFloat(this.state.valor) <= 0) {
                message.error('No se permite valor 0');
                this.setState({
                    validar_valor: 0,
                });
                return;
            }
        }
        if (this.state.idmonedacambio.toString().trim().length == 0) {
            message.error('Favor de ingresar moneda de cambio');
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
            valor: this.state.valor,
            fecha: convertDmyToYmd(this.state.fecha),
            estado: this.state.estado,
            idmonedaingresado: this.state.idmonedaingresado,
            idmonedacambio: this.state.idmonedacambio,
            id: this.props.match.params.id,
        };
        httpRequest('post', ws.wstipocambio + '/update', body)
        .then(result => {
            if(result.response == 1){
                
                message.success('Se edito Correctamente');

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
                                ¿Esta seguro de cancelar el registro de tipo de cambio?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    }
                />
                <Confirmation
                    visible={this.state.visible_submit}
                    loading={this.state.loading}
                    onCancel={this.onClose.bind(this)}
                    title='Editar Tipo de Cambio'
                    onClick={this.onSubmit.bind(this)}
                    content='¿Estas seguro de guardar datos...?'
                />
                <div className="cards" style={{'padding': 0}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Editar tipo de cambio </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-3 cols-md-3'></div>
                        <C_DatePicker
                            onChange={this.onChangeFecha.bind(this)}
                            value={this.state.fecha}
                            title={'Fecha'}
                        />
                        <C_Select 
                            title='Estado'
                            value={this.state.estado}
                            onChange={this.onChangeEstado.bind(this)}
                            component={[
                                <Option key='0' value='A'>Activo</Option>,
                                <Option key='1' value='N'>Inactivo</Option>,
                            ]}
                        />
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-1 cols-md-1'></div>
                        <C_Select 
                            title='De Moneda'
                            value={this.state.idmonedaingresado}
                            onChange={this.onChangeMonedaIngresado.bind(this)}
                            component={this.componentMoneda()}
                        />
                        <C_Select
                            title='A Moneda'
                            value={this.state.idmonedacambio}
                            onChange={this.onChangeMonedaCambio.bind(this)}
                            component={this.componentMoneda()}
                        />
                        <C_Input
                            title='Valor'
                            value={this.state.valor}
                            onChange={this.onChangeValor.bind(this)}
                            validar={this.state.validar_valor}
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

EditarTipoCambio.propTypes = {
    style: PropTypes.object,
}

EditarTipoCambio.defaultProps = {
    style: {},
}

export default withRouter(EditarTipoCambio);
