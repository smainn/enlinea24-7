
import React, { Component } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../utils/routes';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { dateToString, hourToString, convertYmdToDmy, convertDmyToYmd } from '../../utils/toolsDate';
import { message, Select, Menu, Dropdown, Divider, Tree, Icon  } from 'antd';
import "antd/dist/antd.css";
import keysStorage from '../../utils/keysStorage';
import C_Select from '../../componentes/data/select';
import C_DatePicker from '../../componentes/data/date';
import C_Input from '../../componentes/data/input';
import C_CheckBox from '../../componentes/data/checkbox';

const { Option } = Select;
const { TreeNode } = Tree;

class IndexLibroMayor extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,

            dropdowncodcuenta: false,
            dropdowncuenta: false,
            dropdownperiodo: false,

            bandera: 0,

            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],

            moneda: [],
            gestion: [],
            periodo: [],
            cuenta: [],
            codcuenta: [],
            arraycuenta: [],

            datacuenta: [],

            array_periodo: [],

            idgestion: '',
            idperiodo: '',
            nameperiodo: '',

            idcuenta: '',
            idmoneda: '',
            fechainicio: '',
            fechafin: '',
            name_moneda: '',

            checked_gestion: false,
            checked_periodo: false,
            checked_saldo_mayor: false,

            disabled_periodo: false,
            disabled_gestion: false,

            exportar: 'N',

            config: {
                formato: '',
                nivel: '',
            },

            searchcodigocuenta: '',
            searchnamecuenta: '',

            timeoutSearch: undefined,

            noSesion: false,
        }
    }
    componentDidMount(){
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wslibromayor + '/create').then(
            response => {
                console.log(response)
                if (response.response == 1) {

                    var objecto = {
                        formato: (response.config == null)?'':response.config.formato,
                        nivel: (response.config == null)?'':response.config.numniveles,
                    }

                    var cantmoneda = response.moneda.length;
                    var idmoneda = (cantmoneda > 0)?response.moneda[0].idmoneda:'';
                    var name_moneda = (cantmoneda > 0)?response.moneda[0].descripcion:'';

                    this.setState({
                        array_periodo: response.data,

                        moneda: response.moneda,
                        arraycuenta: response.cuenta,
                        gestion: response.gestion,
                        periodo: response.periodo,

                        //idperiodo: response.idperiodo,
                        //idgestion: response.idgestion,
                        idmoneda: idmoneda,
                        name_moneda: name_moneda,

                        config: objecto,

                    });
                    this.getCuenta(response.cuenta);
                    this.getCodCuenta(response.cuenta);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    getCuenta(array) {
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == null) {
                var elem = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].idcuentaplan,
                    nivel: 1,
                };
                array_aux.push(elem);
            }
        }
        this.arbolCuenta(array_aux, 2);
        this.setState({
            cuenta: array_aux,
        });
    }
    arbolCuenta(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijoCuenta(data[i].value, contador);
            data[i].children = hijos;
            this.arbolCuenta(hijos, contador + 1);
        }
    }
    hijoCuenta(idpadre, contador) {
        var array =  this.state.arraycuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].fkidcuentaplanpadre == idpadre){
                var elemento = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].idcuentaplan,
                    nivel: contador,
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    getCodCuenta(array) {
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == null) {
                var elem = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].idcuentaplan,
                    nivel: 1,
                };
                array_aux.push(elem);
            }
        }
        this.arbolCodCuenta(array_aux, 2);
        this.setState({
            codcuenta: array_aux,
        });
    }
    arbolCodCuenta(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijoCodCuenta(data[i].value, contador);
            data[i].children = hijos;
            this.arbolCodCuenta(hijos, contador + 1);
        }
    }
    hijoCodCuenta(idpadre, contador) {
        var array =  this.state.arraycuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].fkidcuentaplanpadre == idpadre){
                var elemento = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].idcuentaplan,
                    nivel: contador,
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    getGestion(id) {
        httpRequest('get', ws.wslibromayor + '/get_gestion/'+ id).then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        idperiodo: response.idperiodo,

                        gestion: response.gestion,
                        periodo: response.periodo,
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
    onChangeMoneda(event) {
        var name_moneda = '';
        for (let i = 0; i < this.state.moneda.length; i++) {
            if (this.state.moneda[i].idmoneda == event) {
                name_moneda = this.state.moneda[i].descripcion;
                break;
            }
        }
        this.setState({
            idmoneda: event,
            name_moneda: name_moneda,
        });
    }
    onChangeGestion(event) {
        this.setState({
            idgestion: event,
        });
        this.getGestion(event);
    }
    onChangePeriodo(event) {
        this.setState({
            idperiodo: event,
        });
    }
    onDeleteMoneda() {
        this.setState({
            idmoneda: '',
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
        if (event >= this.state.fechainicio) {
            this.setState({
                fechafin: event,
            });
        }else {
            message.warning('Fecha Invalido!!!');
        }
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }
    generarReporte(event) {
        event.preventDefault();
        if (this.state.fechainicio != '' && this.state.checkedKeys.length > 0 &&
            this.state.fechafin != ''
        ) {
            document.getElementById('imprimir').submit();
        }else {
           message.error('Favor de ingresar y seleccionar datos!!!');
            
        }
    }
    LimpiarData(event) {
        event.preventDefault();
        this.setState({
            fechainicio: '',
            fechafin: '',

            idgestion: '',
            idperiodo: '',
            nameperiodo: '',

            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],

            checked_gestion: false,
            checked_periodo: false,
            checked_saldo_mayor: false,

            exportar: 'N',
        });
        this.get_data();
    }
    onClickDropDownCodCuenta() {
        this.setState({
            dropdowncodcuenta: !this.state.dropdowncodcuenta,
        });
        if (!this.state.dropdowncodcuenta) {
            this.setState({
                searchnamecuenta: '',
                searchcodigocuenta: '',
                expandedKeys: [],
                autoExpandParent: false,
            });
        }
    }
    onClickDropDownCuenta() {
        this.setState({
            dropdowncuenta: !this.state.dropdowncuenta,
        });
        if (!this.state.dropdowncuenta) {
            this.setState({
                searchnamecuenta: '',
                searchcodigocuenta: '',
                expandedKeys: [],
                autoExpandParent: false,
            });
        }
    }
    
    onClickDropDownPeriodo() {
        if (!this.state.checked_gestion && this.state.checked_periodo) {
            this.setState({
                dropdownperiodo: !this.state.dropdownperiodo,
            });
        }
    }
    renderTreeNodeCodCuenta(data) {
        var array = [];
        data.map(item => {
            if (item.children) {
                array.push(
                    <TreeNode title={item.title} key={item.value} dataRef={item}>
                        {this.renderTreeNodeCodCuenta(item.children)}
                    </TreeNode>
                );
            }
        });
        return array;
    }
    renderTreeNodeCuenta(data) {
        var array = [];
        data.map(item => {
            if (item.children) {
                var numniveles = this.state.config.nivel;
                var nivel = item.nivel;
                //if (nivel <= numniveles) {
                    array.push(
                        <TreeNode title={item.title} key={item.value} dataRef={item}>
                            {this.renderTreeNodeCuenta(item.children)}
                        </TreeNode>
                    );
                //}
            }
        });
        return array;
    }
    evaluarTreeCuenta(data, id, array) {
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            if (array.length == 0) {
                if (data[i].value == id) {
                    if (data[i].children.length == 0) {
                        array.push(array.length + 1);
                    }
                }
                this.evaluarTreeCuenta(data[i].children, id, array);  
            }
        }
    }
    onCheck(checkedKeys) {
        var array = [];
        checkedKeys.map(
            data => {
                var cantidad = [];
                this.evaluarTreeCuenta(this.state.cuenta, data, cantidad);
                if (cantidad.length > 0) {
                    array.push(data);
                }
            }
        );
        this.setState({ 
            checkedKeys: array 
        });
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onChangeCheckedGestion(event) {
        var gestion = this.state.gestion;
        var fechainicio = (gestion.length > 0)?convertYmdToDmy(gestion[0].fechaini):'';
        var fechafin = (gestion.length > 0)?convertYmdToDmy(gestion[0].fechafin):'';
        this.setState({
            checked_gestion: !this.state.checked_gestion,
        });
        if (!this.state.checked_gestion) {
            this.setState({
                fechainicio: fechainicio,
                fechafin: fechafin,
                idgestion: '',
                idperiodo: '',
                nameperiodo: '',
                checked_periodo: false,
                disabled_periodo: true,
            });
        }else {
            this.setState({
                disabled_periodo: false,
                fechainicio: '',
                fechafin: '',
            });
        }
    }
    onChangeCheckedPeriodo(event) {
        this.setState({
            checked_periodo: !this.state.checked_periodo,
        });
        if (!this.state.checked_periodo) {
            this.setState({
                fechainicio: '',
                fechafin: '',
                checked_gestion: false,
                disabled_gestion: true,
            });
        }else {
            this.setState({
                disabled_gestion: false,
                fechainicio: '',
                fechafin: '',
            });
        }
    }
    onChangeCheckedSaldoMayor(event) {
        this.setState({
            checked_saldo_mayor: !this.state.checked_saldo_mayor,
        });
    }
    onClickPeriodo(periodo) {
        this.setState({
            idgestion: periodo.fkidgestioncontable,
            idperiodo: periodo.idperiodocontable,
            nameperiodo: periodo.descripcion,
            fechainicio: convertYmdToDmy(periodo.fechaini),
            fechafin: convertYmdToDmy(periodo.fechafin),
            dropdownperiodo: false,
        });
    }
    onChangeCodCuenta(event) {
        this.setState({
            searchcodigocuenta: event,
        });
        if (event == '') {
            this.setState({
                expandedKeys: [],
                autoExpandParent: false,
            });
        }else {
            this.onSearchCodCuenta(event);
        }
    }
    onSearchCodCuenta(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarCodCuenta(value); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    verificarCodCuenta(value) {
        var body = {
            codigo: value,
        };
        httpRequest('post', ws.wscuentaplan + '/get_codigo', body)
        .then((result) => {
            if (result.response == 1) {
                var array = [];
                result.data.map(
                    (data) => {
                        var cantidad = [];
                        this.TieneChildrenTree(this.state.cuenta, data.idcuentaplan, cantidad);
                        if (cantidad.length > 0) {
                            array.push(data.idcuentaplan.toString());
                        }
                    }
                );
                this.setState({
                    expandedKeys: array,
                    autoExpandParent: false,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    onChangeNameCuenta(event) {
        this.setState({
            searchnamecuenta: event,
        });
        if (event == '') {
            this.setState({
                expandedKeys: [],
                autoExpandParent: false,
            });
        }else {
            this.onSearchNameCuenta(event);
        }
    }
    onSearchNameCuenta(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => { this.verificarNameCuenta(value); }, 400);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    verificarNameCuenta(value) {
        var body = {
            nombre: value,
        };
        httpRequest('post', ws.wscuentaplan + '/get_cuenta', body)
        .then((result) => {
            if (result.response == 1) {

                var array = [];

                result.data.map(
                    (data) => {
                        var arrayidcuenta = [];
                        arrayidcuenta.push(data.idcuentaplan.toString());

                        this.TieneChildrenTree(this.state.cuenta, arrayidcuenta);

                        arrayidcuenta.splice(0, 1);

                        Array.prototype.push.apply(array, arrayidcuenta);

                        array = [...new Set(array)]
                    }
                );
                this.setState({
                    expandedKeys: array,
                    autoExpandParent: false,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    TieneChildrenTree(data, array) {
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {

            this.TieneChildrenTree(data[i].children, array);

            for (var j = 0; j < data[i].children.length; j++) {

                var idcuenta = data[i].children[j].value.toString();
                var id = array[array.length - 1];

                if (idcuenta == id) {
                    array.push(data[i].value.toString());
                    j = data[i].children.length;
                }
            }
            
        }
    }
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));

        const usuario = user == null ? '' :
            (user.apellido == null)?user.nombre:user.nombre + ' ' + user.apellido;

        const x_idusuario =  user == null ? 0 : user.idusuario;
        const x_grupousuario = user == null ? 0 : user.idgrupousuario;
        const x_login = user == null ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';


        const menu_codcuenta = (
            <Menu className='scrollbars' id={`styles-scrollbar`}>
                <div className='forms-groups' style={{paddingRight: 8, paddingLeft: 8, maxWidth: '100%'}}>
                    <C_Input 
                        className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0'
                        style={{paddingRight: 20,}}
                        suffix={
                            <Icon type='search'/>
                        }
                        placeholder='Escribir cod cuenta ...'
                        value={this.state.searchcodigocuenta}
                        onChange={this.onChangeCodCuenta.bind(this)}
                    />
                </div>
                <Tree
                    checkable
                    onExpand={this.onExpand.bind(this)}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={
                        (selectedKeys, info) => {
                            console.log('onSelect', info);
                            this.setState({ selectedKeys });
                        }
                    }
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.renderTreeNodeCodCuenta(this.state.codcuenta)}
                </Tree>
            </Menu>
        );

        const menu_cuenta = (
            <Menu className='scrollbars' id={`styles-scrollbar`}>
                <div className='forms-groups' style={{paddingRight: 8, paddingLeft: 8, maxWidth: '100%'}}>
                    <C_Input 
                        className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0'
                        style={{paddingRight: 20,}}
                        suffix={
                            <Icon type='search'/>
                        }
                        placeholder='Escribir cuenta ...'
                        value={this.state.searchnamecuenta}
                        onChange={this.onChangeNameCuenta.bind(this)}
                    />
                </div>
                <Tree
                    checkable
                    onExpand={this.onExpand.bind(this)}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={
                        (selectedKeys, info) => {
                            //console.log('onSelect', info);
                            this.setState({ selectedKeys });
                        }
                    }
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.renderTreeNodeCuenta(this.state.cuenta)}
                </Tree>
            </Menu>
        );

        const menu_periodo = (
            <Menu>
                {this.state.array_periodo.map(
                    (data, key) => (
                        <div className="forms-groups" key={key}>
                            <div className="nav-link-perfil" 
                                style={{textAlign: 'center', fontWeight: 'bold'}}>
                                Gestion - {data.descripcion}
                            </div>

                            {data.periodo.map(
                                (periodo, keys) => (
                                    <div className="nav-link-perfil" key={'0' + keys}>
                                        <a className={`nav-link-option 
                                                ${(this.state.idperiodo != periodo.idperiodocontable)?
                                                    '':'selected'}`
                                            }
                                            onClick={this.onClickPeriodo.bind(this, periodo)}
                                            style={{textAlign: 'center',}}
                                        >
                                            {periodo.descripcion}
                                        </a>
                                    </div>
                                )
                            )}

                        </div>
                        // <Menu.Item key={key}>
                        //     {data.descripcion}
                        // </Menu.Item>
                    )
                )}
            </Menu>
        ); 

        return (
            <div className="rows">
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title"> Libro Mayor </h1>
                    </div>
                    <form action={routes.libro_mayor + '/reporte'} target="_blank" method='post'
                        id='imprimir' style={{display: 'none',}}>

                        <input type="hidden" value={_token} name="_token" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />
                        <input type='hidden' value={usuario} name='usuario' />

                        <input type='hidden' value={this.state.exportar} name='exportar' />

                        <input type='hidden' value={convertDmyToYmd(this.state.fechainicio)} name='fechainicio' />
                        <input type='hidden' value={convertDmyToYmd(this.state.fechafin)} name='fechafin' />
                        <input type='hidden' value={this.state.idmoneda} name='idmoneda' />
                        <input type='hidden' value={this.state.name_moneda} name='name_moneda' />

                        <input type='hidden' value={JSON.stringify(this.state.checkedKeys)} name='idcuenta' />
                        <input type='hidden' value={this.state.checked_saldo_mayor} name='saldo_mayor' />

                    </form>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            
                            {/* <Dropdown overlay={menu_codcuenta} trigger={['click']} 
                                visible={this.state.dropdowncodcuenta}
                                onVisibleChange={this.onClickDropDownCodCuenta.bind(this)}
                            >
                                <C_Input 
                                    className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                                    value={
                                        (this.state.checkedKeys.length == 0)?
                                            'Seleccionar Cod Cuenta':'Ver Cod Cuenta'
                                    }
                                    readOnly={true}
                                    style={{cursor: 'pointer'}}
                                />
                            </Dropdown> */}

                            <div className='cols-lg-2 cols-md-2'></div>

                            <Dropdown overlay={menu_cuenta} trigger={['click']} 
                                visible={this.state.dropdowncuenta}
                                onVisibleChange={this.onClickDropDownCuenta.bind(this)}
                            >
                                <C_Input 
                                    className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                                    value={
                                        (this.state.checkedKeys.length == 0)?
                                            'Seleccionar Cuenta':'Ver Cuenta'
                                    }
                                    readOnly={true}
                                    style={{cursor: 'pointer'}}
                                />
                            </Dropdown>

                            <C_Select
                                showSearch={true}
                                value={
                                    (this.state.idmoneda == '')?
                                        undefined:this.state.idmoneda
                                }
                                placeholder={"Seleccionar..."}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                //onSearch={this.onSearchProducto.bind(this)}
                                onChange={this.onChangeMoneda.bind(this)}
                                component={
                                    this.state.moneda.map(
                                        (data, key) => (
                                            <Option key={key} value={data.idmoneda}>
                                                {data.descripcion}
                                            </Option>
                                        )
                                    )
                                }
                                title="Moneda"
                            />
                        </div>
                        
                        <div>
                            <Divider orientation="left"
                                style={{fontFamily: 'Roboto', fontWeight: 'normal'}}
                            >
                                Seleccionar
                            </Divider>
                        </div>

                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>

                            {/* <C_Select
                                showSearch={true}
                                value={
                                    (this.state.idgestion == '')?
                                        undefined:this.state.idgestion
                                }
                                placeholder={"Seleccionar..."}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                //onSearch={this.onSearchProducto.bind(this)}
                                onChange={this.onChangeGestion.bind(this)}
                                component={
                                    this.state.gestion.map(
                                        (data, key) => (
                                            <Option key={key} value={data.idgestioncontable}>
                                                {data.descripcion}
                                            </Option>
                                        )
                                    )
                                }
                                title="Gestion"
                            /> */}

                            <C_Input 
                                value='Gestion'
                                readOnly={true}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'
                                style={{cursor: 'pointer', 
                                    background: (this.state.checked_periodo)?'#F5F5F5':'white',
                                }}
                                onClick={this.onChangeCheckedGestion.bind(this)}
                                suffix={
                                    <C_CheckBox
                                        style={{marginTop: -5,}}
                                        onChange={this.onChangeCheckedGestion.bind(this)}
                                        checked={this.state.checked_gestion}
                                        disabled={this.state.disabled_gestion}
                                    />
                                }
                            />

                            <Dropdown overlay={menu_periodo} trigger={['click']} 
                                visible={this.state.dropdownperiodo}
                                onVisibleChange={this.onClickDropDownPeriodo.bind(this)}
                            >
                                <C_Input 
                                    value={
                                        (this.state.checked_periodo)?
                                            (this.state.nameperiodo == '')?
                                                'Periodo':this.state.nameperiodo
                                            :'Activar Periodo'
                                    }
                                    readOnly={true}
                                    className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'
                                    style={{cursor: 'pointer', 
                                        background: (this.state.checked_gestion)?'#F5F5F5':'white',
                                    }}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -5,}}
                                            onChange={this.onChangeCheckedPeriodo.bind(this)}
                                            checked={this.state.checked_periodo}
                                            disabled={this.state.disabled_periodo}
                                        />
                                    }
                                />
                            </Dropdown>

                            {/* <C_Select
                                showSearch={true}
                                value={
                                    (this.state.idperiodo == '')?
                                        undefined:this.state.idperiodo
                                }
                                placeholder={"Seleccionar..."}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                //onSearch={this.onSearchProducto.bind(this)}
                                onChange={this.onChangePeriodo.bind(this)}
                                component={
                                    this.state.periodo.map(
                                        (data, key) => (
                                            <Option key={key} value={data.idperiodocontable}>
                                                {data.descripcion}
                                            </Option>
                                        )
                                    )
                                }
                                title="Periodo"
                            /> */}

                            <C_DatePicker
                                allowClear={true}
                                value={this.state.fechainicio}
                                onChange={this.onChangeFechaInicio.bind(this)}
                                title="Fecha Inicio"
                                readOnly={
                                    (this.state.checked_gestion || this.state.checked_periodo)?
                                        true:false
                                }
                            />

                            <C_DatePicker
                                allowClear={true}
                                value={this.state.fechafin}
                                onChange={this.onChangeFechaFin.bind(this)}
                                title="Fecha Final"
                                readOnly={
                                    (this.state.fechainicio == '' || this.state.checked_gestion || 
                                        this.state.checked_periodo
                                    )?
                                        true:false
                                }
                            />
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='cols-lg-3 cols-md-3'></div>
                        <C_Input 
                            value='Saldo Acumulado'
                            readOnly={true}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom'
                            style={{cursor: 'pointer', 
                                background: 'white',
                            }}
                            onClick={this.onChangeCheckedSaldoMayor.bind(this)}
                            suffix={
                                <C_CheckBox
                                    onChange={this.onChangeCheckedSaldoMayor.bind(this)}
                                    checked={this.state.checked_saldo_mayor}
                                    style={{marginTop: -5,}}
                                />
                            }
                        />
                        <C_Select
                            title='Exportar A'
                            value={this.state.exportar}
                            onChange={this.onChangeExportar.bind(this)}
                            component={[
                                <Option key={0} value={'N'}>Seleccionar</Option>,
                                <Option key={1} value={'P'}>PDF</Option>,
                                <Option key={2} value={'E'}>ExCel</Option>,
                            ]}
                        />
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title='Limpiar'
                                type='primary'
                                onClick={this.LimpiarData.bind(this)}
                            />
                            <C_Button title='Generar Libro'
                                type='primary'
                                onClick={this.generarReporte.bind(this)}
                            />
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title=''
                                type='primary'
                                style={{width: '100%', padding: 10}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(IndexLibroMayor);

