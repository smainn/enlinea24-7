

import React, { Component } from 'react';

import 'antd/dist/antd.css';

export default class ShowCliente extends Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    visualizarImagen() {
        if (this.props.cliente[0].foto != null && this.props.cliente[0].foto != '') {
            return (
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src={this.props.cliente[0].foto} alt="none" className='img-principal'></img>
                    </div>
                </div>
            )
        }else {
            return (
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src="/images/default.jpg"  style={{'cursor': 'pointer'}}
                         alt="none" className="img-principal"/>
                    </div>
                </div>
            )
        }
        
        
    }

    render() {
       
        return (
            <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                style={{'marginTop': '-20px'}}>
                <div className="form-group-content" style={{'padding': '0'}}>
                    <div className="form-group-content col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content"
                        style={{'borderBottom': '1px solid #e8e8e8'}}>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].codcliente} </label>
                            </div>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Tipo Cliente:</label>
                            </div>
                            <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].tipo} </label>
                            </div>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Tipo:</label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].tipopersoneria === 'J'?"Juridico":"Natural"} </label>
                            </div>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Nit/Ci:</label>
                            </div>
                            <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].nit} </label>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Nombre:</label>
                            </div>
                            <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].nombre} {this.props.cliente[0].apellido}</label>
                            </div>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Fecha {this.props.cliente[0].tipopersoneria === 'J'?"Fun":"Nac"}:</label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].fechanac}</label>
                            </div>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Sexo:</label>
                            </div>
                            <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                <label> 
                                    {(this.props.cliente[0].sexo === 'M')?'Masculino':
                                        (this.props.cliente[0].sexo === 'F')?'Femenino':'Sin Definir'}
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Ciudad:</label>
                            </div>
                            <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                                <label> {this.props.cliente[0].ciudad}</label>
                            </div>
                        </div>
                    </div>
            
                    <div className="form-group-content col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        {this.visualizarImagen()}
                    </div>

                    <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <div className="card-caracteristica bd-null">
                                <div className="pull-left-content">
                                    <h1 className="title-logo-content"> Detalles para Contactarlo </h1>
                                </div>
                                <div className="caja-content caja-content-alturaView">
                                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                            <label className="label-content-modal label-group-content-nwe" style={{'fontSize': '18px'}}>
                                                Referencia
                                            </label>
                                        </div>
                                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                            <label className="label-content-modal label-group-content-nwe" style={{'marginLeft': '20px', 'fontSize': '18px'}}>
                                                Descripcion
                                            </label>
                                        </div>
                                    </div>
                                    {this.props.contactoCliente.map(
                                        (resultado, indice) => {
                                            return (
                                                <div key={indice}>
                                                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"

                                                        style={{'marginTop': '-10px', 'marginBottom': '-5px'}}>
                                                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                                            
                                                            <label className="label-content-modal label-group-content-nwe" style={{'marginLeft': '10px'}}>
                                                                {resultado.descripcion} :
                                                            </label>
                                                            
                                                        </div>
                                                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                                            
                                                            <span className="lbl-subtitle-content" style={{'marginLeft': '30px'}}>
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
                        <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            
                            {(this.props.cliente[0].contacto != null)?
                                <div>
                                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                        <label className="label-content-modal label-group-content-nwe">Contacto</label>
                                    </div>
                                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                        <textarea readOnly className="form-textarea-content" 
                                            value={(this.props.cliente[0].contacto != null)?this.props.cliente[0].contacto:''}></textarea>
                                    </div>
                                </div>:''
                            }
                            

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                <label className="label-content-modal label-group-content-nwe">Observaciones</label>
                            </div>
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                <textarea readOnly className="form-textarea-content" 
                                    value={(this.props.cliente[0].notas != null)?this.props.cliente[0].notas:''}></textarea>
                            </div>
                            
                        </div>
                    </div>
                </div>
            
            </div>
        );

    }
}




