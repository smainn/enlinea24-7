
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';

import PropTypes from 'prop-types';
import { readData } from '../../../utils/toolsStorage';
import keysStorage from '../../../utils/keysStorage';

export default class MenuItem extends Component {
    
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

    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
    }

    onLinkMenu(event) {
        event.preventDefault();
        if (this.props.permisions.editable == 'A') {
            this.props.onLink(event);
        }
    }

    className(colors, bandera) {
        
        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     if (index >= 0 && this.props.data[index].value) {
        //         return `${colors} active`
        //     }
        // }
        // return `${colors}`;
        if ( bandera ) return `${colors} active`;
        return `${colors}`;
    }

    onFocusLink(event) {
        event.preventDefault();

        if (this.validar(this.props.onClick)) {
            // var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            // this.props.data.map(value =>{
            //     if (value.key != this.props.keys) {
            //         value.value = false;
            //     }
            // });
            // this.props.data[index].value = true;
            // this.props.onClick(this.props.data);

            var array = [];
            this.updateDataSource(this.props.dataSource, array);
            this.props.onClick(this.props.dataSource, this.props.value);

        }
    }

    validarPermisos() {

        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {

            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            var array = [];
            this.existe_data(this.props.dataSource, array);
            var bandera = array.length > 0 ? array[0] : false;

            return (
                <li onClick={this.onFocusLink.bind(this)}>
                    <a className={ this.className(colors, bandera) } href="#" style={{'fontSize': 13,}}
                        onClick={ this.onLinkMenu.bind(this) }>
                        <span>{this.props.title}</span>
                    </a>
                </li>
            );
        }
        return null;
    
    }

    render() {
        const validarPermisos = this.validarPermisos();
        return (
               <>
                    { validarPermisos }
               </>
        );
    }
}

MenuItem.propTypes = {
    title: PropTypes.string,
    onLink: PropTypes.func.isRequired,
    permisions: PropTypes.object,
    configAllowed: PropTypes.bool,
    keys: PropTypes.string,
    data: PropTypes.array,

    dataSource: PropTypes.array,
    value: PropTypes.any,
}

MenuItem.defaultProps = {
    title: 'Caso Uso',
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true,
    keys: '',
    data: [],

    dataSource: [],
    value: '',

}


