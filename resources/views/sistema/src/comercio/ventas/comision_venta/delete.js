
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {Modal, Spin, Icon} from 'antd';
import "antd/dist/antd.css"; 
import C_Button from '../../../componentes/data/button';

export default class Confirmacion extends Component{

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
        if (this.validar(this.props.loading)) {
            return this.props.loading;
        }
        return false;
    }

    render(){
        const {
            visible,
            width,
            title,
            content
        } = this.props
        return (
            <Modal
                visible={visible}
                onCancel={this.onCancel.bind(this)}
                footer={null}
                title={title}
                bodyStyle={{padding: 10, paddingTop: 6}}
                width={width}
            >

                <div className="forms-groups" style={{'display': (this.loading())?'none':'block'}}>

                    <div className="txts-center">
                        {content}
                    </div>

                    <div className="forms-groups" style={{'textAlign': 'right'}}>
                        <C_Button
                            title="Cancelar"
                            type="danger"
                            onClick={this.onCancel.bind(this)}
                        />
                        <C_Button
                            title="Aceptar"
                            onClick={this.onClick.bind(this)}
                        />
                        {/*}
                        <button type="button" onClick={this.onCancel.bind(this)}
                            className="btns btns-danger">
                            Cancelar
                        </button>
                        <button type="button" onClick={this.onClick.bind(this)}
                            className="btns btns-primary">
                            Aceptar
                        </button>
                        */}
                    </div>
                </div>

                <div className="forms-groups" style={{'display': (this.loading())?'block':'none'}}
                    >
                    <div className="txts-center">
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



