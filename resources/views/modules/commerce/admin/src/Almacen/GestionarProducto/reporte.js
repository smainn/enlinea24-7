
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Spin, Icon, TreeSelect } from 'antd';

import 'antd/dist/antd.css';
import TextArea from '../../../components/textarea';
import { httpRequest, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import { dateToString, hourToString } from '../../../tools/toolsDate';

export default class ReporteProducto extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            inputInicio: true,

            tipoproducto: '',
            descripcion: '',

            arrayFamilia: [],
            arrayArbolFamilia: [],
            familia: '',

            arrayUnidadMedida: [],
            medida: '',

            arrayMoneda: [],
            moneda: '',

            operacioncosto: '',
            costoinicio: '',
            costofin: '',

            operacionprecio: '',
            precioinicio: '',
            preciofin: '',

            operacionstock: '',
            stockinicio: '',
            stockfin: '',

            palabraclave: '',
            observacion: '',

            arrayProductoCaracteristica: [],
            cantidadArrayProductoCaracteristica: 0,

            items: [],

            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],
            noSesion: false
        }
    }

    componentWillMount() {

        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', '/commerce/api/producto/reporte')
        .then(result => {
            if (result.response === 1) {
                
                if (result.data.length > 3) {
                    this.state.items = [0, 0, 0];
                    this.state.arrayCaracteristica = ['', '', ''];
                    this.state.arrayDetalleCaracteristica = ['', '', ''];
                }else {
                    for (var pos = 0; pos < result.data.length; pos++) {
                        this.state.items.push(0);
                        this.state.arrayCaracteristica.push('');
                        this.state.arrayDetalleCaracteristica.push('');
                    }
                }

                this.setState({

                    arrayFamilia: result.familia,
                    arrayUnidadMedida: result.unidad,
                    arrayMoneda: result.moneda,
                    arrayProductoCaracteristica: result.data,
                    cantidadArrayProductoCaracteristica: result.data.length,

                    items: this.state.items,
                    arrayCaracteristica: this.state.arrayCaracteristica,
                    arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                });

                var array = result.familia;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrefamilia == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idfamilia
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolFamilia(array_aux);
                this.setState({
                    arrayArbolFamilia: array_aux
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }

        }).catch(
            error => console.log(error)
        );
    }

    arbolFamilia(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].value);
            
            data[i].children = hijos;
            
            this.arbolFamilia(hijos);
        }
    }

    hijosFamilia(idpadre) {
        var array =  this.state.arrayFamilia;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrefamilia === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idfamilia
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    regresarIndex() {
        this.setState({
            redirect: true,
        });
    }

    onChangeTipoProducto(event) {
        this.setState({
            tipoproducto: event.target.value,
        });
    }

    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
        });
    }

    onChangeFamilia(event) {
        if (typeof event === 'undefined') {
            this.setState({
                familia: '',
            });
        }else {
            this.setState({
                familia: event,
            });
        }
    }

    onChangeUnidadMedida(event) {
        this.setState({
            medida: event.target.value,
        });
    }

    onChangeMoneda(event) {
        this.setState({
            moneda: event.target.value,
        });
    }

    onChangeOperacionCosto(event) {
        this.setState({
            operacioncosto: event.target.value,
            costofin: '',
        });
        if (event.target.value == '') {
            this.setState({
                costoinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado costo fin');
        }
    }

    onChangeCostoInicio(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                costoinicio: event.target.value,
            });
        }
    }

    onChangeCostoFin(event) {
        if (this.state.operacioncosto == '!') {
            if (!isNaN(event.target.value)) {
                this.setState({
                    costofin: event.target.value,
                });
            }
        }
    }

    onChangeOperacionPrecio(event) {
        this.setState({
            operacionprecio: event.target.value,
            preciofin: ''
        });
        if (event.target.value == '') {
            this.setState({
                precioinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado precio fin');
        }
    }

    onChangePrecioInicio(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                precioinicio: event.target.value,
            });
        }
    }

    onChangePrecioFin(event) {
        if (this.state.operacionprecio == '!') {
            if (!isNaN(event.target.value)) {
                this.setState({
                    preciofin: event.target.value,
                });
            }
        }
    }

    onChangeOperacionStock(event) {
        this.setState({
            operacionstock: event.target.value,
            stockfin: ''
        });
        if (event.target.value == '') {
            this.setState({
                stockinicio: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado stock fin');
        }
    }

    onChangeStockInicio(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                stockinicio: event.target.value,
            });
        }
    }

    onChangeStockFin(event) {
        if (this.state.operacionstock == '!') {
            if (!isNaN(event.target.value)) {
                this.setState({
                    stockfin: event.target.value,
                });
            }
        }
    }

    onchangePalabraClave(event) {
        this.setState({
            palabraclave: event,
        });
    }

    onChangeObservacion(event) {
        this.setState({
            observacion: event,
        });
    }

    onChangeArrayDetalleCaracteristica(posicion, event) {
        this.state.arrayDetalleCaracteristica[posicion] = event.target.value;
        this.setState({
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    onChangeArrayCarracteristica(posicion, event) {
        this.state.arrayCaracteristica[posicion] = event.target.value;
        this.state.items[posicion] = event.target.value;
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
            items: this.state.items,
        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    handleAddRow() {
        if (this.state.items.length < this.state.cantidadArrayProductoCaracteristica) {
            this.state.items.push(0);
            this.state.arrayCaracteristica.push('');
            this.state.arrayDetalleCaracteristica.push('');
            this.setState({
                items: this.state.items,
                arrayCaracteristica: this.state.arrayCaracteristica,
                arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            });
        }
        if (this.state.items. length === this.state.cantidadArrayProductoCaracteristica) {
            message.success('cantidad completa de caracteristica');
        }
    }

    handleRemoveRow(indice) {
        this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    componentCaracteristica(posicion) {
        var arrayCaracteristica = [];

        this.state.arrayProductoCaracteristica.map(
            (resultado, indice) => {
                var bandera = 0;
                for (var i = 0; i < this.state.items.length; i++) {
                    if (this.state.items[i] != 0) {
                        if (i != posicion) {
                            if (this.state.items[i] != 0) {
                                if (resultado.idproduccaracteristica == this.state.items[i]) {
                                    bandera = 1;
                                }
                            }
                        }
                    }
                }
                if (bandera == 0) {
                    arrayCaracteristica.push(
                        <option key={indice} value={resultado.idproduccaracteristica}>
                            {resultado.caracteristica}
                        </option>
                    );
                }
            }
        );
        return arrayCaracteristica;
    }

    limpiarDatos() {
        this.setState({
            tipoproducto: '',
            descripcion: '',
            familia: '',
            medida: '',
            moneda: '',

            operacioncosto: '',
            costoinicio: '',
            costofin: '',

            operacionprecio: '',
            precioinicio: '',
            preciofin: '',

            operacionstock: '',
            stockinicio: '',
            stockfin: '',

            palabraclave: '',
            observacion: '',
        });
    }

    render() {
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? null : 
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        let conexion = readData(keysStorage.connection);

        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const token = readData(keysStorage.token);

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio} />)
        }

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/producto"/>)
        }

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Producto</h1>
                    </div>

                    <div className="pulls-right">
                        <button type="button" 
                            onClick={this.regresarIndex.bind(this)} 
                            className="btns btns-primary">
                                Atras
                        </button>
                    </div>
                    <form action="/commerce/admin/producto/generar" target="_blank" method="post">

                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={conexion} name="x_conexion" />

                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={token} name="authorization" />
                        
                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select type="text"
                                            value={this.state.tipoproducto} 
                                            onChange={this.onChangeTipoProducto.bind(this)}
                                            className='forms-control'>

                                            <option value=''>Seleccionar</option>
                                            <option value='P'>Producto</option>    
                                            <option value='S'>Servicio</option>    
                                        </select>

                                        <label className='lbls-input active'>
                                            Tipo
                                        </label>
                                        <input type="hidden" value={this.state.tipoproducto} 
                                            name='tipoproducto' />
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">

                                    <div className="inputs-groups">
                                        <input type='text' className='forms-control'
                                            value={this.state.descripcion} 
                                            placeholder=' Ingresar descripcion ...'    
                                            onChange={this.onChangeDescripcion.bind(this)}
                                        />
                                        <label className='lbls-input active'>Descripcion</label>
                                        <input type='hidden' value={this.state.descripcion} name='descripcion' />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <TreeSelect
                                            value={(this.state.familia == '')?'Seleccionar':this.state.familia}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                                            treeData={this.state.arrayArbolFamilia}
                                            allowClear
                                            style={{'fontFamily': 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
                                                'width': '100%', 'minWidth': '100%'}}
                                            onChange={this.onChangeFamilia.bind(this)}
                                        />
                                        <label
                                            className='lbls-input active'>
                                            Familia
                                        </label>
                                        <input type='hidden' value={this.state.familia}
                                            name='familia' />
                                    </div>
                                    
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">    
                                    <div className="inputs-groups">
                                        <select value={this.state.medida}
                                            onChange={this.onChangeUnidadMedida.bind(this)}
                                            className="forms-control"
                                        >
                                            <option value=''> Seleccionar</option>
                                            {this.state.arrayUnidadMedida.map(
                                                (data, key) => (
                                                    <option key={key} value={data.idunidadmedida}>{data.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className="lbls-input active">Unidad Medida</label>
                                        <input type='hidden' value={this.state.medida} name='medida' />
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">                  
                                    <div className="inputs-groups">
                                        <select value={this.state.moneda}
                                            onChange={this.onChangeMoneda.bind(this)}
                                            className="forms-control"
                                        >
                                            <option value=''> Seleccionar</option>
                                            {this.state.arrayMoneda.map(
                                                (data, key) => (
                                                    <option key={key} value={data.idmoneda}>{data.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className="lbls-input active">Moneda</label>
                                        <input type='hidden' value={this.state.moneda} name='moneda' />
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Costo - Desde'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">

                                    <div className="inputs-groups">
                                        <select className="forms-control"
                                            value={this.state.operacioncosto}
                                            onChange={this.onChangeOperacionCosto.bind(this)}
                                            name="operacioncosto">
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className="lbls-input active">Opcion</label>
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar costo'
                                            className={(this.state.operacioncosto != '')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            value={this.state.costoinicio}
                                            readOnly={(this.state.operacioncosto != '')?false:true}
                                            onChange={this.onChangeCostoInicio.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacioncosto != '')?'#4476FA':'#e8e8e8'}} 
                                            className="lbls-input active">
                                            Costo Inicio
                                        </label>
                                        <input type='hidden' value={this.state.costoinicio} name='costoinicio' />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value=' Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar costo'
                                            className={(this.state.operacioncosto == '!')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            value={this.state.costofin}
                                            readOnly={(this.state.operacioncosto == '!')?false:true}
                                            onChange={this.onChangeCostoFin.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacioncosto == '!')?'#4476FA':'#e8e8e8'}} 
                                            className="lbls-input active">
                                            Costo Fin
                                        </label>
                                        <input type='hidden' value={this.state.costofin} name='costofin' />
                                    </div>
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Precio - Desde'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select className="forms-control"
                                            value={this.state.operacionprecio}
                                            onChange={this.onChangeOperacionPrecio.bind(this)}
                                            name="operacionprecio">
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className="lbls-input active">Opcion</label>
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar precio'
                                            className={(this.state.operacionprecio != '')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            value={this.state.precioinicio}
                                            readOnly={(this.state.operacionprecio != '')?false:true}
                                            onChange={this.onChangePrecioInicio.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacionprecio != '')?'#4476FA':'#e8e8e8'}}
                                            className="lbls-input active">
                                            Precio Inicio
                                        </label>
                                        <input type='hidden' value={this.state.precioinicio} name='precioinicio' />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value=' Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar precio'
                                            className={(this.state.operacionprecio == '!')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            value={this.state.preciofin}
                                            readOnly={(this.state.operacionprecio == '!')?false:true}
                                            onChange={this.onChangePrecioFin.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacionprecio == '!')?'#4476FA':'#e8e8e8'}} 
                                            className="lbls-input active">
                                            Precio Fin
                                        </label>
                                        <input type='hidden' value={this.state.preciofin} name='preciofin' />
                                    </div>
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Stock - Desde'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select className="forms-control"
                                            value={this.state.operacionstock}
                                            onChange={this.onChangeOperacionStock.bind(this)}
                                            name="operacionstock">
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className="lbls-input active">Opcion</label>
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar stock'
                                            className={(this.state.operacionstock != '')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            readOnly={(this.state.operacionstock != '')?false:true}
                                            value={this.state.stockinicio}
                                            onChange={this.onChangeStockInicio.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacionstock != '')?'#4476FA':'#e8e8e8'}} 
                                            className="lbls-input active">
                                            Stock Inicio
                                        </label>
                                        <input type='hidden' value={this.state.stockinicio} name='stockinicio' />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-2 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value=' Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type='text' placeholder='Ingresar stock'
                                            className={(this.state.operacionstock == '!')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            value={this.state.stockfin}
                                            readOnly={(this.state.operacionstock == '!')?false:true}
                                            onChange={this.onChangeStockFin.bind(this)}
                                            />
                                        <label style={{'color': (this.state.operacionstock == '!')?'#4476FA':'#e8e8e8'}} 
                                            className="lbls-input active">
                                            Stock Fin
                                        </label>
                                        <input type='hidden' value={this.state.stockfin} name='stockfin' />
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="forms-groups">
                            <div className="pulls-left">
                                <label>Caracteristicas:</label>
                            </div>
                        </div>

                        <div className="forms-groups">

                            <div className="cols-lg-3 cols-md-3 "></div>

                            <div className="cols-lg-6 cols-md-8 cols-sm-12 cols-xs-12">
                            
                                <div className="card-caracteristica">

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Referencia </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Valor </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="pulls-right">
                                            {(this.state.items.length === this.state.cantidadArrayProductoCaracteristica)?'':
                                                <a className="btns btns-sm btns-primary"
                                                    onClick={this.handleAddRow.bind(this)}
                                                    style={{'marginTop': '15px', 'padding': '3px'}}>
                                                    <i className="fa fa-plus"></i>
                                                </a>
                                            }
                                        </div>
                                    </div>

                                    <div className="caja-content">
                                        {this.state.items.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice}>
                                                        <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                                            <select className="forms-control"
                                                                style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                                                value={this.state.arrayCaracteristica[indice]}
                                                                onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                                >
                                                                <option value={0}>Seleccionar</option>

                                                                {this.componentCaracteristica(indice)}

                                                            </select>
                                                        </div>
                                                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                                            <input type="text"  
                                                                placeholder=" Ingresar detalles ..."
                                                                className='forms-control'
                                                                value={this.state.arrayDetalleCaracteristica[indice]}  
                                                                onChange={this.onChangeArrayDetalleCaracteristica.bind(this, indice)}      
                                                            />
                                                        </div>

                                                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content"
                                                                style={{'marginLeft': '-7px'}}>
                                                                <div className="text-center-content">
                                                                    <i onClick={this.handleRemoveRow.bind(this, indice)}
                                                                        className="fa fa-times btns btns-sm btns-danger"
                                                                        style={{'marginTop': '2px'}}> </i>
                                                                </div>
                                                        </div>
                                                        
                                                    </div>
                                                );
                                            }
                                        )}
                                        <input type="hidden" value={this.state.arrayCaracteristica} 
                                            name="arrayCaracteristica" />
                                        <input type="hidden" value={this.state.arrayDetalleCaracteristica} 
                                            name="arrayDetalleCaracteristica" />
                                    </div>
                                </div>

                            </div>

                            <div className="cols-lg-3 cols-md-2"></div>

                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                            <div className="cols-lg-3 cols-md-3"></div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <div className="inputs-groups" >
                                    <select name="ordenacion" id="ordenar"
                                        className='forms-control'
                                        style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                        <option value={1}> Id Producto </option>
                                        <option value={2}> Descripcion </option>
                                        <option value={3}> Familia </option>
                                        <option value={4}> Unidad medida </option>
                                        <option value={5}> Stock actual </option>
                                        <option value={6}> Precio unitario </option>
                                    </select>
                                    <label htmlFor="ordenar"
                                        className='lbls-input active'>
                                        Ordenar Por
                                    </label>
                                </div>
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <div className="inputs-groups" >
                                    <select name="exportar" id="exportar"
                                        className='forms-control'
                                        style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                        <option value="N"> Seleccionar </option>
                                        <option value="P"> PDF </option>
                                        <option value="E"> ExCel </option>
                                    </select>
                                    <label htmlFor="exportar"
                                        className='lbls-input active'>
                                        Exportar A
                                    </label>
                                </div>
                            </div>
                        
                        </div>

                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-xs-12">

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea
                                        title="Palabras Clave"
                                        value={this.state.palabraclave}
                                        onChange={this.onchangePalabraClave.bind(this)}
                                    />
                                    <input type='hidden' value={this.state.palabraclave} name='palabraclave' />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea 
                                        title="Observaciones"
                                        value={this.state.observacion}
                                        onChange={this.onChangeObservacion.bind(this)}
                                    />
                                    <input type='hidden' value={this.state.observacion} name='observacion' />

                                </div>
                            </div>
                        </div>

                        <div className="forms-groups"
                            style={{'marginBottom': '-10px'}}>
                            <div className="text-center-content">
                                <button type="button" onClick={this.limpiarDatos.bind(this)}
                                    className="btns btns-primary"
                                    style={{'marginRight': '20px'}}>
                                    Limpiar
                                </button>
                                <button type="submit"
                                    className="btns btns-primary"
                                    style={{'marginRight': '20px'}}>
                                    Generar
                                </button>
                                <button onClick={this.regresarIndex.bind(this)}
                                    type="button" className="btns btns-danger">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}