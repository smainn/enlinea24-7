
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, stringToDateB, convertYmdToDmy, dateToString, hourToString } from '../../utils/toolsDate';
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
import C_Caracteristica from '../../componentes/data/caracteristica';
import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
const {Option} = Select;

const NRO_CUENTA_DEFAULT = 3;

class ShowComprobante extends Component{

    constructor(props){
        super(props);
        this.state = {
            idcomprobante: 0,
            idtipopago: '',
            tipo: '',
            nrodoc: '',
            codcom: '',
            moneda: '',
            tipocambio: '',
            nrochequetarjeta: '',
            fecha: '',
            tipopago: '',
            banco: '',
            referidoa: '',
            glosa: '',
            comprobante: undefined,
            redirect: false,
            nodatos: false,
            totaldebe: '',
            totalhaber: '',
            contabilizar: true,
            detalle: []
        }
    }

    componentDidMount() {
        this.showComprobante();
    }

    showComprobante() {
        httpRequest('get', ws.wscomprobante + '/' + this.props.match.params.id)
        .then((result) => {
            console.log('AAA ', result);
            if (result.response == 1) {
                let comprobante = result.comprobante;
                this.setState({
                    idcomprobante: comprobante.idcomprobante,
                    tipo: comprobante.tipo,
                    nrodoc: comprobante.nrodoc,
                    idtipopago: comprobante.idtipopago,
                    nrochequetarjeta: comprobante.nrochequetarjeta,
                    codcom: comprobante.codcomprobante,
                    tipocambio: comprobante.tipocambio,
                    moneda: comprobante.moneda,
                    fecha: comprobante.fecha,
                    tipopago: comprobante.tipopago,
                    contabilizar: comprobante.contabilizar == 'S' ? true : false,
                    banco: comprobante.banco,
                    referidoa: comprobante.referidoa,
                    glosa: comprobante.glosa,
                    totaldebe: comprobante.totaldebe,
                    totalhaber: comprobante.totalhaber,
                    detalle: result.detalle,
                    visibleModalVer: true
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    componentNroCheque() {
        if (this.state.idtipopago == 2) { // SI ES CHEQUE
            return (
                <C_Input
                    title='Nro Cheque'
                    value={this.state.nrochequetarjeta}
                    readOnly={true}
                />
            );
        }
        return null;
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    imprimir() {
        let form = document.getElementById('show_form_comp');
        form.submit();
    }

    render() {

        if (this.state.redirect) {
            return (
                <Redirect to={routes.comprobante_index} />
            );
        }
        const componentNroCheque = this.componentNroCheque();

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));

        const usuario = user == null ? '' :
            (user.apellido == null)?user.nombre:user.nombre + ' ' + user.apellido;

        const x_idusuario =  user == null ? 0 : user.idusuario;
        const x_grupousuario = user == null ? 0 : user.idgrupousuario;
        const x_login = user == null ? null : user.login;
        const x_fecha =  dateToString (new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input
                                title='Tipo'
                                value={this.state.tipo}
                                readOnly={true}
                            />

                            <C_Input
                                title='Numero'
                                value={this.state.codcom}
                                readOnly={true}
                            />

                            <C_Input
                                title='Fecha'
                                value={convertYmdToDmy(this.state.fecha.substring(0, 10))}
                                readOnly={true}
                            />

                            <C_Input
                                title='Nro Doc'
                                value={this.state.nrodoc}
                                readOnly={true}
                            />

                            <C_Input
                                title='Moneda'
                                value={this.state.moneda}
                                readOnly={true}
                            />

                            <C_Input
                                title='Tipo Cambio'
                                value={this.state.tipocambio}
                                onChange={this.onChangeTipoCambio}
                                readOnly={true}
                                style={{ textAlign: 'right' }}
                            />

                            <C_Input
                                title='Tipo Pago'
                                value={this.state.tipopago}
                                readOnly={true}
                            />

                            <C_Input
                                title='Banco'
                                value={this.state.banco}
                                readOnly={true}
                            />

                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-5 cols-md-5"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Contabilizar'}
                                    readOnly={true}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0'
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            disabled={true}
                                            checked={this.state.contabilizar}
                                        />
                                    }
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            { componentNroCheque }
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                title='Referido a'
                                value={this.state.referidoa}
                                readOnly={true}
                            />

                            <C_TextArea 
                                title='Glosa'
                                value={this.state.glosa}
                                readOnly={true}
                            />
                        </div>
                            
                            <div className="table-detalle" 
                                style={{ 
                                    width: '100%',
                                    //marginLeft: '10%',
                                    overflow: 'auto',
                                    height: 400
                                }}>
                                <table className="table-response-detalle"
                                    style={{
                                        overflow: 'auto',
                                        height: 400
                                    }}>
                                    <thead>
                                        <tr>
                                            <th>Nro</th>
                                            <th style={{ width: 300 }}>Cuenta</th>
                                            <th>Glosa</th>
                                            <th style={{ width: 80 }}>Debe</th>
                                            <th style={{ width: 80 }}>Haber</th>
                                            <th>C.Costo</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.detalle.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td style={{ width: '10% '}}>{key + 1}</td>
                                                    <td style={{ width: '30%' }}>
                                                        <C_Input
                                                            value={item.codigo + ' ' + item.cuenta}
                                                            className=""
                                                            readOnly={true}
                                                        />
                                                    </td>
                                                    <td style={{ width: '20%' }}>
                                                        <C_TextArea 
                                                            //title='Referido a'
                                                            value={item.glosa}
                                                            className=""
                                                            readOnly={true}
                                                            style={{ height: '100%' }}
                                                        />
                                                    </td>
                                                    <td style={{ width: '15%' }}>
                                                        <C_Input
                                                            value={item.debe}
                                                            className=""
                                                            readOnly={true}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td style={{ width: '15%'}}>
                                                        <C_Input
                                                            value={item.haber}
                                                            className=""
                                                            readOnly={true}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td style={{ width: '10%' }}>
                                                        <C_Input
                                                            value={item.centrocosto}
                                                            className=""
                                                            readOnly={true}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                        <tr key={-1}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <C_Input
                                                    key={0}
                                                    //title='Total Debe'
                                                    value={this.state.totaldebe}
                                                    readOnly={true}
                                                    className=""
                                                    style={{ textAlign: 'right' }}
                                                />
                                            </td>
                                            <td>
                                                <C_Input
                                                    key={1}
                                                    //title='Total Haber'
                                                    value={this.state.totalhaber}
                                                    readOnly={true}
                                                    className=""
                                                    style={{ textAlign: 'right' }}
                                                />
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        <form target="_blank" id="show_form_comp" action={routes.comprobante_imprimir} method="post">
                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />
                            <input type='hidden' value={usuario} name='usuario' />    
                            <input type='hidden' value={this.state.idcomprobante} name='idcomprobante' />   

                        </form>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Aceptar'
                                    type='primary'
                                    onClick={() => this.setState({redirect: true})}
                                />
                                <C_Button
                                    title='Imprimir'
                                    type='primary'
                                    onClick={this.imprimir.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShowComprobante;

