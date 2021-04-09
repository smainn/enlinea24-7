
import React, { Component } from 'react';

import axios from 'axios';

import {BrowserRouter as Router, Link, Route} from 'react-router-dom';

import { Pagination, Modal, Table, message } from 'antd';

const URL_GET_PRODUCTOS = '/commerce/api/producto';
const URL_SHOW_PRODUCTO = '/commerce/api/producto/';
const URL_DELETE_PRODUCTO = '/commerce/api/producto/';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 


const columns = [{
    title: 'Caracteristicas',
    dataIndex: 'caracteristica',
    key: 'caracteristica'
  },
  {
    title: 'Descripcion',
    dataIndex: 'descripcion',
    key: 'descripcion',
  }
];

export default class IndexProducto extends Component {

    constructor(){
        super();
        this.state = {
            producto: {
                codproducto: '',
                descripcion: '',
                costo: '',
                precio: 0,
                stock: 0,
                stockminimo: 0,
                stockmaximo: 0,
                palabrasclaves: 0,
                notas: 0,
                comision: 0,
                costodos: 0,
                costotres: 0,
                costocuatro: 0,
                tipo: 'P',
                familia: '',
                moneda: 1,
                unidadmedida: 1,
            },
            productos: [],
            pagination: {},
            visibleModalVer: false,
            visibleModalEli: false,
            almacenes: [],
            codigos: [],
            caracteristicas: [],
            fotos: [],
            indexImg: 0,
            modalImage: 'none',
            tecla: 0,
        }

        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }

