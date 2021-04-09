
import { message } from 'antd';
import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

import Confirmation from '../../../componentes/confirmation';
import C_Button from '../../../componentes/data/button';

export default class AddQr extends Component {

    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return(
            <Confirmation
                visible={this.props.visible}
                loading={this.props.loading}
                title="Lector de QR"
                zIndex={900} style={{ top: 30, }}
                width={400}
                content={
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, marginTop: -35, }}>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <QrReader 
                                    style={{ width: 300, height: 300, margin: 'auto', }}
                                    onError={ (error) => {
                                        console.log('Error web scam')
                                        console.log(error)
                                        message.error( 'Error al ingresar al cámara' );
                                    } }
                                    delay={10000}
                                    onScan={ ( result ) => {
                                        
                                        this.props.onSanWebCan(result)
                                        
                                    } }
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginTop: 55, }}>
                            <div style={{textAlign: 'center', paddingRight: 5, }}>
                                <C_Button
                                    title={'Cancelar'}
                                    type='danger'
                                    onClick={ this.props.onCancel }
                                /> 
                            </div>
                        </div>
                    </div>
                }
            />
        );
    }

}
