
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../../../utils/toolsStorage';
import keysStorage from '../../../utils/keysStorage';

class Navegation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    existe_data(data, array) {
        if (!Array.isArray(data)) return;
        
        if (data.length == 0) return;

        for (let index = 0; index < data.length; index++) {
            if (data[index].title == this.props.value) {
                array.push(data[index].value);
                return;
            }
            this.existe_data(data[index].children, array);
        }
    }
    updateDataSource(data, array) {
        if (!Array.isArray(data)) return;
        if (data.length == 0) return;

        for (let index = 0; index < data.length; index++) {

            this.updateDataSource(data[index].children, array);

            if (array.length == 0) {

                if (data[index].title == this.props.value) {
                    data[index].value = !data[index].value;
                    array.push(data[index].title);
                } else {
                    data[index].value = false;
                }
            } else {
                var bandera = true;
                if ( Array.isArray(data[index].children) ) {
                    for (let jindex = 0; jindex < data[index].children.length; jindex++) {
                        var menu = data[index].children[jindex];
                        if (menu.title == array[array.length - 1]) {
                            array.push(data[index].title);
                            data[index].value = true;
                            bandera = false;
                        }
                    }
                }
                if (bandera) data[index].value = false;
            }

        }
    }

    className(bandera) {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     if (this.props.data[index].value) {
        //         return `${colors} active`
        //     }
        // }
        // return `${colors}`;

        if ( bandera ) return `${colors} active`;
        return `${colors}`;
    }

    onFocus(event) {
        event.preventDefault();
        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     this.props.data.map(value =>{
        //         if (value.key != this.props.keys) {
        //             value.value = false;
        //         }
        //     });
        //     this.props.data[index].value = !this.props.data[index].value;
        //     this.props.onCollapse(this.props.data);
        // }
        // return;
        var array = [];
        this.updateDataSource(this.props.dataSource, array);
        this.props.onCollapse(this.props.dataSource, this.props.value);
    }

    validar(data) {
        if (typeof data == 'undefined') return true;
        return false;
    }

    onClick(event) {
        event.preventDefault();
        if (!this.validar(this.props.onLink)) {
            this.props.onLink(event)
        }
    }

    validarPermisions() {
        if (this.props.permisions.visible == 'A') {

            var array = [];
            this.existe_data(this.props.dataSource, array);
            var bandera = array.length > 0 ? array[0] : false;

            const className = this.className(bandera);
            return (
                <li className={ className } onClick={ this.onFocus.bind(this) }>
                    <a href="#" onClick={this.onClick.bind(this)} className={ className }>
                        <span className="icons-left">
                            <Icon type="home" 
                                style={{'position': 'relative', 'top': '-4px'}}
                            />
                            <label>{this.props.title}</label>
                        </span> 
                    </a>
                </li>
            );
        }
        return null;
    }

    render() {
        const validarPermisions = this.validarPermisions();
        return (
            <>
                { validarPermisions }
            </>
        );
    }
}


Navegation.propTypes = {
    title: PropTypes.string,
    keys: PropTypes.any.isRequired,
    onCollapse: PropTypes.func.isRequired,
    style: PropTypes.object,
    data: PropTypes.array,
    permisions: PropTypes.object,

    dataSource: PropTypes.array,
    value: PropTypes.any,
}

Navegation.defaultProps = {
    style: {},
    title: 'Paquete',
    data: [],
    keys: '',
    permisions: {
        visible: 'A',
        editable: 'A'
    },

    dataSource: [],
    value: '',
}

export default Navegation;


