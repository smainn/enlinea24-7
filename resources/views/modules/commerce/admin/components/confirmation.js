
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {Modal, Spin, Icon} from 'antd';
import "antd/dist/antd.css"; 
import C_Button from './data/button';

export default class Confirmation extends Component{

    constructor(props) {
        super(props);
        this.state = {
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

    loading() {
        return this.props.loading;
    }

    render(){

        return (
            <Modal
                visible={this.props.visible}
                footer={null}
                title={this.props.title}
                style={this.props.style}
                bodyStyle={{padding: 10, paddingTop: 6}}
                width={this.props.width}
            >

                <div className="forms-groups" style={{'display': (this.loading())?'none':'block'}}>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        {this.props.content}
                    </div>

                    <div className="forms-groups" style={{'textAlign': 'right','borderTop': '1px solid #e8e8e8'}}>
                        <C_Button 
                            title={this.props.cancelText}
                            type='danger'
                            onClick={this.onCancel.bind(this)}
                        />
                        <C_Button 
                            title={this.props.okText}
                            type='primary'
                            onClick={this.onClick.bind(this)}
                        />
                    </div>
                </div>

                <div className="forms-groups" style={{'display': (this.loading())?'block':'none'}}
                    >
                    <div className="txts-center" style={{'marginBottom': '20px'}}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                    </div>

                    <div className="txts-center">
                         Cargando Informacion Favor de Esperar ...
                    </div>
                </div>

            </Modal>
        );
    }
}

Confirmation.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    visible: PropTypes.bool,
    width: PropTypes.any,
    data: PropTypes.array,
    content: PropTypes.any,
    loading: PropTypes.bool,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
}

Confirmation.defaultProps = {
    style: {},
    title: 'Titulo',
    visible: false,
    width: 320,
    content: '¿Estas seguro de guardar cambios...?',
    loading: false,
    okText: 'Aceptar',
    cancelText: 'Cancelar',
}

