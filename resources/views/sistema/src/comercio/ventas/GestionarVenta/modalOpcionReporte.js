
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {Modal} from 'antd';
import "antd/dist/antd.css"; 
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import PropTypes from 'prop-types';

export default class ModalOpcionReportes extends Component{

    constructor(props) {
        super(props);
        this.state = {
        }
        
        this.permisions = {
            btn_reporte_ventas: readPermisions(keys.venta_btn_reporte_ventas),
            btn_reporte_cobrar: readPermisions(keys.venta_btn_reporte_ventas_cobrar),
            btn_reporte_cobros: readPermisions(keys.venta_btn_reporte_ventas_cobros),
            btn_reporte_detalles: readPermisions(keys.venta_btn_reporte_ventas_detalles),
        }
    }

    reporteVentas() {
        if (this.permisions.btn_reporte_ventas.visible == 'A') {
            return (
                <button type="button" onClick={this.onClick.bind(this, 1)}
                    className="btns btns-danger">
                    Ventas
                </button>
            );
        }
        return null;
    }

    reporteVentasCobrar() {
        if (this.permisions.btn_reporte_cobrar.visible == 'A') {
            return (
                <button type="button" onClick={this.onClick.bind(this, 2)}
                    className="btns btns-danger">
                    Ventas por cobrar
                </button>

            );
        }
        return null;
    }

    reporteVentasCobros() {
        if (this.permisions.btn_reporte_cobros.visible == 'A') {
            return (
                <button type="button" onClick={this.onClick.bind(this, 3)}
                    className="btns btns-danger">
                    Ventas de cobros
                </button>
            );
        }
        return null;
    }

    reporteVentasDetalles() {
        if (this.permisions.btn_reporte_detalles.visible == 'A') {
            return (
                <button type="button" onClick={this.onClick.bind(this, 4)}
                    className="btns btns-danger">
                    Ventas detalles
                </button>
            );
        }
        return null;
    }

    reporteVentasHistoricoVehiculo() {
        if (this.props.configtaller) {
            return (
                <button type="button" onClick={this.onClick.bind(this, 5)}
                    className="btns btns-danger">
                        Ventas historico vehiculo
                </button>
            );
        }
    }

    validar(data) {
        if (typeof data == 'undefined'){
            return false;
        }
        return true;
    }

    onCancel(event) {
        if (this.validar(this.props.onCancel)){
            this.props.onCancel(event);
        }
    }
    onClick(event) {
        if (this.validar(this.props.onClick)) {
            this.props.onClick(event);
        }
    }

    render(){
        
        const reporteVentas = this.reporteVentas();
        const reporteVentasCobrar = this.reporteVentasCobrar();
        const reporteVentasCobros = this.reporteVentasCobros();
        const reporteVentasDetalles = this.reporteVentasDetalles();
        const reporteVentasHistoricoVehiculo = this.reporteVentasHistoricoVehiculo();

        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel.bind(this)}
                footer={null}
                title='Reportes'
                width={720}
                bodyStyle={{padding: 10, paddingTop: 6}}
            >

                <div className="forms-groups">

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                        style={{'textAlign': 'center', 'padding': '0'}}>
                        
                        { reporteVentas }

                        { reporteVentasCobrar }

                        { reporteVentasCobros }

                        { reporteVentasDetalles }

                        { reporteVentasHistoricoVehiculo }
                    </div>
                </div>

            </Modal>
        );
    }
}

ModalOpcionReportes.propTypes = {
    configtaller: PropTypes.bool,
    visible: PropTypes.bool,
}

ModalOpcionReportes.defaultProps = {
    configtaller: false,
    visible: false,
}


