

import React, { Component, Fragment } from 'react';

import { Link, Redirect,withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Table, Pagination, Select, notification } from 'antd';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import ws from '../../utils/webservices';
import C_Button from '../../componentes/data/button';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import Confirmation from '../../componentes/confirmation';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';

import EditarPlantillaAsienAuto from './edit';

const { Option } = Select;

class PlantillaAsienAutom extends Component{

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            loading: false,

            array_data: [],
            bandera: true,
            idctbtransacautomaticas: null,
            first_data: {nombre: '', id: null, },
            noSesion: false,
        };

        this.permisions = {
            // btn_editar: readPermisions(keys.config_eerr_btn_editar),
        };

    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsplantilla_asien_autom + '/get_data')
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                this.setState({array_data: result.data});
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch(
            error => console.log(error)
        );
    }
    componentTipoAsientoAutomatico() {
        var array = [];
        array.push(
            <Option key={-1} value={''}>
                {'Seleccionar'}
            </Option>
        );
        for (let index = 0; index < this.state.array_data.length; index++) {
            var data = this.state.array_data[index];
            array.push(
                <Option key={data.idctbtransacautomaticas} value={data.idctbtransacautomaticas}>
                    {data.nombre}
                </Option>
            );
        }
        return array;
    }
    onCargarData() {
        if (this.state.idctbtransacautomaticas != null) {
            this.props.history.push(routes.plantilla_asien_autom + '/edit/' + this.state.idctbtransacautomaticas);
            //this.setState({visible: true, });
        }
    }
    onSalir() {
        setTimeout(() => {
            this.setState({
                bandera: true,
                first_data: {nombre: '', id: null, },
                idctbtransacautomaticas: null,
            });
        }, 300);
    }
    component_general() {
        if (this.state.bandera) {
            return (
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title" style={{fontSize: 18,}}>
                                PLANTILLA PARA ASIENTOS AUTOMATICOS DESDE SISTEMA COMERCIAL
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-3 cols-md-3'></div>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingRight: 0, paddingLeft: 0, }}>
                            <C_Select
                                value={this.state.idctbtransacautomaticas}
                                onChange={(value) => this.setState({idctbtransacautomaticas: value,})}
                                title='Tipo de asiento automatico'
                                className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom'
                                component = {this.componentTipoAsientoAutomatico()}
                            />
                        </div>
                        <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{paddingLeft: 3, }}>
                            <C_Button title='Cargar'
                                type='primary'
                                onClick={this.onCargarData.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <EditarPlantillaAsienAuto 
                first_data={this.state.first_data}
                onCancel={this.onSalir.bind(this)}
            />
        );
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.visible}
                    loading={true}
                    title="CARGANDO INFORMACION"
                    width={400}
                    content={'¿Esta seguro de cancelar los registro? Los datos ingresados se perderan.'}
                />
                {this.component_general()}
            </div>
        );
    }
}

export default withRouter(PlantillaAsienAutom);
