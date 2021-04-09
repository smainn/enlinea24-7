
import React, { Component } from 'react';

export default class ShowProveedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {}
    }

    componentDidMount() {
        console.log(this.props.bandera);
    }


    visualizarImagen() {
        if (this.props.proveedor.foto != null) {
            return (
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-xs">
                         <img src={this.props.proveedor.foto} style={{'cursor': 'pointer'}}
                            alt="none" className='img-principal'></img>
                    </div>
                </div>
            )
        }else {
            return (
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-xs">
                         <img src="/images/default.jpg"
                         alt="none" className="img-principal"/>
                    </div>
                </div>
            )
        }
        
    }

    cerrarModal() {
        this.props.callback();
    }

    render() {
        return (
            <div className="form-group-content"
                style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>
                <div className="form-group-content col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content"
                    style={{'borderBottom': '1px solid #e8e8e8'}}>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.proveedor.codproveedor} </label>
                        </div>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Nit/Ci:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.proveedor.nit} </label>
                        </div>
                    </div>
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Nombre:</label>
                        </div>
                        <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.proveedor.nombre} {this.props.proveedor.apellido}</label>
                        </div>
                    </div>
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Ciudad:</label>
                        </div>
                        <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.proveedor.ciudad}</label>
                        </div>
                    </div>
                </div>
                <div className="form-group-content col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                    {this.visualizarImagen()}
                </div>

                <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                        
                        <div className="card-caracteristica bd-null">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Detalles para Contactarlo </h1>
                            </div>
                            <div className="caja-content caja-content-alturaView">
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                    style={{'borderBottom': '1px solid #e8e8e8'}}>
                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                        <label className="label-content-modal">
                                            Referencia
                                        </label>
                                    </div>
                                    <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                        <label className="label-content-modal" style={{'marginLeft': '-15px'}}>
                                            Descripcion
                                        </label>
                                    </div>
                                </div>
                                {this.props.contacto.map(
                                    (resultado, indice) => {
                                        return (
                                            <div key={indice}>
                                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"

                                                    style={{'marginTop': '-5px', 'marginBottom': '-5px', 'borderBottom': '1px solid #e8e8e8'}}>
                                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                                        
                                                        <label className="label-content-modal label-group-content-nwe" style={{'marginLeft': '10px'}}>
                                                            {resultado.descripcion} :
                                                        </label>
                                                        
                                                    </div>
                                                    <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                                        
                                                        <span className="lbl-subtitle-content" style={{'marginLeft': '-20px'}}>
                                                            {resultado.valor}
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
                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                        
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="label-content-modal label-group-content-nwe">Notas</label>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <textarea readOnly className="form-textarea-content" 
                                value={(this.props.proveedor.notas != null)?this.props.proveedor.notas:''}></textarea>
                        </div>

                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <label className="label-content-modal label-group-content-nwe">Descripcion</label>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <textarea readOnly className="form-textarea-content" 
                                value={(this.props.proveedor.contactos != null)?this.props.proveedor.contactos:''}></textarea>
                        </div>

                    </div>
                </div>
                <div className="form-group-content" style={{'padding': '0', 'borderTop': '1px solid #e8e8e8'}}>
                    <div className="pull-right-content">
                        <a onClick={this.cerrarModal.bind(this)}
                            className="btn-content btn-sm-content btn-blue-content">
                                Aceptar
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}