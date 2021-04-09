

import React, { Component } from 'react';

import { Modal } from 'antd';

import 'antd/dist/antd.css';

export default class ShowVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {
            indice: 0,
            visible: false,
            imagen: [],
            tecla: 0,
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'ArrowRight') {
                this.onChangeNext();
            }
            if(e.key === 'ArrowLeft') {
                this.onChangePreview();
            }
        }
    }

    onChangePreview() {
        if (this.props.imagen.length > 1){
            var indicePreview = this.state.indice;

            if (indicePreview === 0){
                indicePreview = this.props.imagen.length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.setState({
                indice: indicePreview
            })
        }
    }

    onChangeNext() {
        if (this.props.imagen.length > 1){
            var indiceNext = this.state.indice;

            if (indiceNext === (this.props.imagen.length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.setState({
                indice: indiceNext
            })
        }
    }

    cerralModal() {
        this.setState({
            indice: 0,
            tecla: 0,
        });
        this.props.callback();
    }

    abrirImagen() {
        this.setState({
            visible: true,
            tecla: 1,
        });
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            tecla: 0,
        });
    }

    componentModalImagen() {
        return (
            <Modal
                visible={this.state.visible}
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                closable={false}
                width={600}
                bodyStyle={{'padding': '0 0 0 0'}}
            >
                <div style={{'background': 'red'}} className="content-img">

                    <i className="fa fa-times fa-delete-image" onClick={this.handleCerrarModal.bind(this)}> </i>

                    {(this.props.imagen.length === 0)?'':
                        <img src={this.props.imagen[this.state.indice].foto} 
                            alt="none" className="img-principal"
                            style={{'objectFit': 'fill'}}
                        />
                    }

                    {(this.props.imagen.length > 1)?
                        <div className="pull-left-content">
                            <i onClick={this.onChangePreview.bind(this)}
                                className="fa-left-content fa fa-angle-double-left"> </i>
                        </div>:''
                    }
                    {(this.props.imagen.length > 1)?
                        <div className="pull-right-content">
                            <i onClick={this.onChangeNext.bind(this)}
                                className="fa-right-content fa fa-angle-double-right"> </i>
                        </div>:''
                    }
                
                </div>
            </Modal>
        );
    }

    render() {

        const componentModalImage = this.componentModalImagen();
       
        return (
            <div className="form-group-content" style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>
                {componentModalImage}
                <div className="form-group-content col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content"
                    style={{'borderBottom': '1px solid #e8e8e8'}}>
                    
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Codigo:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{this.props.vehiculo.codvehiculo}</span>
                        </div>
                    </div>

                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Tipo:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{(this.props.vehiculo.tipopartpublic === 'R'?'Privado':'Publico')}</span>
                        </div>
                    </div>

                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Placa:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{this.props.vehiculo.placa}</span>
                        </div>
                    </div>

                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Chasis:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{this.props.vehiculo.chasis}</span>
                        </div>
                    </div>

                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Cliente:</label>
                        </div>
                        <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{this.props.vehiculo.nombre} {this.props.vehiculo.apellido}</span>
                        </div>
                    </div>

                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Vehiculo:</label>
                        </div>
                        <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                            <span className="lbl-subtitle-content">{this.props.vehiculo.descripcion}</span>
                        </div>
                    </div>
                </div>

                <div className="form-group-content col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                    <div className="card-caracteristica">
                        <div className="caja-img caja-altura">
                            {(this.props.imagen.length === 0)?
                                <img src="/images/default.jpg" alt="none" className="img-principal" />:

                                <img style={{'cursor': 'pointer'}} onClick={this.abrirImagen.bind(this)}
                                    src={this.props.imagen[this.state.indice].foto}
                                    alt="none" className="img-principal" />
                            }
                        </div>
                        {(this.props.imagen.length > 1)?
                            <div className="pull-left-content">
                                <i onClick={this.onChangePreview.bind(this)}
                                    className="fa-left-content fa fa-angle-double-left"> </i>
                            </div>:''
                        }
                        {(this.props.imagen.length > 1)?
                            <div className="pull-right-content">
                                <i onClick={this.onChangeNext.bind(this)}
                                    className="fa-right-content fa fa-angle-double-right"> </i>
                            </div>:''
                        }
                    </div>
                </div>

                <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                
                    <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="card-caracteristica bd-null">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Detalles del Vehiculo </h1>
                            </div>

                            <div className="caja-content caja-content-alturaView">
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                        <label className="lbl-title-content" style={{'fontSize': '15px'}}>
                                            Caracteristica
                                        </label>
                                    </div>
                                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                        <label className="lbl-title-content" style={{'fontSize': '15px', 'marginLeft': '-25px'}}>
                                            Descripcion
                                        </label>
                                    </div>
                                </div>
                                {this.props.caracteristica.map(
                                    (resultado, indice) => {
                                        return (
                                            <div key={indice}>
                                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                                    style={{'marginTop': '-10px', 'borderTop': '1px solid #e8e8e8', 'marginBottom': '5px'}}>
                                                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                        
                                                        <label className="lbl-title-content" style={{'marginLeft': '10px'}}>
                                                            {resultado.caracteristica} :
                                                        </label>
                                                        
                                                    </div>
                                                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                        
                                                        <span className="lbl-subtitle-content" style={{'marginLeft': '-22px'}}>
                                                            {resultado.descripcion}
                                                        </span>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                    
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                            style={{'marginTop': '10px'}}>
                            <label className="lbl-title-content">Descripcion</label>
                        </div>

                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <textarea readOnly className="form-textarea-content" value={(this.props.vehiculo.detalle === null)?'':this.props.vehiculo.detalle}></textarea>
                        </div>

                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="lbl-title-content">Notas</label>
                        </div>

                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <textarea readOnly className="form-textarea-content" value={(this.props.vehiculo.notas === null)?'':this.props.vehiculo.notas}></textarea>
                        </div>

                    </div>

                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                        style={{'borderTop': '1px solid #e8e8e8'}}>
                        <div className="pull-right-content">
                            <button onClick={this.cerralModal.bind(this)}
                                type="button" className="btn-content btn-sm-content btn-blue-content">
                                Cerrar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );

    }
}




