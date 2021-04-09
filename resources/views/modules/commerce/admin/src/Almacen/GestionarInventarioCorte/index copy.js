
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { message, Modal, Spin, Icon, Pagination } from 'antd';
import 'antd/dist/antd.css';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import keys from '../../../tools/keys';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexInventarioCorte extends Component{

    constructor() {
        
        super();
        this.state = {
            inventarios: [],
            pagination: {},
            visibleModalVer: false,
            descripcion: '',
            fecha: '',
            notas: '',
            almacenes: [],
            arrayAlmacenes: [],
            selectAlmacenes: [],
            productos: [],
            almacenes: [],
            stockTotales: [],
            noSesion: false
        }
        
        
        this.permisions = {
            btn_nuevo: readPermisions(keys.inventario_corte_btn_nuevo),
            btn_ver: readPermisions(keys.inventario_corte_btn_ver),
            btn_editar: readPermisions(keys.inventario_corte_btn_editar),
            btn_eliminar: readPermisions(keys.inventario_corte_btn_eliminar),
            fecha: readPermisions(keys.inventario_corte_fecha),
            almacenes: readPermisions(keys.inventario_corte_select_almacen),
            descripcion: readPermisions(keys.inventario_corte_textarea_descripcion),
            notas: readPermisions(keys.inventario_corte_textarea_notas),
            btn_add_all: readPermisions(keys.inventario_corte_btn_add_all),
            familias: readPermisions(keys.inventario_corte_treselect_familia),
            search_prod: readPermisions(keys.inventario_corte_search_producto)
        }

        this.componentBodyAlmacen = this.componentBodyAlmacen.bind(this);
        this.componentBodyModalVer = this.componentBodyModalVer.bind(this);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to={routes.inventario_create} className="btns btns-primary">
                    <i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    btnEditar(item) {
        if (item.estado == 'P' && this.permisions.btn_editar.visible == 'A') {
            return (
                <Link 
                    to={routes.inventario_edit + '/' + item.idinventariocorte}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        } 
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a 
                    onClick={this.abrirModalShow.bind(this, id)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    onClick={this.showConfirmDelete.bind(this, id)}
                    className="btns btns-sm btns-outline-danger"
                    aria-label="eliminar" >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
    }

    componentDidMount() {
        this.getInventarios();
    }

    getInventarios() {

        httpRequest('get', ws.wsinventariocorte)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    inventarios: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })


    }

    onChangePage(page, pageSize) {
        
        httpRequest('get', ws.wsinventariocorte + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    inventarios: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({  noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    calcularTotalesStocks(almacenes) {
        
        let result = [];
        let length = almacenes.length;
        for (let i = 0; i < length; i++) {
            let array = almacenes[i];
            let size = array.length;
            let sum1 = 0;
            let sum2 = 0;
            for (let j = 0; j < size; j++) {
                sum1 = sum1 + parseInt(array[j].stockanterior);
                sum2 = sum2 + parseInt(array[j].stocknuevo);
            }
            result.push({
                anterior: sum1,
                nuevo : sum2
            });
        }
        return result;
    }

    getInventarioCorte(id) {

        httpRequest('get', ws.wsinventariocorte + '/' + id)
        .then((result) => {
            if (result.response == 1) {

                this.setState({
                    visibleModalVer: true,
                    productos: result.productos,
                    arrayAlmacenes: result.almacenes,
                    descripcion: result.descripcion,
                    fecha: result.fecha,
                    estado: result.estado,
                    notas: result.notas,
                    almacenes: result.almacenesAll,
                    selectAlmacenes: result.selectAlmacenes,
                    stockTotales: this.calcularTotalesStocks(result.almacenes)
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }) 
        .catch((error) => {
            console.log(error);
        })
       
    }

    deleteInventarioCorte(id) {

        httpRequest('delete', ws.wsinventariocorte + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    inventarios: result.data,
                    pagination: result.pagination
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problea con al conexion');
        })

    }

    showConfirmDelete(id) {
        console.log(id);
        const deleteInventarioCorte = this.deleteInventarioCorte.bind(this);
        Modal.confirm({
            title: 'Elimiar Corte Inventario',
            content: '¿Estas seguro de eliminar el corte de invetario?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deleteInventarioCorte(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentEdit(item) {
        if (item.estado == 'P') {
            return (
                <Link 
                    to={routes.inventario_edit + '/' + item.idinventariocorte}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        } 
        return null;
    }

    getAlmacen(id) {

        let array = this.state.almacenes;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (id == array[i].idalmacen)
                return array[i];
        }
    }

    componentTitleAlmacen() {

        let array = this.state.selectAlmacenes;
        let length = array.length;
        let component = [];
        for (let i = 0; i < length; i++) {
            if (array[i] != 0) {
                let almacen = this.getAlmacen(array[i]);
                component.push(
                    <div 
                        style={{ 
                            padding: 5, 
                            flexDirection: 'column',
                            paddingLeft: 15
                        }}
                    >       
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <label 
                                style={{ color: 'blue'}}>
                                {almacen.descripcion}
                            </label>
                        </div>
                        
    
                        <div style={{ display: 'flex'}}>
                            <label style={{color: 'blue', padding: 2}}>Anterior</label>
                            <label style={{color: 'blue', padding: 2 }}>Nuevo</label>
                        </div>
                    </div>
                );
            }
            
        }
        return component;

    }

    inArrayAlmacen(idalmacen, array) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idalmacen == idalmacen) 
                return i;
        }
        return -1;
    }

    componentBodyAlmacen(index) {
        let array = this.state.selectAlmacenes;
        //console.log('SELECT ALMACENES ', array);
        let length = array.length;
        let component = [];
        for (let i = 0; i < length; i++) {
            //console.log('ELEM A BUSCAR ', array[i]);
            //console.log('LUGAR A BUSCAR ', this.state.arrayAlmacenes[index]);
            let posicion = this.inArrayAlmacen(array[i], this.state.arrayAlmacenes[index]);
            if (posicion >= 0) {
                component.push(
                    <div style={{ width: 130, padding: 9, display: 'flex' }}>
                        <div 
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>{this.state.arrayAlmacenes[index][posicion].stockanterior}</label>
     
                        </div>
                        <div
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>{this.state.arrayAlmacenes[index][posicion].stocknuevo}</label>
                        </div>    
                    </div>
                );
            } else {
                component.push(
                    <div style={{ width: 130, padding: 9, display: 'flex' }}>
                        <div 
                            className="input-group-content"
                            style={{ width: 65,  display: 'flex'}}>
                            <label>0</label>
                        </div>    
                        <div
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>0</label>
                        </div>
                    </div>
                )
            }
        }
        return component;
    }

    closeModalVer() {
        this.setState({ visibleModalVer: false});
    }

    abrirModalShow(id) {
        this.getInventarioCorte(id);
    }

    componentBodyModalVer() {
        const componentTitleAlmacen = this.componentTitleAlmacen();
        return(
            <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                    <div className="col-lg-4-content col-md-4-content col-sd-4-content">
                        <Input 
                            title="Fecha"
                            value={this.state.fecha}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                    <div className="input-group-content col-lg-7-content colmd-7-content col-sd-7-content">
                        <TextArea
                            title="Descripcion"
                            value={this.state.descripcion}
                            readOnly={true}
                        />
                    </div>
                    <div className="input-group-content col-lg-5-content colmd-5-content col-sd-5-content">
                        <TextArea
                            title="Notas"
                            value={this.state.notas}
                            readOnly={true}
                        />
                    </div>
                </div>
                
                <div 
                    className="col-lg-12-content col-md-12-content col-sd-12-content"
                    style={{ overflow: 'scroll', height: 400 }}
                    >
                    <div className="col-lg-5-content col-md-4-content col-sd-4-content">
                        <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                            <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                <label style={{color: 'blue'}}>Nro</label>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                <label style={{color: 'blue'}}>Id</label>
                            </div>
                            <div className="col-lg-6-content col-md-6-content col-sd-6-content">
                                <label style={{color: 'blue'}}>Descripcion</label>
                            </div>
                        </div>

                        <div 
                            className="col-lg-12-content col-md-12-content col-sd-12-content"
                            style={{ paddingTop: 45 }}
                        >
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="col-lg-12-content col-md-12-content col-sd-12-content"
                                        style={{ paddingTop: 15 }}
                                    >
                                        <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                            <label>{key + 1}</label>
                                        </div>
                                        <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                            <label>{item.idproducto}</label>
                                        </div>
                                        <div className="col-lg-6-content col-md-6-content col-sd-6-content">
                                            <label>{item.descripcion}</label>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div 
                        className="col-lg-4-content col-md-4-content col-sd-4-content"
                        style={{ overflowX: 'scroll', }}
                    >
                        <div 
                            className="col-lg-12-content"
                            style={{  
                                width: '100%',
                                paddingLeft: 20, 
                                display: 'flex'
                            }}
                        >
                            { componentTitleAlmacen }
                        </div>

                        <div 
                            className="col-lg-12-content"
                            style={{ paddingTop: '5%' }}
                            >
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="col-lg-12-content"
                                        style={{ paddingTop: 5, display: 'flex' }}
                                    >
                                        { this.componentBodyAlmacen(key) }
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="col-lg-3-content col-md-4-content col-sd-4-content">
                        <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                            <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                                <label 
                                    className="col-lg-12-content" 
                                    style={{
                                        color: 'blue', 
                                        marginLeft: 25 
                                    }}>
                                    Stock Total</label>
                            </div>
                            <div className="col-lg-12-content">
                                <label style={{
                                    color: 'blue', 
                                    padding: 3,
                                    marginLeft: 25
                                    }}>Anterior</label>
                                <label 
                                    style={{
                                        color: 'blue', 
                                        //padding: 2,
                                        //marginLeft: 25
                                    }}>Nuevo</label>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sd-12-content">
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="col-lg-12-content col-md-12-content col-sd-12-content"
                                        style={{ 
                                            marginTop: 2
                                        }}
                                    >
                                        <div 
                                            className="col-lg-12-content col-md-10-content"
                                            style={{ width: 160, display: 'flex' }}
                                        >
                                            <div 
                                                className="col-lg-6-content col-md-6-content"
                                                style={{ width: 60 }}
                                            >
                                                <label>{this.state.stockTotales[key].anterior}</label>
                                            </div> 
                                            <div 
                                                className="col-lg-6-content col-md-6-content"
                                                style={{ width: 60 }}
                                            >
                                                <label>{this.state.stockTotales[key].nuevo}</label>
                                            
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
 
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">

                <Modal
                    title="Detalle Inventario Corte"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,
                        overflow: 'auto'  
                    }}
                >
                    { componentBodyModalVer }
                </Modal>

                <div className="cards">

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Inventario</h1>
                        </div>
                        <div className="pulls-right">
                            { btnNuevo }
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
                                    <option value="10"> 10 </option>
                                    <option value="25"> 25 </option>
                                    <option value="50"> 50 </option>
                                    <option value="100"> 100 </option>
                                </select>
                                <h3 className="lbl-input-form-content active"> Mostrar </h3>
                            </div>
                        </div>
                        
                        <div className="pulls-right">
                            <div className="inputs-groups">
                                <input type="text" 
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}} > 
                                </i>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Descripcion</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.inventarios.map(
                                        (item, key) => (
                                            <tr key={key}>
                                                <td>
                                                    {key + 1}
                                                </td>
                                                <td>
                                                    {item.descripcion}
                                                </td>

                                                <td>
                                                    {(item.estado == 'F') ? 'Finalizado' : 'Pendiente'}
                                                </td>

                                                <td>
                                                    {item.fecha}
                                                </td>
                                                
                                                <td>
                                                    { this.btnVer(item.idinventariocorte) }
                                                    
                                                    { this.btnEditar(item) }

                                                    { this.btnEliminar(item.idinventariocorte) }
                                                    
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="forms-groups">

                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}