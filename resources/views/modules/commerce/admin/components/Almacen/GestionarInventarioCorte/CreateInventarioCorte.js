
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select, Divider, DatePicker,Button, Alert } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString } from '../../../tools/toolsDate';
import { wsalmacen, wsproductosalmacenes, wsinventariocorte, 
        wssearchproducto, wsproductosall } 
        from '../../../WS/webservices';
const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;
let date = new Date();
export default class CreateInventarioCorte extends Component{

    constructor(){
        super();
        this.state = {
            descripcion: '',
            fecha: dateToString(date),
            idalmacen: 0,
            notas: '',
            isInicio: true,
            almacenes: [],

            productosSelected: [],
            resultProductos: [],
            resultProductosDefault: [],
            listaProductos: [],
            arrayProductos: [],
            arrayAlmacenes: [],
            arrayStockNuevos: [],
            arrayStocksTotales: [],
            selectAlmacenes: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,

            txtBtnTodos: 'Agregar todos',
            InputFocusBlur: [],
            labelFocusBlur: ['fecha'],
            redirect: false,
        }

        this.onChangeDescipcion = this.onChangeDescipcion.bind(this);
        this.onFocusDescripcion = this.onFocusDescripcion.bind(this);
        this.onBlurDescripcion = this.onBlurDescripcion.bind(this);
        this.onChangeAlmacen = this.onChangeAlmacen.bind(this);
        this.componentBodyAlmacen = this.componentBodyAlmacen.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this); 
        this.agregarTodos = this.agregarTodos.bind(this);
    }

    focusInicio(e) {
        if (e != null) {
            if (this.state.isInicio) {
                e.focus();
            }
        }
    }

    onChangeDescipcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }
    
    onFocusDescripcion() {
       this.setState({
            InputFocusBlur: [
                ...this.state.InputFocusBlur,
                'descripcion'
            ],
            labelFocusBlur: [
                ...this.state.labelFocusBlur,
                'descripcion'
            ]
       },
        () => console.log(' DATA ', this.state.InputFocusBlur)
       );
    }

    onBlurDescripcion() {
        if (this.state.descripcion.length == 0) {
            let index = this.state.InputFocusBlur.indexOf('descripcion');
            this.state.InputFocusBlur.splice(index, 1);
            index = this.state.labelFocusBlur.indexOf('descripcion');
            this.state.labelFocusBlur.splice(index, 1);
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
                labelFocusBlur: this.state.labelFocusBlur
           });
        } else {
            let index = this.state.InputFocusBlur.indexOf('descripcion');
            this.state.InputFocusBlur.splice(index, 1);
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur
           });
        }
    }

    onChangeFecha(date, dateString) {
        this.setState({
            fecha: dateString
        });
    }

    onChangeAlmacen(data) {
        console.log('DATA ', data);
        this.setState({
            selectAlmacenes: data
        });
    }

    onChangeNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    agregarTodos() {
        if (this.state.txtBtnTodos == 'Agregar Todos') {
            axios.post(wsproductosalmacenes, {
                almacenes: JSON.stringify(this.state.selectAlmacenes)
            })
            .then((resp) => {
                let result = resp.data;
                console.log('RESULT ', result);
                if (result.response > 0) {
                    this.cargarStocks(result.productos);
                    this.setState({
                        productosSelected: result.productos,
                        arrayAlmacenes: result.almacenes,
                        txtBtnTodos: 'Quitar Todos'
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                productosSelected: [],
                txtBtnTodos: 'Agregar Todos',
                arrayAlmacenes: []
            });
        }
        
    }

    searchProducto(value) {
        if (value.length > 0) {
            axios.get(wssearchproducto + '/' + value)
            .then((resp) => {
                let result = resp.data;
                console.log('RESP DE BUSCAR ', result);
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else {
    
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                resultProductos: resultProductosDefault
            });
        }
        
    }

    handleSearchProd(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchProducto(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    /** Metedos Auxiliar */
    //Metodo devuelve null si el producto no existe
    //o si ya fue seleccionado

    /** */

    getIdsProductosSeleceted() {
        
        let data = this.state.productosSelected;
        let array = [];
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(data[i].idproducto);
        }
        return array;
    }

    validarDatos() {
        return true;
    }

    storeInvetario(e) {
 
        axios.post(wsinventario, body)
        .then((resp) => {
            let result = resp.data;
            console.log(result);
            if (result.response > 0) {
                message.success(result.message);
                this.setState({redirect: true});
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    cargarStocks(productos) {
        let array1 = [];
        let array2 = [];
        let length = productos.length;
        for (let i = 0; i < length; i++) {
            array1.push(0);
            array2.push({
                'anterior': productos[i].stock,
                'nuevo': 0,
            });
        }
        this.setState({
            arrayStockNuevos: array1,
            arrayStocksTotales: array2
        });
    }

    getAlmacenes() {
        
        axios.get(wsalmacen)
        .then((resp) => {
            let result = resp.data;
            if (result.response == 1) {
                let array = result.data;
                let length = array.length;
                let data = [];
                for (let i = 0; i < length; i++) {
                    data.push(array[i].idalmacen);
                }
                console.log('ALMACENES ', data);
                this.setState({
                    almacenes: result.data,
                    selectAlmacenes: data
                });
            } 
        })
        .catch((error) => {
            console.log(error);
        })

    }

    prepararDatos() {
        this.setState({ isInicio: false});
    }
    componentDidMount() {

        this.getAlmacenes();
        this.prepararDatos();
        
    }

    showConfirmStore() {

        if(!this.validarDatos()) return;
        const storeInvetario = this.storeInvetario.bind(this);
        Modal.confirm({
          title: 'Registrar Inventario',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            console.log('OK');
            storeInvetario();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }

    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: 'Registrar Lista de Precio',
            content: 'Los cambios realizados no se guardaran, ¿Desea continuar?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              console.log('OK');
              redirect();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    componentTitleAlmacen() {

        let array = this.state.almacenes;
        let length = array.length;
        let component = [];
        //for (let i = 0; i < length; i++) {
            component.push(
                <div className="col-lg-12-content">
                    <label className="col-lg-12-content" style={{color: 'black'}}>{"Almacen 1"/*array[i].descripcion*/}</label>
                    <div className="col-lg-6-content">
                        <label style={{color: 'black'}}>Anterior</label>
                    </div>
                    <div className="col-lg-6-content">
                        <label style={{color: 'black'}}>Nuevo</label>
                    </div>
                </div>
            );
        //}
        return component;

    }

    inArrayAlmacen(idalmacen, array) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idalmacen == idalmacen) 
                return true;
        }
        return false;
    }

    componentBodyAlmacen(index) {
        let array = this.state.almacenes;
        let length = array.length;
        let posicion = 0;
        let component = [];
        for (let i = 0; i < length; i++) {
            if (this.inArrayAlmacen(array[i].idalmacen, this.state.arrayAlmacenes[index])) {
                component.push(
                    <div className="col-lg-12-content">
                        <div className="col-lg-4-content">
                            <input 
                                id={index} 
                                type="text"
                                value={this.state.arrayAlmacenes[index][posicion].stock}
                                placeholder="Valor"
                                className="form-control-content"
                                readOnly
                            />
                        </div>
                        <div className="col-lg-4-content">
                            <input 
                                id={index} 
                                type="text"
                                value={this.state.arrayStockNuevos[index]}
                                placeholder="Valor"
                                //onChange={this.handlePrecioProd}
                                className="form-control-content" 
                            />
                        </div>
                    </div>
                );
                posicion++;
            } else {
                component.push(
                    <div className="col-lg-12-content">
                        <div className="col-lg-4-content">
                            <input 
                                id={index} 
                                type="text"
                                value="0"
                                placeholder="Valor"
                                className="form-control-content"
                                readOnly
                            />
                        </div>
                        <div className="col-lg-4-content">
                            <input 
                                id={index} 
                                type="text"
                                value="0"
                                placeholder="Valor"
                                className="form-control-content" 
                                readOnly
                            />
                        </div>
                    </div>
                )
            }
        }
        return component;
    }

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/inventario/index"/>
            )
        }
        
        let componentTitleAlmacen = this.componentTitleAlmacen();
        return (
            <div>
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Registrar Invetario </h1>
                    </div>
                </div>

                <div className="form-group-content col-lg-12-content">
                    {/*}
                    <div className="col-lg-4-content">
                        <input 
                            id="descripcion" 
                            type="text"
                            value={this.state.descripcion}
                            placeholder="Descripcion"
                            onChange={this.onChangeDescipcion}
                            className="form-control-content"
                        />
                        <label 
                            htmlFor="descripcion" 
                            className="label-content"
                        > 
                            Descripcion
                        </label>
                    </div>
                    */}
                    <div className="col-lg-3-content col-md-3-content col-sm-6-content col-xs-12-content" style={{'marginTop': '8px'}}>
                        <div className="input-group-content">
                            <input type="text" ref={this.focusInicio.bind(this)}
                                onFocus={this.onFocusDescripcion.bind(this)} 
                                onBlur={this.onBlurDescripcion.bind(this)}
                                value={this.state.descripcion} 
                                id="descripcion"
                                onChange={this.onChangeDescipcion.bind(this)}
                                className={this.state.InputFocusBlur.indexOf('descripcion') >=0 ? 'input-form-content active':'input-form-content'}
                            />
                            <label 
                                htmlFor="descripcion" 
                                className={this.state.InputFocusBlur.indexOf('descripcion') >=0?'lbl-input-form-content active':'lbl-input-form-content'}>
                                Descripcion
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-4-content">
                        <div className="input-group-content">
                            <DatePicker
                                defaultValue={moment('2000-01-01', 'YYYY-MM-DD')}
                                format={'YYYY-MM-DD'}
                                onChange={this.onChangeFecha}
                                value={moment(this.state.fecha, 'YYYY-MM-DD')}
                                style={{
                                    marginTop: 15,
                                    width: '100%',
                                    maxHeight: 400
                                }}
                            />
                            <br></br>
                            <label 
                                htmlFor="fecha" 
                                className={this.state.labelFocusBlur.indexOf('fecha') >= 0 ? 'lbl-input-form-content active': 'lbl-input-form-content'}>
                                Fecha
                            </label>
                        </div>
                        
                    </div>
                    <div className="col-lg-4-content">
                        {
                            /**
                            <select
                                id="almacen"
                                className="form-control-content"
                                onChange={this.onChangeAlmacen}>
                                {
                                    this.state.almacenes.map((item, key) => (
                                        <option 
                                            key={key}
                                            value={item.idalmacen}>
                                            {item.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                             */
                        }
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            value={this.state.selectAlmacenes}
                            //defaultValue={this.state.defaultAlmacenes}
                            onChange={this.onChangeAlmacen}
                        >
                            {this.state.almacenes.map((item, key) => (
                                <Option
                                    key={key}
                                    value={item.idalmacen}>
                                    {item.descripcion}
                                </Option>
                            ))}
                        </Select>
                        <label 
                            htmlFor="almacen" 
                            className="label-content"> 
                            Almacen 
                        </label>
                    </div>   
                    <div className="col-lg-6-content">
                        <div className="col-lg-12-content">
                            <label 
                                htmlFor="notas" 
                                className="label-content">
                                Notas
                            </label>
                            <textarea
                                id="notas"
                                type="text"
                                className="textarea-content"
                                value={this.state.notas}
                                onChange={this.onChangeNotas}
                            />
                        </div>
                    </div>
                </div>
                    
                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-12-content">
                        <div className="col-lg-4-content">
                            <Button
                                onClick={this.agregarTodos}>
                                {this.state.txtBtnTodos}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-12-content">
                        <div className="col-lg-1-content">
                            <label style={{color: 'black'}}>Nro</label>
                        </div>
                        <div className="col-lg-1-content">
                            <label style={{color: 'black'}}>Id</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label style={{color: 'black'}}>Descripcion</label>
                        </div>
                        <div 
                            className="col-lg-3-content"
                            style={{ overflowX: 'scroll'}}
                            >
                            { componentTitleAlmacen }
                        </div>

                        <div className="col-lg-3-content">
                            <label className="col-lg-12-content" style={{color: 'black'}}>Stock Total</label>
                            <div className="col-lg-6-content">
                                <label style={{color: 'black'}}>Anterior</label>
                            </div>
                            <div className="col-lg-6-content">
                                <label style={{color: 'black'}}>Nuevo</label>
                            </div>
                        </div>
                    </div>

                    <div className="caja-content">
                            {
                                this.state.productosSelected.map((item, key) => (
                                    <div key={key} className="col-lg-12-content border-table">
                                        <div className="col-lg-1-content">
                                            <label>{key + 1}</label>
                                        </div>
                                        <div className="col-lg-1-content">
                                            <label>{item.idproducto}</label>
                                        </div>
                                        <div className="col-lg-2-content">
                                            <label>{item.descripcion}</label>
                                        </div>
                                        <div 
                                            className="col-lg-3-content"
                                            style={{ width: '25%', overflowX: 'scroll' }}
                                            >
                                            { this.componentBodyAlmacen(key) }
                                        </div>

                                        
                                        <div className="col-lg-3-content">
                                            <div className="col-lg-6-content">
                                                <input 
                                                    id={key} 
                                                    type="text"
                                                    value={this.state.arrayStocksTotales[key].anterior}
                                                    placeholder="Valor"
                                                    //onChange={this.handlePrecioProd}
                                                    className="form-control-content" 
                                                />
                                            </div>
                                            <div className="col-lg-6-content">
                                                <input 
                                                    id={key} 
                                                    type="text"
                                                    value={this.state.arrayStocksTotales[key].nuevo}
                                                    placeholder="Valor"
                                                    //onChange={this.handlePrecioProd}
                                                    className="form-control-content" 
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-1-content">
                                            <i
                                                className="fa fa-remove btn-content btn-danger-content"
                                                key={key}
                                                //onClick={() => this.removeProductSelected(key)}
                                                >
                                            </i>
                                        </div>
                                    </div>    
                                    
                                ))
                            }
                        </div>
                </div>        
                    
                <div className="form-group-content">
                    <div className="text-center-content">
                        <button 
                            type="button" 
                            className="btn-content btn-success-content"
                            onClick={this.showConfirmStore.bind(this)}>
                            Guardar
                        </button>
                        <button
                            className="btn-content btn-danger-content" 
                            type="button" 
                            onClick={this.showConfirmCancel.bind(this)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


