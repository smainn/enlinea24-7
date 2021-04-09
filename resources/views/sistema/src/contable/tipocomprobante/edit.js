
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Select, Dropdown, Menu, Divider, Modal, Result } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, stringToDateB, dateToString, hourToString, convertDmyToYmd } from '../../utils/toolsDate';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../utils/toolsStorage';
import Lightbox from 'react-image-lightbox';
import CImage from '../../componentes/image';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import { dateToStringB } from '../../utils/toolsDate';
import CSelect from '../../componentes/select2';
import PropTypes from 'prop-types';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_DatePicker from '../../componentes/data/date';
import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
import strings from '../../utils/strings';

const {Option} = Select;

const NRO_CUENTA_DEFAULT = 3;
let now = new Date();
let dat = new Date();
dat.setMonth(dat.getMonth() - 1);

class EditTipoComprobante extends Component{

    constructor(props){
        super(props);
        this.state = {
            descripcion: '',
            abreviacion: '',
            nroinicial: '',
            nroactual: '',
            firmaa: '',
            firmab: '',
            firmac: '',
            firmad: '',
            redirect: false,
            noSesion: false
        }

        this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
        this.onChangeAbreviacion = this.onChangeAbreviacion.bind(this);
        this.onChangeNroInicial = this.onChangeNroInicial.bind(this);
        this.onChangeNroActual = this.onChangeNroActual.bind(this);
        this.onChangeFirmaa = this.onChangeFirmaa.bind(this);
        this.onChangeFirmab = this.onChangeFirmab.bind(this);
        this.onChangeFirmac = this.onChangeFirmac.bind(this);
        this.onChangeFirmad = this.onChangeFirmad.bind(this);
        this.updateTipoComprobante = this.updateTipoComprobante.bind(this);

    }

    onChangeDescripcion(value) {
        this.setState({
            descripcion: value
        })
    }

    onChangeAbreviacion(value) {
        if (value.length <= 3) {
            this.setState({
                abreviacion: value
            })
        }
    }

    onChangeNroInicial(value) {
        this.setState({
            nroinicial: value
        })
    }

    onChangeNroActual(value) {
        if (value >= this.state.nroinicial || value == '') {
            this.setState({
                nroactual: value
            })
        }
    }

    onChangeFirmaa(value) {
        this.setState({
            firmaa: value
        })
    }

    onChangeFirmab(value) {
        this.setState({
            firmab: value
        })
    }

    onChangeFirmac(value) {
        this.setState({
            firmac: value
        })
    }

    onChangeFirmad(value) {
        this.setState({
            firmad: value
        })
    }

    componentDidMount() {
        this.getTipoComprobante();
    }

    getTipoComprobante() {
        httpRequest('get', ws.wscomprobantetipo + '/' + this.props.match.params.id + '/edit')
        .then((result) => {
            //console.log(result);
            if (result.response == 1) {
                this.setState({
                    descripcion: result.data.descripcion,
                    abreviacion: result.data.abreviacion,
                    nroinicial: result.data.numeradoinicial,
                    nroactual: result.data.numeroactual,
                    firmaa: result.data.firmaa,
                    firmab: result.data.firmab,
                    firmac: result.data.firmac,
                    firmad: result.data.firmad
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
    }

    updateTipoComprobante() {
        let body = {
            descripcion: this.state.descripcion,
            nroinicial: this.state.nroinicial,
            nroactual: this.state.nroactual,
            abreviacion: this.state.abreviacion,
            firmaa: this.state.firmaa,
            firmab: this.state.firmab,
            firmac: this.state.firmac,
            firmad: this.state.firmad
        }
        httpRequest('put', ws.wscomprobantetipo + '/' + this.props.match.params.id, body)
        .then((result) => {
            //console.log(result);
            if (result.response == 1) {
                message.success('El tipo de comprobante se actualizo correctamente');
                this.setState({ redirect: true })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('error en el servidor');
            }
        })
        .catch((error) => {
            //console.log(error);
            message.error(strings.message_error);
        })
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    showConfirmCancel() {
        const redirect = this.redirect.bind(this);
        Modal.confirm({
          title: 'Cancelar Editar Tipo de Comprobante',
          content: '¿Estas seguro de cancelar , los datos no se guardaran',
          okText: 'Si',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('OK');
            redirect();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        
    }

    showConfirmUpdate() {
        const updateTipoComprobante = this.updateTipoComprobante.bind(this);
        if (!this.validarParametros()) return;
        Modal.confirm({
          title: 'Actualizaar Tipo Comprobante',
          content: '¿Estas seguro de actualizar el tipo de comprobante?',
          okText: 'Si',
          cancelText: 'No',
          onOk() {
            console.log('OK');
            updateTipoComprobante();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }


    validarParametros() {
        let descripcion = this.state.descripcion.trim();
        if (descripcion.length === 0) {
            message.warning('El campo Descripcion es obligatorio');
            return false;
        }
        let nroini = this.state.nroinicial.toString().trim();
        if (nroini.length === 0) {
            message.warning('El Nro Inicial es requerido');
            return false;
        }
        let nroactual = this.state.nroinicial.toString().trim();
        if (nroactual.length === 0 || isNaN(parseInt(nroactual))) {
            message.warning('El Nro Actual es requerido');
            return false;
        }
        let abreviacion = this.state.abreviacion.trim();
        if (abreviacion.length === 0) {
            message.warning('El campo Abreviacion es obligatorio');
            return false;
        }
        return true;
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.comprobantetipo_index}/>
            );
        }

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups" style={{'marginTop': '-15px'}}>

                        <div className="pulls-left">
                            <h1 className="lbls-title"> Editar Tipo Comprobante </h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input
                                title="Descripcion"
                                value={this.state.descripcion}
                                onChange={this.onChangeDescripcion}
                            />
                            <C_Input 
                                title="Numero Inicial"
                                value={this.state.nroinicial}
                                onChange={this.onChangeNroInicial}
                            />
                            <C_Input
                                title="Numero Actual"
                                value={this.state.nroactual}
                                onChange={this.onChangeNroActual}
                            />
                            <C_Input
                                title="Abreviacion"
                                value={this.state.abreviacion}
                                onChange={this.onChangeAbreviacion}
                            />
                            <C_Input
                                title="Firmante 1"
                                value={this.state.firmaa}
                                onChange={this.onChangeFirmaa}
                            />
                            <C_Input
                                title="Firmante 2"
                                value={this.state.firmab}
                                onChange={this.onChangeFirmab}
                            />
                            <C_Input
                                title="Firmante 3"
                                value={this.state.firmac}
                                onChange={this.onChangeFirmac}
                            />
                            <C_Input
                                title="Firmante 4"
                                value={this.state.firmad}
                                onChange={this.onChangeFirmad}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Guardar'
                                    type='primary'
                                    onClick={this.showConfirmUpdate.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={this.showConfirmCancel.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditTipoComprobante;

