
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link, Redirect,withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Table, Pagination, Select, notification } from 'antd';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import ws from '../../utils/webservices';
import C_Button from '../../componentes/data/button';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import Confirmation from '../../componentes/confirmation';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import C_DatePicker from '../../componentes/data/date';
import C_CheckBox from '../../componentes/data/checkbox';
import C_TextArea from '../../componentes/data/textarea';
import C_TreeSelect from '../../componentes/data/treeselect';

const { Option } = Select;

class EditarPlantillaAsienAutom extends Component{

    constructor(props) {
        super(props);

        this.state = {
            visible_cancelar: false,
            visible_submit: false,

            title: '',
            comprobantedetalle: [],
            tree_cuenta: [],
            tree_centrocosto: [],
            array_comprobantetipo: [],

            idctbcomprobautomat: null,
            idcomprobantetipo: null,
            numero: null,
            fecha: null,
            moneda: null,
            tipocambio: null,
            nrodoc: null,
            tipopago: null,
            contabilizar: true,
            referidoa: null,
            glosa: null,

            numniveles: -1,

            loading: false,
            noSesion: false,
        };

        this.permisions = {
            // btn_editar: readPermisions(keys.config_eerr_btn_editar),
        };

    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('post', ws.wsplantilla_asien_autom + '/edit', {id: this.props.match.params.id})
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                console.log(result)
                this.setState({
                    title: result.data == null ? '' : result.data.nombre,
                    idctbcomprobautomat: result.data.idctbcomprobautomat,
                    comprobantedetalle: result.detalle,
                    numniveles: result.cuentaconfig == null ? -1 : result.cuentaconfig.numniveles,
                    array_comprobantetipo: result.comprobantetipo,
                    idcomprobantetipo: result.data.fkidcomprobantetipo,
                    numero: result.data.codcomprobante,
                    fecha: result.data.fecha,
                    moneda: result.data.fkidmoneda,
                    tipocambio: result.data.tipocambio,
                    nrodoc: result.data.nrodoc,
                    tipopago: result.data.fkidtipopago,
                    contabilizar: result.data.contabilizar == 'S' ? true : false,
                    referidoa: result.data.referidoa,
                    glosa: result.data.glosa,
                });
                this.cargarTreeCuenta(result.cuenta, result.cuentapadre);
                this.cargarTreeCentroCosto(result.centrocosto, result.centrocostopadre);
            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                console.log(result);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
    cargarTreeCuenta(array_cuenta, array_cuentapadre) {
        var array = array_cuentapadre;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].codcuenta,
                value: array[i].codcuenta,
                idcuentaplan: array[i].idcuentaplan,
                cuenta: array[i].nombre,
                codcuenta: array[i].codcuenta,
                nivel: 1,
            };
            array_aux.push(objeto);
        }
        this.treeCuenta(array_aux, array_cuenta, 2);
        this.setState({
            tree_cuenta: array_aux,
        });
    }
    treeCuenta(data, array_cuenta, nivel) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCuenta(data[i].idcuentaplan, array_cuenta, nivel);
            data[i].children = hijos;
            this.treeCuenta(hijos, array_cuenta, nivel + 1);
        }
    }
    childrenCuenta(idpadre, array_cuenta, nivel) {
        var array = array_cuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    title: array[i].codcuenta,
                    value: array[i].codcuenta,
                    idcuentaplan: array[i].idcuentaplan,
                    cuenta: array[i].nombre,
                    codcuenta: array[i].codcuenta,
                    nivel: nivel,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    cargarTreeCentroCosto(array_centrocosto, array_centrocostopadre) {
        var array = array_centrocostopadre;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].nombre,
                value: array[i].nombre,
                idcentrodecosto: array[i].idcentrodecosto,
            };
            array_aux.push(objeto);
        }
        this.treeCentroCosto(array_aux, array_centrocosto);
        this.setState({
            tree_centrocosto: array_aux,
        });
    }
    treeCentroCosto(data, array_centrocosto) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCentroCosto(data[i].idcentrodecosto, array_centrocosto);
            data[i].children = hijos;
            this.treeCentroCosto(hijos, array_centrocosto);
        }
    }
    childrenCentroCosto(idpadre, array_centrocosto) {
        var array = array_centrocosto;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcentrodecostopadre == idpadre) {
                var objeto = {
                    title: array[i].nombre,
                    value: array[i].nombre,
                    idcentrodecosto: array[i].idcentrodecosto,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    componenteComprobanteTipo() {
        let data = this.state.array_comprobantetipo;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idcomprobantetipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    componentBack() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registro"
                onCancel={() => this.setState({visible_cancelar: false,})}
                onClick={() => {
                    this.setState({loading: true,});
                    setTimeout(() => {
                        this.props.history.goBack();
                    }, 500);
                }}
                width={400}
                content={'¿Esta seguro de cancelar los registro? Los datos ingresados se perderan.'}
            />
        );
    }
    componentSubmit() {
        return (
            <Confirmation
                visible={this.state.visible_submit}
                loading={this.state.loading}
                title="Registrar Registro"
                onCancel={() => this.setState({visible_submit: false,})}
                onClick={this.onStoreData.bind(this)}
                width={400}
                content={'¿Esta seguro de guardar registro?'}
            />
        );
    }
    onStoreData() {
        this.setState({ loading: true, });
        let body = {
            comprobantedetalle: JSON.stringify(this.state.comprobantedetalle),
            idctbtransacautomaticas: this.props.match.params.id,
            contabilizar: this.state.contabilizar ? 'S' : 'N',
            idcomprobantetipo: this.state.idcomprobantetipo,
            idctbcomprobautomat: this.state.idctbcomprobautomat,
        };
        httpRequest('post', ws.wsplantilla_asien_autom + '/update', body)
        .then((result) => {
            if (result.response == 1) {
                console.log(result)
                message.success('EXITO EN ACTUALIZAR INFORMACION');
                this.props.history.goBack();
            } else if (result.response == 2) {
                message.error('ERROR AL ACTUALIZAR INFORMACION');
                this.setState({ loading: false, });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, loading: false, });
            } else {
                message.error('ERROR AL ACTUALIZAR INFORMACION');
                this.setState({ loading: false, });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false, })
        });
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                {this.componentBack()}
                {this.componentSubmit()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title" style={{fontSize: 18,}}>
                                ASIENTO -> {this.state.title.toUpperCase()}
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <C_Select 
                            title='Tipo'
                            value={this.state.idcomprobantetipo}
                            allowDelete={this.state.idcomprobantetipo == null ? false : true}
                            onDelete={() => this.setState({idcomprobantetipo: null,})}
                            onChange={(value) => {
                                this.setState({idcomprobantetipo: value,})
                                // for (let index = 0; index < this.state.array_comprobantetipo.length; index++) {
                                //     const data = this.state.array_comprobantetipo[index];
                                //     if (data.idcomprobantetipo == value) {
                                //         this.setState({numero: parseInt(data.numeroactual) + 1,});
                                //         return;
                                //     }
                                // }
                            }}
                            component={this.componenteComprobanteTipo()}
                        />
                        <C_Input
                            title='Numero'
                            value={this.state.numero}
                            readOnly={true}
                        />
                        <C_Select
                            title='Moneda'
                            value={this.state.moneda}
                            //onChange={this.onChangeIDMoneda.bind(this)}
                            //component={this.componenteMoneda()}
                            readOnly={true}
                        />
                        <C_Input
                            title='Tipo Cambio'
                            value={this.state.tipocambio}
                            //onChange={this.onChangeTipoCambio.bind(this)}
                            style={{ textAlign: 'right' }}
                            readOnly={true}
                        />
                    </div>
                    <div className='forms-groups'>
                        {/* <C_DatePicker 
                            //value={this.state.fecha}
                            //onChange={this.onChangeFecha.bind(this)}
                            readOnly={true}
                        /> */}
                        <C_Input
                            title='Fecha'
                            value={this.state.fecha}
                            //onChange={this.onChangeNroDoc.bind(this)}
                            readOnly={true}
                        />
                        <C_Input
                            title='Nro Doc'
                            value={this.state.nrodoc}
                            //onChange={this.onChangeNroDoc.bind(this)}
                            readOnly={true}
                        />
                        <C_Select
                            title='Tipo Pago'
                            value={this.state.tipopago}
                            //onChange={this.onChangeIDTipoPago.bind(this)}
                            //component={this.componenteTiposPagos()}
                            readOnly={true}
                        />
                        <C_CheckBox
                            title='Contabilizar'
                            style={{ marginTop: 16, marginLeft: 4 }}
                            onChange={(event) => this.setState({ contabilizar: event.target.checked, })}
                            checked={this.state.contabilizar}
                        />
                    </div>
                    <div className='forms-groups'>
                        <C_TextArea 
                            title='Referido a'
                            value={this.state.referidoa}
                            //onChange={this.onChangeReferidoA.bind(this)}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                            readOnly={true}
                        />
                        <C_TextArea 
                            title='Glosa Gral.'
                            value={this.state.glosa}
                            //onChange={this.onChangeGlosa.bind(this)}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                            readOnly={true}
                        />
                    </div>
                    <div className='forms-groups'>
                        <div className="table-detalle">
                            <table className="table-response-detalle">
                                <thead>
                                    <tr>
                                        <th> Clave </th>
                                        <th> Desripcion Cuenta </th>
                                        <th> Cod Cuenta </th>
                                        <th> Nombre Cuenta </th>
                                        <th> Glosa </th>
                                        <th> Debe </th>
                                        <th> Haber </th>
                                        <th> C. Costo </th>
                                        <th> Valor % </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.comprobantedetalle.map((data, key) => (
                                        <tr key={key}>
                                            <td>{data.clave}</td>
                                            <td>{data.descripcion}</td>
                                            <td>
                                                <C_TreeSelect
                                                    showSearch={true} allowClear={true}
                                                    value={data.codcuenta} treeData={this.state.tree_cuenta}
                                                    onChange={(value, label, extra) => {
                                                        if (typeof value == 'undefined') {
                                                            data.codcuenta = null;
                                                            data.idcuentaplan = null;
                                                            data.cuenta = null;
                                                        }else {
                                                            if (extra.triggerNode.props.nivel == this.state.numniveles) {
                                                                data.codcuenta = value;
                                                                data.idcuentaplan = extra.triggerNode.props.idcuentaplan;
                                                                data.cuenta = extra.triggerNode.props.cuenta;
                                                            }else {
                                                                message.warning(`Debe seleccionar una cuenta del nivel ${this.state.numniveles}`);
                                                            }
                                                        }
                                                        this.setState({
                                                            comprobantedetalle: this.state.comprobantedetalle,
                                                        })
                                                    }}
                                                    placeholder='Seleccione una opcion' className=''
                                                />
                                            </td>
                                            <td>{data.cuenta == null ? '' : data.cuenta}</td>
                                            <td>{data.glosamenor == null ? '' : data.glosamenor}</td>
                                            <td>{data.debe}</td>
                                            <td>{data.haber}</td>
                                            <td>
                                                <C_TreeSelect
                                                    showSearch={true} allowClear={true} 
                                                    value={data.centrodecosto}
                                                    treeData={this.state.tree_centrocosto}
                                                    onChange={(value, label, extra) => {
                                                        if (typeof value == 'undefined') {
                                                            data.idcentrodecosto = null;
                                                            data.centrodecosto = null;
                                                        }else {
                                                            data.centrodecosto = value;
                                                            data.idcentrodecosto = extra.triggerNode.props.idcentrodecosto;
                                                        }
                                                        this.setState({
                                                            comprobantedetalle: this.state.comprobantedetalle,
                                                        })
                                                    }}
                                                    placeholder='Seleccione una opcion' className=''
                                                />
                                            </td>
                                            <td>{data.valor}</td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='forms-groups'>
                        <div className="txts-center">
                            <C_Button
                                title='Guardar'
                                type='primary'
                                onClick={() => this.setState({ visible_submit: true, })}
                            />
                            <C_Button
                                title='Cancelar'
                                type='danger'
                                onClick={() => this.setState({ visible_cancelar: true, })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EditarPlantillaAsienAutom.propTypes = {
    first_data: PropTypes.object,
}

EditarPlantillaAsienAutom.defaultProps = {
    first_data: {
        nombre: '', id: null,
    },
}

export default withRouter(EditarPlantillaAsienAutom);

