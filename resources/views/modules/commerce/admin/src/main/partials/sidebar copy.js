
import React, { Component } from 'react';
import {Layout, Icon, Menu, Dropdown} from 'antd';
import {withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import Navegation from './menu/menu';
import SubMenu from './menu/submenu';
import MenuItem from './menu/item';
import { geturl } from '../../../tools/toolsurl';
import keys from '../../../tools/keys';
import keysStorage from '../../../tools/keysStorage';

import ws from '../../../tools/webservices';

import { readPermisions, savePermisionsAll } from '../../../tools/toolsPermisions';
import { httpRequest, readData, saveData } from '../../../tools/toolsStorage';
import colors from '../../../tools/colors';

const {
    Sider
} = Layout;

class Sidebar extends Component {

    constructor(props) {

        super(props);
        this.state = {

            user: '',

            dropdown_sider: false,
            collapsed: false,
            visible: false,

            configGrupoUser: false,

            rootMenuKeys: [
                {key: 'home', value: false},
                {key: 'seguridad', value: false},
                {key: 'sub_comercial', value: false},
            ],
            rootSubMenuKeys: [
                {key: 'taller', value: false, position: 2},
                {key: 'almacen', value: false, position: 2},
                {key: 'ventas', value: false, position: 2},
                {key: 'compras', value: false, position: 2},

                {key: 'permiso', value: false, position: 1},

            ],
            rootLinkMenuKey: [
                {key: 'user', value: false, position: 1, bandera: 0},
                {key: 'rol', value: false, position: 1, bandera: 0},

                {key: 'assignpermission', value: false, position: 1, bandera: 0},
                {key: 'activepermission', value: false, position: 1, bandera: 0},
                {key: 'users_online', value: false, position: 1, bandera: 0},
                {key: 'log_del_sistema', value: false, position: 1, bandera: 0},

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
                {key: 'tipo_moneda', value : false, position: 1, bandera: 1},
                {key: 'tipo_traspaso', value: false, position: 1, bandera: 1},
                {key: 'sucursal', value: false, position: 1, bandera: 1},
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

        this.setState({
            user: usuario,
        });

        this.getConfigsMenuLink();
        this.getConfigsFabrica();
        this.getConfigsClient();

        document.addEventListener("click", this.handleEventClick.bind(this));
    }

    handleEventClick() {
        let key = JSON.parse(readData(keysStorage.user));
        var usuario = (typeof key == 'undefined' || key == null)?'':key.nombre;
        this.setState({
            user: usuario,
        });
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
                let title = '';
                if (result.data.clienteesabogado) {
                    saveData(keysStorage.isabogado, 'A');
                } else {
                    saveData(keysStorage.isabogado, 'C');
                }
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getConfigsFabrica() {
        httpRequest('get', ws.wsconfigfabrica)
        .then((result) => {
            //console.log('CONFIG FABRICA ====> ', result);
            if (result.response == 1) {
                this.setState({
                    comalmaceninventariocorte: result.data.comalmaceninventariocorte,
                    comalmaceningresoprod: result.data.comalmaceningresoprod,
                    comalmacensalidaprod: result.data.comalmacensalidaprod,
                    comalmacenlistadeprecios: result.data.comalmacenlistadeprecios,
                    comventasventaalcredito: result.data.comventasventaalcredito,
                    comventasventaproforma: result.data.comventasventaproforma,
                    comventascobranza: result.data.comventascobranza,
                    comcompras: result.data.comcompras,
                    comtaller: result.data.comtaller,
                    comtallervehiculoparte: result.data.comtallervehiculoparte,
                    comtallervehiculohistoria: result.data.comtallervehiculohistoria,
                    seguridad: result.data.seguridad,
                })
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
    }

    onClickMenu(event) {
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
            rootMenuKeys: event,
        });
    }

    onClickChildren(event) {
        event.preventDefault();
    }

    onLink(event) {
        let url = geturl(event);
        this.props.history.push(url);
    }

    onClickMenuLink(event) {
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
    }

    onClickPerfil() {
        this.setState({
            dropdown_sider: !this.state.dropdown_sider,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
            });
            let url = '/commerce/admin/perfil';
            this.props.history.push(url);
        }, 400);
    }

    reporteventas() {

        const permisionsRepVenta = readPermisions(keys.ventas_reportes_ventas);
        const permisionsRepVentaDetalle = readPermisions(keys.ventas_reportes_ventas_detallado);
        const permisionsRepVentaCobrar = readPermisions(keys.ventas_reportes_cuentas_por_cobrar);
        const permisionsRepVentaCobros = readPermisions(keys.ventas_reportes_cobros_realizados);
        const permisionsRepVentaHisVeh = readPermisions(keys.ventas_reportes_ventas_historico_veh);
        const permisionsRepClientes = readPermisions(keys.ventas_reportes_clientes);

        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, 'reporteventa')} 
                title={'R. de Ventas'} 
                keys={'reporteventa'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVenta}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, 'reporteventadetalle')}
                title={'R. Venta Detallado'}
                keys={'reporteventadetalle'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaDetalle}
            />,
            <MenuItem 
                key={3} 
                onLink={this.onLink.bind(this, 'reporteventaporcobrar')}
                title={'R. Cuentas por Cobrar'}
                keys={'reporteventaporcobrar'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaCobrar}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, 'reporteventacobro')}
                title={'R. Cobros Realizados'}
                keys={'reporteventacobro'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaCobros}
            />,
            <MenuItem 
                key={5} 
                onLink={this.onLink.bind(this, 'reporteventahistoricovehiculo')}
                title={'R. Venta Historico Vehiculo'}
                keys={'reporteventahistoricovehiculo'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVentaHisVeh}
            />,
            <MenuItem 
                key={6} 
                onLink={this.onLink.bind(this, 'reportecliente')}
                title={'R. Cliente'}
                keys={'reportecliente'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepClientes}
            />,
            <MenuItem 
                key={7} 
                onLink={this.onLink.bind(this, 'reportecomisionvendedor')}
                title={'R. Comision Vendedor'}
                keys={'reportecomisionvendedor'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                //permisions={permisionsRepClientes}
            />,
        ];
    }

    reportealmacen() {
        const permisionsReporteProducs = readPermisions(keys.almacen_reportes_productos);
        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, 'reporteproducto')} 
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
                onLink={this.onLink.bind(this, 'reportevehiculo')} 
                title={'R. de Vehiculo'} 
                keys={'reportevehiculo'}
                data={this.state.rootSubLinkMenuKey}
                onClick={this.onClickMenuSubLink.bind(this)}
                permisions={permisionsRepVehiculo}
            />,
        ];
    }

    permisos() {
        return [
            <MenuItem 
                key={1} 
                onLink={this.onLink.bind(this, 'asignarpermiso')} 
                title={'Asignar Permiso'} 
                keys={'asignarpermiso'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
            />,
            <MenuItem 
                key={2} 
                onLink={this.onLink.bind(this, 'activarpermiso')}
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
                        onLink={this.onLink.bind(this, 'activarpermiso')}
                        onClick={this.onClickMenuLink.bind(this)}
                        title={'Activar Modulo'}
                    />,
                    <MenuItem 
                        key={4} 
                        onLink={this.onLink.bind(this, 'asignarpermiso')} 
                        title={'Asignar Permiso'} 
                        keys={'asignarpermiso'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />,
                    <MenuItem 
                        key={5} 
                        onLink={this.onLink.bind(this, 'users_online')} 
                        title={'Usuarios Conectados'} 
                        keys={'users_online'}
                        data={this.state.rootLinkMenuKey}
                        onClick={this.onClickMenuLink.bind(this)}
                    />, 
                    <MenuItem 
                        key={6} 
                        onLink={this.onLink.bind(this, 'log_del_sistema')} 
                        title={'Log del Sistema'} 
                        keys={'log_del_sistema'}
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
                        onLink={this.onLink.bind(this, 'asignarprivilegio')}
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
                    onLink={this.onLink.bind(this, 'vehiculo')}
                    title={'Vehiculo'}
                    keys={'vehiculo'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehiculo}
                />,
                <MenuItem
                    key={1}
                    onLink={this.onLink.bind(this, 'vehiculohistoria')}
                    keys={'vehiculo_historia'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    title={'Vehiculo Historia'}
                    permisions={permisionsVehiculoHis}
                    configAllowed={configVehiculoHistoria}
                />,
                <MenuItem
                    key={2}
                    onLink={this.onLink.bind(this, 'vehiculoparte')}
                    title={'Vehiculo Parte'}
                    keys={'vehiculo_parte'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehiculoPate}
                    configAllowed={configVehiculoParte}
                />,
                <MenuItem
                    key={4}
                    onLink={this.onLink.bind(this, 'vehiculocaracteristica')}
                    title={'Caracteristicas'}
                    keys={'vehiculo_caracteristica'}
                    data={this.state.rootLinkMenuKey}
                    onClick={this.onClickMenuLink.bind(this)}
                    permisions={permisionsVehCaracteristicas}
                />,
                <MenuItem
                    key = {5}
                    onLink = {this.onLink.bind(this, 'familiavehiculo')}
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
                    onLink={this.onLink.bind(this, 'usuario')}
                    onClick={this.onClickMenuLink.bind(this)}
                    title={'Usuario'}
                    permisions={permisionsUsuario}
                />,
                <MenuItem
                    key={2}
                    keys={'rol'}
                    data={this.state.rootLinkMenuKey}
                    onLink={this.onLink.bind(this, 'grupousuario')}
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
        const permisionsTipoMoneda = readPermisions(keys.tipomoneda);
        const permisionsTipoTrasnpaso = readPermisions(keys.tipotraspaso)
        const permisionsSucursales = readPermisions(keys.sucursales);
        const permisionsAlmacenes = readPermisions(keys.almacenes);
        const permisionsAlmacenUbicacion = readPermisions(keys.ubicaciones);
        const permisionsReportesAlmacen = readPermisions(keys.almacen_reportes)

        const ingresoprod = this.state.comalmaceningresoprod;
        const salidaprod = this.state.comalmacensalidaprod;
        const invenariocorte = this.state.comalmaceninventariocorte;
        const listaprecios = this.state.comalmacenlistadeprecios;

        return [
            <MenuItem
                key={0}
                onLink={this.onLink.bind(this, 'producto')}
                title={'Producto'}
                keys={'producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProducto}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, 'ingresoproducto')}
                title={'Ingreso Producto'}
                keys={'ingreso_producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsIngresoProd}
                configAllowed={ingresoprod}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, 'salidaproducto')}
                title={'Salida Producto'}
                keys={'salida_producto'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsSalidaProd}
                configAllowed={salidaprod}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, 'inventariocorte')}
                title={'Inventario Fisico'}
                keys={'inventario_corte'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsInventario}
                configAllowed={invenariocorte}
            />,
            <MenuItem
                key={4}
                onLink={this.onLink.bind(this, 'listaprecio')}
                title={'Lista de Precios'}
                keys={'lista_precio'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsListaPrecios}
                configAllowed={listaprecios}
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, 'familia')}
                title={'Familia'}
                keys={'familia'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsFamilia}
            />,
            <MenuItem
                key={7}
                onLink={this.onLink.bind(this, 'productocaracteristica')}
                title={'Prod Caracteristica'}
                keys={'producto_caracteristica'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProdCaracteristicas}
            />,
            <MenuItem
                key={8}
                onLink={this.onLink.bind(this, 'traspasoproducto')}
                title={'Traspasos'}
                keys={'traspasos'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsTraspaso}
            />,
            <MenuItem
                key = {9}
                onLink = {this.onLink.bind(this, 'unidadmedida')}
                title = {'Unidad de Medida'}
                keys = {'unidad_medida'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsUnidadMedida}
            />,
            <MenuItem
                key = {10}
                onLink = {this.onLink.bind(this,'tipomoneda')}
                title = {'Tipo de Moneda'}
                keys = {'tipo_moneda'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsTipoMoneda}
            />,
            <MenuItem
                key = {11}
                onLink = {this.onLink.bind(this, 'tipotraspaso')}
                title = {'Tipo de Traspaso'}
                keys = {'tipo_traspaso'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsTipoTrasnpaso}
            />,
            <MenuItem
                key = {12}
                onLink = {this.onLink.bind(this, 'sucursal')}
                title = {'Sucursales'}
                keys = {'sucursal'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsSucursales}
            />,
            <MenuItem
                key = {13}
                onLink = {this.onLink.bind(this, 'almacenes')}
                title = {'Almacenes'}
                keys = {'almacenes'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsAlmacenes}
            />,
            <MenuItem
                key = {14}
                onLink = {this.onLink.bind(this, 'almacenubicacion')}
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
                onLink={this.onLink.bind(this, 'cliente')}
                title={'Cliente'}
                keys={'cliente'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCliente}
            />,
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, 'vendedor')}
                title={titleVendedor}
                keys={'vendedor'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsVendedor}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, 'venta')}
                title={'Venta'}
                keys={'venta'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsVenta}
            />,
            <MenuItem 
                key={4} 
                onLink={this.onLink.bind(this, 'proforma')}
                title={'Proforma'}
                keys={'proforma'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProforma}
                configAllowed={ventasproforma}
            />,
            <MenuItem
                key={5}
                onLink={this.onLink.bind(this, 'cobranza')}
                title={'Cobranza'}
                keys={'cobranza'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCobranza}
                configAllowed={ventascobranza}
            />,
            <MenuItem
                key={6}
                onLink={this.onLink.bind(this, 'comision')}
                title={'Comision'}
                keys={'comision'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsComision}
            />,
            <MenuItem
                key = {7}
                onLink = {this.onLink.bind(this, 'tipocliente')}
                title = {'Tipo Cliente'}
                keys = {'tipo_cliente'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsTipoCliente}
            />,
            <MenuItem
                key = {8}
                onLink = {this.onLink.bind(this, 'familiaciudad')}
                title = {'Familia Ciudades'}
                keys = {'familia_ciudad'}
                data = {this.state.rootLinkMenuKey}
                onClick = {this.onClickMenuLink.bind(this)}
                permisions={permisionsFamCiudad}
            />,
            <SubMenu 
                key={3}
                title='Reporte'
                keys='ventareporte'
                onCollapse={this.onClickMenuLink.bind(this)}
                data={this.state.rootLinkMenuKey}
                component={componentReporte}
                style={{'width': '100%', 'height': '40px', 'paddingLeft': '25px'}}
                permisions={permisionReporteVentas}
            />,
        ];
    }

    compras() {

        const permisionsProveedor = readPermisions(keys.proveedor);
        const permisionsCompra = readPermisions(keys.compra);
        const permisionsPago = readPermisions(keys.pago);

        return  [
            <MenuItem
                key={1}
                onLink={this.onLink.bind(this, 'proveedor')}
                title={'Proveedor'}
                keys={'proveedor'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsProveedor}
            />,
            <MenuItem
                key={2}
                onLink={this.onLink.bind(this, 'compra')}
                title={'Compra'}
                keys={'compra'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsCompra}
            />,
            <MenuItem
                key={3}
                onLink={this.onLink.bind(this, 'pago')}
                title={'Pago'}
                keys={'pago'}
                data={this.state.rootLinkMenuKey}
                onClick={this.onClickMenuLink.bind(this)}
                permisions={permisionsPago}
            />
        ];
    }

    subComercial() {

        const componentTaller = this.taller();
        const componentAlmacen = this.almacen();
        const componentVentas = this.ventas();
        const componentCompras = this.compras();

        const permisionsTaller = readPermisions(keys.taller);
        const permisionsAlmacen = readPermisions(keys.almacen);
        const permisionsVentas = readPermisions(keys.ventas);
        const permisionsCompras = readPermisions(keys.compras);

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
            />
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

        const permisionsSeguridad = readPermisions(keys.seguridad);
        const permisionsSubComercial = readPermisions(keys.sistema_comercial);
        const permisionsHome = readPermisions(keys.home);

        const user = readData(keysStorage.user) == null ? {foto:null} : JSON.parse(readData(keysStorage.user));
        
        const img = readData(keysStorage.img) == null ? {logo: '', logonombre: ''} : JSON.parse(readData(keysStorage.img));
        const logo = img.logo == undefined ? '' : img.logo;
        const logonombre = img.logonombre == undefined ? '' : img.logonombre;
        const styles = {
            sidebar: {
              //background: colors.danger.sidebar.principal,
              padding: 0,
              margin: 0,
              boxSizing: 'border-box',
            }
        }

        return (

            <Sider //collapsible
                theme={'light'}
                collapsed={this.props.collapsed}
                width={250}
                style={styles.sidebar}
                // style={{
                //     overflow: 'auto',
                //     height: '100vh',
                //     position: 'fixed',
                //     left: 0
                // }}

                onCollapse={this.onCollapse.bind(this)}>

                <Menu theme="light" style={{'padding': '0', 'margin': '0'}}
                    defaultSelectedKeys={['1']}
                    >

                    <div className={'menu_logo_header'}>

                        <div className='logo_header'>

                            {/*<img src="/img/logo.png" alt='none'*/}
                            <img src={logo} alt='none'
                                className={(this.props.collapsed)?'img_logo_1 activo':'img_logo_1'}
                            />
                            {/*<img src='/img/nombre.png' alt='none'*/}
                            <img src={logonombre} alt='none'
                                className={(this.props.collapsed)?'img_logo_2 inactivo':'img_logo_2'}
                            />
                        </div>
                    </div>

                    <div className={(this.props.collapsed)?'menu_logo_sidebar active':'menu_logo_sidebar'}>

                        <img src='/img/fondo2.png'
                            className='img_logo_sidebar'
                            alt='none'
                        />

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

                <nav className="aside-navbar" style={styles.sidebar}>
                    <ul>
                        <Navegation
                            title='Home'
                            keys='home'
                            onCollapse={this.onClickMenu.bind(this)}
                            data={this.state.rootMenuKeys}
                            onLink={this.onLink.bind(this, 'home')}
                            permisions={permisionsHome}
                        />

                        <SubMenu
                            key={0}
                            title='Seguridad'
                            keys='seguridad'
                            onCollapse={this.onClickMenu.bind(this)}
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
                        />

                        <SubMenu
                            key={1}
                            title='Subsistema Comerial'
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
                        />

                    </ul>
                </nav>
            </Sider>
        );
    }
}

export default withRouter(Sidebar);

