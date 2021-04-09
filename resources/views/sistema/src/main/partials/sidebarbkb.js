import React, { Component } from 'react';
import { Layout, Icon, Menu, Dropdown } from 'antd';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import Navegation from './menu/menu';
import SubMenu from './menu/submenu';
import MenuItem from './menu/item';
import { geturl } from '../../utils/toolsurl';
import keys from '../../utils/keys';
import keysStorage from '../../utils/keysStorage';
import ws from '../../utils/webservices';
import { readPermisions, savePermisionsAll } from '../../utils/toolsPermisions';
import { httpRequest, readData, saveData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
//import colors from '../../tools/colors';
const { Sider } = Layout;

import PropTypes from 'prop-types';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            dropdown_sider: false,
            ventaendospasos: false,
            collapsed: false,
            visible: false,
            configGrupoUser: false,

            subMenu_object: [
                { 
                    title: 'home', value: false, 
                    children: [],
                },
                {
                    title: 'subsistema_comercial', value: false,
                    children: [
                        {
                            title: 'submenu_taller', value: false,
                            children: [
                                {
                                    title: 'menu_vehiculo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_vehiculohistoria', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_vehiculoparte', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_vehiculocaracteristica', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_vehiculotipo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'submenu_tallerreporte', value: false,
                                    children: [
                                        {
                                            title: 'vehiculoreporte', value: false,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: 'submenu_almacen', value: false,
                            children: [
                                {
                                    title: 'menu_producto', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_ingresoproducto', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_salidaproducto', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_inventario', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_listaprecio', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_familia', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_productocaracteristica', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_traspaso', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_unidadmedida', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_traspasotipo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_almacen', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_almacenubicacion', value: false,
                                    children: [],
                                },
                                {
                                    title: 'submenu_almacenreporte', value: false,
                                    children: [
                                        {
                                            title: 'productoreporte', value: false,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: 'submenu_venta', value: false,
                            children: [
                                {
                                    title: 'menu_cliente', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_vendedor', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_venta', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_proforma', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_cobranza', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_comision', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_clientetipo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_ciudad', value: false,
                                    children: [],
                                },
                                {
                                    title: 'submenu_ventareporte', value: false,
                                    children: [
                                        {
                                            title: 'ventareporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'ventadetallereporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'cuentaporcobrarporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'cobrorealizadoreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'ventahistoricoreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'clientereporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'comisionvendedorreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'ventaproductoreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'ventafacturareporte', value: false,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: 'submenu_compra', value: false,
                            children: [
                                {
                                    title: 'menu_proveedor', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_compra', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_pago', value: false,
                                    children: [],
                                },
                                {
                                    title: 'submenu_comprareporte', value: false,
                                    children: [
                                        {
                                            title: 'comprareporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'compradetallereporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'cuentaporpagarreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'pagorealizadoreporte', value: false,
                                            children: [],
                                        },
                                        {
                                            title: 'proveedorreporte', value: false,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: 'submenu_restaurant', value: false,
                            children: [
                                {
                                    title: 'menu_ventapedido', value: false,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    title: 'subsistema_contable', value: false,
                    children: [
                        {
                            title: 'menu_plancuenta', value: false,
                            children: [],
                        },
                        {
                            title: 'menu_comprobante', value: false,
                            children: [],
                        },
                        {
                            title: 'menu_librodiario', value: false,
                            children: [],
                        },
                        {
                            title: 'menu_libromayor', value: false,
                            children: [],
                        },
                        {
                            title: 'menu_estadoresultado', value: false,
                            children: [],
                        },
                        {
                            title: 'menu_balancegeneral', value: false,
                            children: [],
                        },
                        {
                            title: 'submenu_contabilidadajuste', value: false,
                            children: [
                                {
                                    title: 'menu_cuentaasiento', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_plantillaasiento', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_gestionperiodo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_comprobantetipo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_centrocostotipo', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_centrocosto', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_banco', value: false,
                                    children: [],
                                },
                                {
                                    title: 'menu_config_eerr', value: false,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                { 
                    title: 'subsistema_configuracion', value: false, 
                    children: [
                        {
                            title: 'menu_tipomoneda', value: false, 
                            children: [],
                        },
                        {
                            title: 'menu_tipocambio', value: false, 
                            children: [],
                        },
                        {
                            title: 'menu_sucursal', value: false, 
                            children: [],
                        },
                        {
                            title: 'submenu_facturacion', value: false, 
                            children: [
                                { 
                                    title: 'menu_actividadeconomica', value: false, 
                                    children: [],
                                },
                                { 
                                    title: 'menu_dosificacion', value: false, 
                                    children: [],
                                },
                                { 
                                    title: 'menu_certificacion_sin', value: false, 
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                { 
                    title: 'subsistema_seguridad', value: false, 
                    children: [
                        { 
                            title: 'menu_usuario', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_grupousuario', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_activarpermiso', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_asignarpermiso', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_usuarioconectado', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_logsistema', value: false,
                            children: [],
                        },
                        { 
                            title: 'menu_configinicial', value: false,
                            children: [],
                        },
                    ],
                },
            ],

            rootMenuKeys: [
                {key: 'home', value: false},
                {key: 'seguridad', value: false},
                {key: 'sub_comercial', value: false},
                {key: 'sub_contable', value: false},
                {key: 'configuracion_general', value: false},
            ],
            rootSubMenuKeys: [
                {key: 'taller', value: false, position: 2},
                {key: 'almacen', value: false, position: 2},
                {key: 'ventas', value: false, position: 2},
                {key: 'compras', value: false, position: 2},
                {key: 'permiso', value: false, position: 1},
                {key: 'configconta', value: false, position: 3},
                {key: 'restaurant', value: false, position: 2},
                {key: 'facturacion', value: false, position: 4,},

                {key: 'plandecuenta', value: false, position: 3},
                {key: 'comprobante', value: false, position: 3},
                //{key: 'gestion_periodo', value: false, position: 3},
                {key: 'libro_diario', value: false, position: 3},
                {key: 'libro_mayor', value: false, position: 3},
                {key: 'balance_general', value: false, position: 3},
                {key: 'estado_resultado', value: false, position: 3},
                //{key: 'banco', value: false, position: 3},
                {key: 'tipo_moneda', value : false, position: 4},
                {key: 'tipo_cambio', value : false, position: 4},
                {key: 'sucursal', value: false, position: 4},

            ],
            rootLinkMenuKey: [

                {key: 'user', value: false, position: 1, bandera: 0},
                {key: 'rol', value: false, position: 1, bandera: 0},

                {key: 'assignpermission', value: false, position: 1, bandera: 0},
                {key: 'activepermission', value: false, position: 1, bandera: 0},
                {key: 'users_online', value: false, position: 1, bandera: 0},
                {key: 'log_del_sistema', value: false, position: 1, bandera: 0},
                {key: 'config_inicial', value: false, position: 1, bandera: 0},

                {key: 'asignarpermiso', value: false, position: 4, bandera: 1},
                {key: 'activarpermiso', value: false, position: 4, bandera: 1},

                {key: 'vehiculo', value: false, position: 0, bandera: 1},
                {key: 'vehiculo_historia', value: false, position: 0, bandera: 1},
                {key: 'vehiculo_parte', value: false, position: 0, bandera: 1},
                {key: 'vehiculoreporte', value: false, position: 0, bandera: 1, report: 0},
                {key: 'vehiculo_caracteristica', value: false, position: 0, bandera: 1},
                {key: 'familia_vehiculo', value: false, position: 0, bandera: 1},

                {key: 'producto', value: false, position: 1, bandera: 1},
                {key: 'producto_caracteristica', value: false, position: 1, bandera: 1},
                {key: 'ingreso_producto', value: false, position: 1, bandera: 1},
                {key: 'salida_producto', value: false, position: 1, bandera: 1},
                {key: 'inventario_corte', value: false, position: 1, bandera: 1},
                {key: 'lista_precio', value: false, position: 1, bandera: 1},
                {key: 'familia', value: false, position: 1, bandera: 1},
                {key: 'almacenreporte', value: false, position: 1, bandera: 1, report: 1},
                {key: 'traspasos', value: false, position: 1, bandera: 1},
                {key: 'unidad_medida', value : false, position: 1, bandera: 1},
                
                {key: 'tipo_traspaso', value: false, position: 1, bandera: 1},
                
                {key: 'almacenes', value: false, position: 1, bandera: 1},
                {key: 'familia_almacen_ubicacion', value: false, position: 1, bandera: 1},

                {key: 'cliente', value: false, position: 2, bandera: 1},
                {key: 'vendedor', value: false, position: 2, bandera: 1},
                {key: 'venta', value: false, position: 2, bandera: 1},
                {key: 'ventareporte', value: false, position: 2, bandera: 1, report: 2},
                {key: 'proforma', value: false, position: 2, bandera: 1},
                {key: 'cobranza', value: false, position: 2, bandera: 1},
                {key: 'comision', value: false, position: 2, bandera: 1},
                {key: 'tipo_cliente', value: false, position: 2, bandera: 1},
                {key: 'familia_ciudad', value: false, position: 2, bandera: 1},

                {key: 'proveedor', value: false, position: 3, bandera: 1},
                {key: 'compra', value: false, position: 3, bandera: 1},
                {key: 'pago', value: false, position: 3, bandera: 1},
                {key: 'comprareporte', value: false, position: 3, bandera: 1, report: 3,},

                {key: 'restaurant_venta', value: false, position: 6, bandera: 1},

                {key: 'tipocomprobante', value: false, position: 5, bandera: 1},
                {key: 'banco', value: false, position: 5, bandera: 1},
                {key: 'config_eerr', value: false, position: 5, bandera: 1},
                {key: 'gestion_periodo', value: false, position: 5, bandera: 1},
                {key: 'cuenta_asien_autom', value: false, position: 5, bandera: 1},
                {key: 'plantilla_asien_autom', value: false, position: 5, bandera: 1},
                {key: 'centrocostotipo', value: false, position: 5, bandera: 1}, 
                {key: 'centrocosto', value: false, position: 5, bandera: 1},

                {key: 'actividadeconomica', value: false, position: 7, bandera: 1,},
                {key: 'dosificacion', value: false, position: 7, bandera: 1, },
                {key: 'certificacionsin', value: false, position: 7, bandera: 1, },

                {key: 'entregaproducto', value: false, position: 2, bandera: 1, },
            ],

            rootSubLinkMenuKey: [
                {key: 'reportevehiculo', value: false, report: 0},

                {key: 'reporteproducto', value: false, report: 1},

                {key: 'reporteventa', value: false, report: 2},
                {key: 'reporteventadetalle', value: false, report: 2},
                {key: 'reporteventaporcobrar', value: false, report: 2},
                {key: 'reporteventacobro', value: false, report: 2},
                {key: 'reporteventahistoricovehiculo', value: false, report: 2},
                {key: 'reportecliente', value: false, report: 2},
                {key: 'reportecomisionvendedor', value: false, report: 2},
                {key: 'reporteventaporproducto', value: false, report: 2},
                {key: 'reportefactura', value: false, report: 2},

                {key: 'reportecompradetalle', value: false, report: 3},
                {key: 'reportecompra', value: false, report: 3},
                {key: 'reportecompracuentaporpagar', value: false, report: 3},
                {key: 'reporteproveedor', value: false, report: 3},
                {key: 'reportepagorealizado', value: false, report: 3},
            ],

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
            seguridad: false,
        }

        this.subComercial = this.subComercial.bind(this);

    }

    onVisibleChange() {
        this.setState({
            dropdown_sider: !this.state.dropdown_sider,
        });
        setTimeout(() => {
            this.setState({
                visible: !this.state.visible
            });
        }, 400);
    }

    componentDidMount() {

        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        var usuario = (typeof key == 'undefined' || key == null)?'':key.nombre;

        if ((id == 1) || (id == 2)) {
            this.setState({
                configGrupoUser: true,
            });
        }
        this.getConfigsMenuLink();
        this.getConfigsClient();
        this.validate_img();

        var menu = readData(keysStorage.LinkMenu);
        menu = this.validar_data(menu) ? menu : 'home';
        var array = [];
        this.config_menu(this.state.subMenu_object, array, menu);
        this.setState({
            subMenu_object: this.state.subMenu_object,
            user: usuario,
        });
    }
    config_menu(data, array, value) {

        if (!Array.isArray(data)) return;
        if (data.length == 0) return;

        for (let index = 0; index < data.length; index++) {

            if (data[index].title == value) {
                array.push(data[index].title);
                data[index].value = true;
                return;
            }

            this.config_menu(data[index].children, array, value);

            if ( Array.isArray(data[index].children) ) {
                for (let jindex = 0; jindex < data[index].children.length; jindex++) {
                    var menu = data[index].children[jindex];
                    if (menu.title == array[array.length - 1]) {
                        array.push(data[index].title);
                        data[index].value = true;
                    }
                }
            }

        }
    }
    validate_img() {
        var img_logo1 = document.getElementById('img_logo1');
        img_logo1.onerror = (event) => {
            event.target.src = '/img/logo.png';
        };

        var img_logo2 = document.getElementById('img_logo2');
        img_logo2.onerror = (event) => {
            event.target.src = '/img/nombre.png';
        };
    }
    getPositionData(array, key) {
        var pos = -1;
        array.map(
            (data, i) => {
                if (data.key == key) {
                    pos = i;
                }
            }
        );
        return pos;
    }

    getConfigsMenuLink() {
        var key = readData(keysStorage.LinkMenu);
        if (key != null) {
            var pos = this.getPositionData(this.state.rootMenuKeys, key);

            if (pos > -1) {
                this.state.rootMenuKeys[pos].value = true;
                this.setState({
                    rootMenuKeys: this.state.rootMenuKeys,
                });
            }
            pos = this.getPositionData(this.state.rootSubMenuKeys, key);
            if (pos > -1) {
                this.state.rootSubMenuKeys[pos].value = true;
                this.state.rootMenuKeys[this.state.rootSubMenuKeys[pos].position].value = true;
                this.setState({
                    rootMenuKeys: this.state.rootMenuKeys,
                    rootSubMenuKeys: this.state.rootSubMenuKeys,
                });
            }
            pos = this.getPositionData(this.state.rootLinkMenuKey, key);

            if (pos > -1) {
                var bandera = this.state.rootLinkMenuKey[pos].bandera;
                if (bandera == 0) {
                    this.state.rootLinkMenuKey[pos].value = true;
                    var posicion = this.state.rootLinkMenuKey[pos].position;
                    this.state.rootMenuKeys[posicion].value = true;
                }
                if (bandera == 1) {
                    this.state.rootLinkMenuKey[pos].value = true;

                    var posicion = this.state.rootLinkMenuKey[pos].position;
                    this.state.rootSubMenuKeys[posicion].value = true;

                    posicion = this.state.rootSubMenuKeys[posicion].position;
                    this.state.rootMenuKeys[posicion].value = true;
                }

                this.setState({
                    rootMenuKeys: this.state.rootMenuKeys,
                    rootSubMenuKeys: this.state.rootSubMenuKeys,
                    rootLinkMenuKey: this.state.rootLinkMenuKey,
                });
            }

            pos = this.getPositionData(this.state.rootSubLinkMenuKey, key);

            if (pos > -1) {

                var report = this.state.rootSubLinkMenuKey[pos].report;
                this.state.rootSubLinkMenuKey[pos].value = true;

                for (let i = 0; i < this.state.rootLinkMenuKey.length; i++) {
                    if (typeof this.state.rootLinkMenuKey[i].report != 'undefined') {
                        if (report == this.state.rootLinkMenuKey[i].report) {
                            pos = i;
                            break;
                        }
                    }
                }

                var bandera = this.state.rootLinkMenuKey[pos].bandera;

                if (bandera == 0) {
                    this.state.rootLinkMenuKey[pos].value = true;
                    var posicion = this.state.rootLinkMenuKey[pos].position;
                    this.state.rootMenuKeys[posicion].value = true;
                }

                if (bandera == 1) {
                    this.state.rootLinkMenuKey[pos].value = true;

                    var posicion = this.state.rootLinkMenuKey[pos].position;
                    this.state.rootSubMenuKeys[posicion].value = true;

                    posicion = this.state.rootSubMenuKeys[posicion].position;
                    this.state.rootMenuKeys[posicion].value = true;
                }
                this.setState({
                    rootMenuKeys: this.state.rootMenuKeys,
                    rootSubMenuKeys: this.state.rootSubMenuKeys,
                    rootLinkMenuKey: this.state.rootLinkMenuKey,
                    rootSubLinkMenuKey: this.state.rootSubLinkMenuKey,
                });

            }
        }
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {

            if (result.response == 1) {

                this.props.getventaendospasos(result.configcliente.ventaendospasos);
                if (result.configcliente.clienteesabogado) {
                    saveData(keysStorage.isabogado, 'A');
                } else {
                    saveData(keysStorage.isabogado, 'V');
                }
                this.setState({
                    comalmaceninventariocorte: result.configfabrica.comalmaceninventariocorte,
                    comalmaceningresoprod:     result.configfabrica.comalmaceningresoprod,
                    comalmacensalidaprod:      result.configfabrica.comalmacensalidaprod,
                    comalmacenlistadeprecios:  result.configfabrica.comalmacenlistadeprecios,
                    comventasventaalcredito:   result.configfabrica.comventasventaalcredito,
                    comventasventaproforma:    result.configfabrica.comventasventaproforma,
                    comventascobranza:         result.configfabrica.comventascobranza,
                    comcompras:                result.configfabrica.comcompras,
                    comtaller:                 result.configfabrica.comtaller,
                    comtallervehiculoparte:    result.configfabrica.comtallervehiculoparte,
                    comtallervehiculohistoria: result.configfabrica.comtallervehiculohistoria,
                    seguridad:                 result.configfabrica.seguridad,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    validar(data) {
        return data != 'undefined';
    }

    onCollapse(event) {
        if (this.validar(this.props.onClick)) {
            this.props.onClick(event);
        }
    }

    onClick(event) {
        var pos = -1;
        event.map(
            (data, i) => {
                if (data.value) {
                    pos = i;
                }
            }
        );
        if (pos > -1) {
            var key = event[pos].key;
            saveData(keysStorage.LinkMenu, key);
        }else {
            saveData(keysStorage.LinkMenu, 'sub_comercial');
        }
        this.setState({
            rootSubMenuKeys: event,
        });

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
                validacion: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }

    }

    onCollapseMenu(data, menu) {
        saveData(keysStorage.LinkMenu, menu);
        this.setState({
            subMenu_object: data,
        });
    }

    onClickMenu(event) {
        //console.log("======================ENTROOOOOOO========================");
        var pos = -1;
        event.map(
            (data, i) => {
                if (data.value) {
                    pos = i;
                }
            }
        );
        if (pos > -1) {
            var key = event[pos].key;
            //console.log("======================>-1");
            saveData(keysStorage.LinkMenu, key);
        }else {
            //console.log("<======================-1");
            saveData(keysStorage.LinkMenu, null);
        }
        this.setState({
            rootMenuKeys: event,
        });
    }

    onLink(event) {
        //let url = geturl(event);
        this.props.history.push(event);
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    onClickMenuLink(event) {

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
                validacion: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }

        var pos = -1;
        event.map(
            (data, i) => {
                if (data.value) {
                    pos = i;
                }
            }
        );
        if (pos > -1) {
            var key = event[pos].key;
            saveData(keysStorage.LinkMenu, key);
        }else {
            var key = readData(keysStorage.LinkMenu);
            var bandera = 0;
            if (key == 'ventareporte') {
                saveData(keysStorage.LinkMenu, 'ventas');
                bandera = 1;
            }
            if (key == 'comprareporte') {
                saveData(keysStorage.LinkMenu, 'compras');
                bandera = 1;
            }
            if (key == 'almacenreporte') {
                saveData(keysStorage.LinkMenu, 'almacen');
                bandera = 1;
            }
            if (key == 'vehiculoreporte') {
                saveData(keysStorage.LinkMenu, 'taller');
                bandera = 1;
            }
            if (bandera == 0) {
                saveData(keysStorage.LinkMenu, null);
            }

        }
        this.state.rootSubLinkMenuKey.map(
            (event) => {
                event.value = false;
            }
        );
        this.setState({
            rootLinkMenuKey: event,
            rootSubLinkMenuKey: this.state.rootSubLinkMenuKey,
        });
    }

    onClickMenuSubLink(event) {
        var pos = -1;
        event.map(
            (data, i) => {
                if (data.value) {
                    pos = i;
                }
            }
        );
        if (pos > -1) {
            var key = event[pos].key;
            saveData(keysStorage.LinkMenu, key);
        }else {
            saveData(keysStorage.LinkMenu, null);
        }
        this.setState({
            rootSubLinkMenuKey: event,
        });

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
                validacion: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }
    }

    onClickPerfil() {
        this.setState({
            dropdown_sider: !this.state.dropdown_sider,
            visible: false,
        });
        setTimeout(() => {
            this.props.history.push(routes.usuario_perfil);
        }, 500);
    }

    reporteventas() {

        const permisionsRepVenta = readPermisions(keys.ventas_reportes_ventas);
        const permisionsRepVentaDetalle = readPermisions(keys.ventas_reportes_ventas_detallado);
        const permisionsRepVentaCobrar = readPermisions(keys.ventas_reportes_cuentas_por_cobrar);
        const permisionsRepVentaCobros = readPermisions(keys.ventas_reportes_cobros_realizados);
        const permisionsRepVentaHisVeh = readPermisions(keys.ventas_reportes_ventas_historico_veh);
        const permisionsRepClientes = readPermisions(keys.ventas_reportes_clientes);
        const permisionsRepVentaProd = readPermisions(keys.ventas_reportes_ventas_producto);
        const permisionsRepVentaComision = readPermisions(keys.ventas_reportes_comision_vend);

        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        let cliente_Abogado = (isAbogado == 'A') ? 'Abogado' : 'Vendedor';

        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.reporte_venta)} 
                title={'R. de Ventas'} 
                keys={'reporteventa'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVenta}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, routes.reporte_venta_detalle)}
                title={'R. Venta Detallado'}
                keys={'reporteventadetalle'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaDetalle}
            />,
            <MenuItem 
                key={3} 
                onLink={this.onLink.bind(this, routes.reporte_venta_por_cobrar)}
                title={'R. Cuentas por Cobrar'}
                keys={'reporteventaporcobrar'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaCobrar}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.reporte_venta_cobro)}
                title={'R. Cobros Realizados'}
                keys={'reporteventacobro'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaCobros}
            />,
            <MenuItem 
                key={5} 
                onLink={this.onLink.bind(this, routes.reporte_venta_historico_vehiculo)}
                title={'R. Venta Historico Vehiculo'}
                keys={'reporteventahistoricovehiculo'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaHisVeh}
            />,
            <MenuItem 
                key={6} 
                onLink={this.onLink.bind(this, routes.reporte_cliente)}
                title={'R. Cliente'}
                keys={'reportecliente'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepClientes}
            />,
            <MenuItem 
                key={7} 
                onLink={this.onLink.bind(this, routes.reporte_comision_vendedor)}
                title={'R. Comision ' + cliente_Abogado}
                keys={'reportecomisionvendedor'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaComision}
            />,
            <MenuItem 
                key={8} 
                onLink={this.onLink.bind(this, routes.reporte_venta_por_producto)}
                title={'R. Venta por Producto'}
                keys={'reporteventaporproducto'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaProd}
            />,
            <MenuItem 
                key={9} 
                onLink={this.onLink.bind(this, routes.reporte_venta_factura_all)}
                title={'R. de Factura'}
                keys={'reportefactura'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsRepVentaProd}
            />
        ];
    }

    reportealmacen() {
        const permisionsReporteProducs = readPermisions(keys.almacen_reportes_productos);
        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.reporte_producto)} 
                title={'R. de Producto'} 
                keys={'reporteproducto'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsReporteProducs}
            />,
        ];
    }

    reportevehiculo() {
        const permisionsRepVehiculo = readPermisions(keys.taller_reportes_vehiculo);
        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.reporte_vehiculo)} 
                title={'R. de Vehiculo'} 
                keys={'reportevehiculo'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVehiculo}
            />,
        ];
    }

    reportecompras() {
        //const permisionsReporteProducs = readPermisions(keys.almacen_reportes_productos);
        return [
            <MenuItem 
                key={0} 
                onLink={this.onLink.bind(this, routes.compra_reporte)} 
                title={'R. Compra'} 
                keys={'reportecompra'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsReporteProducs}
            />,
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.compra_detalle_reporte)} 
                title={'R. Compra Detallado'} 
                keys={'reportecompradetalle'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsReporteProducs}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, routes.compra_cuentaporpagar_reporte)} 
                title={'R. Cuenta por Pagar'} 
                keys={'reportecompracuentaporpagar'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsReporteProducs}
            />,
            <MenuItem 
                key={3} 
                onLink={this.onLink.bind(this, routes.compra_pagorealizado_reporte)} 
                title={'R. Pago Realizado'} 
                keys={'reportepagorealizado'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsReporteProducs}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.compra_proveedor_reporte)} 
                title={'R. Proveedor'} 
                keys={'reporteproveedor'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsReporteProducs}
            />,
        ];
    }

    permisos() {
        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.asignar_permiso)} 
                title={'Asignar Permiso'} 
                keys={'asignarpermiso'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, routes.activar_permiso)}
                keys={'activarpermiso'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                title={'Activar Permiso'}
            />
        ];
    }

    permisionsMenu(permisionsPriv) {
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null) ? '' : key.idgrupousuario;

        if (id == 1) {
            const componentPermisos = this.permisos();
            return(
                [
                    /*
                    <SubMenu 
                        key={3}
                        title='Permiso'
                        keys='permiso'
                        onCollapse={this.onClick.bind(this)}
                        data={this.state.rootSubMenuKeys}
                        component={componentPermisos}
                        style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                    />
                    */
                    <MenuItem 
                        key={3} 
                        keys={'activepermission'}
                        data={this.state.rootLinkMenuKey}
                        onLink={this.onLink.bind(this, routes.activar_permiso)}
                        onClick={this.onClickMenuLink.bind(this)}
                        title={'Activar Modulo'}
                    />,
                    <MenuItem 
                        key={4} 
                        onLink={this.onLink.bind(this, routes.asignar_permiso)} 
                        title={'Asignar Permiso'} 
                        keys={'asignarpermiso'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />,
                    <MenuItem 
                        key={5} 
                        onLink={this.onLink.bind(this, routes.usuarios_online)} 
                        title={'Usuarios Conectados'} 
                        keys={'users_online'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />, 
                    <MenuItem 
                        key={6} 
                        onLink={this.onLink.bind(this, routes.log_sistema)} 
                        title={'Log del Sistema'} 
                        keys={'log_del_sistema'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />, 
                    <MenuItem 
                        key={7} 
                        onLink={this.onLink.bind(this, routes.config_inicial)} 
                        title={'Config Inicial'} 
                        keys={'config_inicial'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />, 
                ]
            );
        } else {
            if (id == 2) {
                return (
                    <MenuItem 
                        key={3}
                        keys={'assignpermission'}
                        data={this.state.rootLinkMenuKey}
                        onLink={this.onLink.bind(this, routes.asignar_privilegio)}
                        onClick={this.onClickMenuLink.bind(this)}
                        title={'Asignar Privilegio'} 
                        permisions={permisionsPriv}
                    />
                );
            }
        }
    }

    taller() {

        let componentReporte = this.reportevehiculo();

        const permisionsVehiculo = readPermisions(keys.vehiculo);
        const permisionsVehiculoHis = readPermisions(keys.vehiculo_historia);
        const permisionsVehiculoPate = readPermisions(keys.vehiculo_parte);
        const permisionsTipoVehiculo = readPermisions(keys.tipovehiculo);
        const permisionsVehCaracteristicas = readPermisions(keys.vehcaracteristicas);
        const permisionsReportesTaller = readPermisions(keys.taller_reportes);

        const configVehiculoHistoria = this.state.comtallervehiculohistoria;
        const configVehiculoParte = this.state.comtallervehiculoparte;
        return [
                <MenuItem
                    key={0}
                    onLink={this.onLink.bind(this, routes.vehiculo_index)}
                    title={'Vehiculo'}
                    keys={'vehiculo'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehiculo}
                />,
                <MenuItem
                    key={1}
                    onLink={this.onLink.bind(this, routes.vehiculo_historia)}
                    keys={'vehiculo_historia'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    title={'Vehiculo Historia'}
                    permisions={permisionsVehiculoHis}
                    configAllowed={configVehiculoHistoria}
                />,
                <MenuItem
                    key={2}
                    onLink={this.onLink.bind(this, routes.vehiculo_parte)}
                    title={'Vehiculo Parte'}
                    keys={'vehiculo_parte'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehiculoPate}
                    configAllowed={configVehiculoParte}
                />,
                <MenuItem
                    key={4}
                    onLink={this.onLink.bind(this, routes.vehiculo_caracteristica)}
                    title={'Caracteristicas'}
                    keys={'vehiculo_caracteristica'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehCaracteristicas}
                />,
                <MenuItem
                    key = {5}
                    onLink = {this.onLink.bind(this, routes.familia_vehiculo)}
                    title = {'Tipo Vehiculo'}
                    keys = {'familia_vehiculo'}
                    data = {this.state.rootLinkMenuKey}
                    onClick = {this.onClickMenuLink.bind(this)}
                    permisions={permisionsTipoVehiculo}
                />,
                <SubMenu 
                    key={3}
                    title='Reporte'
                    keys='vehiculoreporte'
                    onCollapse={this.onClickMenuLink.bind(this)}
                    data={this.state.rootLinkMenuKey}
                    component={componentReporte}
                    style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                    permisions={permisionsReportesTaller}
                    value={'submenu_tallerreporte'}
                    dataSource={this.state.subMenu_object}
                />,
            ];
    }

    seguridad() {

        const permisionsUsuario = readPermisions(keys.grupo_usuario);
        const permisionsGrup = readPermisions(keys.grupo_usuario);
        const permisionsPriv = readPermisions(keys.asignar_privilegio);
        return [
                <MenuItem
                    key={1}
                    keys={'user'}
                    data={this.state.rootLinkMenuKey}
                    onLink={this.onLink.bind(this, routes.usuario_index)}
                    onClick={this.onClickMenuLink.bind(this)}
                    title={'Usuario'}
                    permisions={permisionsUsuario}
                />,
                <MenuItem
                    key={2}
                    keys={'rol'}
                    data={this.state.rootLinkMenuKey}
                    onLink={this.onLink.bind(this, routes.grupo_usuario_index)}
                    onClick={this.onClickMenuLink.bind(this)}
                    title={'Grupo Usuario'}
                    permisions={permisionsGrup}
                />,
                this.permisionsMenu(permisionsPriv),
            ];
    }

    almacen() {

        let componentReporte = this.reportealmacen();

        const permisionsProducto = readPermisions(keys.producto);
        //console.log("PERMISOS PRODS ====> ", permisionsProducto);
        const permisionsIngresoProd = readPermisions(keys.ingreso_producto);
        const permisionsSalidaProd = readPermisions(keys.salida_producto);
        const permisionsInventario = readPermisions(keys.inventario_corte);
        const permisionsListaPrecios = readPermisions(keys.lista_precio);
        const permisionsFamilia = readPermisions(keys.familia);
        const permisionsProdCaracteristicas = readPermisions(keys.prodcaracteristicas);
        const permisionsTraspaso = readPermisions(keys.traspaso);
        const permisionsUnidadMedida = readPermisions(keys.unidadmedida);
        
        const permisionsTipoTrasnpaso = readPermisions(keys.tipotraspaso)
        
        const permisionsAlmacenes = readPermisions(keys.almacenes);
        const permisionsAlmacenUbicacion = readPermisions(keys.ubicaciones);
        const permisionsReportesAlmacen = readPermisions(keys.almacen_reportes)

        const ingresoprod = this.state.comalmaceningresoprod;
        const salidaprod = this.state.comalmacensalidaprod;
        const invenariocorte = this.state.comalmaceninventariocorte;
        //const listaprecios = this.state.comalmacenlistadeprecios;

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.producto_index)}
                title={'Producto'}
                keys={'producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProducto}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.ingreso_producto_index)}
                title={'Ingreso Producto'}
                keys={'ingreso_producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsIngresoProd}
                configAllowed={ingresoprod}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.salida_producto_index)}
                title={'Salida Producto'}
                keys={'salida_producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsSalidaProd}
                configAllowed={salidaprod}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.inventario_index)}
                title={'Inventario Fisico'}
                keys={'inventario_corte'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsInventario}
                configAllowed={invenariocorte}
            />,
            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.lista_precios_index)}
                title={'Lista de Precios'}
                keys={'lista_precio'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsListaPrecios}
                //configAllowed={listaprecios}
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.familia_producto)}
                title={'Familia'}
                keys={'familia'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsFamilia}
            />,
            <MenuItem
                key={7}
                onLink={this.onLink.bind(this, routes.producto_caracteristica)}
                title={'Prod Caracteristica'}
                keys={'producto_caracteristica'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProdCaracteristicas}
            />,
            <MenuItem
                key={8}
                onLink={this.onLink.bind(this, routes.traspaso_producto_index)}
                title={'Traspasos'}
                keys={'traspasos'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsTraspaso}
            />,
            <MenuItem
                key = {9}
                onLink = {this.onLink.bind(this, routes.unidad_medida)}
                title = {'Unidad de Medida'}
                keys = {'unidad_medida'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsUnidadMedida}
            />,
            <MenuItem
                key = {11}
                onLink = {this.onLink.bind(this, routes.tipo_traspaso)}
                title = {'Tipo MovAlmacen'}
                keys = {'tipo_traspaso'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsTipoTrasnpaso}
            />,
            
            <MenuItem
                key = {13}
                onLink = {this.onLink.bind(this, routes.almacenes)}
                title = {'Almacenes'}
                keys = {'almacenes'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsAlmacenes}
            />,
            <MenuItem
                key = {14}
                onLink = {this.onLink.bind(this, routes.familia_almacen_ubicacion)}
                title = {'Ubicaciones'}
                keys = {'familia_almacen_ubicacion'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsAlmacenUbicacion}
            />,
            <SubMenu 
                key={6}
                title='Reporte'
                keys='almacenreporte'
                onCollapse={this.onClickMenuLink.bind(this)}
                data={this.state.rootLinkMenuKey}
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                permisions={permisionsReportesAlmacen}
                value={'submenu_almacenreporte'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    ventas() {

        const permisionsCliente = readPermisions(keys.cliente);
        const permisionsVendedor = readPermisions(keys.vendedor);
        const permisionsVenta = readPermisions(keys.venta);
        const permisionsProforma = readPermisions(keys.proforma);
        const permisionsCobranza = readPermisions(keys.cobranza);
        const permisionsComision = readPermisions(keys.comision);
        const permisionsTipoCliente = readPermisions(keys.tipocliente);
        const permisionsFamCiudad = readPermisions(keys.famciudad);
        const permisionReporteVentas = readPermisions(keys.ventas_reportes);

        const ventasproforma = this.state.comventasventaproforma;
        const ventascobranza = this.state.comventascobranza;
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        let titleVendedor = isAbogado == 'A' ? 'Abogado' : 'Vendedor';

        let componentReporte = this.reporteventas();

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.cliente_index)}
                title={'Cliente'}
                keys={'cliente'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCliente}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.vendedor_index)}
                title={titleVendedor}
                keys={'vendedor'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsVendedor}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.venta_index)}
                title={'Venta'}
                keys={'venta'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsVenta}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.entregaproducto + '/index')}
                title={'Entrega Producto'}
                keys={'entregaproducto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                //permisions={permisionsVenta}
                configAllowed={this.props.ventaendospasos}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.proforma_index)}
                title={'Proforma'}
                keys={'proforma'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProforma}
                configAllowed={ventasproforma}
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.cobranza_index)}
                title={'Cobranza'}
                keys={'cobranza'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCobranza}
                configAllowed={ventascobranza}
            />,
            <MenuItem
                key={6}
                onLink={this.onLink.bind(this, routes.comision_index)}
                title={'Comision'}
                keys={'comision'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsComision}
            />,
            <MenuItem
                key = {7}
                onLink = {this.onLink.bind(this, routes.tipo_cliente)}
                title = {'Tipo Cliente'}
                keys = {'tipo_cliente'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsTipoCliente}
            />,
            <MenuItem
                key = {8}
                onLink = {this.onLink.bind(this, routes.familia_ciudad)}
                title = {'Familia Ciudades'}
                keys = {'familia_ciudad'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsFamCiudad}
            />,
            <SubMenu 
                key={9}
                title='Reporte'
                keys='ventareporte'
                onCollapse={this.onClickMenuLink.bind(this)}
                data={this.state.rootLinkMenuKey}
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                permisions={permisionReporteVentas}
                value={'submenu_ventareporte'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    compras() {

        const permisionsProveedor = readPermisions(keys.proveedor);
        const permisionsCompra = readPermisions(keys.compra);
        const permisionsPago = readPermisions(keys.pago);

        let componentReporte = this.reportecompras();

        return  [
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.proveedor_index)}
                title={'Proveedor'}
                keys={'proveedor'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProveedor}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.compra_index)}
                title={'Compra'}
                keys={'compra'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCompra}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.pago_index)}
                title={'Pago'}
                keys={'pago'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsPago}
            />,
            <SubMenu 
                key={4}
                title='Reporte'
                keys='comprareporte'
                onCollapse={this.onClickMenuLink.bind(this)}
                data={this.state.rootLinkMenuKey}
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                //permisions={permisionReporteVentas}
                value={'submenu_comprareporte'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    restaurant() {

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.restaurant_venta_index)}
                title={'Gestion Ventas'}
                keys={'restaurant_venta'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                //permisions={permisionsRestaurante}
            />,
        ];
    }

    subComercial() {

        const componentTaller = this.taller();
        const componentAlmacen = this.almacen();
        const componentVentas = this.ventas();
        const componentCompras = this.compras();
        const componentRestaurant = this.restaurant();

        const permisionsTaller = readPermisions(keys.taller);
        const permisionsAlmacen = readPermisions(keys.almacen);
        const permisionsVentas = readPermisions(keys.ventas);
        const permisionsCompras = readPermisions(keys.compras);
        const permisionsRestaurante = readPermisions(keys.restaurante);
        const taller = this.state.comtaller;
        const compras = this.state.comcompras;

        return [
            <SubMenu
                key={0}
                title='Taller'
                keys='taller'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentTaller}
                permisions={permisionsTaller}
                configAllowed={taller}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_taller'}
                dataSource={this.state.subMenu_object}
            />,
            <SubMenu
                key={1}
                title='Almacen'
                keys='almacen'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentAlmacen}
                permisions={permisionsAlmacen}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_almacen'}
                dataSource={this.state.subMenu_object}
            />,
            <SubMenu
                key={2}
                title='Ventas'
                keys='ventas'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentVentas}
                permisions={permisionsVentas}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_venta'}
                dataSource={this.state.subMenu_object}
            />,
            <SubMenu
                key={3}
                title='Compras'
                keys='compras'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentCompras}
                permisions={permisionsCompras}
                configAllowed={compras}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_compra'}
                dataSource={this.state.subMenu_object}
            />,
            <SubMenu
                key={4}
                title='Restaurant'
                keys='restaurant'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentRestaurant}
                configAllowed={true}
                permisions={permisionsRestaurante}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_restaurant'}
                dataSource={this.state.subMenu_object}
            />
        ];
    }

    componentConfigConta() {
        const permisionsGestionPeriodo = readPermisions(keys.gestion_periodo);
        const permisionsTipoComprobante = readPermisions(keys.tipo_comprobante);
        const permisionsTipoCentroCosto = readPermisions(keys.tipo_centro_costo);
        const permisionsCentroCostos = readPermisions(keys.centro_costo);
        const permisionsBanco = readPermisions(keys.banco);
        const permisionsConfigEERR = readPermisions(keys.config_eerr);

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.cuenta_asien_autom + '/index')}
                title={'Cuentas Asien. Autom.'}
                keys={'cuenta_asien_autom'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsGestionPeriodo} 
            />,
            <MenuItem
                key={-1}
                onLink={this.onLink.bind(this, routes.plantilla_asien_autom + '/index')}
                title={'Plantilla Asien. Autom.'}
                keys={'plantilla_asien_autom'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsGestionPeriodo} 
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.gestion_periodo_index)}
                title={'Gestion y Periodo'}
                keys={'gestion_periodo'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsGestionPeriodo} 
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.comprobantetipo_index)}
                title={'Tipo Comprobante'}
                keys={'tipocomprobante'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsTipoComprobante}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.tipocentrocosto_index)}
                title={'Tipo Centro Costo'}
                keys={'centrocostotipo'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsTipoCentroCosto} 
            />,
            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.centrodecosto_index)}
                title={'Centro de Costo'}
                keys={'centrocosto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsCentroCostos}
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.banco_index)}
                title={'Banco'}
                keys={'banco'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsBanco}
            />,
            <MenuItem
                key={6}
                onLink={this.onLink.bind(this, routes.configeerr_index)}
                title={'Config EERR'}
                keys={'config_eerr'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsConfigEERR}
            />,
        ];
    }

    subContable() {
        const permisionsPlanCuenta = readPermisions(keys.plan_cuentas);
        const permisionsComprobante = readPermisions(keys.comprobante);
        const permisionsLibroDiario = readPermisions(keys.libro_diario);
        const permisionsMayor = readPermisions(keys.libro_mayor);
        const permisionsEstadoResults = readPermisions(keys.estado_resultados);
        const permisionBalanceGeneral = readPermisions(keys.balance_general);
        const permisionsConfig = readPermisions(keys.configuraciones_contab);

        const componentConfigConta = this.componentConfigConta();        
        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.plan_de_cuenta_index)}
                title={'Plan de cuentas'}
                keys={'plandecuenta'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionsPlanCuenta}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.comprobante_index)}
                title={'Comprobante'}
                keys={'comprobante'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionsComprobante}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.libro_diario_index)}
                title={'Libro Diario'}
                keys={'libro_diario'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionsLibroDiario} 
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.libro_mayor_index)}
                title={'Libro Mayor'}
                keys={'libro_mayor'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionsMayor} 
            />,

            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.estado_resultado_index)}
                title={'Estados de Resultados'}
                keys={'estado_resultado'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionsEstadoResults} 
            />,
            
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.balance_general_index)}
                title={'Balance General'}
                keys={'balance_general'}
                data={this.state.rootSubMenuKeys}
                onClick={this.onClick.bind(this)}
                permisions={permisionBalanceGeneral} 
            />,

            <SubMenu
                key={6}
                title='Ajustes'
                keys='configconta'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentConfigConta}
                permisions={permisionsConfig}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_contabilidadajuste'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    componentConfigFacturacion() {
        
        const permisionsActividadEconimica = readPermisions(keys.facturacion_actividad_economica);
        const permisionsDosificacion = readPermisions(keys.facturacion_dosificacion);
        const permisionsCertificacionSin = readPermisions(keys.facturacion_certificacion_sin);

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.actividad_economica + '/index')}
                title={'Actividad Economica'}
                keys={'actividadeconomica'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsActividadEconimica}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.dosificacion + '/index')}
                title={'Dosificacion'}
                keys={'dosificacion'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsDosificacion}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.certificacion_sin + '/index')}
                title={'Certificación SIN '}
                keys={'certificacionsin'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsCertificacionSin}
            />,
        ];
    }

    configuracionGeneral() {
        const permisionsTipoMoneda = readPermisions(keys.tipomoneda);
        const permisionsSucursales = readPermisions(keys.sucursales);
        const permisionsFacturacion = readPermisions(keys.facturacion);
        const componentConfigFacturacion = this.componentConfigFacturacion(); 

        return [
            <MenuItem
                key = {0}
                onLink = {this.onLink.bind(this,routes.tipo_moneda)}
                title = {'Tipo de Moneda'}
                keys = {'tipo_moneda'}
                data = {this.state.rootSubMenuKeys}
                onClick = {this.onClick.bind(this)}
                permisions={permisionsTipoMoneda}
            />,
            <MenuItem
                key = {1}
                onLink = {this.onLink.bind(this,routes.tipo_cambio + '/index')}
                title = {'Tipo de Cambio'}
                keys = {'tipo_cambio'}
                data = {this.state.rootSubMenuKeys}
                onClick = {this.onClick.bind(this)}
                //permisions={permisionsTipoMoneda}
            />,
            <MenuItem
                key = {2}
                onLink = {this.onLink.bind(this, routes.sucursal_index)}
                title = {'Empresa/Sucursal'}
                keys = {'sucursal'}
                data = {this.state.rootSubMenuKeys}
                onClick = {this.onClick.bind(this)}
                permisions={permisionsSucursales}
            />,
            <SubMenu
                key={3}
                title='Facturacion'
                keys='facturacion'
                onCollapse={this.onClick.bind(this)}
                data={this.state.rootSubMenuKeys}
                component={componentConfigFacturacion}
                permisions={permisionsFacturacion}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '18px'}}
                icon={
                    <Icon type="ant-design" 
                        style={{'position': 'relative', 'top': '-4px'}}
                    />
                }
                value={'submenu_facturacion'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    render() {

        const menu_sidebar = (
            <Menu className={(this.state.dropdown_sider)?
                'dropdown-menu-sidebar-option active':
                'dropdown-menu-sidebar-option'}>
                <div className="nav-link-perfil">
                    <a className="nav-link-option" onClick={this.onClickPerfil.bind(this)}> 
                        <Icon className="icono-nav-link" type="user" /> Perfil 
                    </a>
                </div>
                <div className="nav-link-perfil">
                    {this.props.logout}
                </div>
            </Menu>
        );

        const componentSeguridad = this.seguridad();
        const subComercial = this.subComercial();
        const subContable = this.subContable();
        const configuracionGeneral = this.configuracionGeneral();

        const permisionsSeguridad = readPermisions(keys.seguridad);
        const permisionsSubComercial = readPermisions(keys.sistema_comercial);
        
        const permisionsHome = readPermisions(keys.home);
        const permisionsSubContable = readPermisions(keys.sistema_contabilidad);
        const permisionsMenuConfiguracion = readPermisions(keys.menu_configuracion);
        
        const img = readData(keysStorage.img) == null ? {logo: '', logonombre: ''} : JSON.parse(readData(keysStorage.img));
        const logo = img.logo == undefined ? '' : img.logo;
        const logonombre = img.logonombre == undefined ? '' : img.logonombre;
        const styles = {
            sidebar: {
              padding: 0, margin: 0,
              boxSizing: 'border-box',
            }
        }

        return (

            <Sider //collapsible
                theme={'light'}
                collapsed={this.props.collapsed}
                width={250}
                style={styles.sidebar}

                onCollapse={this.onCollapse.bind(this)}>

                <Menu theme="light" style={{'padding': '0', 'margin': '0'}}
                    defaultSelectedKeys={['1']}
                    >

                    <div className={'menu_logo_header'}>

                        <div className='logo_header'>

                            {/*<img src="/img/logo.png" alt='none'*/}
                            <img src={logo} alt='none' id='img_logo1'
                                className={(this.props.collapsed)?'img_logo_1 activo':'img_logo_1'}
                            />
                            {/*<img src='/img/nombre.png' alt='none'*/}
                            <img src={logonombre} alt='none' id='img_logo2'
                                className={(this.props.collapsed)?'img_logo_2 inactivo':'img_logo_2'}
                            />
                        </div>
                    </div>

                    <div className={(this.props.collapsed)?'menu_logo_sidebar active':'menu_logo_sidebar'}>

                        <img src='/img/fondo2.png' className='img_logo_sidebar' alt='none' />

                        <div className={(this.props.collapsed)?'menu_sidebar active':'menu_sidebar'}>
                            {/*
                            <img
                                src={(user.foto == null)?'/img/perfil.png':user.foto}
                                className={(this.props.collapsed)?"user_sidebar active":"user_sidebar"}
                                alt='none'
                            /> */}

                            <Dropdown overlay={menu_sidebar} trigger={['click']} visible={this.state.visible}
                                onVisibleChange={this.onVisibleChange.bind(this)} style={{width: '100%'}}
                            >
                                <div className="content-sider" style={{width: '100%'}}>
                                    <label className={(this.props.collapsed)?"title-user-sidebar active":"title-user-sidebar"}>
                                        {this.state.user}
                                    </label>
                                    <Icon type="down"
                                        style={{'color': '#FFF', 'position': 'absolute', 'padding': '3px',
                                        'right': '5px', 'bottom': '4px', 'fontSize': '15px', 'fontWeight': 'bold'}}
                                    />
                                </div>
                            </Dropdown>
                        </div>

                    </div>
                </Menu>

                <nav className="aside-navbar" style={{ padding: 0, margin: 0, overflowY: 'scroll', height: 580}}>
                    <ul>
                        <Navegation
                            title='Home'
                            keys='home'
                            onCollapse={this.onClickMenu.bind(this)}
                            data={this.state.rootMenuKeys}
                            onLink={this.onLink.bind(this, routes.home)}
                            
                            permisions={permisionsHome}
                        />

                        <SubMenu
                            key={1}
                            title='Subsistema Comercial'
                            keys='sub_comercial'
                            onCollapse={this.onClickMenu.bind(this)}
                            data={this.state.rootMenuKeys}
                            component={subComercial}
                            permisions={permisionsSubComercial}
                            style={{'width': '100%', 'height': '40px'}}
                            icon={
                                <Icon type="ant-design" 
                                    style={{'position': 'relative', 'top': '-4px'}}
                                />
                            }
                            value={'subsistema_comercial'}
                            dataSource={this.state.subMenu_object}
                        />

                        <SubMenu
                            key={2}
                            title='Subsistema Contable'
                            keys='sub_contable'
                            onCollapse={this.onClickMenu.bind(this)}
                            data={this.state.rootMenuKeys}
                            component={subContable}
                            permisions={permisionsSubContable}
                            style={{'width': '100%', 'height': '40px'}}
                            icon={
                                <Icon type="ant-design" 
                                    style={{'position': 'relative', 'top': '-4px'}}
                                />
                            }
                            value={'subsistema_contable'}
                            dataSource={this.state.subMenu_object}
                        />

                        <SubMenu
                            key={3}
                            title='Configuracion'
                            keys='configuracion_general'
                            onCollapse={this.onClickMenu.bind(this)}
                            data={this.state.rootMenuKeys}
                            component={configuracionGeneral}
                            permisions={permisionsMenuConfiguracion}
                            style={{'width': '100%', 'height': '40px'}}
                            icon={
                                <Icon type="ant-design" 
                                    style={{'position': 'relative', 'top': '-4px'}}
                                />
                            }
                            value={'subsistema_configuracion'}
                            dataSource={this.state.subMenu_object}
                        />

                        <SubMenu
                            key={0}
                            title='Seguridad'
                            keys='seguridad'
                            onCollapse={ this.onCollapseMenu.bind(this) }
                            data={this.state.rootMenuKeys}
                            component={componentSeguridad}
                            permisions={permisionsSeguridad}
                            style={{'width': '100%', 'height': '40px'}}
                            configAllowed={this.state.configGrupoUser}
                            icon={
                                <Icon type="ant-design" 
                                    style={{'position': 'relative', 'top': '-4px'}}
                                />
                            }
                            value={'subsistema_seguridad'}
                            dataSource={this.state.subMenu_object}
                        />

                    </ul>
                </nav>
            </Sider>
        );
    }
}

Sidebar.propTypes = {
    ventaendospasos: PropTypes.bool,
}

Sidebar.defaultProps = {
    ventaendospasos: false,
}

export default withRouter(Sidebar);

