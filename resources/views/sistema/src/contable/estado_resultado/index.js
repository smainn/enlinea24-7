
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

class IndexEstadoResultado extends Component {
    constructor(props){
        super(props)
        this.state = {

            fechainicio: '',
            fechafin: '',

            fechainicio_origen: '',
            fechafin_origen: '',

            idmoneda: '',
            name_moneda: '',

            moneda: [],

            exportar: 'N',
            nivel: '',
            checked_show_codigo: false,

            noSesion: false,
        }
    }
    componentDidMount(){
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsestadoresultado + '/create').then(
            response => {
                if (response.response == 1) {
                    var cantmoneda = response.moneda.length;
                    var idmoneda = (cantmoneda > 0)?response.moneda[0].idmoneda:'';
                    var name_moneda = (cantmoneda > 0)?response.moneda[0].descripcion:'';
                    this.setState({
                        idmoneda: idmoneda,
                        name_moneda: name_moneda,
                        nivel: (response.config == null)?'':response.config.numniveles,
                        fechainicio_origen: (response.gestion == null)?'':convertYmdToDmy(response.gestion.fechaini),
                        fechainicio: (response.gestion == null)?'':convertYmdToDmy(response.gestion.fechaini),

                        fechafin_origen: (response.gestion == null)?'':convertYmdToDmy(response.gestion.fechafin),
                        fechafin: (response.gestion == null)?'':convertYmdToDmy(response.gestion.fechafin),

                        moneda: response.moneda,
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
    onChangeFechaInicio(event) {
        if (this.state.fechainicio_origen != '') {
            if (convertDmyToYmd(event) >= convertDmyToYmd(this.state.fechainicio_origen)) {
                this.setState({
                    fechainicio: event,
                });
            }else {
                message.warning('No se permite fecha menor a la gestion');
            }
        }else {
            message.error('No existe registro de gestion');
        }
    }
    onChangeFechaFin(event) {
        if (convertDmyToYmd(event) <= convertDmyToYmd(this.state.fechafin_origen)) {
            if (convertDmyToYmd(event) >= convertDmyToYmd(this.state.fechainicio)) {
                this.setState({
                    fechafin: event,
                });
            }else {
                message.warning('Fecha Invalido!!!');
            }
        }else {
            message.warning('No se permite fecha mayor a la gestion');
        }
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
    onChangeCheckedShowCodigo(event) {
        this.setState({
            checked_show_codigo: !this.state.checked_show_codigo,
        });
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }
    onLimpiar() {
        this.setState({
            fechainicio: '',
            fechafin: '',
            exportar: 'N',
            nivel: '',
            checked_show_codigo: false,
        });
        this.get_data();
    }
    generarReporte(event) {
        event.preventDefault();
        if (this.state.fechainicio != '' && this.state.fechafin != '') {
            document.getElementById('imprimir').submit();
        }else {
           message.error('Favor de ingresar y seleccionar datos!!!');
            
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

        return (
            <div className="rows">
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title"> Estado de Resultados </h1>
                    </div>
                    <form action={routes.estado_resultado + '/imprimir'} target="_blank" method='post'
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

                        <input type='hidden' value={this.state.fechainicio} name='fechainicio' />
                        <input type='hidden' value={this.state.fechafin} name='fechafin' />
                        <input type='hidden' value={this.state.idmoneda} name='idmoneda' />
                        <input type='hidden' value={this.state.name_moneda} name='name_moneda' />
                        <input type='hidden' value={this.state.exportar} name='exportar' />
                        <input type='hidden' 
                            value={this.state.checked_show_codigo} name='checked_show_codigo' 
                        />

                    </form>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='cols-lg-2 cols-md-2'></div>
                        <C_DatePicker
                            allowClear={true}
                            value={this.state.fechainicio}
                            onChange={this.onChangeFechaInicio.bind(this)}
                            title="Fecha Inicio"
                        />

                        <C_DatePicker
                            allowClear={true}
                            value={this.state.fechafin}
                            onChange={this.onChangeFechaFin.bind(this)}
                            title="Fecha Final"
                            readOnly={
                                (this.state.fechainicio == '')?
                                    true:false
                            }
                        />
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
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='cols-lg-2 cols-md-2'></div>
                        <C_Input 
                            value='Mostrar Codigos'
                            readOnly={true}
                            style={{cursor: 'pointer', 
                                background: 'white',
                            }}
                            onClick={this.onChangeCheckedShowCodigo.bind(this)}
                            suffix={
                                <C_CheckBox
                                    onChange={this.onChangeCheckedShowCodigo.bind(this)}
                                    checked={this.state.checked_show_codigo}
                                    style={{marginTop: -3, left: 5}}
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
                                onClick={this.onLimpiar.bind(this)}
                            />
                            <C_Button title='Generar EERR'
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

export default withRouter(IndexEstadoResultado);

