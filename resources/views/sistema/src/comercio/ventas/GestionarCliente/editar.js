
import React, { Component } from 'react';

import {Redirect, withRouter} from 'react-router-dom';
import { message } from 'antd';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import "antd/dist/antd.css";

import CImage from '../../../componentes/image';

import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import { convertDmyToYmd, convertYmdToDmy } from '../../../utils/toolsDate';
import Confirmation from '../../../componentes/confirmation';
import C_DatePicker from '../../../componentes/data/date';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_TextArea from '../../../componentes/data/textarea';

class EditarCliente extends Component{

    constructor(props){
        super(props)
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            codigo: '',
            idtipocliente: '',
            tipopersoneria: 'S',
            fechanacimiento: '',
            nombre: '',
            apellido: '',
            nit :'',
            genero: 'N',
            idciudad: '',
            imagen: '',
            contacto: '',
            nota: '',

            validar_nombre: 1,

            array_tipo_cliente: [],
            array_ciudad: [],
            array_ciudad_tree: [],
            array_contacto: [],
            array_contacto_select: ['', '', ''],
            array_contacto_descripcion: ['', '', ''],

            idParaContactarlo:[],
            idParaContactarloEliminar:[],

            noSesion: false,
        }

        this.permisions = {
            codigo: readPermisions(keys.cliente_input_codigo),
            tipo: readPermisions(keys.cliente_select_tipoCliente),
            fecha_nac: readPermisions(keys.cliente_fechaNacimiento),
            personeria: readPermisions(keys.cliente_select_tipoPersoneria),
            caracteristicas: readPermisions(keys.cliente_caracteristicas),
            nombre: readPermisions(keys.cliente_input_nombre),
            apellido: readPermisions(keys.cliente_input_apellido),
            nit: readPermisions(keys.cliente_input_nit),
            genero: readPermisions(keys.cliente_select_genero),
            ciudad: readPermisions(keys.cliente_select_ciudad),
            imagen: readPermisions(keys.cliente_imagenes),
            contacto: readPermisions(keys.cliente_textarea_contactos),
            observaciones: readPermisions(keys.cliente_textarea_observaciones)
        }
    }
    componentDidMount(){
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wscliente + '/' + this.props.match.params.id+'/edit')
        .then(result => {
            if (result.response == 1) {
                //console.log(result)
                result.cliente_contacto.map(
                    (data, key) => {
                        this.state.array_contacto_select[key] = data.fkidreferenciadecontacto;
                        this.state.array_contacto_descripcion[key] = data.valor;
                        this.state.idParaContactarlo[key] = data.idclientecontactarlo;
                    }
                );
                this.setState({

                    codigo: (result.config.codigospropios) ? result.data.codcliente : result.data.idcliente,
                    idtipocliente: result.data.fkidclientetipo,
                    fechanacimiento: (result.data.fechanac == null)?'':convertYmdToDmy(result.data.fechanac),
                    nombre: result.data.nombre,
                    apellido: (result.data.apellido == null)?'':result.data.apellido,
                    nit: (result.data.nit == null)?'':result.data.nit,
                    genero: result.data.sexo,
                    idciudad: result.data.fkidciudad,
                    imagen: (result.data.foto == null)?'':result.data.foto,
                    contacto: (result.data.contacto == null)?'':result.data.contacto,
                    nota: (result.data.notas == null)?'':result.data.notas,

                    array_tipo_cliente: result.tipo_cliente,
                    array_ciudad: result.ciudad,
                    array_contacto: result.referencia_contacto,
                    array_contacto_select: this.state.array_contacto_select,
                    array_contacto_descripcion: this.state.array_contacto_descripcion,
                    idParaContactarlo: this.state.idParaContactarlo,
                });
                this.cargarTree(result.ciudad);
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Error al traer los datos');
            }
            
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    cargarTree(data) {
        var array_aux = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].idpadreciudad == null) {
                var elem = {
                    title: data[i].descripcion,
                    value: data[i].idciudad,
                };
                array_aux.push(elem);
            }
        }
        this.treeCiudad(array_aux);
        this.setState({
            array_ciudad_tree: array_aux
        });
    }
    treeCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childreenCiudad(data[i].value);
            data[i].children = hijos;
            this.treeCiudad(hijos);
        }
    }
    childreenCiudad(idpadre) {
        var array =  this.state.array_ciudad;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadreciudad == idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idciudad
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    onChangeClienteTipo(event) {
        this.setState({
            idtipocliente: event,
        });
    }
    onChangeClientePersoneria(event) {
        this.setState({
            tipopersoneria: event,
        });
    }
    onChangeFechaNacimiento(event) {
        this.setState({
            fechanacimiento: event,
        });
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event,
            validar_nombre: 1,
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event,
        });
    }
    onChangeNitCI(event) {
        this.setState({
            nit: event,
        });
    }
    onChangeGenero(event) {
        this.setState({
            genero: event,
        });
    }
    onChangeCiudad(event) {
        this.setState({
            idciudad: event,
        });
    }
    componentTipoCliente() {
        let data = this.state.array_tipo_cliente;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idclientetipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array;
    }
    handleAddRow() {
        this.setState({
            array_contacto_descripcion: [
                ...this.state.array_contacto_descripcion,
                ""
            ],
            array_contacto_select: [
                ...this.state.array_contacto_select,
                ''
            ]
        });
    }
    handleRemoveRow(i) {
        this.state.array_contacto_select.splice(i, 1);
        this.state.array_contacto_descripcion.splice(i, 1);
        var idEliminar = this.state.idParaContactarlo[i];
        if(typeof idEliminar != 'undefined'){
            this.state.idParaContactarloEliminar.push(idEliminar);
        }
        this.state.idParaContactarlo.splice(i, 1);
        this.setState({
            array_contacto_select: this.state.array_contacto_select,
            array_contacto_descripcion: this.state.array_contacto_descripcion,
            idParaContactarlo: this.state.idParaContactarlo,
            idParaContactarloEliminar: this.state.idParaContactarloEliminar,
        });
    }
    cambioReferenciaSelect(event){
        let index = event.id;
        let value = event.value;
        if (value == '') {
            this.state.array_contacto_descripcion[index] = "";
            this.state.array_contacto_select[index] = "";
            this.setState({
                array_contacto_descripcion: this.state.array_contacto_descripcion,
                array_contacto_select: this.state.array_contacto_select,
            });
        } else {
            this.state.array_contacto_select[index] = parseInt(value);
            this.state.array_contacto_descripcion[index] = "";
            this.setState({
                array_contacto_select: this.state.array_contacto_select,
                array_contacto_descripcion: this.state.array_contacto_descripcion,
            });
        }
    }
    cambioDescripcionInput(event) {
        let posicion = event.id;
        let value = event.value;
        if (typeof this.state.array_contacto_select[posicion] == 'undefined' || this.state.array_contacto_select[posicion] == "" || 
            this.state.array_contacto_select[posicion] == '') {
            message.warning('Seleccione una opcion para poder seguir ');
        } else {
            this.state.array_contacto_descripcion[posicion] = value;
            this.setState({
                array_contacto_descripcion: this.state.array_contacto_descripcion,
            });
        }
    }
    onChangeImagen(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    fotocliente: e.target.result,
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }
    eliminarImagen() {
        this.setState({
            imagen: ''
        });
    }
    onChangeContacto(event) {
        this.setState({
            contacto: event,
        });
    }
    onChangeNota(event) {
        this.setState({
            nota: event,
        });
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        })
    }
    onSalir(event) {
        event.preventDefault();
        this.props.history.goBack();
    }
    componenetOption() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Cancelar Editar Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro del cliente?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    ]}
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Actualizar Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onUpdate.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de actualizar los datos del cliente?
                            </label>
                        </div>
                    ]}
                />
            );
        }
    }
    validarData() {
        if (this.state.nombre.toString().trim().length > 0) {
            this.setState({
                visible: true,
                bandera: 2,
            });
        }else {
            message.error('El nombre es obligatorio');
            this.setState({
                validar_nombre: 0,
            });
        }
    }
    validarRferenciaContacto() {
        if (this.state.array_contacto_descripcion.length > 0) {
            var array = []
            for (let i = 0; i < this.state.array_contacto_descripcion.length; i++) {
                
                if (String(this.state.array_contacto_descripcion[i]).trim().length > 0 && 
                    String(this.state.array_contacto_select[i]).trim().length > 0 && 
                    typeof this.state.array_contacto_select[i] != 'undefined' && 
                    typeof this.state.array_contacto_descripcion[i] != 'undefined')
                {
                    var referenciaDesc = {
                        "fkidreferenciacontacto": (typeof this.state.array_contacto_select[i] != 'undefined') ? 
                            this.state.array_contacto_select[i]:this.state.array_contacto[0].id,
                        "valor":this.state.array_contacto_descripcion[i]
                    }
                    array.push(referenciaDesc)
                }
            }
        }
        return array
    }
    onUpdate() {
        this.setState({
            loading: true,
        });
        var datosActualizar = {
            'codigoCliente': this.state.codigo,
            'apellidoCliente': this.state.apellido,
            'nombreCliente': this.state.nombre,
            'nitCliente': this.state.nit,
            'fotoCliente': this.state.imagen,
            'sexoCliente': this.state.genero,
            'tipoPersoneriaCliente': this.state.tipopersoneria,
            'fechaNacimientoCliente': convertDmyToYmd(this.state.fechanacimiento),
            'notasCliente': this.state.nota,
            'contactoCliente': this.state.contacto,
            'fkidciudad': this.state.idciudad,
            'fkidtipocliente': this.state.idtipocliente,
            'datosTablaIntermedia': JSON.stringify(this.validarRferenciaContacto()),
            'idParaContactarlo': JSON.stringify(this.state.idParaContactarlo),
            'idParaContactarloEliminar': JSON.stringify(this.state.idParaContactarloEliminar),
        };
        httpRequest('put', ws.wscliente + '/' + this.props.match.params.id, datosActualizar)
        .then(result => {
            this.onClose();
            if (result.response === 1) {
                message.success('Se actualizo Correctamente');
                this.props.history.goBack();
            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else{
                message.error("Ocurrio algun error intentelo nuevamente");
            }
        }).catch(error => {
            message.error(strings.message_error);
            this.onClose();
        });
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                {this.componenetOption()}
                <div className="cards" style={{'padding': '0'}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Editar cliente</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.codigo}
                                title='Codigo'
                                permisions={this.permisions.codigo}
                                readOnly={true}
                            />
                            <C_Select
                                title="Tipo Cliente"
                                value={this.state.idtipocliente}
                                onChange={this.onChangeClienteTipo.bind(this)}
                                component={this.componentTipoCliente()}
                                permisions={this.permisions.tipo}
                            />
                            <C_Select
                                title='Tipo Personeria*'
                                value={this.state.tipopersoneria}
                                onChange={this.onChangeClientePersoneria.bind(this)}
                                permisions={this.permisions.personeria}
                                component={[
                                    <Option key={0} value="S">Ninguno</Option>,
                                    <Option key={1} value="N">Natural</Option>,
                                    <Option key={2} value="J">Juridico</Option>
                                ]}
                            />
                            <C_DatePicker
                                allowClear={true}
                                onChange={this.onChangeFechaNacimiento.bind(this)}
                                value={this.state.fechanacimiento}
                                title={'Fecha Nacimiento'}
                                permisions={this.permisions.fecha_nac}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.nombre}
                                onChange={this.onChangeNombre.bind(this)}
                                title='Nombre'
                                validar={this.state.validar_nombre}
                                permisions={this.permisions.nombre}
                            />
                            <C_Input 
                                value={this.state.apellido}
                                onChange={this.onChangeApellido.bind(this)}
                                title='Apellido'
                                permisions={this.permisions.apellido}
                                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Input 
                                value={this.state.nit}
                                onChange={this.onChangeNitCI.bind(this)}
                                title='Nit/Ci'
                                permisions={this.permisions.nit}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Select 
                                value={this.state.genero}
                                title='Genero*'
                                onChange={this.onChangeGenero.bind(this)}
                                permisions={this.permisions.genero}
                                component={
                                    (this.state.tipopersoneria == 'J')?
                                    [<Option key={0} value="N">Ninguno</Option>]:
                                    [
                                        <Option key={0} value="N">Ninguno</Option>,
                                        <Option key={1} value="M">Masculino</Option>,
                                        <Option key={2} value="F">Femenino</Option>,
                                    ]
                                }
                            />
                            <C_TreeSelect
                                title="Ciudad"
                                value={this.state.idciudad}
                                treeData={this.state.array_ciudad_tree}
                                placeholder="Seleccionar"
                                onChange={this.onChangeCiudad.bind(this)}
                                permisions={this.permisions.ciudad}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Caracteristica 
                                title="Referencia Para Contactarlo"
                                data={this.state.array_contacto}
                                onAddRow={this.handleAddRow.bind(this)}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.array_contacto_select}
                                onChangeSelect={this.cambioReferenciaSelect.bind(this)}
                                valuesInput={this.state.array_contacto_descripcion}
                                onChangeInput={this.cambioDescripcionInput.bind(this)}
                                onDeleteRow={this.handleRemoveRow.bind(this)}
                                permisions={this.permisions.caracteristicas}
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                <CImage 
                                    onChange={this.onChangeImagen.bind(this)}
                                    image={this.state.imagen}
                                    images={[]}
                                    delete={this.eliminarImagen.bind(this)}
                                    style={{ height: 240, 'border': '1px solid transparent',}}
                                    permisions={this.permisions.imagen}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                value={this.state.contacto}
                                onChange={this.onChangeContacto.bind(this)}
                                title='Contacto'
                                permisions={this.permisions.contacto}
                            />
                            <C_TextArea 
                                value={this.state.nota}
                                onChange={this.onChangeNota.bind(this)}
                                title='Observaciones'
                                permisions={this.permisions.observaciones}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button onClick={this.validarData.bind(this)}
                                    type='primary' title='Aceptar'
                                />
                                <C_Button onClick={() => this.setState({ visible: true, bandera: 1, })}
                                    type='danger' title='Cancelar'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

}

export default withRouter(EditarCliente);
