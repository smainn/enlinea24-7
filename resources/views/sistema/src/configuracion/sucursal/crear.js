
import React, { Component } from 'react';

import { message, Select } from 'antd';
import "antd/dist/antd.css"; 
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import routes from '../../utils/routes';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import strings from '../../utils/strings';
import ws from '../../utils/webservices';
import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import Confirmation from '../../componentes/confirmation';
import { withRouter, Redirect } from 'react-router-dom';

const {Option} = Select;

class Crear_Sucursal extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible_cancelar: false,
            visible_submit: false,
            loading: false,

            tipoempresa: 'N',
            tiposucursal: 'S',
            nombrecomercial: '',
            razonsocial: '',

            nit: '',
            nombre: '',
            apellido: '',

            idpais: '',
            idciudad: '',
            zona: '',
            direccion: '',

            telefono: '',
            logotipo: '',

            array_pais: [],
            array_ciudad: [],

            array_general_ciudad: [],

            noSesion: false,
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wssucursal + '/create')
        .then(result => {
            if ( result.response == 1) {

                var array_pais = [];
                var array_ciudad = [];
                var bandera = true;

                for (var i = 0; i < result.ciudad.length; i++) {
                    var data = result.ciudad[i];
                    if (data.idpadreciudad == null) {
                        var elem = {
                            descripcion: data.descripcion,
                            idciudad: data.idciudad,
                        };
                        array_pais.push(elem);
                        if (bandera) {
                            array_ciudad = this.cargarCiudad(result.ciudad, data.idciudad);
                            bandera = false;
                        }
                    }
                }

                this.setState({
                    array_pais: array_pais,
                    idpais: (array_pais.length > 0)?array_pais[0].idciudad:'',

                    array_ciudad: array_ciudad,
                    idciudad: (array_ciudad.length > 0)?array_ciudad[0].value:'',
                    array_general_ciudad: result.ciudad,
                });

            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }
        })
        .catch(error => {
            console.log(error)
            message.error(strings.message_error);
        });
    }
    cargarCiudad(array_ciudad, idciudad) {
        var array_aux = [];
        for (var i = 0; i < array_ciudad.length; i++) {
            if (array_ciudad[i].idpadreciudad == idciudad) {
                var elem = {
                    title: array_ciudad[i].descripcion,
                    value: array_ciudad[i].idciudad,
                };
                array_aux.push(elem);
            }
        }
        this.treeCiudad(array_aux, array_ciudad);
        return array_aux;
    }
    treeCiudad(data, array_ciudad) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childreenCiudad(data[i].value, array_ciudad);
            data[i].children = hijos;
            this.treeCiudad(hijos, array_ciudad);
        }
    }
    childreenCiudad(idpadre, array_ciudad) {
        var array =  array_ciudad;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadreciudad == idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idciudad,
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    onChangeTipoEmpresa(value) {
        if (value == 'J') {
            this.setState({
                tipoempresa: value,
                nombrecomercial: '',
                nombre: '',
                apellido: '',
            });
        }
        if (value == 'N') {
            this.setState({
                tipoempresa: value,
                razonsocial: '',
            });
        }
    }
    onChangeTipoSucursal(value) {
        this.setState({
            tiposucursal: value,
        });
    }
    onChangeNombreComercial(value) {
        this.setState({
            nombrecomercial: value,
        });
    }
    onChangeRazonSocial(value) {
        this.setState({
            razonsocial: value,
        });
    }
    onChangeNit(value) {
        this.setState({
            nit: value,
        });
    }
    onChangeNombre(value) {
        this.setState({
            nombre: value,
        });
    }
    onChangeApellido(value) {
        this.setState({
            apellido: value,
        });
    }
    onChangeIDPais(value) {
        var array_ciudad = this.cargarCiudad(this.state.array_general_ciudad, value);
        this.setState({
            idpais: value,
            idciudad: (array_ciudad.length > 0)?array_ciudad[0].value:'',
            array_ciudad: array_ciudad,
        });
    }
    onChangeIDCiudad(value) {
        this.setState({
            idciudad: value,
        });
    }
    onChangeZona(value) {
        this.setState({
            zona: value,
        });
    }
    onChangeDireccion(value) {
        this.setState({
            direccion: value,
        });
    }
    onChangeTelefono(value) {
        if (!isNaN(value)) {
            this.setState({
                telefono: value,
            });
        }
    }
    onChangeLogoTipo(value) {
        this.setState({
            logotipo: value,
        });
    }
    componentPais() {
        var array = [];
        for (let i = 0; i < this.state.array_pais.length; i++) {
            var data = this.state.array_pais[i];
            array.push(
                <Option key={i} value={data.idciudad}> {data.descripcion} </Option>
            );
        }
        return array;
    }
    onClose() {
        this.setState({
            visible_cancelar: false,
            visible_submit: false,
        });
    }
    onSalir(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 400);
    }
    componentModalCancelar() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registro"
                onCancel={this.onClose.bind(this)}
                onClose={this.onClose.bind(this)}
                onClick={this.onSalir.bind(this)}
                width={400}
                content={
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <label>
                            ¿Esta seguro de cancelar el registro del sucursal?
                        </label>
                    </div>
                }
            />
        );
    }
    onValidarData() {
        this.setState({
            visible_submit: true,
        });
    }
    componentModalSubmit() {
        return (
            <Confirmation
                visible={this.state.visible_submit}
                loading={this.state.loading}
                title="Guardar Registro"
                onCancel={this.onClose.bind(this)}
                onClick={this.onSubmit.bind(this)}
                width={400}
                content={
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <label>
                            ¿Esta seguro de guardar los registro del sucursal?
                        </label>
                    </div>
                }
            />
        );
    }
    onSubmit() {
        this.setState({
            loading: true,
        });
        let body = {
            tipoempresa: this.state.tipoempresa,
            tiposucursal: this.state.tiposucursal,
            nombrecomercial: this.state.nombrecomercial,
            razonsocial: this.state.razonsocial,
            nit: this.state.nit,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            idpais: this.state.idpais,
            idciudad: this.state.idciudad,
            zona: this.state.zona,
            direccion: this.state.direccion,
            telefono: this.state.telefono,
            logotipo: this.state.logotipo,
        };
        httpRequest('post',  ws.wssucursal + '/store', body)
        .then((result) => {
            if (result.response == 1) {             
                message.success('exito en guardar los datos');
                this.props.history.goBack();
            }
            if (result.response == 0) {
                message.success('Ocurrio un problema en el servidor');
            }
            if (result.response == 2) {
                this.setState({
                    validar_chasis: 0,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            }
            this.onClose();
        }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            }
        );
    }
    render(){
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                {this.componentModalCancelar()}
                {this.componentModalSubmit()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Registrar Sucursal</h1>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Select 
                                title='Tipo Empresa'
                                value={this.state.tipoempresa}
                                onChange={this.onChangeTipoEmpresa.bind(this)}
                                component={[
                                    <Option key={0} value={'N'}>Natural</Option>,
                                    <Option key={1} value={'J'}>Juridico</Option>
                                ]}
                            />
                            <C_Select 
                                title='Tipo Sucursal'
                                value={this.state.tiposucursal}
                                onChange={this.onChangeTipoSucursal.bind(this)}
                                component={[
                                    <Option key={0} value={'S'}>Sucursal</Option>,
                                    <Option key={1} value={'M'}>Matriz</Option>
                                ]}
                            />
                            {(this.state.tipoempresa == 'J')?
                                <C_Input 
                                    title='Razon social'
                                    value={this.state.razonsocial}
                                    onChange={this.onChangeRazonSocial.bind(this)}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                                />:
                                <C_Input 
                                    title='Nombre Comercial'
                                    value={this.state.nombrecomercial}
                                    onChange={this.onChangeNombreComercial.bind(this)}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                                />
                            }
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title='Nit'
                                value={this.state.nit}
                                onChange={this.onChangeNit.bind(this)}
                            />
                            {(this.state.tipoempresa == 'N')?
                                <C_Input 
                                    title='Nombre'
                                    value={this.state.nombre}
                                    onChange={this.onChangeNombre.bind(this)}
                                />:null
                            }
                            {(this.state.tipoempresa == 'N')?
                                <C_Input 
                                    title='Apellido'
                                    value={this.state.apellido}
                                    onChange={this.onChangeApellido.bind(this)}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                                />:null
                            }
                            <C_Select 
                                title='Pais'
                                value={this.state.idpais}
                                onChange={this.onChangeIDPais.bind(this)}
                                component={this.componentPais()}
                            />
                            <C_TreeSelect
                                title="Ciudad"
                                value={this.state.idciudad}
                                treeData={this.state.array_ciudad}
                                onChange={this.onChangeIDCiudad.bind(this)}
                            />
                            <C_Input 
                                title='Zona'
                                value={this.state.zona}
                                onChange={this.onChangeZona.bind(this)}
                            />
                            <C_Input 
                                title='Direccion'
                                value={this.state.direccion}
                                onChange={this.onChangeDireccion.bind(this)}
                            />
                            <C_Input 
                                title='Telefono'
                                value={this.state.telefono}
                                onChange={this.onChangeTelefono.bind(this)}
                            />
                            <C_Input 
                                title='Logo Tipo URL'
                                value={this.state.logotipo}
                                onChange={this.onChangeLogoTipo.bind(this)}
                                className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button title='Aceptar'
                                    type='primary'
                                    onClick={this.onValidarData.bind(this)}
                                />
                                <C_Button title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({ visible_cancelar: true, })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Crear_Sucursal);

