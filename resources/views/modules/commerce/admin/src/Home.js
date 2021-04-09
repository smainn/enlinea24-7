
import React, { Component } from 'react';
import Input from '../components/input';
import { Select } from 'antd';
import axios from 'axios';
import ws from '../tools/webservices';
import { save, read, httpRequest } from '../tools/toolsStorage';
//import { getPermisions } from '../tools/toolsPermisions';
import CDatePicker from '../components/datepicker';
import moment from 'moment';

import CSelect from '../components/select2';

const {Option} = Select;
const style = {
    reportrange: {
        'background': '#fff',
        'cursor': 'pointer',
        'padding': '5px 10px',
        'border': '1px solid #ccc'
    }
};

const data = [
    {
        title: 'title1',
        value: 'value1'
    },
    {
        title: 'title2ASDASDASDASDASDASDASDASD',
        value: 'value2'
    },
    {
        title: 'title3ASDASDASDASDASDASDASDASD',
        value: 'value3'
    },
    {
        title: 'title4ASDASDASDASDASDASDASDASD',
        value: 'value4'
    },
    {
        title: 'title5ASDASDASDASDASDASDASDASD',
        value: 'value5'
    }
];


export default class Home extends Component {

    constructor(){
        super();
        this.state = {
            permisions: {
                codigo: {},
                descripcion: {},
                costo: {},
                precio: {},
                stock: {}
            },
            value: '2015-05-05',
            value1: '2015-05-05',
            valueselect: '',
        }

        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this);
        //this.onChange = this.onChange.bind(this);
    }

    onChangeInput(value) {
        this.setState({ value: value});
    }

    componentDidMount() {
        
        let arr = [];
        //console.log("LA LONGITUD ES ", arr.length);
        console.log("PRIMERO ", arr);
        //this.readPermisions();
        let prueba = undefined;
        let prueba2 = 'undefined';
        if (undefined === 'undefined') {
            console.log('son iguales');
        } else {
            console.log('no son iguales');
        }
        //console.log('PRODUCTOS PERMISIONS ', getPermisions('producto'));
        this.getPermisionsRemote();
    }


    async readPermisions() {
        await this.getPermisionsRemote();
        let data = getPermisions('producto');
        //console.log('PERMISION PRODUCTO =======>', data);
        let arr = data[1].items;
        for (let i = 0; i < arr.length; i++) {
            switch (arr[i].nombre) {
                case 'codigo' :
                    this.state.permisions.codigo = arr[i];
                    break;
                case 'descripcion' :
                    this.state.permisions.descripcion = arr[i];
                    break;
                case 'costo' :
                    this.state.permisions.costo = arr[i];
                    break;
                case 'precio' :
                    this.state.permisions.precio = arr[i];
                    break;
                case 'stock' :
                    this.state.permisions.stock = arr[i];
                    break;
            }
        }
        
        this.setState({
            permisions: this.state.permisions
        });
        
    }

    getPermisionsRemote() {
        httpRequest('get', ws.wspermisions + '/1')
        .then((resp) => {
            console.log('RESP ==> ', resp);
        })
        .catch((error) => {
            console.log(error);
        })
        /*
        axios.get(ws.wspermisions + '/1')
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT == >', result);
            if (result.response == 1) {
                this.savePermisions(result.data);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        */
    }


    onChange(date, dateString) {
        console.log('HOME ', date);
        console.log('HOME ', dateString);
        this.setState({
            value1: dateString
        });
    }

    onChangeSelect(value) {
        this.setState({
            valueselect: value
        });
    }
    
    component() {
        
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(<Option 
                        key={i} value={data[i].value}>
                        {data[i].title}
                    </Option>);
        }
        return arr;
    }

    render() {
        const component = this.component();
        const value1 = this.state.value1;
        return (
            <div>
                <div className="row" id="inicio-table">
                    Estas en Home
                    
                    <div className="col-lg-6-content">

                        <Input
                            title="Codigo"
                            value={this.state.value}
                            permisions={this.state.permisions.codigo}
                            onChange={this.onChangeInput}
                        />
                    </div>
                    <div className="col-lg-6-content">
                        <CDatePicker
                            title="ALEX"
                            //defaultValue={moment('2019-05-05')}
                            allowClear={false}
                            value={moment(value1, 'YYYY-MM-DD')}
                            onChange={this.onChange.bind(this)}
                        />
                    </div>
                    
                    <div className="col-lg-3-content">
                        <CSelect
                            value={this.state.valueselect}
                            component={component}
                            onChange={this.onChangeSelect}
                            placeholder={"Seleccionar"}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>

        );
    }
}
