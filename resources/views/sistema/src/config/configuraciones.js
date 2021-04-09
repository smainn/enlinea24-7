
import React, { Component } from 'react';
import { removeAllData, httpRequest, saveData, readData } from '../utils/toolsStorage';
import routes from '../utils/routes';
import { Select, Spin, Icon, message } from 'antd';
import C_Button from '../componentes/data/button';
import C_CheckBox from '../componentes/data/checkbox';
import C_Input from '../componentes/data/input';
import C_Select from '../componentes/data/select';
import { Redirect } from 'react-router-dom';
import ws from '../utils/webservices';
import CImage from '../componentes/image';
import Confirmation from '../componentes/confirmation';
import keysStorage from '../utils/keysStorage';
import C_DatePicker from '../componentes/data/date';
import { convertYmdToDmy } from '../utils/toolsDate';

const { Option } = Select;

export default class Configuracion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            noSesion: false,
            disabledConfigCli: true,
            disabledConfigFab: true,
            disabledConfigConta: true,
            loading: false,
            configCliente: {
                codigospropios: false,
                otroscodigos: false,
                monedapordefecto: 1,
                editprecunitenventa: false,
                editcostoproducto: false,
                masdeuncosto: false,
                masdeunalmacen: false,
                editarstockproducto: false,
                clienteesabogado: false,
                ventaendospasos: false,
                logo: null,
                nlogo: null,
                logonombre: null,
                nlogonombre: null,
                logoreporte: null,
                nlogoreporte: null,
                colors: null,
                facturarsiempre: 'N',
                asientoautomaticosiempre: true,
                asientoautomdecomprob: true,
            },
            configFabrica: {
                comalmaceninventariocorte: false,
                comalmaceningresoprod: false,
                comalmacensalidaprod: false,
                comalmacenlistadeprecios: false,
                comventasventaalcredito: false,
                comventasventaproforma: false,
                comventascobranza: false,
                comcompras: false,
                comtaller: false,
                comtallervehiculoparte: false,
                comtallervehiculohistoria: false,
                seguridad: false
            },
            configContab: {
                fecha: null,
                numniveles: 0,
                formato: null,
                impuestoanualieerr: 0
            }

        }

        this.buttonsConfCli = this.buttonsConfCli.bind(this);
        this.onChangeCodPropios = this.onChangeCodPropios.bind(this);
        this.onChangeOtrosCods = this.onChangeOtrosCods.bind(this);
        this.onChangeEditPreV = this.onChangeEditPreV.bind(this);
        this.onChangeCostoProd = this.onChangeCostoProd.bind(this);
        this.onChangeMasdeUnCosto = this.onChangeMasdeUnCosto.bind(this);
        this.onChangeMasdeUnAlmacen = this.onChangeMasdeUnAlmacen.bind(this);
        this.onChangeEditStockProd = this.onChangeEditStockProd.bind(this);
        this.onChangeMonedaDefecto = this.onChangeMonedaDefecto.bind(this);
        this.onChangeCliesAbogado = this.onChangeCliesAbogado.bind(this);
        this.storeConfigCli = this.storeConfigCli.bind(this);
        this.storeConfigFab = this.storeConfigFab.bind(this);
        this.onChangeLogo = this.onChangeLogo.bind(this);
        this.deleteImgLogo = this.deleteImgLogo.bind(this);
        this.onChangeLogoNombre = this.onChangeLogoNombre.bind(this);
        this.deleteImgLogoNombre = this.deleteImgLogoNombre.bind(this);
        this.onChangeLogoReporte = this.onChangeLogoReporte.bind(this);
        this.deleteImgLogoReporte = this.deleteImgLogoReporte.bind(this);
        this.onChangeFacturarSiempre = this.onChangeFacturarSiempre.bind(this);
        this.onChangeVentaEnDosPasos = this.onChangeVentaEnDosPasos.bind(this);

        this.onChangeAlmacenInventario = this.onChangeAlmacenInventario.bind(this);
        this.onChangeAlmacenIngresoProd = this.onChangeAlmacenIngresoProd.bind(this);
        this.onChangeAlmacenSalidaProd = this.onChangeAlmacenSalidaProd.bind(this);
        this.onChangeAlmacenListaPrecios = this.onChangeAlmacenListaPrecios.bind(this);
        this.onChangeVentasVentaCredito = this.onChangeVentasVentaCredito.bind(this);
        this.onChangeVentasVentaProforma = this.onChangeVentasVentaProforma.bind(this);
        this.onChangeVentasCobranza = this.onChangeVentasCobranza.bind(this);
        this.onChangeCompras = this.onChangeCompras.bind(this);
        this.onChangeTaller = this.onChangeTaller.bind(this);
        this.onChangeTallerVehiculoParte = this.onChangeTallerVehiculoParte.bind(this);
        this.onChangeTallerVehiculoHistoria = this.onChangeTallerVehiculoHistoria.bind(this);

        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeNumeroNiveles = this.onChangeNumeroNiveles.bind(this);
        this.onChangeFormato = this.onChangeFormato.bind(this);
        this.onChangeImpuestoAnual = this.onChangeImpuestoAnual.bind(this);
        this.buttonsConfConta = this.buttonsConfConta.bind(this);
        this.storeConfigConta = this.storeConfigConta.bind(this);
        
    };

    onChangeCodPropios(evt) {
        this.state.configCliente.codigospropios = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeOtrosCods(evt) {
        this.state.configCliente.otroscodigos = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeEditPreV(evt) {
        this.state.configCliente.editprecunitenventa = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeCostoProd(evt) {
        this.state.configCliente.editcostoproducto = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeMasdeUnCosto(evt) {
        this.state.configCliente.masdeuncosto = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeMasdeUnAlmacen(evt) {
        this.state.configCliente.masdeunalmacen = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeEditStockProd(evt) {
        this.state.configCliente.editarstockproducto = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeMonedaDefecto(value) {
        this.state.configCliente.monedapordefecto = value;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeCliesAbogado(evt) {
        this.state.configCliente.clienteesabogado = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente
        })
    }

    onChangeFacturarSiempre(event) {
        this.state.configCliente.facturarsiempre = event;
        this.setState({

            configCliente: this.state.configCliente,
        })
    }

    onChangeVentaEnDosPasos(evt) {
        this.state.configCliente.ventaendospasos = evt.target.checked;
        this.setState({
            configCliente: this.state.configCliente,
        })
    }

    onChangeLogo(event) {
        let files = event.target.files;
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.state.configCliente.logo = e.target.result;
                this.state.configCliente.nlogo = files[0].name;
                this.setState({
                    configCliente: this.state.configCliente
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }

    deleteImgLogo() {
        this.state.configCliente.logo = '';
        this.setState({
            configCliente: this.state.configCliente
        });
    }

    onChangeLogoNombre(event) {
        let files = event.target.files;
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.state.configCliente.logonombre = e.target.result;
                this.state.configCliente.nlogonombre = files[0].name;
                this.setState({
                    configCliente: this.state.configCliente
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }

    deleteImgLogoNombre() {
        this.state.configCliente.logonombre = '';
        this.setState({
            configCliente: this.state.configCliente
        });
    }

    onChangeLogoReporte(event) {
        let files = event.target.files;
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.state.configCliente.logoreporte = e.target.result;
                this.state.configCliente.nlogoreporte = files[0].name;
                this.setState({
                    configCliente: this.state.configCliente
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }

    deleteImgLogoReporte() {
        this.state.configCliente.logoreporte = '';
        this.setState({
            configCliente: this.state.configCliente
        });
    }

    onChangeAlmacenInventario(evt) {
        this.state.configFabrica.comalmaceninventariocorte = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeAlmacenIngresoProd(evt) {
        this.state.configFabrica.comalmaceningresoprod = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeAlmacenSalidaProd(evt) {
        this.state.configFabrica.comalmacensalidaprod = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeAlmacenListaPrecios(evt) {
        this.state.configFabrica.comalmacenlistadeprecios = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeVentasVentaCredito(evt) {
        this.state.configFabrica.comventasventaalcredito = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeVentasVentaProforma(evt) {
        this.state.configFabrica.comventasventaproforma = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeVentasCobranza(evt) {
        this.state.configFabrica.comventascobranza = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeCompras(evt) {
        this.state.configFabrica.comcompras = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeTaller(evt) {
        this.state.configFabrica.comtaller = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeTallerVehiculoParte(evt) {
        this.state.configFabrica.comtallervehiculoparte = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeTallerVehiculoHistoria(evt) {
        this.state.configFabrica.comtallervehiculohistoria = evt.target.checked;
        this.setState({
            configFabrica: this.state.configFabrica
        })
    }

    onChangeFecha(date) {
        this.state.configContab.fecha = date;
        this.setState({
            configContab: this.state.configContab
        })
    }

    onChangeNumeroNiveles(value) {
        this.state.configContab.numniveles = value;
        this.setState({
            configContab: this.state.configContab
        })
    }

    onChangeFormato(value) {
        this.state.configContab.formato = value;
        this.setState({
            configContab: this.state.configContab
        })
    }

    onChangeImpuestoAnual(value) {
        this.state.configContab.impuestoanualieerr = value;
        this.setState({
            configContab: this.state.configContab
        })
    }

    componentDidMount() {
        this.getConfigs();
    }

    getConfigs() {
        httpRequest('get', ws.wsconfigcliente)
        .then((resp) => {
            console.log(resp)
            if (resp.response == 1) {
                saveData(keysStorage.config_cli, JSON.stringify(resp.configcliente));
                saveData(keysStorage.config_fab, JSON.stringify(resp.configfabrica));
                saveData(keysStorage.config_contab, JSON.stringify(resp.cuentaconfig));

                var asientoautomaticosiempre = resp.configcliente.asientoautomaticosiempre;
                resp.configcliente.asientoautomaticosiempre = (asientoautomaticosiempre == null || asientoautomaticosiempre == 'N') ? false : true; 

                var asientoautomdecomprob = resp.configcliente.asientoautomdecomprob;
                resp.configcliente.asientoautomdecomprob = (asientoautomdecomprob == null || asientoautomdecomprob == 'N') ? false : true; 

                this.setState({
                    configCliente: resp.configcliente,
                    configFabrica: resp.configfabrica,
                    configContab: resp.cuentaconfig,
                })
            } else if (resp.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    storeConfigCli() {
        this.setState({
            loading: true
        });
        httpRequest('post', ws.wsconfigcliente, {
            configCliente: this.state.configCliente,
        })
        .then((resp) => {
            this.setState({
                loading: false,
                disabledConfigCli: true
            });
            console.log(resp)
            if (resp.response == 1) {
                saveData(keysStorage.config_cli, JSON.stringify(resp.configCli));
                var config = JSON.parse(readData(keysStorage.config_cli))
                this.props.getventaendospasos(config.ventaendospasos)
                message.success('Se guardo correctamente');
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            this.setState({
                loading: false
            });
            message.error('Error no se pudo procesr la solicitud, revise su conexion de internet');
            console.log(error);
        })
    }

    storeConfigFab() {
        this.setState({
            loading: true
        })
        httpRequest('post', ws.wsconfigfabrica, {
            configFabrica: this.state.configFabrica
        })
        .then((resp) => {
            this.setState({
                loading: false,
                disabledConfigFab: true
            });
            if (resp.response == 1) {
                saveData(keysStorage.config_fab, JSON.stringify(resp.configFab));
                message.success('Se guardo correctamente');
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            this.setState({
                loading: false,
            });
            console.log(error);
            message.error('Error no se pudo procesr la solicitud, revise su conexion de internet');
        })
    }

    storeConfigConta() {
        this.setState({
            loading: true
        })
        httpRequest('post', ws.wsconfigcontab, {
            config: this.state.configContab
        })
        .then((resp) => {
            this.setState({
                loading: false,
                disabledConfigConta: true
            });
            if (resp.response == 1) {
                saveData(keysStorage.config_contab, JSON.stringify(resp.config));
                message.success('Se guardo correctamente');
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            this.setState({
                loading: false,
            });
            console.log(error);
            message.error('Error no se pudo procesr la solicitud, revise su conexion de internet');
        })
    }

    buttonsConfCli() {
        if (this.state.disabledConfigCli) {
            return (
                <C_Button 
                    title='Editar'
                    onClick={() => this.setState({ disabledConfigCli: false })}
                />
            );
        }
        return (
            <>
            <C_Button 
                title='Guardar'
                onClick={this.storeConfigCli}
            />
            <C_Button 
                title='Cancelar'
                type='danger'
                onClick={() => {
                    let encode = readData(keysStorage.config_cli);
                    let conf = encode == null ? this.state.configCliente : JSON.parse(encode);
                    this.setState({ 
                        disabledConfigCli: true,
                        configCliente: conf
                    })
                }}
            />
            </>
        );
    }

    buttonsConfFab() {
        if (this.state.disabledConfigFab) {
            return (
                <C_Button 
                    title='Editar'
                    onClick={() => this.setState({ disabledConfigFab: false })}
                />
            );
        }
        return (
            <>
            <C_Button 
                title='Guardar'
                onClick={this.storeConfigFab}
            />
            <C_Button 
                title='Cancelar'
                type='danger'
                onClick={() => {
                    let encode = readData(keysStorage.config_fab);
                    let conf = encode == null ? this.state.configFabrica : JSON.parse(encode);
                    this.setState({ 
                        disabledConfigFab: true,
                        configFabrica: conf
                    })
                }}
            />
            </>
        );
    }

    buttonsConfConta() {
        if (this.state.disabledConfigConta) {
            return (
                <C_Button 
                    title='Editar'
                    onClick={() => this.setState({ disabledConfigConta: false })}
                />
            );
        }
        return (
            <>
            <C_Button 
                title='Guardar'
                onClick={this.storeConfigConta}
            />
            <C_Button 
                title='Cancelar'
                type='danger'
                onClick={() => {
                    let encode = readData(keysStorage.config_contab);
                    let conf = encode == null ? this.state.configContab : JSON.parse(encode);
                    this.setState({ 
                        disabledConfigConta: true,
                        configContab: conf
                    })
                }}
            />
            </>
        );
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
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Configuracion</h1>
                    </div>
                    <Confirmation
                        title={'Guardando...'}
                        visible={this.state.loading}
                        content={
                            <div style={{ textAlign: 'center' }}>
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                            </div>
                        }
                    />
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                            <div style={{ textAlign: 'center' }}>
                                <label>Configuración de Cliente</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Codigos Propios</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.codigospropios}
                                    onChange={this.onChangeCodPropios}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Otros Codigos</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.otroscodigos}
                                    onChange={this.onChangeOtrosCods}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Editar Precio Unidad Venta</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.editprecunitenventa}
                                    onChange={this.onChangeEditPreV}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Editar Costo Producto</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.editcostoproducto}
                                    onChange={this.onChangeCostoProd}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Mas de un Costo</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.masdeuncosto}
                                    onChange={this.onChangeMasdeUnCosto}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Mas de un Almacen</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.masdeunalmacen}
                                    onChange={this.onChangeMasdeUnAlmacen}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Editar Stock Producto</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.editarstockproducto}
                                    onChange={this.onChangeEditStockProd}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Cliente es Abogado</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.clienteesabogado}
                                    onChange={this.onChangeCliesAbogado}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Venta en dos pasos</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.ventaendospasos}
                                    onChange={this.onChangeVentaEnDosPasos}
                                />
                            </div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Asiento Automatico Siempre</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.asientoautomaticosiempre}
                                    onChange={(event) => {
                                        this.state.configCliente.asientoautomaticosiempre = event.target.checked;
                                        this.setState({
                                            configCliente: this.state.configCliente,
                                        });
                                    }}
                                />
                            </div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Asiento Automatico Comprob</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigCli}
                                    checked={this.state.configCliente.asientoautomdecomprob}
                                    onChange={(event) => {
                                        this.state.configCliente.asientoautomdecomprob = event.target.checked;
                                        this.setState({
                                            configCliente: this.state.configCliente,
                                        });
                                    }}
                                />
                            </div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Moneda por Defecto</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <C_Select
                                    value={this.state.configCliente.monedapordefecto}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                    onChange={this.onChangeMonedaDefecto}
                                    component={[
                                        <Option key={1} value={0}>seleccionar</Option>,
                                        <Option key={2} value={1}>Bolivianos</Option>,
                                        <Option key={3} value={2}>Dolares</Option>
                                    ]}
                                    readOnly={this.state.disabledConfigCli}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Facturar El Sistema</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <C_Select
                                    value={this.state.configCliente.facturarsiempre}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"

                                    onChange={this.onChangeFacturarSiempre}
                                    readOnly={this.state.disabledConfigCli}
                                    component={[
                                        <Option key={1} value={'N'}>No Facturar</Option>,
                                        <Option key={2} value={'P'}>Preguntar Si Factura</Option>,
                                        <Option key={3} value={'S'}>Facturar</Option>
                                    ]}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Logo</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.onChangeLogo}
                                    image={this.state.configCliente.logo}
                                    images={[]}
                                    delete={this.deleteImgLogo}
                                    readOnly={this.state.disabledConfigCli}
                                    style={{ 
                                            height: 100, 
                                            'border': '1px solid transparent',
                                        }}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Logo Nombre</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.onChangeLogoNombre}
                                    image={this.state.configCliente.logonombre}
                                    images={[]}
                                    delete={this.deleteImgLogoNombre}
                                    readOnly={this.state.disabledConfigCli}
                                    style={{ 
                                            height: 100, 
                                            'border': '1px solid transparent',
                                        }}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Logo Reporte</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.onChangeLogoReporte}
                                    image={this.state.configCliente.logoreporte}
                                    images={[]}
                                    delete={this.deleteImgLogoReporte}
                                    readOnly={this.state.disabledConfigCli}
                                    style={{ 
                                            height: 100, 
                                            'border': '1px solid transparent',
                                    }}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{ textAlign: 'center' }}>
                                { this.buttonsConfCli() }
                            </div>
                        </div>
                        
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" style={{ textAlign: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <label>Configuración de Fabrica</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Almacen Inventario Fisico</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comalmaceninventariocorte}
                                    onChange={this.onChangeAlmacenInventario}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Almacen Ingreso Producto</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comalmaceningresoprod}
                                    onChange={this.onChangeAlmacenIngresoProd}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Almacen Salida Producto</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comalmacensalidaprod}
                                    onChange={this.onChangeAlmacenSalidaProd}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Almacen Lista de Precios</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comalmacenlistadeprecios}
                                    onChange={this.onChangeAlmacenListaPrecios}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Ventas Venta al Credito</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comventasventaalcredito}
                                    onChange={this.onChangeVentasVentaCredito}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Ventas Venta Proforma</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comventasventaproforma}
                                    onChange={this.onChangeVentasVentaProforma}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Ventas Cobranza</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comventascobranza}
                                    onChange={this.onChangeVentasCobranza}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Compras</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comcompras}
                                    onChange={this.onChangeCompras}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Taller</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comtaller}
                                    onChange={this.onChangeTaller}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Taller Vehiculo Parte</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comtallervehiculoparte}
                                    onChange={this.onChangeTallerVehiculoParte}
                                />
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                <label>Com Taller Vehiculo Historia</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                <C_CheckBox
                                    disabled={this.state.disabledConfigFab}
                                    checked={this.state.configFabrica.comtallervehiculohistoria}
                                    onChange={this.onChangeTallerVehiculoHistoria}
                                />
                            </div>
                            <br></br>
                            { this.buttonsConfFab() }
                        </div>
                        {/*}
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" style={{ textAlign: 'center' }}>
                            <label>Configuracion de Contabilidad</label>
                            <br></br>
                            <C_Button 
                                title="Editar"
                            />
                        </div>
                        */}
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{ textAlign: 'center' }}>
                                <label>Configuración de Contabilidad</label>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{ textAlign: 'center' }}>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <label>Fecha</label>
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                    <C_DatePicker
                                        value={this.state.configContab.fecha}
                                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                        onChange={this.onChangeFecha}
                                        readOnly={this.state.disabledConfigConta}
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <label>Numero de Niveles</label>
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                    <C_Input
                                        value={this.state.configContab.numniveles}
                                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                        onChange={this.onChangeNumeroNiveles}
                                        readOnly={this.state.disabledConfigConta}
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <label>Formato</label>
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                    <C_Input
                                        value={this.state.configContab.formato}
                                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                        onChange={this.onChangeFormato}
                                        readOnly={this.state.disabledConfigConta}
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <label>Impuesto Anual</label>
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" style={{ textAlign: 'center' }}>
                                    <C_Input
                                        value={this.state.configContab.impuestoanualieerr}
                                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                        type='number'
                                        onChange={this.onChangeImpuestoAnual}
                                        readOnly={this.state.disabledConfigConta}
                                    />
                                </div>
                                { this.buttonsConfConta() }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
