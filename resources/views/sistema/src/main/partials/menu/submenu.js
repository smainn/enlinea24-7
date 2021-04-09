
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';

import PropTypes from 'prop-types';
import { readData } from '../../../utils/toolsStorage';
import keysStorage from '../../../utils/keysStorage';

export default class SubMenu extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    existe_data(data, array) {
        if (!Array.isArray(data)) {
            return;
        }
        if (data.length == 0) {
            return;
        }
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

    className(colors, bandera) {
        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     if (index >= 0 && this.props.data[index].value) {
        //         return `submenu ${colors} active`
        //     }
        // }
        // return `submenu`;
        if ( bandera ) return `submenu ${colors} active`;
        return `submenu`;
    }

    classNameChildren(bandera) {
        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     if (index >= 0 && this.props.data[index].value) {
        //         return 'children active'
        //     }
        // }
        // return 'children';

        if ( bandera ) return 'children active';
        return 'children';
    }

    onClick(event) {
        event.preventDefault();
        //if (this.props.permisions.editable == 'A') {

            // var index = this.props.data.findIndex(value => (value.key == this.props.keys));

            // this.props.data.map(value =>{
            //     if (index >=0 && value.key != this.props.keys) {
            //         value.value = false;
            //     }
            // });
            // this.props.data[index].value = !this.props.data[index].value;

            var array = [];
            this.updateDataSource(this.props.dataSource, array);

            this.props.onCollapse(this.props.dataSource, this.props.value);
        //}
    }
    icon(bandera) {
        // if (this.props.data.length > 0) {
        //     var index = this.props.data.findIndex(value => (value.key == this.props.keys));
        //     if (index >= 0 && this.props.data[index].value) {
        //         return 'down';
        //     }
        //     return 'right'
        // }
        // return 'down';
        if ( bandera ) return 'down';
        return 'right';
    }

    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
    }
    validarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {

            var array = [];
            this.existe_data(this.props.dataSource, array);
            
            var bandera = array.length > 0 ? array[0] : false;
            
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            return (
                <li className={ this.className(colors, bandera) } 
                    style={{width: '100%'}}>
                    <a href="#" onClick={ this.onClick.bind(this) }
                        style={this.props.style} className={`${colors}`}>
                        <span className="icons-left">
                            {this.props.icon}
                            <label>{this.props.title}</label>
                        </span>  

                        <span className="icons-right">
                            <Icon type={ this.icon(bandera) } />
                        </span>
                    </a>

                    <ul className={ this.classNameChildren(bandera) }>
                        {this.props.component}
                    </ul>
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

SubMenu.propTypes = {
    title: PropTypes.string,
    keys: PropTypes.any.isRequired,
    onCollapse: PropTypes.func.isRequired,
    style: PropTypes.object,
    data: PropTypes.array.isRequired,
    component: PropTypes.any,
    configAllowed: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.any,

    dataSource: PropTypes.array,
    value: PropTypes.any,
}

SubMenu.defaultProps = {
    style: {},
    title: 'Caso Uso',
    data: [],
    keys: '',
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true,
    className: '',
    icon: null,

    dataSource: [],
    value: '',
}


