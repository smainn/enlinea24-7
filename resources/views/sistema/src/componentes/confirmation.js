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
                bodyStyle={{padding: 10, paddingTop: 6, width: '100%', minWidth: '100%', maxWidth: '100%'}}
                width={this.props.width}
                zIndex={this.props.zIndex}
                onCancel={this.props.onClose}
            >   

                {
                    (this.validar(this.props.onCancel))
                    ?
                    <Icon type="close" onClick={this.onCancel.bind(this)}
                        style={{ fontSize: 13, position: 'absolute', right: 20, top: 10, cursor: 'pointer', background: '#E4E4E4', padding: 8, borderRadius: 50 }} 
                    />
                    :
                    null
                }
                <div className="forms-groups" style={{'display': (this.loading())?'none':'block'}}>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{paddingTop: 0,}}
                        >
                            {this.props.content}
                        </div>
                    </div>

                    <div className="forms-groups"
                        style={{'textAlign': 'right', 'paddingTop': '5px',
                            'display': (this.props.footer)?'block':'none',
                            'borderTop': '1px solid #e8e8e8',
                        }}
                    >
                        {(this.validar(this.props.onCancel))?
                            <C_Button 
                                title={this.props.cancelText}
                                type='danger'
                                onClick={this.onCancel.bind(this)}
                            />:null
                        }
                        {(this.validar(this.props.onClick))?
                            <C_Button 
                                title={this.props.okText}
                                type='primary'
                                onClick={this.onClick.bind(this)}
                            />:null
                        }
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
    footer: PropTypes.bool,
    zIndex: PropTypes.number,
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
    footer: true,
    zIndex: 1000,
}
