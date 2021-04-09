

import React, { Component } from 'react';

const style = {
    row_content : {
        'width' : '100%',
        'margin-top': '20px'
    }
};


export default class CrearProducto extends Component{

    constructor(){
        super();
        this.handleAddRow = this.handleAddRow.bind(this);
        this.state = {
            items: [1]
        }
    }

    handleAddRow() {
        var newRow = this.state.items.concat(this.state.items.length + 1);
        this.setState({
            items: newRow
        });
    }

    handleRemoveRow(i){
        var newItem = this.state.items;
        newItem.splice(i, 1);
        this.setState({items: newItem});
    }


    render() {

        return (
            <div>
                <div className="row-content">
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Producto </h1>
                        </div>
                    </div>
                    <form action="" className="formulario-content" name="form_register" id="form_register">
                        <div>
                            <div className="form-group-content">
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="codigo" type="text" name="prueba1" className="form-control-content"/>
                                        <label htmlFor="codigo" className="label-content"> Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="placa" type="text" name="prueba2" className="form-control-content"/>
                                        <label htmlFor="placa" className="label-content"> Placa </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="chasis" type="text" name="prueba3" className="form-control-content"/>
                                        <label htmlFor="chasis" className="label-content"> Chasis </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-content">
                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <div className="card-caracteristica">
                                        <div className="pull-left-content">
                                            <h1 className="title-content"> Caracteristica </h1>
                                        </div>
                                        <div className="pull-right-content">
                                            <i className="fa fa-plus fa-form-control" onClick={this.handleAddRow}> </i>
                                        </div>
                                        <div style={style.row_content}>
                                            {
                                                this.state.items.map((valor, i) => {
                                                    return (
                                                        <div>
                                                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                                <select name="referencia" id="referencia" className="form-control-content">
                                                                    <option value="1">Buenas {i}</option>
                                                                    <option value="2">Joven</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                                <input type="text"  id="valor" name="valor" className="form-control-content"/>
                                                                <i className="fa fa-remove fa-form-sd-control" onClick={this.handleRemoveRow.bind(this, i)}> </i>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    `   `
                                </div>
                            </div>
                            <div className="form-group-content">
                                <div className="text-center-content">
                                    <button type="submit" className="btn-content btn-success-content">
                                        Aceptas
                                    </button>
                                    <button type="button" className="btn-content btn-danger-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );

    }
}




