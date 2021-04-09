import React, { Component } from 'react';
import { message, Modal, Spin, Icon, Checkbox } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import C_Button from '../../../componentes/data/button';
import keysStorage from '../../../utils/keysStorage';
import Confirmation from '../../../componentes/confirmation';
import C_Input from '../../../componentes/data/input';
import C_CheckBox from '../../../componentes/data/checkbox';
import strings from '../../../utils/strings';

export default class IndexFamiliaVehiculo extends Component {
    constructor(props){
        super(props)
            this.state = {
                tipoVehiculos: [],
                arbolFamilia: [],
                vistaFamilia: [''],
                validacion: [],
                idFamiliaElegido: 0,
                bandera: 0,
                visibleModal: false,
                descripcionFamilia: '',
                descripcionPadre: '',
                titleModal: '',
                loadModal: false,
                InputFocusBlur: [0],
                labelFocusBlur: [0],
                noSesion: false,
                mostrarFamily: false,
                ocultarFamily: false,
                arrayCheckedFamily: [],
            }
            
            this.permisions = {
                btn_nuevo: readPermisions(keys.tipovehiculo_btn_nuevo)
            }
    }

    componentDidMount(){
        this.getFamilia();
        for (var i = 0; i < 1; i++) {
            this.state.validacion.push(1);
        }
        this.setState({
            validacion: this.state.validacion
        });
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={this.abrirModal.bind(this, 1, 0, '')}
                    />
                </div>
            );
        }
        return null;
    }

    getFamilia() {
        var url = 'indexFamilia';
        httpRequest('get', ws.wsGetTipoVehiculos)
        .then((resp) => {
            if (resp.response == -2) {
                this.setState({ noSesion: true })
            } else if (resp.ok) {
                this.setState({
                    arbolFamilia: resp.data
                });
                this.onChangeVistaFamilia(resp.data);
                this.setState({
                    vistaFamilia: this.state.vistaFamilia
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onChangeVistaFamilia(data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].idpadrevehiculo == null) {
                var elem = {
                    title: array[i].descripcion,
                    value: array[i].idvehiculotipo
                };
                array_aux.push(elem);
            }
        }
        var vistaHTML = [];
        var vistaIdPadre = [];
        this.onChangeArbolFamiliaShow(array_aux, vistaHTML, vistaIdPadre);
        this.state.vistaFamilia[0] = (<ul className="menu" id="menu">{vistaHTML}</ul>)
    }

    esPadre(id) {
        var array =  this.state.arbolFamilia;
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo === id){
                return false;
            }
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i].idvehiculotipo === id) {
                if (array[i].idpadrevehiculo == null) {
                    return true;
                }
            }
        }
        return false;
    }

    onCheckedFamily(pos) {
        if (typeof this.state.arrayCheckedFamily[pos] == 'undefined') {
            this.state.arrayCheckedFamily[pos] = false;
        }
        return this.state.arrayCheckedFamily[pos];
    }

    onChangeChecked(pos) {
        this.state.arrayCheckedFamily[pos] = !this.state.arrayCheckedFamily[pos];
        this.setState({
            arrayCheckedFamily: this.state.arrayCheckedFamily,
            mostrarFamily: false,
        });
    }

    onChangeArbolFamiliaShow(data, vistaHTML, vistaIdPadre) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = [];
            this.onChangeHijoFamiliaShow(data[i].value, hijos);
            data[i].children = hijos;
            this.onChangeArbolFamiliaShow(hijos, vistaHTML, vistaIdPadre);
            if (data[i].children.length > 0) {
                var pilaDeHijos = [];
                for (var j = 0; j < data[i].children.length; j++) {
                    if (data[i].children[j].children.length > 0) {
                        var pos = 0;
                        for (var k = 0; k < vistaIdPadre.length; k++) {
                            if (data[i].children[j].value == vistaIdPadre[k]) {
                                pos = k;
                                k = vistaIdPadre.length;
                            }
                        }
                        pilaDeHijos.push(
                            vistaHTML[pos]
                        );
                        vistaHTML.splice(pos, 1);
                        vistaIdPadre.splice(pos, 1);
                    }else{
                        pilaDeHijos.push(
                            <li className="item-content" key={data[i].children[j].value}>
                                <input type="checkbox" id={data[i].children[j].value} 
                                    onChange={this.onChangeChecked.bind(this, data[i].children[j].value)}
                                    checked={this.onCheckedFamily(data[i].children[j].value)} 
                                />
                                <label htmlFor={data[i].children[j].value}>
                                <i className="icon-izq "> </i>
                                    <span>{data[i].children[j].title}</span>
                                </label>
                                <i className="icon-der fa fa-ellipsis-v">
                                    <div className="sub-menu-hijo">
                                        <div onClick={this.abrirModal.bind(this, 2, data[i].children[j].value, data[i].children[j].title)}
                                            className="hijo-sub-menu">Nuevo</div>
                                        <div onClick={this.abrirModal.bind(this, 3, data[i].children[j].value, data[i].children[j].title)}
                                            className="hijo-sub-menu">Editar</div>
                                        <div onClick={this.abrirModal.bind(this, 4, data[i].children[j].value, data[i].children[j].title)}
                                            className="hijo-sub-menu">Eliminar</div>
                                    </div>
                                </i>
                            </li>
                        );
                    }
                }
                vistaHTML.push(
                    <li className="item-content" key={data[i].value}>
                        <input type="checkbox" id={data[i].value} 
                            onChange={this.onChangeChecked.bind(this, data[i].value)}
                            checked={this.onCheckedFamily(data[i].value)} />
                        <label htmlFor={data[i].value}>
                            <i className="icon-izq">
                                <img src="/images/flecha.png" className="arrow" />
                            </i>
                            <span>{data[i].title}</span>
                        </label>
                        <i className="icon-der fa fa-ellipsis-v">
                            <div className="sub-menu-hijo">
                                <div onClick={this.abrirModal.bind(this, 2, data[i].value, data[i].title)}
                                    className="hijo-sub-menu">Nuevo</div>
                                <div onClick={this.abrirModal.bind(this, 3, data[i].value, data[i].title)}
                                    className="hijo-sub-menu">Editar</div>
                                <div onClick={this.abrirModal.bind(this, 4, data[i].value, data[i].title)}
                                    className="hijo-sub-menu">Eliminar</div>    
                            </div>
                        </i>
                        <ul>{pilaDeHijos}</ul>
                    </li>
                );
                vistaIdPadre.push(data[i].value);
            } else {
                if (this.esPadre(data[i].value)) {
                    vistaHTML.push(
                        <li className="item-content" key={data[i].value}>
                            <input type="checkbox" id={data[i].value} 
                                onChange={this.onChangeChecked.bind(this, data[i].value)}
                                checked={this.onCheckedFamily(data[i].value)} />
                            <label htmlFor={data[i].value}>
                                <i className="icon-izq">
                                </i>
                                <span> {data[i].title} </span>
                            </label>
                            <i className="icon-der fa fa-ellipsis-v">
                                <div className="sub-menu-hijo">
                                    <div onClick={this.abrirModal.bind(this, 2, data[i].value, data[i].title)}
                                        className="hijo-sub-menu">Nuevo</div>
                                    <div onClick={this.abrirModal.bind(this, 3, data[i].value, data[i].title)}
                                        className="hijo-sub-menu">Editar</div>
                                    <div onClick={this.abrirModal.bind(this, 4, data[i].value, data[i].title)}
                                        className="hijo-sub-menu">Eliminar</div>
                                </div>
                            </i>
                        </li>
                    );
                    vistaIdPadre.push(data[i].value);
                }
            }
        }
    }

    onChangeHijoFamiliaShow(idpadre, hijos) {
        var array =  this.state.arbolFamilia;
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idvehiculotipo
                };
                hijos.push(elemento);
            }
        }
    }

    abrirModal(bandera, id, descripcion) {
        if (bandera === 1) {
            this.setState({
                bandera: bandera,
                idFamiliaElegido: id,
                descripcionPadre: descripcion,
                visibleModal: true,
                titleModal: 'Nueva Familia'
            });
        }
        if (bandera === 2) {
            this.setState({
                bandera: bandera,
                idFamiliaElegido: id,
                descripcionPadre: descripcion,
                visibleModal: true,
                titleModal: 'Nueva SubFamilia'
            });
        }
        if (bandera === 3) {
            this.setState({
                bandera: bandera,
                idFamiliaElegido: id,
                descripcionPadre: descripcion,
                descripcionFamilia: descripcion,
                visibleModal: true,
                titleModal: 'Editar ' + descripcion,
            });
        }
        if (bandera === 4) {
            this.setState({
                bandera: bandera,
                idFamiliaElegido: id,
                descripcionPadre: descripcion,
                visibleModal: true,
                titleModal: 'Eliminar ' + descripcion
            });
        }
    }

    onChangeDescripcionFamilia(e) {
        this.state.validacion[0] = 1;
        this.setState({
            descripcionFamilia: e,
            validacion: this.state.validacion
        })
    }

    handleCerrar() {
        this.state.validacion[0] = 1;
        this.setState({
            bandera: 0,
            idFamiliaElegido: 0,
            descripcionPadre: '',
            descripcionFamilia: '',
            visibleModal: false,
            titleModal: '',
            validacion: this.state.validacion,
            loadModal: false,
        });
    }

    onChangeModalShow() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.state.bandera === 1) {
            return (
                <Confirmation
                    visible={this.state.visibleModal}
                    title={this.state.titleModal}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    onClick={this.onSubmitCrear.bind(this)}
                    width={400}
                    content = {[
                        <C_Input
                            key={0}
                            className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            title='Descripcion'
                            value={this.state.descripcionFamilia}
                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                        />
                    ]}
                />
            );
        }
        if (this.state.bandera === 2) {
            return (
                <Confirmation
                    visible={this.state.visibleModal}
                    title={this.state.titleModal}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    onClick={this.onSubmitCrear.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                            style={{marginTop: '-10px', paddingBottom: 0}}
                            key={0}>
                            <label className="title-sublogo-content">
                                Categoria: 
                                <span> {this.state.descripcionPadre}</span>
                            </label>
                        </div>,
                        <C_Input
                            key={1}
                            className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            title='Descripcion'
                            value={this.state.descripcionFamilia}
                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                        />
                    ]}
                />
            );
        }
        if (this.state.bandera === 3) {
            return (
                <Confirmation
                    visible={this.state.visibleModal}
                    title={this.state.titleModal}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    onClick={this.onSubmitCrear.bind(this)}
                    width={400}
                    content = {[
                        <C_Input
                            key={0}
                            className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            title='Descripcion'
                            value={this.state.descripcionFamilia}
                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                        />
                    ]}
                />
            );
        }
        if (this.state.bandera === 4) {
            return (
                <Confirmation
                    visible={this.state.visibleModal}
                    title={this.state.titleModal}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    onClick={this.onSubmitEliminar.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <div className="txts-center" style={{'marginTop': '-10px'}}>
                                <label className="title-sublogo-content">
                                    <span>¿Estas seguro de eliminar {this.state.descripcionPadre} ?</span>
                                </label>
                            </div>
                        </div>
                    ]}
                />
            );
        }
    }

    onSubmitCrear(e) {
        e.preventDefault();
        if (this.state.descripcionFamilia.length > 0) {
            
            let body = {
                descripcionFamilia: this.state.descripcionFamilia,
                banderaFamilia: this.state.bandera,
                idPadre: this.state.idFamiliaElegido
            }
            this.setState({
                loadModal: true
            });
            httpRequest('post', ws.wstipovehiculo, body)
            .then((resp) => {
                if (resp.response === 1) {
                    this.setState({
                        arbolFamilia: resp.data
                    });
                    this.onChangeVistaFamilia(resp.data);
                    this.setState({
                        vistaFamilia: this.state.vistaFamilia
                    });
                    this.handleCerrar();
                    message.success('datos guardados exitosamente');
                } else if (resp.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        }else {
            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion
            });
            message.error('No se permite campo vacio');
        }
    }

    onSubmitEliminar(e) {
        e.preventDefault();
        
        this.setState({
            loadModal: true
        });
        httpRequest('post', ws.wstipovehiculodel, {
            idPadre: this.state.idFamiliaElegido
        })
        .then((resp) => {
            if (resp.response === 1) {
                this.setState({
                    arbolFamilia: resp.data
                });
                this.onChangeVistaFamilia(resp.data);
                this.setState({
                    vistaFamilia: this.state.vistaFamilia
                });
                this.handleCerrar();
                message.success('Se a eliminado correctamente!');
                
            } else if (resp.response == -2) {
                this.setState({ noSesion: true })
            }
            if (resp.response === 2) {
                this.handleCerrar();
                message.warning('No se puede eliminar porque tiene hijos');
            }
            if (resp.response === 3) {
                this.handleCerrar();
                message.warning('Ups No se pudo anular por que esta registrado a un vehiculo');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onchangeShowFamily() {
        if (this.state.ocultarFamily) {
            this.setState({
                ocultarFamily: false,
            });
        }
        if (!this.state.mostrarFamily) {
            for (var i = 0; i < this.state.arrayCheckedFamily.length; i++) {
                var checked = this.state.arrayCheckedFamily[i];
                if (typeof checked != 'undefined') {
                    this.state.arrayCheckedFamily[i] = true;
                }
            }
        }else {
            for (var i = 0; i < this.state.arrayCheckedFamily.length; i++) {
                var checked = this.state.arrayCheckedFamily[i];
                if (typeof checked != 'undefined') {
                    this.state.arrayCheckedFamily[i] = false;
                }
            }
        }
        this.setState({
            mostrarFamily: !this.state.mostrarFamily,
            arrayCheckedFamily: this.state.arrayCheckedFamily,
        });
    }

    onChangeHideFamily() {
        if (this.state.mostrarFamily) {
            this.setState({
                mostrarFamily: false,
            });
        }
        if (!this.state.ocultarFamily) {
            for (var i = 0; i < this.state.arrayCheckedFamily.length; i++) {
                var checked = this.state.arrayCheckedFamily[i];
                if (typeof checked != 'undefined') {
                    this.state.arrayCheckedFamily[i] = false;
                }
            }
        }else {
            for (var i = 0; i < this.state.arrayCheckedFamily.length; i++) {
                var checked = this.state.arrayCheckedFamily[i];
                if (typeof checked != 'undefined') {
                    this.state.arrayCheckedFamily[i] = false;
                }
            }
        }
        this.setState({
            ocultarFamily: !this.state.ocultarFamily,
            arrayCheckedFamily: this.state.arrayCheckedFamily,
        });
    }

    render() {
        this.onChangeVistaFamilia(this.state.arbolFamilia);
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalShow = this.onChangeModalShow();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                {componentModalShow}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Tipo de Vehiculos</h1>
                        </div>
                        { btnNuevo }
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'display': 'flex'}}>
                            <div style={{'width': '80px'}}>
                                <div className="inputs-groups">
                                    <input type='text' 
                                        style={{'border': '1px solid transparent', 'width': '70px',
                                            'color': 'blue', 'cursor': 'pointer', 'paddingLeft': '2px'}}
                                        value='Mostrar' readOnly
                                        onClick={this.onchangeShowFamily.bind(this)}
                                        className='forms-control'
                                    />
                                    <label className="checkboxContainer" 
                                        style={{'position': 'absolute', 'right': '-5px', 'top': '8px'}}>
                                        <input type="checkbox"
                                            onChange={this.onchangeShowFamily.bind(this)}
                                            checked={this.state.mostrarFamily}
                                        />
                                        <span className="checkmark">  </span>
                                    </label>
                                    <C_CheckBox
                                        onChange={this.onchangeShowFamily.bind(this)}
                                        checked={this.state.mostrarFamily}
                                        style={{'position': 'absolute', 'right': '-5px', 'top': '8px'}}
                                    />
                                </div>
                            </div>
                            <div style={{'width': '80px'}}>
                                <div className="inputs-groups">
                                    <input type='text' 
                                        style={{'border': '1px solid transparent', 'width': '70px',
                                            'color': 'blue', 'cursor': 'pointer', 'paddingLeft': '4px'}}
                                        value='Ocultar' readOnly
                                        onClick={this.onChangeHideFamily.bind(this)}
                                        className='forms-control'
                                    />
                                    <C_CheckBox
                                        onChange={this.onChangeHideFamily.bind(this)}
                                        checked={this.state.ocultarFamily}
                                        style={{'position': 'absolute', 'right': '-5px', 'top': '8px'}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="multi-menu-content" style={{'marginBottom': '40px'}}>
                            {this.state.vistaFamilia[0]}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
