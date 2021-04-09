
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';

import PropTypes from 'prop-types';
import { readData } from '../../../../tools/toolsStorage';
import keysStorage from '../../../../tools/keysStorage';

export default class SubMenu extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            if (index >= 0 && this.props.data[index].value) {
                return `submenu ${colors} active`
            }
        }
        return `submenu`;
    }

    classNameChildren() {
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            if (this.props.data[index].value) {
                return 'children active'
            }
        }
        return 'children';
    }

    onClick(event) {
        event.preventDefault();
        if (this.props.permisions.editable == 'A') {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            this.props.data.map(value =>{
                if (value.key != this.props.keys) {
                    value.value = false;
                }
            });
            this.props.data[index].value = !this.props.data[index].value;
            this.props.onCollapse(this.props.data);
        }
    }
    icon() {
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            if (this.props.data[index].value) {
                return 'down';
            }
            return 'right'
        }
        return 'down';
    }

    onClickChildren(event) {
        event.preventDefault();
    }

    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
    }
    validarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            
            const className = this.className();
            const classNameChildren = this.classNameChildren();
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            return (
                <li className={className} 
                    style={{width: '100%'}}>
                    <a href="#" onClick={this.onClick.bind(this)}
                        style={this.props.style} className={`${colors}`}>
                        <span className="icons-left">

                            {this.props.icon}
                            
                            <label>{this.props.title}</label>
                        </span>  

                        <span className="icons-right">
                            <Icon type={this.icon()} />
                        </span>
                    </a>

                    <ul className={classNameChildren}>
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
}