    obtenerProductos() {
        axios.get(URL_GET_PRODUCTOS)
        .then((resp) => {
            let result = resp.data;
            console.log('PRODUCTOS ',result);
            if (result.response > 0) {
                this.setState({
                    productos: result.data
                })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) =>{
            console.log(error);
            console.log("ERROR AL OBTENER LOS PRODUCTOS");
        })
    }

    loadDataCaracterisctic(data) {
        
        let array = [];
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                caracteristica: data[i].caracteristica,
                descripcion: data[i].descripcion
            });
        }
        this.setState({
            caracteristicas: array
        });
    }
    
    showProducto(producto) {
        let id = producto.idproducto;
        const URL = URL_SHOW_PRODUCTO + id;
        axios.get(URL)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT SHOW',result);
            //if (result.fotos.length > 0) {
                //console.log(result.fotos);
            //}
            if (result.response > 0) {
                this.loadDataCaracterisctic(result.caracteristicas);
                this.setState({
                   producto: result.producto,
                   visibleModalVer: true,
                   almacenes: result.almacenes,
                   codigos: result.producto.codigos,
                   //caracteristicas: result.caracteristicas,
                   fotos: result.producto.foto
                });
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })

    }

    componentDidMount() {
        
        this.obtenerProductos();
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
                this.cerrarModalImage();
            }
            if (e.key === 'ArrowRight') {
                this.siguienteImg();
            }
            if(e.key === 'ArrowLeft') {
                this.anteriorImg();
            }
        }
    }
    
    deleteProLista(id) {
        
        let data = this.state.productos;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto !== id) {
                array.push(data[i]);
            }
        }
        this.setState({
            productos: array
        });
        
    }

    deleteProducto(producto) {
        let URL = URL_DELETE_PRODUCTO + producto.idproducto;
        axios.delete(URL)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                this.deleteProLista(producto.idproducto);
                message.success(result.message);
            } else {
                message.error(result.message);
            }
            
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        })
    }

    nextPaginate() {

    }

    iconZoom() {
        if (this.state.fotos.length > 0) {
            return (
                <i 
                    className="styleImg fa fa-search-plus" 
                    onClick={() => console.log('hola mundo')/*this.abrirModal.bind(this, 1)*/}> 
                </i>
            )
        } else {
            return null;
        }
    }

    iconDelete() {
        
        if (this.state.fotos.length > 0) {
            return (
                <i 
                    className="styleImg fa fa-times"
                    onClick={() => this.deleteImgIndex() }>
                </i>
            )
        } else {
            return null;
        }
    }

    componentImg() {
        /*
        if (this.state.fotos[this.state.indexImg] !== undefined){
            console.log('La imagen',this.state.fotos[this.state.indexImg].foto);
        }
        */
        if (this.state.fotos.length === 0) {
            return (
                <img 
                    src='/images/default.jpg'
                    //src="/storage/imgcaptura.png"
                    alt="none" className="img-principal" 
                    />
            )
            
        } else {
            return (
                <img 
                    style={{'cursor': 'pointer'}}
                    onClick={this.abrirModalImage.bind(this)}
                    src={this.state.fotos[this.state.indexImg].foto}
                    alt="none" className="img-principal" 
                    />
            )
        }
    }

    siguienteImg() {

        if (this.state.fotos.length > 1) {
            var index = this.state.indexImg;
            var ultimo = this.state.fotos.length - 1;

            if (index === ultimo) {
                index = 0;
            } else {
                index++;
            }
            this.setState({
                indexImg: index
            })
            console.log(this.state.indexImg);
        }
        
    }

    anteriorImg() {
        
        if (this.state.fotos.length > 1) {
            var index = this.state.indexImg;
            let ultimo = this.state.fotos.length - 1;
    
            if (index === 0) {
                index = ultimo;
            } else {
                index--;
            }
            this.setState({
                indexImg: index
            })
            console.log(this.state.indexImg);
        }
        
    }

    componentCosto2() {
        if (this.state.producto.costodos > 0) {
            return (
                <div>
                    <div className="col-lg-3-content">
                        <label className="label-content-modal">
                            Costo Dos
                        </label>
                    </div>
                    <div className="col-lg-3-content">
                        <label>{this.state.producto.costodos}</label>
                    </div>
                </div>
            )
        } else 
            return null;
    }

    componentCosto3() {
        if (this.state.producto.costotres > 0) {
            return (
                <div>
                    <div className="col-lg-3-content">
                        <label className="label-content-modal">
                            Costo Tres
                        </label>
                    </div>
                    <div className="col-lg-3-content">
                        <label>{this.state.producto.costotres}</label>
                    </div>
                </div>
            )
        } else 
            return null;
    }

    componentCosto4() {
        if (this.state.producto.costocuatro > 0) {
            return (
                <div>
                    <div className="col-lg-3-content">
                        <label className="label-content-modal">
                            Costo Cuatro
                        </label>
                    </div>
                    <div className="col-lg-3-content">
                        <label>{this.state.producto.costocuatro}</label>
                    </div>
                </div>
            )
        } else 
            return null;
    }

    componentAuxCod() {
        if (this.state.codigos.length > 0) {
            return (
                <div>
                    <div className="col-lg-3-content">
                        <label className="label-content-modal">{this.state.codigos[0].descripcion}</label>
                    </div>
                    <div className="col-lg-3-content">
                        <label>{this.state.codigos[0].codproduadi}</label>
                    </div>
                </div>
            )
        } else 
            return null;
    }

    abrirModalImage() {
        this.setState({
            modalImage: 'block',
            tecla: 1
        });
    }

    cerrarModalImage() {
        this.setState({
            modalImage: 'none',
            tecla: 0
        })
    }

    componentBodyModalVer() {
        
        const iconDelete = this.iconDelete();
        const iconZoom = this.iconZoom();
        const componentImg = this.componentImg();
        const componentCosto2 = this.componentCosto2();
        const componentCosto3 = this.componentCosto3();
        const componentCosto4 = this.componentCosto4();
        const componentAuxCod = this.componentAuxCod();
        let componentImage = this.componentImgModal();

        let tipo = this.state.producto.tipo == 'P' ? 'Producto' : 'Servicio';
        return (

            <div className="col-lg-12-content body-scroll">
                <div 
                    className="divFormularioImagen" 
                    style={{'display': this.state.modalImage}}
                >
                    {componentImage}
                </div>

                <div 
                    className="divModalImagen" 
                    onClick={this.cerrarModalImage.bind(this)}
                    style={{'display': this.state.modalImage}}
                >  
                </div>

                <div className="col-lg-12-content">
                    <div className="col-lg-8-content">
                        <div className="col-lg-12-content">

                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Codigo</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.codproducto}</label>
                            </div>

                            { componentAuxCod }

                        </div>

                        <div className="col-lg-12-content">
                            {
                                this.state.codigos.map((item, key) => {
                                    if (key > 0 ) {
                                        return (
                                            <div key={key}>
                                                <div className="col-lg-3-content">
                                                    <label className="label-content-modal">{item.descripcion}</label>
                                                </div>
                                                <div className="col-lg-3-content">
                                                    <label>{item.codproduadi}</label>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>

                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Descripcion</label>
                            </div>
                            <div className="col-lg-9-content">
                                <label>{this.state.producto.descripcion}</label>
                            </div>
                        </div>
                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Tipo</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{tipo}</label>
                            </div>

                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Familia</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.familia.descripcion}</label>
                            </div>

                        </div>

                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Unidad Medida</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.unidadmedida.descripcion}</label>
                            </div>

                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Moneda</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.moneda.descripcion}</label>
                            </div>
                        </div>

                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <label className="label-content-modal">Precio</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.precio}</label>
                            </div>

                            <div className="col-lg-3-content">
                                <label className="label-content-modal">
                                    Costo
                                </label>
                            </div>
                            <div className="col-lg-3-content">
                                <label>{this.state.producto.costo}</label>
                            </div>
                        </div>    
        
                        <div className="col-lg-12-content">
                            { componentCosto2 }
                            { componentCosto3 }
                        </div>

                        <div className="col-lg-12-content">
                            { componentCosto4 }
                        </div>
                    </div>

                    <div className="form-group-content col-lg-4-content">
                        <div className="card-caracteristica">
              
                            <div className="caja-img caja-altura">
                                { componentImg }
                            </div>

                            <div className="pull-left-content">
                                <i className="fa-left-content fa fa-angle-double-left"
                                    onClick={() => this.anteriorImg() }> 
                                </i>
                            </div>

                            <div className="pull-right-content">
                                <i className="fa-right-content fa fa-angle-double-right"
                                    onClick={() => this.siguienteImg()}> 
                                </i>
                            </div>

                        </div>
                    </div>
                </div>  

                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-7-content">
                        <div className="col-lg-12-content">

                            <div className="col-lg-12-content">
                                <h4 className="label-content-modal">Caracteristicas del Producto</h4>
                            </div>
                            <div className="col-lg-12-content border-table">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">caracteristicas</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Descripcion</label>
                                </div>
                            </div>

                            <div className="caja-almacen-view-content col-lg-12-content">
                                {
                                    this.state.caracteristicas.map((item , key) => (
                                        <div
                                            key={key}
                                            className="col-lg-12-content"
                                            style={{ marginTop: -10, marginBottom: -10}}
                                        >
                                            <div className="col-lg-6-content">
                                                <p>{item.caracteristica}</p>
                                            </div>
                                            <div className="col-lg-6-content">
                                                <p>{item.descripcion}</p>
                                            </div>
                                        </div>
                                    ))        
                                }
                            </div>

                        </div>
                        <div className="col-lg-12-content">
                            <div className="col-lg-12-content">
                                <label className="label-content-modal">Stock por Almacen</label>
                            </div>

                            <div className="col-lg-12-content border-table">

                                <div className="col-lg-3-content">
                                    <h5 style={{color: '#225ccc'}}>Almacen</h5>
                                </div>
                                <div className="col-lg-2-content">
                                    <h5 style={{color: '#225ccc'}}>Stock</h5>
                                </div>
                                <div className="col-lg-2-content">
                                    <h5 style={{color: '#225ccc'}}>Stock Minimo</h5>
                                </div>
                                <div className="col-lg-2-content">
                                    <h5 style={{color: '#225ccc'}}>Stock Maximo</h5>
                                </div>
                                <div className="col-lg-3-content">
                                    <h5 style={{color: '#225ccc'}}>Ubicacion</h5>
                                </div>

                            </div>

                            <div className="caja-almacen-view-content col-lg-12-content">

                                {
                                    this.state.almacenes.map((item, key) => {
                                        let ubicacion = item.ubicacion == null ? '' : item.ubicacion.descripcion;
                                        return (
                                            <div key={key}
                                                className="col-lg-12-content"
                                                style={{ marginTop: -10, marginBottom: -10}}
                                                >
                                                <div className="col-lg-3-content">
                                                    <p key={key}>{item.almacen}</p>
                                                </div>
                                                <div className="col-lg-2-content">
                                                    <p key={key}>{item.stock}</p>
                                                </div>
                                                <div className="col-lg-2-content">
                                                    <p key={key}>{item.stockminimo}</p>
                                                </div>
                                                <div className="col-lg-2-content">
                                                    <p key={key}>{item.stockmaximo}</p>
                                                </div>
                                                <div className="col-lg-3-content">
                                                    <p key={key}>{ubicacion}</p>
                                                </div>
                                            </div>
                                        )
                                        
                                    })
                                }

                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group-content col-lg-5-content">
                        <div className="col-lg-12-content">
                            <label className="label-content-modal">
                                Palabras Claves
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.producto.palabrasclaves}</label>
                        </div>

                        <div className="col-lg-12-content">
                            <label className="label-content-modal">
                                notas
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.producto.notas}</label>
                        </div>

                        <div className="col-lg-12-content">
                            <label className="label-content-modal">
                                Stock
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.producto.stock}</label>
                        </div>

                        <div className="col-lg-12-content">
                            <label className="label-content-modal">
                                Stock Maximo
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.producto.stockmaximo}</label>
                        </div>

                        <div className="col-lg-12-content">
                            <label className="label-content-modal">
                                Stock Minimo
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.producto.stockminimo}</label>
                        </div>
                    </div>

                </div>
                

            </div>
        );
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    openModalEli() {
        this.setState({ visibleModalEli: true });
    }

    showDeleteConfirm(thisContex,item) {
        console.log(item);
        Modal.confirm({
            title: 'Elimiar Producto',
            content: '¿Estas seguro de eliminar el Producto?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                thisContex.deleteProducto(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    closeModalEli() {
        this.setState({ visibleModalEli: false });
    }

    componentImgModal() {
        return (
            <div className="content-img">
                <i className="fa fa-times fa-delete-image" onClick={this.cerrarModalImage.bind(this)}> </i>
                {(this.state.fotos.length === 0)?'':
                    <img src={this.state.fotos[this.state.indexImg].foto}
                        alt="none" className="img-principal"
                        style={{'objectFit': 'fill', 'borderRadius': '8px'}} />
                }
                {(this.state.fotos.length > 1)?
                <div className="pull-left-content">
                    <i onClick={this.siguienteImg.bind(this)}
                        className="fa-left-content fa fa-angle-double-left"> </i>
                </div>:''
                }
                {(this.state.fotos.length > 1)?
                    <div className="pull-right-content">
                        <i onClick={this.anteriorImg.bind(this)}
                            className="fa-right-content fa fa-angle-double-right"> </i>
                    </div>:''
                }
            </div>
        )
    }

    render() {

        const componentBodyModalVer = this.componentBodyModalVer();
        
        return (

                <div>
                    

                    <Modal
                        title="Detalle del Producto"
                        visible={this.state.visibleModalVer}
                        onOk={this.closeModalVer.bind(this)}
                        onCancel={this.closeModalVer.bind(this)}
                        width={WIDTH_WINDOW * 0.7}
                        bodyStyle={{
                            height: HEIGHT_WINDOW * 0.7,  
                        }}
                        cancelText={"Cancelar"}
                        okText={"Aceptar"}
                    >

                        { componentBodyModalVer }

                    </Modal>

                    <Modal
                        title="Eliminar Producto"
                        visible={this.state.visibleModalEli}
                        onOk={() => {
                            //this.deleteProducto();
                            this.closeModalEli.bind(this)
                        }}
                        onCancel={this.closeModalEli.bind(this)}
                        //width={WIDTH_WINDOW * 0.7}
                    >
                        
                    </Modal>
                        
                    <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Listado de Productos </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/indexProducto/nuevo/crearProducto" className="btn btn-primary-content">
                                    <i> Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <div className="input-group-content">
                                    <select className="form-control-content w-25-content">
                                        <option value="1"> 10 </option>
                                        <option value="2"> 25 </option>
                                        <option value="3"> 50 </option>
                                        <option value="4"> 100 </option>
                                    </select>
                                    <h3 className="title-md-content"> Mostrar </h3>
                                </div>
                            </div>
                            <div className="pull-right-content">
                                <div className="input-group-content">
                                    <input type="text" className="form-control-content w-75-content" placeholder=" Buscar ..."/>
                                    <i className="fa fa-search fa-content"> </i>
                                </div>
                            </div>
                        </div>

                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>Nro</th>
                                    <th>Codigo</th>
                                    <th>Descripcion</th>
                                    <th>Costo</th>
                                    <th>Precio</th>
                                    <th>Tipo</th>
                                    <th>Familia</th>
                                    <th>Unidad Medida</th>
                                    <th>Opcion</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.productos.map((item,key) => {
                                        const tipo = item.tipo == 'P' ? 'Producto' : 'Servicio';
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">Nro: </label>{key + 1}</td>
                                                <td><label className="col-show">Codigo: </label>{item.codproducto}</td>
                                                <td><label className="col-show">Descripcion: </label>{item.descripcion}</td>
                                                <td><label className="col-show">Costo: </label>{item.costo}</td>
                                                <td><label className="col-show">Precio: </label>{item.precio}</td>
                                                <td><label className="col-show">Tipo: </label>{tipo}</td>
                                                <td><label className="col-show">Familia: </label>{item.familia}</td>
                                                <td><label className="col-show">Unidad Med: </label>{item.unidadmedida}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    <a 
                                                        className="btn-content btn-success-content"
                                                        onClick={() => this.showProducto(item)}>
                                                        <i className="fa fa-eye"> </i>
                                                    </a>
                                                    <Link  to={"/commerce/admin/indexProducto/editProducto/" + item.idproducto}
                                                        className="btn-content btn-primary-content" 
                                                        aria-label="editar">
                                                        <i className="fa fa-edit"> </i>
                                                    </Link>
                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        onClick={() => this.showDeleteConfirm(this,item)}>
                                                        <i className="fa fa-trash"> 
                                                        </i>
                                                    </a>
                                                    
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>

                            </table>
                        </div>

                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1} 
                                total={50} 
                            />
                        </div>
                    </div>
                </div>
        );
    }
}
