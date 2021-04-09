

import React, { Component } from 'react';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class IndexFamilia extends Component{

    constructor(){

        super();
        this.state = {

            familiaCategoria: [],
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

        }
    }
    
    componentDidMount() {

        this.getFamilia();
        for (var i = 0; i < 1; i++) {
            this.state.validacion.push(1);
        }
        this.setState({
            validacion: this.state.validacion
        });

    }

    getFamilia() {
        var url = 'indexFamilia';
        axios.get(url).then( resultado => {
            if(resultado.data.ok){
                this.onChangeVistaFamilia(resultado.data.data);
            }
        }).catch( error => {
            console.log(error)
        });
    }

    onChangeVistaFamilia(data) {
        this.setState({
            arbolFamilia: data
        });

        var array = data;
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

        var vistaHTML = [];
        var vistaIdPadre = [];

        this.onChangeArbolFamiliaShow(array_aux, vistaHTML, vistaIdPadre);

        this.state.vistaFamilia[0] = (<ul className="menu" id="menu">{vistaHTML}</ul>)
        
        this.setState({
            vistaFamilia: this.state.vistaFamilia
        });
    }

    esPadre(id) {
        var array =  this.state.arbolFamilia;

        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrefamilia === id){
                return false;
            }
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i].idfamilia === id) {
                if (array[i].idpadrefamilia == null) {
                    return true;
                }
            }
        }
        return false;
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
                            <li className="item-cotent" key={data[i].children[j].value}>
                                <input type="checkbox" id={data[i].children[j].value} />
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
                        <input type="checkbox" id={data[i].value} />
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
            }  else {
                if (this.esPadre(data[i].value)) {
                    vistaHTML.push(
                        <li className="item-content" key={data[i].value}>
                            <input type="checkbox" id={data[i].value} />
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
            if(array[i].idpadrefamilia === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idfamilia
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
            descripcionFamilia: e.target.value,
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
        if (this.state.bandera === 1) {
            return (
                <Modal
                    title={this.state.titleModal}
                    visible={this.state.visibleModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >

                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitCrear.bind(this)} encType="multipart/form-data">

                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"></div>
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" ref={function(input) {if (input != null) {input.focus();}}}
                                            value={this.state.descripcionFamilia}
                                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-outline-content':'form-outline-content error'}
                                            placeholder="Agregar descripcion..."
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Descripcion</label>
                                    </div>
                                </div>


                                <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btn-content btn-sm-content btn-blue-content">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btn-content btn-sm-content btn-cancel-content">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                        
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            );
        }
        if (this.state.bandera === 2) {
            return (
                <Modal
                    title={this.state.titleModal}
                    visible={this.state.visibleModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >

                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitCrear.bind(this)} encType="multipart/form-data">
                                
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                    style={{'marginTop': '-10px'}}>
                                    <label className="title-sublogo-content">Categoria: <span>{this.state.descripcionPadre}</span></label>
                                </div>

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"></div>
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" ref={function(input) {if (input != null) {input.focus();}}}
                                            value={this.state.descripcionFamilia}
                                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-outline-content':'form-outline-content error'}
                                            placeholder="Agregar descripcion..."
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Descripcion</label>
                                    </div>
                                </div>


                                <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btn-content btn-sm-content btn-blue-content">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btn-content btn-sm-content btn-cancel-content">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                        
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            );
        }
        if (this.state.bandera === 3) {
            return (
                <Modal
                    title={this.state.titleModal}
                    visible={this.state.visibleModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >

                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitCrear.bind(this)} encType="multipart/form-data">

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"></div>
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" ref={function(input) {if (input != null) {input.focus();}}}
                                            value={this.state.descripcionFamilia}
                                            onChange={this.onChangeDescripcionFamilia.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-outline-content':'form-outline-content error'}
                                            placeholder="Agregar descripcion..."
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Descripcion</label>
                                    </div>
                                </div>


                                <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btn-content btn-sm-content btn-blue-content">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btn-content btn-sm-content btn-cancel-content">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                        
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            );
        }
        if (this.state.bandera === 4) {
            return (
                <Modal
                    title={this.state.titleModal}
                    visible={this.state.visibleModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >

                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitEliminar.bind(this)} encType="multipart/form-data">

                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="text-center-content" style={{'marginTop': '-10px'}}>
                                        <label className="title-sublogo-content"><span>¿Estas seguro de eliminar {this.state.descripcionPadre} ?</span></label>
                                    </div>
                                </div>

                                <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btn-content btn-sm-content btn-blue-content">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btn-content btn-sm-content btn-cancel-content">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                        
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            );
        }
    }

    onSubmitCrear(e) {
        e.preventDefault();
        if (this.state.descripcionFamilia.length > 0) {

            const formData = new FormData();
            formData.append('descripcionFamilia', this.state.descripcionFamilia);
            formData.append('banderaFamilia', this.state.bandera);
            formData.append('idPadre', this.state.idFamiliaElegido);

            this.setState({
                loadModal: true
            });

            axios.post('/commerce/admin/postFamilia', formData).then(
                response => {
                    
                    if (response.data.response === 1) {
                        this.onChangeVistaFamilia(response.data.data);
                        this.handleCerrar();
                        message.success('datos guardados exitosamente');
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );

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

        const formData = new FormData();

        formData.append('idPadre', this.state.idFamiliaElegido);

        this.setState({
            loadModal: true
        });

        axios.post('/commerce/admin/anularFamilia', formData).then(
            response => {
                
                if (response.data.response === 1) {
                    this.onChangeVistaFamilia(response.data.data);
                    this.handleCerrar();
                    message.success('Exito en la anulacion');
                    
                }
                if (response.data.response === 2) {
                    this.handleCerrar();
                    message.warning('Ups No se pudo anular por que tiene hijos');
                }

                if (response.data.response === 3) {
                    this.handleCerrar();
                    message.warning('Ups No se pudo anular por que esta registrado a un producto');
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }

    render() {

        const componentModalShow = this.onChangeModalShow();

        return (

            <div className="row-content">
                
                {componentModalShow}

                <div className="card-body-content card-primary-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Listado de Familia </h1>
                    </div>
                    <div className="pull-right-content">
                        <a onClick={this.abrirModal.bind(this, 1, 0, '')}
                            className="btn-content btn-sm-content btn-primary-content">
                            <i> Nuevo </i>
                        </a>
                    </div>

                </div>
                <div className="card-header-content card-success-content">
                    <div className="multi-menu-content" style={{'marginBottom': '40px'}}>
                        {this.state.vistaFamilia[0]}
                    </div>
                </div>
            </div>
        );

    }
}




