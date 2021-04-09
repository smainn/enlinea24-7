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
                    title: 'menu_home', value: false, 
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
                                        {
                                            title: 'kerdexproducto', value: false,
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
                                    title: 'menu_entregaproducto', value: false,
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
                                        {
                                            title: 'libroventa', value: false,
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
        // img_logo1.onerror = (event) => {
        //     event.target.src = '/img/logo.png';
        // };

        var img_logo2 = document.getElementById('img_logo2');
        // img_logo2.onerror = (event) => {
        //     event.target.src = '/img/nombre.png';
        // };
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
    onCollapse(event) {
        if (this.validar_data(this.props.onClick)) {
            this.props.onClick(event);
        }
    }
    children_menu(data, array, menu) {
        if (!Array.isArray(data)) return;
        
        if (data.length == 0) return;

        for (let index = 0; index < data.length; index++) {
            if (data[index].title == menu) {
                array.push(data[index]);
                return;
            }
            this.children_menu(data[index].children, array, menu);
        }
    }
    onCollapseMenu(data, menu) {

        var array = [];
        this.children_menu(this.state.subMenu_object, array, menu);

        if (array.length > 0) {

            var bandera = Array.isArray(array[0].children) ? array[0].children.length > 0 ? false : true : true;

            if ( bandera ) {
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
        }

        saveData(keysStorage.LinkMenu, menu);
        this.setState({
            subMenu_object: data,
        });
    }

    onLink(event) {
        this.props.history.push(event);
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
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
                permisions={permisionsRepVenta}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'ventareporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, routes.reporte_venta_detalle)}
                title={'R. Venta Detallado'}
                permisions={permisionsRepVentaDetalle}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'ventadetallereporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={3} 
                onLink={this.onLink.bind(this, routes.reporte_venta_por_cobrar)}
                title={'R. Cuentas por Cobrar'}
                permisions={permisionsRepVentaCobrar}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'cuentaporcobrarporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.reporte_venta_cobro)}
                title={'R. Cobros Realizados'}
                permisions={permisionsRepVentaCobros}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'cobrorealizadoreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={5} 
                onLink={this.onLink.bind(this, routes.reporte_venta_historico_vehiculo)}
                title={'R. Venta Historico Vehiculo'}
                permisions={permisionsRepVentaHisVeh}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'ventahistoricoreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={6} 
                onLink={this.onLink.bind(this, routes.reporte_cliente)}
                title={'R. Cliente'}
                permisions={permisionsRepClientes}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'clientereporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={7} 
                onLink={this.onLink.bind(this, routes.reporte_comision_vendedor)}
                title={'R. Comision ' + cliente_Abogado}
                permisions={permisionsRepVentaComision}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'comisionvendedorreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={8} 
                onLink={this.onLink.bind(this, routes.reporte_venta_por_producto)}
                title={'R. Venta por Producto'}
                permisions={permisionsRepVentaProd}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'ventaproductoreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={9} 
                onLink={this.onLink.bind(this, routes.reporte_venta_factura_all)}
                title={'R. de Factura'}
                //permisions={permisionsRepVentaProd}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'ventafacturareporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={10} 
                onLink={this.onLink.bind(this, routes.reporte_librodeventa)}
                title={'Libro de Venta'}
                //permisions={permisionsRepVentaProd}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'libroventa'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    reportealmacen() {
        const permisionsReporteProducs = readPermisions(keys.almacen_reportes_productos);
        return [
            <MenuItem 
                key={0} 
                onLink={this.onLink.bind(this, routes.reporte_producto)} 
                title={'R. de Producto'} 
                permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'productoreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.reporte_kardexproducto)} 
                title={'Kardex Producto'} 
                // permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'kerdexproducto'}
                dataSource={this.state.subMenu_object}
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
                permisions={permisionsRepVehiculo}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'vehiculoreporte'}
                dataSource={this.state.subMenu_object}
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
                //permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'comprareporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, routes.compra_detalle_reporte)} 
                title={'R. Compra Detallado'}
                //permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'compradetallereporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, routes.compra_cuentaporpagar_reporte)} 
                title={'R. Cuenta por Pagar'} 
                //permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'cuentaporpagarreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={3} 
                onLink={this.onLink.bind(this, routes.compra_pagorealizado_reporte)} 
                title={'R. Pago Realizado'}
                //permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'pagorealizadoreporte'}
                dataSource={this.state.subMenu_object}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.compra_proveedor_reporte)} 
                title={'R. Proveedor'}
                //permisions={permisionsReporteProducs}

                onClick = {this.onCollapseMenu.bind(this)}
                value={'proveedorreporte'}
                dataSource={this.state.subMenu_object}
            />,
        ];
    }

    permisionsMenu(permisionsPriv) {
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null) ? '' : key.idgrupousuario;

        if (id == 1) {
            return(
                [
                    <MenuItem 
                        key={3} 
                        onLink={this.onLink.bind(this, routes.activar_permiso)}
                        title={'Activar Modulo'}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_activarpermiso'}
                        dataSource={this.state.subMenu_object}
                    />,
                    <MenuItem 
                        key={4} 
                        onLink={this.onLink.bind(this, routes.asignar_permiso)} 
                        title={'Asignar Permiso'}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_asignarpermiso'}
                        dataSource={this.state.subMenu_object}
                    />,
                    <MenuItem 
                        key={5} 
                        onLink={this.onLink.bind(this, routes.usuarios_online)} 
                        title={'Usuarios Conectados'}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_usuarioconectado'}
                        dataSource={this.state.subMenu_object}
                    />, 
                    <MenuItem 
                        key={6} 
                        onLink={this.onLink.bind(this, routes.log_sistema)} 
                        title={'Log del Sistema'}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_logsistema'}
                        dataSource={this.state.subMenu_object}
                    />, 
                    <MenuItem 
                        key={7} 
                        onLink={this.onLink.bind(this, routes.config_inicial)} 
                        title={'Config Inicial'}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_configinicial'}
                        dataSource={this.state.subMenu_object}
                    />, 
                ]
            );
        } else {
            if (id == 2) {
                return (
                    <MenuItem 
                        key={0}
                        onLink={this.onLink.bind(this, routes.asignar_permiso)}
                        title={'Asignar Permiso'} 
                        permisions={permisionsPriv}

                        onClick = {this.onCollapseMenu.bind(this)}
                        value={'menu_asignarpermiso'}
                        dataSource={this.state.subMenu_object}
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
                    permisions={permisionsVehiculo}

                    onClick = {this.onCollapseMenu.bind(this)}
                    value={'menu_vehiculo'}
                    dataSource={this.state.subMenu_object}
                />,
                <MenuItem
                    key={1}
                    onLink={this.onLink.bind(this, routes.vehiculo_historia)}
                    title={'Vehiculo Historia'}
                    permisions={permisionsVehiculoHis}
                    configAllowed={configVehiculoHistoria}

                    onClick = {this.onCollapseMenu.bind(this)}
                    value={'menu_vehiculohistoria'}
                    dataSource={this.state.subMenu_object}
                />,
                <MenuItem
                    key={2}
                    onLink={this.onLink.bind(this, routes.vehiculo_parte)}
                    title={'Vehiculo Parte'}
                    permisions={permisionsVehiculoPate}
                    configAllowed={configVehiculoParte}

                    onClick = {this.onCollapseMenu.bind(this)}
                    value={'menu_vehiculoparte'}
                    dataSource={this.state.subMenu_object}
                />,
                <MenuItem
                    key={4}
                    onLink={this.onLink.bind(this, routes.vehiculo_caracteristica)}
                    title={'Caracteristicas'}
                    permisions={permisionsVehCaracteristicas}
                    
                    onClick = {this.onCollapseMenu.bind(this)}
                    value={'menu_vehiculocaracteristica'}
                    dataSource={this.state.subMenu_object}
                />,
                <MenuItem
                    key = {5}
                    onLink = {this.onLink.bind(this, routes.familia_vehiculo)}
                    title = {'Tipo Vehiculo'}
                    permisions={permisionsTipoVehiculo}

                    onClick = {this.onCollapseMenu.bind(this)}
                    value={'menu_vehiculotipo'}
                    dataSource={this.state.subMenu_object}
                />,
                <SubMenu 
                    key={3}
                    title='Reporte'
                    component={componentReporte}
                    style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                    permisions={permisionsReportesTaller}

                    value={'submenu_tallerreporte'}
                    dataSource={this.state.subMenu_object}
                    onCollapse={ this.onCollapseMenu.bind(this) }
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
                    onLink={this.onLink.bind(this, routes.usuario_index)}
                    title={'Usuario'}
                    permisions={permisionsUsuario}

                    value={'menu_usuario'}
                    dataSource={this.state.subMenu_object}
                    onClick={ this.onCollapseMenu.bind(this) }
                />,
                <MenuItem
                    key={2}
                    onLink={this.onLink.bind(this, routes.grupo_usuario_index)}
                    title={'Grupo Usuario'}
                    permisions={permisionsGrup}

                    value={'menu_grupousuario'}
                    dataSource={this.state.subMenu_object}
                    onClick={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsProducto}

                value={'menu_producto'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.ingreso_producto_index)}
                title={'Ingreso Producto'}
                permisions={permisionsIngresoProd}
                configAllowed={ingresoprod}

                value={'menu_ingresoproducto'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.salida_producto_index)}
                title={'Salida Producto'}
                permisions={permisionsSalidaProd}
                configAllowed={salidaprod}

                value={'menu_salidaproducto'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.inventario_index)}
                title={'Inventario Fisico'}
                permisions={permisionsInventario}
                configAllowed={invenariocorte}

                value={'menu_inventario'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.lista_precios_index)}
                title={'Lista de Precios'}
                permisions={permisionsListaPrecios}
                //configAllowed={listaprecios}

                value={'menu_listaprecio'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.familia_producto)}
                title={'Familia'}
                permisions={permisionsFamilia}

                value={'menu_familia'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={7}
                onLink={this.onLink.bind(this, routes.producto_caracteristica)}
                title={'Prod Caracteristica'}
                permisions={permisionsProdCaracteristicas}

                value={'menu_productocaracteristica'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={8}
                onLink={this.onLink.bind(this, routes.traspaso_producto_index)}
                title={'Traspasos'}
                permisions={permisionsTraspaso}

                value={'menu_traspaso'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {9}
                onLink = {this.onLink.bind(this, routes.unidad_medida)}
                title = {'Unidad de Medida'}
                permisions={permisionsUnidadMedida}

                value={'menu_unidadmedida'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {11}
                onLink = {this.onLink.bind(this, routes.tipo_traspaso)}
                title = {'Tipo MovAlmacen'}
                permisions={permisionsTipoTrasnpaso}

                value={'menu_traspasotipo'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            
            <MenuItem
                key = {13}
                onLink = {this.onLink.bind(this, routes.almacenes)}
                title = {'Almacenes'}
                permisions={permisionsAlmacenes}

                value={'menu_almacen'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {14}
                onLink = {this.onLink.bind(this, routes.familia_almacen_ubicacion)}
                title = {'Ubicaciones'}
                permisions={permisionsAlmacenUbicacion}

                value={'menu_almacenubicacion'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu 
                key={6}
                title='Reporte'
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                permisions={permisionsReportesAlmacen}

                value={'submenu_almacenreporte'}
                dataSource={this.state.subMenu_object}
                onCollapse={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsCliente}

                value={'menu_cliente'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.vendedor_index)}
                title={titleVendedor}
                permisions={permisionsVendedor}

                value={'menu_vendedor'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.venta_index)}
                title={'Venta'}
                permisions={permisionsVenta}

                value={'menu_venta'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.entregaproducto + '/index')}
                title={'Entrega Producto'}
                configAllowed={this.props.ventaendospasos}

                value={'menu_entregaproducto'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, routes.proforma_index)}
                title={'Proforma'}
                permisions={permisionsProforma}
                configAllowed={ventasproforma}

                value={'menu_proforma'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.cobranza_index)}
                title={'Cobranza'}
                permisions={permisionsCobranza}
                configAllowed={ventascobranza}

                value={'menu_cobranza'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={6}
                onLink={this.onLink.bind(this, routes.comision_index)}
                title={'Comision'}
                permisions={permisionsComision}

                value={'menu_comision'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {7}
                onLink = {this.onLink.bind(this, routes.tipo_cliente)}
                title = {'Tipo Cliente'}
                permisions={permisionsTipoCliente}

                value={'menu_clientetipo'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {8}
                onLink = {this.onLink.bind(this, routes.familia_ciudad)}
                title = {'Familia Ciudades'}
                permisions={permisionsFamCiudad}

                value={'menu_ciudad'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu 
                key={9}
                title='Reporte'
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                permisions={permisionReporteVentas}
                value={'submenu_ventareporte'}
                dataSource={this.state.subMenu_object}
                onCollapse={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsProveedor}

                value={'menu_proveedor'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.compra_index)}
                title={'Compra'}
                permisions={permisionsCompra}

                value={'menu_compra'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.pago_index)}
                title={'Pago'}
                permisions={permisionsPago}

                value={'menu_pago'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu 
                key={4}
                title='Reporte'
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                //permisions={permisionReporteVentas}

                value={'submenu_comprareporte'}
                dataSource={this.state.subMenu_object}
                onCollapse={ this.onCollapseMenu.bind(this) }
            />,
        ];
    }

    restaurant() {

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, routes.restaurant_venta_index)}
                title={'Gestion Ventas'}
                //permisions={permisionsRestaurante}

                value={'menu_ventapedido'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
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
                onCollapse={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu
                key={1}
                title='Almacen'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu
                key={2}
                title='Ventas'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu
                key={3}
                title='Compras'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu
                key={4}
                title='Restaurant'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
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
                //permisions={permisionsGestionPeriodo} 

                value={'menu_cuentaasiento'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={-1}
                onLink={this.onLink.bind(this, routes.plantilla_asien_autom + '/index')}
                title={'Plantilla Asien. Autom.'}
                //permisions={permisionsGestionPeriodo} 

                value={'menu_plantillaasiento'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.gestion_periodo_index)}
                title={'Gestion y Periodo'}
                permisions={permisionsGestionPeriodo} 

                value={'menu_gestionperiodo'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.comprobantetipo_index)}
                title={'Tipo Comprobante'}
                permisions={permisionsTipoComprobante}

                value={'menu_comprobantetipo'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.tipocentrocosto_index)}
                title={'Tipo Centro Costo'}
                permisions={permisionsTipoCentroCosto} 

                value={'menu_centrocostotipo'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.centrodecosto_index)}
                title={'Centro de Costo'}
                permisions={permisionsCentroCostos}

                value={'menu_centrocosto'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.banco_index)}
                title={'Banco'}
                permisions={permisionsBanco}

                value={'menu_banco'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={6}
                onLink={this.onLink.bind(this, routes.configeerr_index)}
                title={'Config EERR'}
                permisions={permisionsConfigEERR}

                value={'menu_config_eerr'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsPlanCuenta}

                value={'menu_plancuenta'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.comprobante_index)}
                title={'Comprobante'}
                permisions={permisionsComprobante}

                value={'menu_comprobante'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.libro_diario_index)}
                title={'Libro Diario'}
                permisions={permisionsLibroDiario} 

                value={'menu_librodiario'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, routes.libro_mayor_index)}
                title={'Libro Mayor'}
                permisions={permisionsMayor} 

                value={'menu_libromayor'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,

            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, routes.estado_resultado_index)}
                title={'Estados de Resultados'}
                permisions={permisionsEstadoResults} 

                value={'menu_estadoresultado'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, routes.balance_general_index)}
                title={'Balance General'}
                permisions={permisionBalanceGeneral}
                
                value={'menu_balancegeneral'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,

            <SubMenu
                key={6}
                title='Ajustes'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsActividadEconimica}

                value={'menu_actividadeconomica'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, routes.dosificacion + '/index')}
                title={'Dosificacion'}
                permisions={permisionsDosificacion}

                value={'menu_dosificacion'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, routes.certificacion_sin + '/index')}
                title={'Certificación SIN '}
                permisions={permisionsCertificacionSin}

                value={'menu_certificacion_sin'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
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
                permisions={permisionsTipoMoneda}

                value={'menu_tipomoneda'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {1}
                onLink = {this.onLink.bind(this,routes.tipo_cambio + '/index')}
                title = {'Tipo de Cambio'}
                //permisions={permisionsTipoMoneda}

                value={'menu_tipocambio'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <MenuItem
                key = {2}
                onLink = {this.onLink.bind(this, routes.sucursal_index)}
                title = {'Empresa/Sucursal'}
                permisions={permisionsSucursales}
                
                value={'menu_sucursal'}
                dataSource={this.state.subMenu_object}
                onClick={ this.onCollapseMenu.bind(this) }
            />,
            <SubMenu
                key={3}
                title='Facturacion'
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
                onCollapse={ this.onCollapseMenu.bind(this) }
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
        const logo = ( typeof img.logo == 'undefined' || img.logo == null) ? '' : img.logo;
        const logonombre = ( typeof img.logonombre == 'undefined' || img.logonombre == null ) ? '' : img.logonombre;

        return (

            <Sider
                theme={'light'}
                collapsed={this.props.collapsed}
                width={250}
                style={{ padding: 0, margin: 0, boxSizing: 'border-box', }}

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
                            onLink={this.onLink.bind(this, routes.home)}
                            
                            permisions={permisionsHome}

                            value={'menu_home'}
                            dataSource={this.state.subMenu_object}
                            onCollapse={ this.onCollapseMenu.bind(this) }
                        />

                        <SubMenu
                            key={1}
                            title='Subsistema Comercial'
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
                            onCollapse={ this.onCollapseMenu.bind(this) }
                        />

                        <SubMenu
                            key={2}
                            title='Subsistema Contable'
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
                            onCollapse={ this.onCollapseMenu.bind(this) }
                        />

                        <SubMenu
                            key={3}
                            title='Configuracion'
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
                            onCollapse={ this.onCollapseMenu.bind(this) }
                        />

                        <SubMenu
                            key={0}
                            title='Seguridad'
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
                            onCollapse={ this.onCollapseMenu.bind(this) }
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

